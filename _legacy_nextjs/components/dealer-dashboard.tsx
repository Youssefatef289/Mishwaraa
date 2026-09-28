'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { respondBooking } from '@/app/actions';
import StatusChip from '@/components/status-chip';
import BookingChat from '@/components/booking-chat';
import SupportChat from '@/components/support-chat';

export default function DealerDashboard({ dealer, initialCars, initialBookings }: { dealer: any; initialCars: any[]; initialBookings: any[] }) {
  const [cars, setCars] = useState(initialCars);
  const [bookings, setBookings] = useState(initialBookings);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const s = createClient();
    const ch = s.channel(`dealer-${dealer.id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'bookings', filter: `dealer_id=eq.${dealer.id}` }, async () => {
      const { data } = await s.from('bookings').select('*,cars(name)').eq('dealer_id', dealer.id);
      if (data) setBookings(data);
    }).subscribe();
    return () => { s.removeChannel(ch) };
  }, [dealer.id]);
  async function addCar(f: FormData) {
    const s = createClient();
    const { error } = await s.from('cars').insert({ dealer_id: dealer.id, name: String(f.get('name')), type: String(f.get('type')), price_per_day: Number(f.get('price')), extra_per_km: Number(f.get('perKm')) });
    setNotice(error ? error.message : 'تمت إضافة السيارة');
    if (!error) {
      const { data } = await s.from('cars').select('*').eq('dealer_id', dealer.id);
      if (data) setCars(data);
    }
  }
  async function toggle(c: any) {
    const s = createClient();
    const status = c.status === 'available' ? 'maintenance' : 'available';
    const { error } = await s.from('cars').update({ status }).eq('id', c.id);
    if (error) setNotice(error.message);
    else setCars(cars.map((x) => x.id === c.id ? { ...x, status } : x));
  }
  const availableCars = cars.filter((c) => c.status === 'available').length;
  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const now = new Date();
  const confirmedThisMonth = bookings.filter((b) => b.status === 'confirmed' && new Date(b.created_at).getFullYear() === now.getFullYear() && new Date(b.created_at).getMonth() === now.getMonth()).length;
  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{dealer.name}</h1>
        <p className="mt-1 text-sm text-dim">حالة المعرض: <StatusChip status={dealer.status} /></p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-4">
          <p className="text-sm text-dim">عربيات متاحة</p>
          <p className="mt-1 text-3xl font-bold text-teal"><span className="digital">{availableCars}</span></p>
        </div>
        <div className="surface p-4">
          <p className="text-sm text-dim">طلبات معلقة</p>
          <p className="mt-1 text-3xl font-bold text-amber"><span className="digital">{pendingBookings}</span></p>
        </div>
        <div className="surface p-4">
          <p className="text-sm text-dim">حجوزات مؤكدة الشهر ده</p>
          <p className="mt-1 text-3xl font-bold text-success"><span className="digital">{confirmedThisMonth}</span></p>
        </div>
      </div>
      {dealer.status === 'approved' && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="surface p-5">
              <h2 className="mb-4 text-xl font-bold">إضافة سيارة</h2>
              <form action={addCar} className="space-y-3">
                <input name="name" placeholder="اسم السيارة" required />
                <select name="type">
                  <option value="economy">اقتصادي</option>
                  <option value="family">عائلي</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">فاخر</option>
                  <option value="minibus">ميني باص</option>
                </select>
                <input name="price" type="number" min="0" placeholder="السعر اليومي" required />
                <input name="perKm" type="number" min="0" placeholder="إضافة لكل كم" required />
                <button className="primary">إضافة</button>
              </form>
            </div>
            <div className="surface p-5">
              <h2 className="mb-4 text-xl font-bold">سياراتي</h2>
              {cars.map((c) => (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-3">
                  <span className="font-bold">{c.name}</span>
                  <span className="flex items-center gap-2">
                    <StatusChip status={c.status} />
                    <button className="secondary" onClick={() => toggle(c)}>{c.status === 'available' ? 'صيانة' : 'إتاحة'}</button>
                  </span>
                </div>
              ))}
              {!cars.length && <p className="mt-3 text-sm text-dim">لسه مفيش عربيات مضافة.</p>}
            </div>
          </div>
          <div className="surface p-5">
            <h2 className="mb-4 text-xl font-bold">طلبات الحجز الواردة</h2>
            {bookings.map((b) => (
              <div key={b.id} className="border-b py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{b.cars?.name} إلى {b.destination_city}</p>
                    <p className="text-sm text-dim"><span className="digital">{b.days}</span> أيام · <span className="digital">{b.total_price}</span> ج</p>
                  </div>
                  <span className="flex flex-wrap items-center gap-2">
                    <StatusChip status={b.status} />
                    {b.status === 'pending' && (
                      <>
                        <button className="primary" onClick={() => respondBooking(b.id, 'confirmed')}>تأكيد</button>
                        <button className="danger" onClick={() => respondBooking(b.id, 'rejected')}>رفض</button>
                      </>
                    )}
                  </span>
                </div>
                <BookingChat bookingId={b.id} viewerId={dealer.user_id} status={b.status} label="الشات مع العميل" />
              </div>
            ))}
            {!bookings.length && <p className="mt-3 text-sm text-dim">مفيش طلبات واردة دلوقتي.</p>}
          </div>
        </>
      )}
      {dealer.status !== 'approved' && (
        <div className="surface p-5">
          <p className="text-dim">معرضك لسه قيد المراجعة — أول ما الإدارة تعتمده هتقدر تضيف عربيات وتستقبل طلبات الحجز.</p>
        </div>
      )}
      <div className="surface p-5">
        <h2 className="mb-4 text-xl font-bold">تواصل مع إدارة الموقع</h2>
        <p className="mb-2 text-sm text-dim">عندك سؤال أو مشكلة في المعرض أو الحجوزات؟ اكتب هنا وهيرد عليك فريق إدارة مشوار.</p>
        <SupportChat dealerId={dealer.id} viewerId={dealer.user_id} label="افتح المحادثة مع الإدارة" />
      </div>
      {notice && <p className="text-sm text-danger">{notice}</p>}
    </section>
  );
}