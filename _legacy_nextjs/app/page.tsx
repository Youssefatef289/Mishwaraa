import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import CarCard from '@/components/car-card';
import { CarIcon, CalendarIcon, KeyIcon, PriceIcon, CheckIcon } from '@/components/icons';

const STEPS = [
  { title: 'اختار المعرض والعربية', text: 'لفّ على المعارض المعتمدة في مدينتك واختار العربية اللي تناسب ميزانيتك واحتياجك.' },
  { title: 'حدّد وجهتك ومدّة الرحلة', text: 'اكتب مدينة الوجهة وعدد الأيام، والسعر بيتحسب قدامك لحظيًا على المسافة.' },
  { title: 'أكّد واستنى ردّ المعرض', text: 'ابعَت طلبك، وهيوصلك تأكيد المعرض بالتفاصيل ومواعيد التسليم.' },
];

const SERVICES = [
  { icon: <CalendarIcon className="h-6 w-6 text-teal" />, title: 'تأجير يومي وأسبوعي', text: 'عقود مرنة تبدأ من يوم لحد 90 يوم على حسب رحلتك.' },
  { icon: <KeyIcon className="h-6 w-6 text-teal" />, title: 'تسليم واستلام مرن', text: 'المعرض بيوصّلك العربية أو تروح تاخدها — كل ده بالاتفاق.' },
  { icon: <PriceIcon className="h-6 w-6 text-teal" />, title: 'تسعير شفاف', text: 'سعر اليوم + جنيه للكيلو، في حساب واضح قدامك قبل ما تأكد.' },
  { icon: <CheckIcon className="h-6 w-6 text-teal" />, title: 'تأكيد فوري من المعرض', text: 'المعرض بيرد على طلبك بسرعة، وبتلاقي الرد في حسابك وعلى الإيميل.' },
];

export default async function Home() {
  let stats = { dealers: 40, cars: 200, cities: 15 };
  let featured: any[] = [];
  if (isSupabaseConfigured) {
    try {
      const s = await createClient();
      const [{ count: dealers }, { count: carsCount }] = await Promise.all([
        s.from('dealers').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        s.from('cars').select('id', { count: 'exact', head: true }).eq('status', 'available'),
      ]);
      if (dealers) stats.dealers = dealers;
      if (carsCount) stats.cars = carsCount;
      const { data: cityRows } = await s.from('dealers').select('city').eq('status', 'approved');
      if (cityRows?.length) stats.cities = new Set(cityRows.map((r: any) => r.city)).size;
      const { data } = await s.from('cars').select('*,dealers!inner(name,city)').eq('status', 'available').eq('dealers.status', 'approved').order('created_at', { ascending: false }).limit(6);
      if (data) featured = data;
    } catch {}
  }
  return (
    <>
      {/* a. Hero */}
      <section className="pb-4">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-teal"><CarIcon className="h-6 w-12" />تأجير سيارات موثوق في مصر</p>
            <h1 className="text-5xl font-extrabold leading-tight">مشوارك يبدأ هنا</h1>
            <p className="mt-4 text-lg leading-8 text-dim">اختار المعرض، اختار العربية، واعرف السعر قبل ما تتحرك — من غير ما تكلم خمسة جراجات علشان تقارن.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/cars" className="primary inline-block rounded-lg px-6 py-2.5 text-lg font-bold">تصفح السيارات</Link>
              <Link href="/auth" className="secondary inline-block rounded-lg px-6 py-2.5 text-lg font-bold">سجّل معرضك</Link>
            </div>
          </div>
          <div className="surface p-6 md:p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-extrabold text-amber"><span className="digital">{stats.dealers}+</span></p>
                <p className="mt-1 text-xs text-dim">معرض معتمد</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-amber"><span className="digital">{stats.cars}+</span></p>
                <p className="mt-1 text-xs text-dim">عربية متاحة</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-amber"><span className="digital">{stats.cities}+</span></p>
                <p className="mt-1 text-xs text-dim">مدينة مخدومة</p>
              </div>
            </div>
            <div className="road-divider mt-5" />
            <p className="mt-4 flex items-center gap-2 text-sm text-dim"><CarIcon className="h-6 w-12 text-teal" />أسعار واضحة، معارض موثوقة، وتأكيد من غير معاناة.</p>
          </div>
        </div>
      </section>

      <Link href="/demo" className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-surface-2 px-4 py-3 transition hover:border-amber" style={{ borderColor: 'var(--border)' }}>
        <span className="flex flex-wrap items-center gap-2">
          <span className="cluster-font text-xs font-bold tracking-widest" style={{ color: 'var(--teal)' }}>EG-HIGHWAY // 2025</span>
          <span className="text-sm font-bold">جرّب تجربتنا التفاعلية الكاملة — كل الشاشات ومُحاكي الأجهزة</span>
        </span>
        <span className="cluster-font text-xs font-bold text-amber">OPEN ↗</span>
      </Link>

      <div className="road-divider my-12" />

      {/* b. How it works */}
      <section className="my-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">إزاي بيشتغل؟</h2>
          <p className="mt-2 text-dim">تلات خطوات وتكون راكب</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((st, i) => (
            <article key={st.title} className="surface p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber text-lg font-bold text-white"><span className="digital">{i + 1}</span></span>
              <h3 className="mt-3 text-xl font-bold">{st.title}</h3>
              <p className="mt-2 text-sm leading-7 text-dim">{st.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* c. Services */}
      <section id="services" className="my-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold">خدماتنا</h2>
          <p className="mt-2 text-dim">كل اللي محتاجه في رحلتك، في مكان واحد</p>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((sv) => (
            <article key={sv.title} className="surface p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface-2">{sv.icon}</div>
              <h3 className="mt-3 font-bold">{sv.title}</h3>
              <p className="mt-2 text-sm leading-7 text-dim">{sv.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* d. Featured cars */}
      {featured.length > 0 && (
        <section className="my-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold">أحدث العربيات المتاحة</h2>
            <Link href="/cars" className="text-teal underline-offset-2 underline">كل العربيات</Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CarCard key={c.id} car={c} />)}
          </div>
        </section>
      )}

      <div className="road-divider my-12" />

      {/* e. About */}
      <section id="about" className="my-12">
        <h2 className="text-3xl font-extrabold">من نحن</h2>
        <p className="mt-4 text-base leading-8 text-text">مشوار منصّة بتوصّل الناس بمعارض السيارات في كل مصر — سواء كنت صاحب معرض عايز تجيب عملاء جدد، أو مسافر محتاج عربية لرحلته.</p>
        <p className="mt-3 text-base leading-8 text-dim">بنحل مشكلة إنك تضطر تكلم خمسة جراجات وتقارن الأسعار والمواعيد واحدة واحدة. على مشوار، كل حاجة واضحة من الأول: السعر، المسافة، ومواعيد التسليم.</p>
      </section>

      {/* f. Dealer CTA */}
      <section className="my-12 border bg-surface-2 p-8 md:p-10" style={{ borderColor: 'var(--amber)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">عندك معرض سيارات؟</h2>
            <p className="mt-2 text-dim">سجّل معرضك في مشوار واستقبل طلبات حجز من عملاء جدد في مدينتك.</p>
          </div>
          <Link href="/auth" className="primary inline-block rounded-lg px-6 py-2.5 text-lg font-bold">سجّل معرضك مجانًا</Link>
        </div>
      </section>
    </>
  );
}
