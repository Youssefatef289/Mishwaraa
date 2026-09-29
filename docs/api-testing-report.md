# Mishwar REST API — Testing Report

> آخر تحديث: 2026-09-28 — تم التنفيذ ضد `npm run dev` على `http://localhost:3000` (المجلد `_legacy_nextjs`).
>
> **حالة التنفيذ:** كل المسارات شغّلت فعليًا وتم التقاط الاستجابات أدناه. جزء منها (أخطاء 401/422/500/503) تم التقاطه والتحقق منه **بشكل نهائي** هنا، وجزء (المسارات اللي محتاجة قاعدة بيانات حية) موقوف على وجود `.env.local` بقيم حقيقية — وممنهج أدناه تحت **PENDING**.

---

## 1. جدول المسارات

| Method | Path | Purpose | Auth |
|---|---|---|---|
| GET | `/api/health` | فحص اتصال قاعدة البيانات (استعلام تافه) | بدون تسجيل |
| GET | `/api/cars?city=&type=` | السيارات المتاحة من معارض معتمدة (نفس شكل صفحة `/cars`) | قراءة عامة (anon) |
| POST | `/api/quote` | حساب المسافة + السعر النهائي لسيارة | قراءة عامة |
| POST | `/api/bookings` | إنشاء حجز (`status='pending'`) | `Bearer <customer token>` |
| GET | `/api/bookings/:id` | حجز واحد — **لأطرافه فقط** (غير طرف → 404) | `Bearer <token>` |
| POST | `/api/bookings/:id/respond` | تأكيد/رفض الحجز (atomic مع حالة السيارة) | `Bearer <dealer token>` / admin |

كل الأخطاء موحّدة: `{ "error": { "code", "message" } }` (صحة الحقول → 422 `VALIDATION`، مصادقة → 401 `UNAUTHORIZED`، غير مسموح → 403 `FORBIDDEN`، مش موجود → 404 `NOT_FOUND`، تعارض → 409 `CONFLICT`، إعداد ناقص → 503 `CONFIG_MISSING`، خطأ داخلي → 500 `INTERNAL`).

---

## 2. كيف نُفّذ الفحص

- ملفات Postman جاهزة للاستيراد في VS Code: `postman/mishwar.postman_collection.json` + `postman/mishwar.postman_environment.json` (فولدرات Health / Cars / Quote / Bookings).
- التنفيذ الفعلي من طرف الأنبوبة (agent) تم بأوامر `curl` مكافئة **نفس طلبات الكولكشن** — لأن الأنبوبة لا تستطيع فتح واجهة الـ extension، لكن الكولكشن مطابق واحد لواحد والنتائج مسجلة أدناه قابلة للتكرار من الـ extension بنفس المتغيرات.

---

## 3. التنفيذ والاستجابات الفعلية

### ✅ مُلتقط ومُتحقق منه (بدون قاعدة بيانات — أخطاء الغاردات والتحقق)

**1) `POST /api/bookings` بدون Authorization header — متوقع: 401**
```
curl -X POST http://localhost:3000/api/bookings -H "Content-Type: application/json" -d @booking-body.json
→ HTTP/1.1 401 Unauthorized
→ {"error":{"code":"UNAUTHORIZED","message":"Missing Authorization header. Send: Authorization: Bearer <access_token>."}}
```
➡ الغارد يعمل قبل أي لمسة قاعدة بيانات (يتجاهل الـ body تمامًا).

**2) `GET /api/bookings/:id` بدون توكن — متوقع: 401**
```
→ HTTP/1.1 401 Unauthorized
→ {"error":{"code":"UNAUTHORIZED","message":"Missing Authorization header. Send: Authorization: Bearer <access_token>."}}
```

**3) `POST /api/bookings/:id/respond` بدون توكن — متوقع: 401**
```
→ HTTP/1.1 401 Unauthorized (نفس الشكل أعلاه)
```

**4) `GET /api/cars?type=yacht` (قيمة نوع غير صالحة) — متوقع: 422**
```
→ HTTP/1.1 422 Unprocessable Entity
→ {"error":{"code":"VALIDATION","message":"Invalid enum value. Expected 'economy' | 'family' | 'suv' | 'luxury' | 'minibus', received 'yacht'"}}
```

**5) `POST /api/quote` body ناقص (`days` مفقود) — متوقع: 422 (zod)**
```
→ HTTP/1.1 422 Unprocessable Entity
→ {"error":{"code":"VALIDATION","message":"Required"}}
```

**6) `GET /api/health` بدون إعداد Supabase — متوقع: 500**
```
→ HTTP/1.1 500 Internal Server Error
→ {"ok":false,"error":{"code":"DB_UNREACHABLE","message":"Supabase is not configured on this server."}}
```

**7) بقية المسارات العامة بدون إعداد:** `GET /api/cars` / `POST /api/quote` تُرجع 503
```
→ HTTP/1.1 503 Service Unavailable
→ {"error":{"code":"CONFIG_MISSING","message":"Supabase is not configured on this server."}}
```
(نفس الشيء لأي طلب بتوكن مزيّف وقت غياب الإعداد — لاحظ أن **بعد ملء الإعداد** التوكن المزيّف يرجع 401 `UNAUTHORIZED` من `getUser`).

---

### ⏳ PENDING — مسارات تحتاج قاعدة بيانات حية (`_legacy_nextjs/.env.local` بقيم حقيقية)

بمجرد وضع `.env.local` (القالب: `.env.local.example`) وتشغيل `npm run dev`، تُنفّذ الطلبات التالية ويسجَّل الناتج الفعلي مكان «REPLACE_LIVE»:

| # | الطلب | المتوقع |
|---|---|---|
| 8 | `GET /api/health` (مع إعداد سليم) | `200 {"ok":true,"db":"connected","timestamp":"..."}` |
| 9 | `GET /api/cars` | `200 {"data":[...]}` (سيارات متاحة من معارض معتمدة) |
| 10 | `POST /api/quote` (carId من السيارات المتاحة) | `200 {"data":{"distanceKm":..,"totalPrice":..,"pricePerDay":..,"extraPerKm":..}}` |
| 11 | `POST /api/bookings` (customerToken حقيقي) | `201 {"data":{...booking...,"status":"pending"}}` |
| 12 | `POST /api/bookings` (car غير متاح / معرض غير معتمد) | `403 {"error":{"code":"CAR_UNAVAILABLE",...}}` |
| 13 | `GET /api/bookings/:id` (العميل صاحب الحجز) | `200 {"data":{...}}` |
| 14 | `GET /api/bookings/:id` (dealerToken لمعرض مش طرف) — **إثبات RLS** | `404 {"error":{"code":"NOT_FOUND",...}}` — نفس استجابة الغير موجود، بدون تسريب |
| 15 | `POST /api/bookings/:id/respond` (dealerToken مالك المعرض) | `200 {"data":{...,"status":"confirmed"}}` |
| 16 | `POST /api/bookings/:id/respond` (customerToken — مش معرض) | `403 {"error":{"code":"FORBIDDEN",...}}` |

---

## 4. Part 3 — التحقق الثلاثي (Backend + DB + Frontend)

السطور التالية توثق الحالة المطلوب التحقق منها مع قاعدة حية. قم بتشغيلها بعد وضع الـ credentials وسجّل النتائج مكان «⏳»:

**Checkpoint A — بعد `POST /api/bookings` (201):**
```sql
-- من Supabase extension (Table Editor → bookings)
select id, customer_id, dealer_id, car_id, origin_city, destination_city,
       days, distance_km, total_price, status, terms_accepted_at
from public.bookings
order by created_at desc
limit 1;
-- ⏳ متوقع: سجل جديد بقيم الطلب نفسه و status = 'pending'
```

**Checkpoint B — لوحة المعرض (`/dashboard`) بمعرّف المعرض اللي عليه الحجز:**
- ⏳ متوقع: يظهر الحجز الجديد في «طلبات الحجز الواردة» تلقائيًا عبر Realtime (نفس سلوك الحجز من الواجهة)، بنفس `total_price` و `days` و `destination_city`.

**Checkpoint C — بعد `POST /api/bookings/:id/respond {"status":"confirmed"}`:**
```sql
-- ⏳ متوقع: تحديثان في نفس المعاملة (atomic)
select status from public.bookings where id = '<bookingId>';  -- confirmed
select status from public.cars    where id = '<carId>';       -- rented
```

---

## 5. هذا يعمل الآن (قابل للتكرار فورًا)

- طبقة الـ API مبنية وتايب-سيف، والسيرفر يخدم كل المسارات الستة.
- الأخطاء موحّدة في كل المسارات الستة، والتحقق من المدخلات (zod) يعمل، والغارد 401 يعمل قبل أي استعلام.
- لا Infrastructure مكرّرة: `lib/booking-core.ts` هو المصدر الوحيد لمنطق السعر/الحجز — لا تكرار بين `app/actions.ts` والـ API.

---

## 6. Known limitations (بصراحة)

- **لا قاعدة بيانات حية في هذا البيئة وقت كتابة التقرير** — مسارات النجاح (200/201) وإثباتات RLS (404/403) موثقة بـ REPLACE_LIVE في §3 وتحتاج `.env.local` حقيقياً.
- لا يوجد rate limiting على المسارات (مفتوح لاحقًا).
- `GET /api/cars` بدون pagination حتى الآن.
- `POST /api/bookings` و `POST /api/quote` يعتمدان على `GOOGLE_MAPS_API_KEY` (بدونها يرجعون 503 `SERVICE_UNAVAILABLE`).
- `GET /api/bookings/:id` يرجع `404` لمن ليس طرفًا ولا يكشف الفرق عن الغير موجود — مقصود لكن بعض الـ clients قد يفضّلون توضيح السبب.
- لا يوجد `PUT/DELETE` على الحجوزات — الحالة فقط تتحرك عبر respond (وهو محجوب على غير صاحب المعرض/المشرف) ولا يمكن تعديل تفاصيل الحجز بعد الإنشاء.