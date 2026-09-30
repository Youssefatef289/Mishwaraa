import { createClient as createAdminClient } from '@supabase/supabase-js';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { sendNotification } from '@/lib/notifications';

// ========== مشوار: قلب منطق الحجز (مشترك بين Server Actions و REST API) ==========
// لا تُكرَّر الصيغ هنا في أي مكان آخر — أي تغيير في الحسابات/التحقق ينعكس على المسارين.

export function validateBookingData(destination: string, days: number, date: string) {
  if (destination.length < 2 || destination.length > 100) throw new Error('Enter a valid destination city.');
  if (!Number.isInteger(days) || days < 1 || days > 90) throw new Error('Trip duration must be 1–90 days.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Enter a valid start date.');
}

export async function fetchDistanceKm(origin: string, destination: string): Promise<number> {
  if (!process.env.GOOGLE_MAPS_API_KEY) throw new Error('Google Maps API is not configured.');
  const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json');
  url.searchParams.set('origins', `${origin}, Egypt`);
  url.searchParams.set('destinations', `${destination}, Egypt`);
  url.searchParams.set('key', process.env.GOOGLE_MAPS_API_KEY);
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error('Distance service is unavailable.');
  const payload = await response.json();
  const element = payload.rows?.[0]?.elements?.[0];
  if (element?.status !== 'OK' || typeof element.distance?.value !== 'number') throw new Error('Unable to calculate this route.');
  return Math.round(element.distance.value / 10) / 100;
}

export function priceQuote(distanceKm: number, days: number, pricePerDay: number, extraPerKm: number): { distanceKm: number; totalPrice: number } {
  return { distanceKm, totalPrice: Math.round((days * pricePerDay + distanceKm * extraPerKm) * 100) / 100 };
}

export async function calculateQuote(origin: string, destination: string, days: number, pricePerDay: number, extraPerKm: number) {
  validateBookingData(destination.trim(), days, new Date().toISOString().slice(0, 10));
  const distanceKm = await fetchDistanceKm(origin, destination);
  return priceQuote(distanceKm, days, pricePerDay, extraPerKm);
}

export type BookingInput = { carId: string; destination: string; days: number; startDate: string; terms: boolean };

export async function createBookingFor(s: SupabaseClient, user: User, data: BookingInput): Promise<Record<string, unknown>> {
  if (!data.terms) throw new Error('You must accept the terms.');
  validateBookingData(data.destination.trim(), data.days, data.startDate);
  const { data: car, error } = await s
    .from('cars')
    .select('id,organization_id,price_per_day,extra_per_km,organizations!inner(city,status,owner_id)')
    .eq('id', data.carId)
    .eq('status', 'available')
    .single();
  const dealer = car?.organizations as unknown as { city: string; status: string; owner_id: string } | undefined;
  if (error || !car || !dealer || dealer.status !== 'approved') throw new Error('This car is no longer available.');
  const quote = await calculateQuote(dealer.city, data.destination.trim(), data.days, Number(car.price_per_day), Number(car.extra_per_km));
  // نفس قيم الإدراج الموجودة في createBooking — مع إعادة السجل المُنشأ (select) ليُرجعه الـ API.
  const { data: created, error: insertError } = await s.from('bookings').insert({
    customer_id: user.id,
    organization_id: car.organization_id,
    car_id: car.id,
    origin_city: dealer.city,
    destination_city: data.destination.trim(),
    distance_km: quote.distanceKm,
    start_date: data.startDate,
    days: data.days,
    price_per_day: car.price_per_day,
    extra_per_km: car.extra_per_km,
    total_price: quote.totalPrice,
    terms_accepted_at: new Date().toISOString(),
  }).select('*').single();
  if (insertError) throw new Error(insertError.message);
  await notify(await emailFor(dealer.owner_id), 'New Mishwar booking request', `A customer requested a car trip to ${data.destination.trim()}.`);
  return created as Record<string, unknown>;
}

// بريد/إشعارات — مشتركة بين المسارين (نفس تنفيذ app/actions.ts القديم تمامًا).
export async function emailFor(userId: string): Promise<string | null> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key || !process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const admin = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key);
  const { data } = await admin.auth.admin.getUserById(userId);
  return data.user?.email ?? null;
}

export async function notify(to: string | null, subject: string, html: string) {
  if (!to) return;
  try { await sendNotification({ to, subject, html }); } catch (error) { console.error('Notification failed:', error); }
}