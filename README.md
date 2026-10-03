# Mishwar - مشوار

مشوار هي منصة سحابية لتأجير السيارات في مصر، تهدف لربط العملاء بالمعارض الموثوقة لتأجير السيارات بسهولة وسرعة من خلال واجهة مستخدم سريعة، تفاعلية، وتدعم المحادثات الفورية.
_Mishwar is a cloud-based car rental marketplace in Egypt, connecting customers with verified car rental dealers via a fast, interactive SPA with real-time chat._

## التقنيات المستخدمة (Tech Stack)

- **React**: ^19.0.1
- **Vite**: ^8.3.0
- **Tailwind CSS**: ^4.3.3
- **Supabase**: ^2.57.4 (`@supabase/supabase-js`)
- **Deployment**: Vercel

## هيكل المجلدات (Folder Structure)

تم تقسيم مجلد `src` بناءً على خصائص ووظائف المشروع (Domain-Based Structure):

- `src/core/`: يحتوي على ملفات التهيئة الأساسية، التوجيهات العامة، وتنسيقات CSS الأساسية.
- `src/shared/`: المكونات المشتركة التي يتم استخدامها في أكثر من مكان (כمثل Header و Footer والـ Chat).
- `src/features/auth/`: مكونات تسجيل الدخول والتحقق من المستخدم.
- `src/features/home/`: واجهة الاستكشاف الرئيسية للعملاء.
- `src/features/booking/`: مسار الحجوزات وإدارتها للعميل.
- `src/features/dealer/`: لوحة تحكم المعرض (إدارة الأسطول، الحجوزات، والتسويات).
- `src/features/admin/`: لوحة التحكم الخاصة بالإدارة العُليا (Super Admin).
- `src/lib/`: دوال الاتصال بالخادم وقاعدة البيانات (Supabase, Integration, Chat).
- `src/data/`: البيانات الوهمية (Mock Data) للاستخدام أثناء التطوير أو انقطاع الاتصال.

## خطوات التشغيل (Setup Steps)

1. قم بتثبيت الحزم:
   ```bash
   npm install
   ```
2. قم بنسخ ملف المتغيرات البيئية:
   ```bash
   cp .env.example .env.local
   ```
3. أضف قيم المتغيرات الخاصة بـ Supabase داخل `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```
4. قم بتشغيل خادم التطوير:
   ```bash
   npm run dev
   ```

## الأدوار والصلاحيات (Roles)

يعتمد التطبيق على ثلاث فئات للمستخدمين: `customer`, `dealer`, و `super_admin`.

- يتم استرداد نوع المستخدم من جدول `profiles` عند الدخول وتُخزّن القيمة في `App.tsx` داخل حالة (state) تُسمى `profile`.
- تقوم `App.tsx` بمنع المستخدم العادي من الدخول إلى لوحة تحكم المعرض (`currentScreen === 'dealer'`) وتوجيهه تلقائياً إلى الصفحة الرئيسية.
- نفس الأمر ينطبق على لوحة الإدارة (`admin`).

## سجل التحديثات

### 2026-10-02 — إعادة هيكلة الملفات وتنظيف المشروع

- إزالة النسخ القديمة والملفات الثابتة (Static HTML) التي لم تعد مستخدمة.
- تقسيم مجلد `src/` إلى هيكل يعتمد على الخصائص (Domain-based: core, shared, features, lib, data).
- تحديث جميع الاستدعاءات (Imports) وإعدادات Vite لتعكس الهيكل الجديد بشكل صحيح.
- إضافة ملف `README.md` جديد ووثيقة المعايير `docs/PROJECT.md` لضمان استمرارية التنظيم.

- **Phase 2-5 Updates**: Removed debug header, implemented strict role-based routing (Option A for car_owners = dealer under the hood), completely redesigned the public HomeScreen with authentic data and spec-aligned typography/colors, and implemented a native-feeling elevated FAB MobileBottomNav.

- **Bug Fix (Design Reversion):** Diagnosed the persistent design-revert bug. Root causes found: (1) A secondary AI tool or editor buffer overrode local files right before commits, wiping out recent changes. Documented single-source-of-truth policy in PROJECT.md. (2) ercel.json was 0 bytes, missing caching rules. Re-wrote ercel.json with strict 
o-cache for index.html and aggressive caching for immutable hashed assets to fix stale deployments on Vercel.
