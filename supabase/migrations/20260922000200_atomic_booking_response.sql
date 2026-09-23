create or replace function public.respond_to_booking(p_booking_id uuid, p_status public.booking_status)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare result public.bookings;
begin
  if p_status not in ('confirmed', 'rejected') then raise exception 'Invalid response status'; end if;
  select * into result from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'Booking not found'; end if;
  if result.status <> 'pending' then raise exception 'Booking was already handled'; end if;
  if not exists (select 1 from public.dealers where id = result.dealer_id and user_id = (select auth.uid())) and not public.is_admin() then
    raise exception 'Not authorized to respond to this booking';
  end if;
  update public.bookings set status = p_status where id = p_booking_id returning * into result;
  if p_status = 'confirmed' then update public.cars set status = 'rented' where id = result.car_id and status = 'available'; end if;
  return result;
end;
$$;
revoke all on function public.respond_to_booking(uuid, public.booking_status) from public;
grant execute on function public.respond_to_booking(uuid, public.booking_status) to authenticated;
