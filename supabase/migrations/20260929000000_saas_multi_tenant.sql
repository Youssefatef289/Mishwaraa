-- ============================================================
-- مشوار → Mishwaraa SaaS : التحويل إلى Multi-Tenant Platform
-- ============================================================
-- تحويل المعرض (dealer) إلى كيان Tenant باسم organizations،
-- وربط كل البيانات الأساسية بالـ Organization مع عزل كامل عبر RLS.
-- لا يتم حذف أي جدول قائم — فقط إعادة تشكيل + جداول جديدة.

-- 1) إعادة تشكيل dealers → organizations (الـ Tenant)
alter table public.dealers rename to organizations;
alter table public.organizations rename column user_id to owner_id;
alter table public.organizations
  add column slug text,
  add column email text,
  add column logo_url text,
  add column updated_at timestamptz not null default now();

-- slug فريد لكل معرض (للصفحات العامة)
update public.organizations set slug = 'dealer-' || replace(gen_random_uuid()::text, '-', '');
alter table public.organizations alter column slug set not null;
create unique index organizations_slug_idx on public.organizations(slug);

-- 2) بيانات الحجز/السيارات/الشات تصبح مرتبطة بالـ Organization
alter table public.cars rename column dealer_id to organization_id;
alter table public.bookings rename column dealer_id to organization_id;
alter table public.dealer_admin_messages rename column dealer_id to organization_id;

-- 3) ربط العميل بالـ Organization عند الحجز (جداول علائقية)
create table public.customers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  total_bookings integer not null default 0 check(total_bookings >= 0),
  total_spent numeric(12,2) not null default 0 check(total_spent >= 0),
  last_booked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index customers_organization_idx on public.customers(organization_id);

-- 4) أعضاء المعرض (Owner / Manager / Staff)
create type public.org_member_role as enum ('owner', 'manager', 'staff');
create type public.org_member_status as enum ('active', 'invited', 'disabled');
create table public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.org_member_role not null,
  status public.org_member_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);
create index organization_members_org_idx on public.organization_members(organization_id);

-- 5) خطط الاشتراك
create type public.billing_interval as enum ('monthly', 'yearly', 'one_time');
create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null default 0,
  currency text not null default 'EGP',
  billing_interval public.billing_interval not null default 'monthly',
  max_cars integer,
  max_users integer,
  max_bookings integer,
  features jsonb not null default '[]'::jsonb,
  trial_days integer not null default 14,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- 6) الاشتراكات
create type public.subscription_status as enum ('trial', 'active', 'past_due', 'cancelled', 'expired', 'suspended');
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id),
  status public.subscription_status not null default 'trial',
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  trial_ends_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_org_idx on public.subscriptions(organization_id);

-- 7) المدفوعات
create type public.payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  amount numeric(12,2) not null check(amount > 0),
  currency text not null default 'EGP',
  status public.payment_status not null default 'pending',
  payment_method text,
  provider text,
  transaction_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index payments_org_idx on public.payments(organization_id);

-- 8) سجل الاستخدام
create table public.usage_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  metric text not null,
  value integer not null default 0,
  period_start date not null,
  period_end date not null,
  created_at timestamptz not null default now(),
  unique (organization_id, metric, period_start)
);
create index usage_records_org_idx on public.usage_records(organization_id);

-- 9) سجل التدقيق
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete cascade,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_org_idx on public.audit_logs(organization_id);
create index audit_logs_user_idx on public.audit_logs(user_id);

-- 10) الإشعارات
create type public.notification_type as enum (
  'new_booking', 'booking_status', 'new_message', 'subscription_expiring',
  'payment_success', 'subscription_expired', 'organization_approved', 'system'
);
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid references public.organizations(id) on delete cascade,
  type public.notification_type not null default 'system',
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, read_at);

-- 11) تفعيل RLS على الجداول الجديدة
alter table public.organizations enable row level security;
alter table public.customers enable row level security;
alter table public.organization_members enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.usage_records enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

-- 12) دوال مساعدة للـ Tenant والخطط
create or replace function public.current_organization_id()
returns uuid language sql stable security definer set search_path = public as $$
  select m.organization_id from public.organization_members m
  where m.user_id = (select auth.uid()) and m.status = 'active'
  limit 1
$$;

create or replace function public.member_role(in_org_id uuid)
returns public.org_member_role language sql stable security definer set search_path = public as $$
  select m.role from public.organization_members m
  where m.organization_id = in_org_id and m.user_id = (select auth.uid()) and m.status = 'active'
  limit 1
$$;

-- الخطة الفعّالة للمعرض (trial أو active)
create or replace function public.active_plan_for(in_org_id uuid)
returns public.subscription_plans language sql stable security definer set search_path = public as $$
  select p.* from public.subscriptions s
  join public.subscription_plans p on p.id = s.plan_id
  where s.organization_id = in_org_id and s.status in ('active', 'trial')
  order by (s.status = 'trial')::int, s.created_at desc
  limit 1
$$;

-- حدود الخطة (تُفحص في الجبهة الخلفية داخل triggers)
create or replace function public.plan_can_add_car(in_org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(p.max_cars is null or (select count(*) from public.cars c where c.organization_id = in_org_id) < p.max_cars, false)
  from public.subscriptions s join public.subscription_plans p on p.id = s.plan_id
  where s.organization_id = in_org_id and s.status in ('active', 'trial')
  limit 1
$$;

create or replace function public.plan_can_add_member(in_org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(p.max_users is null or (select count(*) from public.organization_members m where m.organization_id = in_org_id and m.status = 'active') < p.max_users, false)
  from public.subscriptions s join public.subscription_plans p on p.id = s.plan_id
  where s.organization_id = in_org_id and s.status in ('active', 'trial')
  limit 1
$$;

create or replace function public.plan_can_create_booking(in_org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(p.max_bookings is null or (select count(*) from public.bookings b where b.organization_id = in_org_id) < p.max_bookings, false)
  from public.subscriptions s join public.subscription_plans p on p.id = s.plan_id
  where s.organization_id = in_org_id and s.status in ('active', 'trial')
  limit 1
$$;

-- 13) إنشاء حساب المعرض: Organization + Owner member + اشتراك تجريبي
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested_role public.user_role;
  org_id uuid;
  free_plan public.subscription_plans;
begin
  requested_role := case when new.raw_user_meta_data->>'role' = 'dealer'
    then 'dealer'::public.user_role else 'customer'::public.user_role end;
  insert into public.profiles (id, role, full_name, phone)
    values (new.id, requested_role,
            nullif(new.raw_user_meta_data->>'full_name',''),
            nullif(new.raw_user_meta_data->>'phone',''));
  if requested_role = 'dealer' then
    insert into public.organizations (owner_id, name, city, phone, address, email, status, slug)
    values (new.id,
            coalesce(nullif(new.raw_user_meta_data->>'dealer_name',''), nullif(new.raw_user_meta_data->>'full_name',''), 'New dealer'),
            coalesce(nullif(new.raw_user_meta_data->>'city',''), 'Cairo'),
            coalesce(nullif(new.raw_user_meta_data->>'phone',''), ''),
            coalesce(nullif(new.raw_user_meta_data->>'address',''), ''),
            new.email,
            'pending',
            'dealer-' || replace(gen_random_uuid()::text, '-', ''))
    returning id into org_id;
    insert into public.organization_members (organization_id, user_id, role, status)
      values (org_id, new.id, 'owner', 'active');
    select * into free_plan from public.subscription_plans where slug = 'free' and active limit 1;
    if free_plan.id is not null then
      insert into public.subscriptions (organization_id, plan_id, status, trial_ends_at, started_at)
      values (org_id, free_plan.id, 'trial',
              now() + make_interval(days => free_plan.trial_days), now());
    end if;
  end if;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- 14) حارس تحديث الحجز + الرد على الحجز (بعد تغيير الأعمدة)
create or replace function public.guard_booking_update()
returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if new.customer_id is distinct from old.customer_id
     or new.organization_id is distinct from old.organization_id
     or new.car_id is distinct from old.car_id
     or new.origin_city is distinct from old.origin_city
     or new.destination_city is distinct from old.destination_city
     or new.distance_km is distinct from old.distance_km
     or new.start_date is distinct from old.start_date
     or new.days is distinct from old.days
     or new.price_per_day is distinct from old.price_per_day
     or new.extra_per_km is distinct from old.extra_per_km
     or new.total_price is distinct from old.total_price
     or new.terms_accepted_at is distinct from old.terms_accepted_at then
    raise exception 'Booking details cannot be changed after creation';
  end if;
  if old.status <> 'pending' then raise exception 'Only pending bookings can be updated'; end if;
  if new.status not in ('confirmed', 'rejected', 'cancelled') then raise exception 'Invalid booking status transition'; end if;
  return new;
end;
$$;
drop trigger if exists bookings_guard_update on public.bookings;
create trigger bookings_guard_update before update on public.bookings for each row execute procedure public.guard_booking_update();

create or replace function public.respond_to_booking(p_booking_id uuid, p_status public.booking_status)
returns public.bookings language plpgsql security definer set search_path = public as $$
declare result public.bookings;
begin
  if p_status not in ('confirmed', 'rejected') then raise exception 'Invalid response status'; end if;
  select * into result from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'Booking not found'; end if;
  if result.status <> 'pending' then raise exception 'Booking was already handled'; end if;
  if not exists (select 1 from public.organization_members m
                 where m.organization_id = result.organization_id and m.user_id = (select auth.uid()) and m.status = 'active')
     and not public.is_admin() then
    raise exception 'Not authorized to respond to this booking';
  end if;
  update public.bookings set status = p_status where id = p_booking_id returning * into result;
  if p_status = 'confirmed' then update public.cars set status = 'rented' where id = result.car_id and status = 'available'; end if;
  return result;
end;
$$;
revoke all on function public.respond_to_booking(uuid, public.booking_status) from public;
grant execute on function public.respond_to_booking(uuid, public.booking_status) to authenticated;