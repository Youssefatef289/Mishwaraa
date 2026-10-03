# تقرير تحليل مشروع Mishwaraa وخطة التطوير

بناءً على طلبك، قمت بمراجعة المشروع الحالي بدقة (Architecture, Supabase, Auth, Database, UI/UX) وتحديد ما يمكن إعادة استخدامه وما يحتاج إلى تعديل أو إضافة دون كسر الوظائف الموجودة.

## 1. تحليل الوضع الحالي (Current State Analysis)
*   **Architecture**: المشروع عبارة عن SPA (Single Page Application) مبني بـ React و Vite. التوجيه (Routing) يعتمد على State داخلي (`currentScreen` في `App.tsx`) بدلاً من React Router.
*   **Authentication & Roles**: يعتمد على `Supabase Auth` ولديه ثلاثة أدوار حالية (`customer`, `dealer`, `super_admin`) مخزنة في جدول `profiles`.
*   **Database (Supabase & RLS)**: الجداول الأساسية موجودة (`dealers`, `cars`, `bookings`, `booking_messages`) مع تفعيل RLS.
*   **Mock Data**: يوجد اعتماد كبير حالياً على `MOCK_CARS` و `mockData.ts` كبديل عند عدم الاتصال، وهذا يتعارض مع طلبك بمنع البيانات الوهمية في الـ Production.
*   **UI/UX**: الـ Navbar والـ Mobile Navigation الحاليين بدائيين ويحتاجان لإعادة بناء لتطوير تجربة المستخدم وتفعيل الـ Role-based Action Button (+).

## 2. التعديلات المطلوبة (خطة التنفيذ التدريجي)

لضمان عدم كسر أي من الـ Business Logic، سيتم تنفيذ المطلوب على **4 مراحل (Batches)**:

### المرحلة الأولى: التأسيس وإضافة دور المالك (انتهت الآن ✅)
1.  **دعم الـ Roles الجديدة**: تم تحديث ملفات الأنواع (`types.ts`) لتشمل الدور الجديد `car_owner` وحالات الحجز الدقيقة.
2.  **بناء الـ Mobile Bottom Navigation**: تم إعادة بناء `MobileBottomNav.tsx` بالكامل ليكون Fixed في الأسفل مع زر `+` مركزي يفتح Bottom Sheet، والروابط تتغير ديناميكياً حسب الـ Role الحقيقي للمستخدم.
3.  **عزل Mock Data**: جاري تجهيز `App.tsx` و `integration.ts` لمنع استخدام الـ Mock Data تماماً إلا إذا كان `VITE_DEMO_MODE=true` في الـ `.env`.

### المرحلة الثانية: إعادة بناء الواجهة الرئيسية للعميل وتطوير الـ Header (التالية ⏳)
1.  **Header**: تحويله إلى Sticky، إضافة Dropdown لحساب المستخدم عند تسجيل الدخول، وتوحيد الألوان والتصميم (Amber / Teal).
2.  **Home Page**: تطبيق الـ Sections المطلوبة (Hero Search, Popular Cars, Categories, Featured Dealers, How it works, Why us).

### المرحلة الثالثة: لوحات التحكم (Dashboards) وعزل الـ Routing ⏳
1.  **Dealer Dashboard**: تحسين الواجهة الحالية لتشمل الإحصائيات (Cars, Bookings, Revenue) وإدارة السيارات والطلبات.
2.  **Owner Dashboard**: إنشاء لوحة جديدة لمالك السيارة تشبه Dealer ولكن مخصصة لفرد.
3.  **Admin Dashboard**: إنشاء لوحة الإدارة العليا.
4.  **Booking Flow**: تعديل منطق الحجز ليعتمد على Source of Truth من قاعدة البيانات وعدم تأكيد الحجز للمستخدم إلا بعد موافقة المعرض/المالك.

### المرحلة الرابعة: الصفحات العامة للمعارض (Public Dealer Pages) ⏳
1.  إنشاء صفحة خاصة بكل معرض (Cover, Logo, Info, Cars).
2.  تمكين المعرض من تعديل بيانات هذه الصفحة.

---

**الخطوة الحالية:** 
لقد قمت بإضافة الدور الجديد وتحديث بنية `MobileBottomNav` و `types.ts` محلياً. 
هل ترغب في أن أبدأ بدمجها بشكل كامل في `App.tsx` والانتقال للمرحلة الثانية (تعديل الـ Home Page والـ Navbar/Header) الآن؟
