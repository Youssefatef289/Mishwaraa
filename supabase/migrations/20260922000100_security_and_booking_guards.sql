drop policy if exists "profiles update own" on public.profiles;
create policy "profiles insert self as customer or dealer" on public.profiles for insert to authenticated with check (id = (select auth.uid()) and role in ('customer', 'dealer'));
create policy "profiles update own safe roles" on public.profiles for update to authenticated using (id = (select auth.uid()) or public.is_admin()) with check (public.is_admin() or (id = (select auth.uid()) and role in ('customer', 'dealer')));
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare requested_role public.user_role;
begin
  requested_role := case when new.raw_user_meta_data->>'role' = 'dealer' then 'dealer'::public.user_role else 'customer'::public.user_role end;
  insert into public.profiles (id, role, full_name, phone) values (new.id, requested_role, nullif(new.raw_user_meta_data->>'full_name',''), nullif(new.raw_user_meta_data->>'phone',''));
  if requested_role = 'dealer' then
    insert into public.dealers (user_id, name, city, phone, address) values (new.id, coalesce(nullif(new.raw_user_meta_data->>'dealer_name',''), 'New dealer'), coalesce(nullif(new.raw_user_meta_data->>'city',''), 'Cairo'), coalesce(nullif(new.raw_user_meta_data->>'phone',''), ''), coalesce(nullif(new.raw_user_meta_data->>'address',''), ''));
  end if;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
create or replace function public.guard_booking_update() returns trigger language plpgsql security invoker set search_path = public as $$
begin
  if new.customer_id is distinct from old.customer_id or new.dealer_id is distinct from old.dealer_id or new.car_id is distinct from old.car_id or new.origin_city is distinct from old.origin_city or new.destination_city is distinct from old.destination_city or new.distance_km is distinct from old.distance_km or new.start_date is distinct from old.start_date or new.days is distinct from old.days or new.price_per_day is distinct from old.price_per_day or new.extra_per_km is distinct from old.extra_per_km or new.total_price is distinct from old.total_price or new.terms_accepted_at is distinct from old.terms_accepted_at then raise exception 'Booking details cannot be changed after creation'; end if;
  if old.status <> 'pending' then raise exception 'Only pending bookings can be updated'; end if;
  if new.status not in ('confirmed', 'rejected', 'cancelled') then raise exception 'Invalid booking status transition'; end if;
  return new;
end;
$$;
drop trigger if exists bookings_guard_update on public.bookings;
create trigger bookings_guard_update before update on public.bookings for each row execute procedure public.guard_booking_update();
