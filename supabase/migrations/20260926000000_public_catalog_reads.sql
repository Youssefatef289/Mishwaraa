-- مشوار: فتح كتالوج الأسطول للمتصفحين قبل تسجيل الدخول
-- يجعل المعارض المعتمدة وعرباتها المتاحة قابلة للقراءة العامة (anon)
-- مع الحفاظ على كافة قيود RLS الأخرى (الحجوزات/الإدارة للمصادق فقط).

drop policy if exists "anon reads approved dealers" on public.dealers;
create policy "anon reads approved dealers"
  on public.dealers for select to anon
  using (status = 'approved');

drop policy if exists "anon reads cars of approved dealers" on public.cars;
create policy "anon reads cars of approved dealers"
  on public.cars for select to anon
  using (
    exists (
      select 1 from public.dealers d
      where d.id = dealer_id
        and d.status = 'approved'
    )
  );