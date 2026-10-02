# مشوار (Mishwar) — Project Reference

> ملف مرجعي واحد لأي مطوّر جديد يبدأ مع المشروع. اقرأه كاملًا الأول، وبعدين ابدأ من «تشغيل المشروع».

---

## 1. Tech stack

| طبقة | التقنية |
|---|---|
| Framework | Next.js 14 (App Router) — React 18 |
| اللغة | TypeScript (strict) |
| قاعدة البيانات | PostgreSQL عبر Supabase (مضيفة أو محلية) |
| Auth | Supabase Auth (email/password + JWT) |
| ORM/Client | `@supabase/supabase-js` + `@supabase/ssr` (كوكيز للصفحات) |
| Realtime | Supabase Realtime (`postgres_changes`) |
| الأمان | RLS-first — كل قراءة/كتابة تِمر على سياسات RLS |
| الإيميلات | Resend (اختياري) |
| التحقق من المدخلات | zod (اختياري — طبقة REST API) |
| الـ UI | Tailwind CSS 3 + الواجهة عربي RTL (خط Tajawal) |

مجلد التطبيق: `_legacy_nextjs/` داخل مستودع ساياارا (النسخة Next.js). ملفات الهجرة في `supabase/migrations/` على مستوى المستودع.

---

## 2. Folder structure (الأهم)

```
_legacy_nextjs/
  app/
    actions.ts            # Server Actions (الواجهة القديمة للصفحات) — Logic موجود في lib/booking-core
    api/                  # طبقة REST API الجديدة (Route Handlers)
      _helpers.ts         # مساعدات مشتركة: أخطاء موحّدة + كلاينت RLS من Bearer token
      health/route.ts     # GET  /api/health
      cars/route.ts       # GET  /api/cars
      quote/route.ts      # POST /api/quote
      bookings/route.ts   # POST /api/bookings
      bookings/[id]/route.ts         # GET  /api/bookings/:id
      bookings/[id]/respond/route.ts # POST /api/bookings/:id/respond
    bookings/             # صفحة حجوزاتي (عميل)
    dashboard/            # لوحة المعرض
    admin/                # لوحة إدارة الموقع (super_admin)
    cars/                 # تصفح السيارات + الحجز
  components/             # مكوّنات الواجهة (dealer-dashboard, my-bookings, booking-chat, …)
  lib/
    booking-core.ts       # ⭐ قلب منطق الحجز والسعر (مشترك: Server Actions + REST API)
    supabase/             # server.ts (كوكيز) + client.ts (متصفح) + middleware.ts
    notifications.ts      # Resend
  middleware.ts           # تجديد الجلسة + توجيه الأدوار
supabase/
  migrations/             # كل الهجرات (schemas, RLS, chat, …)
postman/
  mishwar.postman_collection.json   # كولكشن Postman لكل الـ API
  mishwar.postman_environment.json  # متغيرات (baseUrl, customerToken, …)
docs/
  api-testing-report.md   # نتائج فحص الـ API
  PROJECT.md              # هذا الملف
```

---

## 3. Auth & roles

- الجداول: `profiles.role` (enum `super_admin | dealer | customer`)، `dealers.user_id` يربط المستخدم بمعرّف المعرض.
- ربط الحساب بالدور يتم آليًا عبر `handle_new_user()` trigger وقت إنشاء المستخدم (من `user_metadata.role`).
- أدوار RLS في كامل الموقع:
  - **customer**: يقرأ/يعدّل حجوزاته فقط.
  - **dealer**: يدير سياراته وحجوزات معرضه، ويشوف شات الحجز والدعم.
  - **super_admin**: يقرأ كل شيء (`public.is_admin()`).
  - **anon**: يقرأ المعارض المعتمدة وعربياتها المتاحة فقط.
- صفحات محمية عبر `middleware.ts` (cookies) وكل أكشن يتحقق بـ `currentUser()`.

### Auth في طبقة REST API
- الطلبات العامة: بدون توكن → دور `anon` (RLS للأشياء العامة).
- الطلبات الخاصة: `Authorization: Bearer <access_token>` → يصنع السيرفر كلاينت supabase-js بخيار `accessToken` فيتحمل كل طلب التوكن، والنواة السابقة تِمر على RLS بنفس هوية صاحب التوكن (أبدًا service role في مسارات الـ API).
- الحصول على التوكن محليًا: سجّل دخول من `/auth` وانسخ access token من Session، أو من سكريبت:
  ```ts
  const { data } = await s.auth.signInWithPassword({ email, password });
  const token = data.session?.access_token;
  ```

---

## 4. Booking lifecycle — مساران متطابقان

المنطق الكامل في **`lib/booking-core.ts`** (مصدر واحد، ممنوع التكرار):

1. `validateBookingData` → التحقق من الوجهة/الأيام/التاريخ.
2. `fetchDistanceKm` → Google Distance Matrix (يتطلب `GOOGLE_MAPS_API_KEY`).
3. `priceQuote` → `totalPrice = days*price_per_day + distance_km*extra_per_km`.
4. `createBookingFor(client, user, data)` → يتحقق من توفّر العربية + اعتماد المعرض، يحسب الاقتباس، يُدرج الحجز (`status='pending'`)، ويرسل إيميل للمعرض.

| المسار | النداء | التفاصيل |
|---|---|---|
| الواجهة (UI) | Server Action `createBooking` في `app/actions.ts` | جلسة الكوكيز + `revalidatePath` |
| REST API | `POST /api/bookings` | Bearer token → `createBookingFor` → `201` بالحجز المنشأ |

**الرد على الحجز**: `respond_to_booking(id, 'confirmed'|'rejected')` (RPC with `security definer`):
- يتحقق داخليًا أن المستدعي هو مالك المعرض أو `is_admin()`.
- غيّر `bookings.status` و (عند التأكيد) `cars.status → 'rented'` **في نفس المعاملة** (atomic).
- الواجهة: `respondBooking` — الـ API: `POST /api/bookings/:id/respond`.

---

## 5. Environment variables

انسخ `_legacy_nextjs/.env.local.example` إلى `_legacy_nextjs/.env.local` واملأ القيم:

| المتغير | ليه؟ | مطلوب؟ |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | رابط مشروع Supabase | مطلوب |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | مفتاح العميل (pub/anón) — RLS | مطلوب |
| `SUPABASE_SERVICE_ROLE_KEY` | من السيرفر فقط (بريد `emailFor`) — **لا** يُستخدم في مسارات API | للتحقق/الإيميل فقط |
| `GOOGLE_MAPS_API_KEY` | حساب المسافات للاقتباس | للحجز/الاقتباس |
| `RESEND_API_KEY` + `NOTIFICATION_FROM` | إيميلات الإشعارات | اختياري |
| `PAYMOB_ENABLED` / `TWILIO_ENABLED` | مدفوعات/SMS (غير مفعّلين) | اختياري |

---

## 6. تشغيل المشروع

1. `cd _legacy_nextjs`
2. `npm install`
3. املأ `.env.local` (أعلاه).
4. طبّق الهجرات على قاعدة إنتاج/محلية: مشروعك يحتاج جداول `profiles, dealers, cars, bookings` + `booking_messages, dealer_admin_messages`.
5. `npm run dev` → `http://localhost:3000`
6. `npm run build` للتأكد قبل الدفع.

---

## 7. تشغيل كولكشن Postman من جديد

1. افتح **Postman extension** في VS Code.
2. Import: `postman/mishwar.postman_collection.json` + `postman/mishwar.postman_environment.json`.
3. فعّل بيئة **Mishwar Local** واملأ:
   - `customerToken` / `dealerToken`: من `/auth` (انظر §3).
   - `carId`: من `GET /api/cars`.
   - `bookingId`: من استجابة `POST /api/bookings` (أو أي حجز في الجدول).
   - `baseUrl`: `http://localhost:3000` (غيّرها لو المنفذ مختلف).
4. شغّل الفولدرات بالترتيب: Health → Cars → Quote → Bookings. الطلبات المسماة «فشل متوقع» لازم ترجّع الأكواد المكتوبة.

> من الطرفية بديل عن الـ extension: `curl.exe -s -i http://localhost:3000/api/health` وهكذا لكل مسار.

---

## 8. معايير مهمة

- **RLS الأول**: لا تفتح وصول بدون سياسة؛ لا تستخدم service role في مسارات API.
- **لا تكرار منطق**: أي تعديل على حساب/تحقق يبدأ من `lib/booking-core.ts`.
- أخطاء API موحّدة: `{ "error": { "code", "message" } }`.
- الرسائل الإنجليزية في طبقة API (تقنية)، والواجهة عربي بالكامل.
- `docs/api-testing-report.md` يوثّق كل مسار + النتائج الفعلية لكل اختبار.