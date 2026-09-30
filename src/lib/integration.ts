// طبقة البيانات — تحويل صفوف Supabase إلى أنواع شاشات مشوار
// كل الدوال تعود بـ null في حالة عدم التهيئة/الفشل حتي تبقى البيانات التجريبية هي الأساس.
import type { Booking, Car, DealerRequest } from '../types';
import { supabase } from './supabase';

const FALLBACK_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA9PA3q6QcYuprjKbhshCO96zoVnaYZzJXoMBjJ8WweRYq4ao15O71qNEy-vThgwKxkzdnZuETqZakR8zBMv0mN3IGbXy6Ehpvor50IoITrGfUJbvN7YajOR3lWdbaeIksbTOBaorYOCu0HMKKFc4ZDTaV9k4_-cDfkzHtMP1Wa3A7NSWwA4BLaK9IbvoM2foUHi517JO2Yz1seyeVTfj9hY1ec5wRzmiMJYCtSs-wsH8_rm933sYtr';

const CATEGORY_AR: Record<string, string> = {
  economy: 'اقتصادية وعملية',
  family: 'عائلية مريحة',
  suv: 'SUV عائلية',
  luxury: 'فاخرة',
  minibus: 'ميني باص',
};

function hashNum(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9000;
  return 1000 + h;
}

/** تحويل صف سيارة من قاعدة البيانات إلى نوع Car الخاص بالواجهة */
export function mapCarRow(row: Record<string, any>): Car {
  const dealer = (row.organizations as Record<string, any> | undefined) ?? {};
  const type = (row.type as string) || 'suv';
  const yearMatch = (row.name as string).match(/20\d{2}/);
  const status = (row.status as string) || 'available';
  return {
    id: row.id as string,
    name: row.name as string,
    year: yearMatch ? Number(yearMatch[0]) : new Date().getFullYear(),
    category: CATEGORY_AR[type] ? type : 'suv',
    categoryAr: CATEGORY_AR[type] ?? 'معتمد',
    plateLetters: 'س ج د',
    plateNumbers: String(hashNum(row.id as string)),
    dailyPrice: Number(row.price_per_day ?? 0),
    dealerName: (dealer.name as string) || 'معرض معتمد',
    location: (dealer.city as string) || 'القاهرة',
    mileage: 'مفتوح كم',
    transmission: 'أوتوماتيك',
    seats: type === 'minibus' ? 12 : 5,
    fuel: 'بنزين 95',
    status: status === 'available' ? 'available' : 'rented',
    statusAr: status === 'available' ? 'متاح للتسليم' : 'في رحلة مؤجرة',
    image: (row.photo_url as string | null) || FALLBACK_IMG,
    deposit: 3000,
    insurancePrice: 500,
    serviceFee: 350,
    routeAllowanceKm: 800,
  };
}

/** تحميل كتالوج السيارات الحقيقي من المعارض المعتمدة */
export async function loadLiveCars(): Promise<Car[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('cars')
      .select('*, organizations!inner(name, city, status)')
      .eq('organizations.status', 'approved')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error || !data || data.length === 0) return null;
    return data.map((r) => mapCarRow(r as Record<string, any>));
  } catch {
    return null;
  }
}

/** بيانات لوحة المعارض للمستخدم الحالي (معرض) */
export async function loadDealerOps(): Promise<{ fleet: Car[]; requests: DealerRequest[] } | null> {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: dealer } = await supabase
      .from('organizations')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle();
    if (!dealer) return null;
    const [{ data: rows, error: carsErr }, { data: pending, error: reqErr }] = await Promise.all([
      supabase.from('cars').select('*, organizations!inner(name, city, status)').eq('organization_id', (dealer as Record<string, any>).id),
      supabase
        .from('bookings')
        .select('*, cars(name)')
        .eq('organization_id', (dealer as Record<string, any>).id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20),
    ]);
    if (carsErr && reqErr && !rows) return null;
    const fleet = (rows ?? []).map((r) => mapCarRow(r as Record<string, any>));
    const requests: DealerRequest[] = (pending ?? []).map((b) => {
      const row = b as Record<string, any>;
      return {
        id: row.id as string,
        code: `MSH-${(row.id as string).slice(0, 4).toUpperCase()}`,
        customerName: 'عميل مشوار',
        customerPhone: '',
        carName: (row.cars as Record<string, any> | undefined)?.name ?? 'سيارة',
        route: `${row.origin_city} ← ${row.destination_city}`,
        period: `${row.days} أيام`,
        days: Number(row.days ?? 1),
        totalPrice: Number(row.total_price ?? 0),
        status: 'pending',
        statusAr: 'قيد المراجعة — مباشر من قاعدة البيانات',
        pickupTime: 'التسليم حسب العقد',
      };
    });
    return { fleet, requests };
  } catch {
    return null;
  }
}
/** حجوزات العميل الحالي من قاعدة البيانات */
export async function loadMyBookings(): Promise<Booking[] | null> {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('bookings')
      .select('*, cars(name), organizations(name, phone)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error || !data || data.length === 0) return null;
    return data.map((b) => {
      const row = b as Record<string, any>;
      const car = mapCarRow({ ...(row.cars ?? {}), id: row.car_id, price_per_day: row.price_per_day });
      const status = (row.status as string) || 'pending';
      const statusAr =
        status === 'confirmed'
          ? 'مؤكد وجاهز للاستلام'
          : status === 'rejected'
            ? 'تم الاعتذار من المعرض'
            : status === 'cancelled'
              ? 'ملغي'
              : 'قيد المراجعة';
      return {
        id: row.id as string,
        code: `MSH-${(row.id as string).slice(0, 4).toUpperCase()}`,
        car,
        pickupLocation: row.origin_city as string,
        dropoffLocation: row.destination_city as string,
        pickupDate: (row.start_date as string) ?? '',
        pickupTime: '10:00 ص',
        returnDate: '',
        returnTime: '08:00 م',
        days: Number(row.days ?? 1),
        distanceKm: Number(row.distance_km ?? 0),
        dailyPrice: Number(row.price_per_day ?? 0),
        rentalSubtotal: Number(row.total_price ?? 0),
        insuranceFee: 0,
        serviceFee: 0,
        deposit: 0,
        totalPrice: Number(row.total_price ?? 0),
        status: status === 'confirmed' ? 'confirmed' : status === 'rejected' ? 'cancelled' : 'pending',
        statusAr,
        officerName: 'مشوار — خدمة العملاء',
        officerPhone: '19822',
        officerAvatar: '',
        insurancePolicyNumber: `POL-DB-${(row.id as string).slice(0, 4).toUpperCase()}`,
        createdAt: row.created_at as string,
      };
    });
  } catch {
    return null;
  }
}

/** حفظ حجز جديد في قاعدة البيانات (يتطلب تسجيل الدخول) */
export async function persistBooking(input: {
  carId: string;
  originCity: string;
  destination: string;
  distanceKm: number;
  days: number;
  startDate: string;
  pricePerDay: number;
  totalPrice: number;
}): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ' };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'سجّل دخولك أولاً لحفظ الحجز في قاعدة البيانات.' };
    const { data: car, error: carErr } = await supabase
      .from('cars')
      .select('organization_id, status, organizations!inner(status)')
      .eq('id', input.carId)
      .maybeSingle();
    if (carErr || !car) return { ok: false, error: 'السيارة غير متاحة للحجز الآن.' };
    const { error } = await supabase.from('bookings').insert({
      customer_id: user.id,
      organization_id: (car as Record<string, any>).organization_id,
      car_id: input.carId,
      origin_city: input.originCity,
      destination_city: input.destination,
      distance_km: input.distanceKm,
      start_date: input.startDate,
      days: input.days,
      price_per_day: input.pricePerDay,
      extra_per_km: 0,
      total_price: input.totalPrice,
      terms_accepted_at: new Date().toISOString(),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'خطأ غير متوقع' };
  }
}

/** رد المعرض على طلب حجز (confirm/reject) عبر RPC آمن */
export async function respondToBooking(id: string, status: 'confirmed' | 'rejected'): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ' };
  // نتعامل فقط مع المعرّفات القادمة من قاعدة البيانات (uuid)
  if (!/^[0-9a-f-]{36}$/i.test(id)) return { ok: false, error: 'request-id' };
  try {
    const { error } = await supabase.rpc('respond_to_booking', { p_booking_id: id, p_status: status });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'خطأ غير متوقع' };
  }
}

/** تحديث إتاحة سيارة المعرض */
export async function setCarStatus(carId: string, status: 'available' | 'maintenance'): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ' };
  if (!/^[0-9a-f-]{36}$/i.test(carId)) return { ok: false, error: 'car-id' };
  try {
    const { error } = await supabase.from('cars').update({ status }).eq('id', carId);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'خطأ غير متوقع' };
  }
}