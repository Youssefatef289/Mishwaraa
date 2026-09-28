import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import ConfigAlert from '@/components/config-alert';
import CarCard from '@/components/car-card';

export default async function Cars({ searchParams }: { searchParams: { city?: string; type?: string } }) {
  if (!isSupabaseConfigured) return <ConfigAlert />;
  const s = await createClient();
  let q = s.from('cars').select('*,dealers!inner(name,city,status)').eq('status', 'available').eq('dealers.status', 'approved');
  if (searchParams.city) q = q.eq('dealers.city', searchParams.city);
  if (searchParams.type) q = q.eq('type', searchParams.type);
  const { data: result } = await q;
  const data = result ?? [];
  return (
    <>
      <h1 className="mb-2 text-3xl font-bold">السيارات المتاحة</h1>
      <p className="mb-6 text-sm text-dim">كل العربيات المعتمدة من معارضنا، بسعر واضح لحد ما تقرر.</p>
      <form className="mb-8 flex flex-wrap items-end gap-3">
        <input name="city" placeholder="المدينة" defaultValue={searchParams.city} />
        <select name="type" defaultValue={searchParams.type}>
          <option value="">كل الفئات</option>
          <option value="economy">اقتصادي</option>
          <option value="family">عائلي</option>
          <option value="suv">SUV</option>
          <option value="luxury">فاخر</option>
          <option value="minibus">ميني باص</option>
        </select>
        <button className="primary">بحث</button>
      </form>
      <div className="grid gap-5 md:grid-cols-3">
        {data.map((c: any) => <CarCard key={c.id} car={c} />)}
      </div>
      {!data.length && <p className="text-dim">لا توجد سيارات مطابقة حالياً.</p>}
    </>
  );
}
