-- مشوار: شات الحجز (عميل ↔ معرض) + شات دعم المعرض (معرض ↔ إدارة الموقع)
-- نظامان منفصلان تمامًا: جدولان منفصلان، سياسات RLS منفصلة، وواجهات منفصلة.
-- ملاحظة: لا توجد سياسات update/delete نهائيًا — الرسائل ثابتة (غير قابلة للتعديل أو الحذف)
-- عمدًا لتبقى سجلًا قابلاً للتدقيق في هذه النسخة.

create table public.booking_messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  sender_role public.user_role not null,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index booking_messages_booking_idx on public.booking_messages(booking_id, created_at);

create table public.dealer_admin_messages (
  id uuid primary key default gen_random_uuid(),
  dealer_id uuid not null references public.dealers(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  sender_role public.user_role not null,
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index dealer_admin_messages_dealer_idx on public.dealer_admin_messages(dealer_id, created_at);

alter table public.booking_messages enable row level security;
alter table public.dealer_admin_messages enable row level security;

-- شات الحجز: فقط العميل صاحب الحجز أو المعرض المالك للحجز يستطيع القراءة.
create policy "booking chat select for booking parties"
  on public.booking_messages for select to authenticated
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (
          b.customer_id = (select auth.uid())
          or exists (
            select 1 from public.dealers d where d.id = b.dealer_id and d.user_id = (select auth.uid())
          )
        )
    )
  );

-- شات الحجز: الكتابة لنفس المستخدم فقط، وباعتباره طرفًا في الحجز.
create policy "booking chat insert for booking parties"
  on public.booking_messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and sender_role in ('customer', 'dealer')
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (
          b.customer_id = (select auth.uid())
          or exists (
            select 1 from public.dealers d where d.id = b.dealer_id and d.user_id = (select auth.uid())
          )
        )
    )
  );

-- شات الدعم: المعرض المالك أو إدارة الموقع فقط — لا يراه العملاء أبدًا.
create policy "dealer admin chat select for participants"
  on public.dealer_admin_messages for select to authenticated
  using (
    exists (
      select 1 from public.dealers d where d.id = dealer_id and d.user_id = (select auth.uid())
    )
    or public.is_admin()
  );

-- شات الدعم: الكتابة لنفس المستخدم فقط، وباعتباره المعرض المالك أو مشرفًا.
create policy "dealer admin chat insert for participants"
  on public.dealer_admin_messages for insert to authenticated
  with check (
    sender_id = (select auth.uid())
    and sender_role in ('dealer', 'super_admin')
    and (
      exists (
        select 1 from public.dealers d where d.id = dealer_id and d.user_id = (select auth.uid())
      )
      or public.is_admin()
    )
  );

alter publication supabase_realtime add table public.booking_messages;
alter publication supabase_realtime add table public.dealer_admin_messages;