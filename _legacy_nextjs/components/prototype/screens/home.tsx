'use client';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckIcon } from '@/components/icons';
import type { Device, ScreenId } from '../data';
import { CITIES, FLEET, HIGHWAYS, QUALITY, SAFETY } from '../data';
import { CarArt, EgHighwayTicker, Plate, ProgressMeter, SectionTitle } from '../ui';
import { CaretIcon, ClockIcon, FuelIcon, GearIcon, MapPinIcon, SearchIcon, SeatIcon, ShieldIcon, StarIcon, SnowIcon } from '../icons';

const CLASS_OPTIONS = [
  { id: '', label: 'كل الفئات' },
  { id: 'suv', label: 'SUV' },
  { id: 'sedan', label: 'سيدان' },
  { id: 'economy', label: 'اقتصادي' },
  { id: 'luxury', label: 'فاخر' },
];

const SAFETY_ICONS: Record<string, ReactNode> = {
  shield: <ShieldIcon className="h-5 w-5" />,
  check: <CheckIcon className="h-5 w-5" />,
  clock: <ClockIcon className="h-5 w-5" />,
  plate: <MapPinIcon className="h-5 w-5" />,
};

export default function HomeScreen({ device, goTo, onBook }: { device: Device; goTo: (s: ScreenId) => void; onBook: (carId: string) => void }) {
  const [city, setCity] = useState('');
  const [klass, setKlass] = useState('');
  const [picked, setPicked] = useState(false);

  const fleet = useMemo(() => FLEET.filter((c) => (!city || c.city === city) && (!klass || c.type === klass)), [city, klass]);

  return (
    <div className="screen-enter">
      <EgHighwayTicker items={HIGHWAYS} />

      {/* Hero + بحث وفلترة */}
      <section className="relative overflow-hidden px-4 pb-6 pt-7" style={{ background: 'radial-gradient(1200px 320px at 50% -40px, var(--surface) 0%, var(--bg) 70%)' }}>
        <p className="cluster-font mb-2 text-[11px] font-bold tracking-[0.3em]" style={{ color: 'var(--teal)' }}>
          EG-HIGHWAY // 2025 · بمعايير السلامة المصرية
        </p>
        <h1 className="text-3xl font-extrabold leading-snug sm:text-4xl">
          سيّارتك جاهزة عند البوابة…
          <span style={{ color: 'var(--amber)' }}> والطريق مستويك.</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-dim sm:text-base">
          تصفّح أسطول المعارض المعتمدة في المدن المصرية، واختر السيارة ولوحة المرور، واحجز بمسافات وأسعار محسوبة لحظيًا على الـ EG-HIGHWAY.
        </p>

        {/* شريط البحث الذكي */}
        <div className="surface mt-6 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-xs font-bold text-dim">
              مدينة الاستلام
              <select className="mt-1" value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">كل المدن</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-xs font-bold text-dim">
              تاريخ الاستلام
              <input type="date" className="mt-1" defaultValue="2026-10-12" />
            </label>
            <label className="block text-xs font-bold text-dim">
              تاريخ الإرجاع
              <input type="date" className="mt-1" defaultValue="2026-10-19" />
            </label>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {CLASS_OPTIONS.map((opt) => (
              <button
                key={opt.id || 'all'}
                type="button"
                onClick={() => setKlass(opt.id)}
                className="rounded-full border px-3 py-1 text-xs font-bold transition"
                style={klass === opt.id ? { background: 'var(--amber)', borderColor: 'var(--amber)', color: '#fff' } : { color: 'var(--dim)', borderColor: 'var(--border)' }}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPicked(true)}
              className="primary btn-shine ms-auto flex items-center gap-2"
            >
              <SearchIcon className="h-4 w-4" /> ابحث في الأسطول
            </button>
          </div>
          {picked && (
            <p className="fade-up mt-3 flex flex-wrap items-center gap-2 text-xs text-dim">
              <span style={{ color: 'var(--green)' }}>●</span> تم رصد <b className="cluster-font">{fleet.length}</b> سيارة مطابقة شرط البحث الحالي.
            </p>
          )}
        </div>
      </section>
      {/* خريطة مسار الخطوات 01–03 */}
      <section className="px-4 pb-6 pt-4">
        <SectionTitle
          eyebrow="ROADMAP 01–03"
          title="مسار خطواتك على الطريق"
          after={device === 'desktop' ? <button className="secondary px-3 py-1 text-xs" onClick={() => goTo('checkout')}>ابدأ الحجز</button> : undefined}
        />
        <div className="surface p-4">
          <div className="relative">
            <span className="road-strip absolute right-4 left-4 top-4 h-[2px] opacity-40" />
            <div className="relative grid grid-cols-3 gap-2">
              {[
                { n: '01', t: 'اختار المدينة والعربية', d: 'المعارض المعتمدة ولوحات المرور المصرية قدامك' },
                { n: '02', t: 'وجهة الرحلة والمدة', d: 'المسافة بالكيلومتر على الـ EG-HIGHWAY وتكلفة لحظية' },
                { n: '03', t: 'الحساب والتأكيد', d: 'تصريح القيادة الرقمي والاستلام من البوابة في دقيقتين' },
              ].map((s, i) => (
                <div key={s.n} className="flex flex-col items-center text-center">
                  <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold" style={{ background: 'var(--surface)', borderColor: 'var(--amber)', color: 'var(--amber)' }}>
                    <span className="cluster-font">{s.n}</span>
                  </span>
                  <h3 className="mt-2 text-sm font-extrabold">{s.t}</h3>
                  <p className="mt-1 hidden text-[11px] leading-5 text-dim sm:block">{s.d}</p>
                  {i === 0 && <span className="sr-only">ابدأ من هنا</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* معايير الأمان على الطرق السريعة */}
      <section className="px-4 pb-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {SAFETY.map((s, i) => (
            <article key={s.title} className="surface fade-up p-3" style={{ animationDelay: `${i * 90}ms` }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg text-teal" style={{ background: 'var(--surface-2)' }}>
                {SAFETY_ICONS[s.icon]}
              </span>
              <h3 className="mt-2 text-xs font-extrabold">{s.title}</h3>
              <p className="mt-1 text-[11px] leading-5 text-dim">{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* شبكة الأسطول المعتمد */}
      <section className="px-4 pb-6">
        <SectionTitle
          eyebrow="CERTIFIED FLEET"
          title="شبكة الأسطول المعتمدة"
          after={<span className="flex items-center gap-1 text-[11px] font-bold text-dim"><MapPinIcon className="h-3.5 w-3.5" /> {city || 'كل المدن'} · {fleet.length} سيارة</span>}
        />
        {fleet.length === 0 ? (
          <div className="surface p-8 text-center">
            <p className="text-lg font-bold">لا توجد نتائج في {city}</p>
            <p className="mt-2 text-sm text-dim">يمكنك الحجز على الطريق من أي مدينة والوجهة أمامك على الـ EG-HIGHWAY.</p>
            <button className="primary mt-4 text-sm" onClick={() => { setCity(''); setKlass(''); setPicked(false); }}>إعادة ضبط البحث</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {fleet.map((car, i) => (
              <article key={car.id} className="surface fade-up overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative bg-surface-2">
                  <CarArt car={car} className="h-28 w-full p-2" />
                  <span className="absolute right-2 top-2"><Plate code={car.plate} size="sm" /></span>
                  <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-bold text-[#0B3D91]">{car.city}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold">{car.name}</h3>
                      <p className="text-xs text-dim">{car.typeLabel} · {car.dealer}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--amber)' }}>
                      <StarIcon className="h-3.5 w-3.5" />{car.rating}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-dim">
                    <span className="flex items-center gap-1"><SeatIcon className="h-3.5 w-3.5" />{car.seats} ركاب</span>
                    <span className="flex items-center gap-1"><GearIcon className="h-3.5 w-3.5" />{car.transmission}</span>
                    <span className="flex items-center gap-1"><FuelIcon className="h-3.5 w-3.5" />{car.fuel}</span>
                    <span className="flex items-center gap-1"><SnowIcon className="h-3.5 w-3.5" />مكيف</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                    <div>
                      <p className="cluster-font text-lg font-bold" style={{ color: 'var(--amber)' }}>{car.pricePerDay} ج/يوم</p>
                      <p className="text-[11px] text-dim">+ {car.perKm} ج/كم · باقة <b className="cluster-font">800 كم</b> مشمولة</p>
                    </div>
                    <button className="primary btn-shine flex items-center gap-1 text-sm" onClick={() => onBook(car.id)}>
                      حجز مباشر <CaretIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {/* مؤشر الجودة الميداني */}
      <section className="px-4 pb-6">
        <div className="surface p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="cluster-font mb-1 text-[11px] font-bold tracking-[0.25em]" style={{ color: 'var(--teal)' }}>FIELD QUALITY INDEX</p>
              <h2 className="text-lg font-extrabold sm:text-xl">مؤشر الجودة الميداني</h2>
            </div>
            <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold" style={{ color: 'var(--green)' }}>تحديث لحظي · أكتوبر 2026</span>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {QUALITY.map((q) => <ProgressMeter key={q.label} label={q.label} value={q.value} sub={q.sub} />)}
          </div>
        </div>
      </section>

      {/* بانر تسجيل أصحاب المعارض والأسطول */}
      <section className="px-4 pb-8">
        <div className="relative overflow-hidden rounded-2xl border p-6 sm:p-8" style={{ borderColor: 'var(--amber)', background: 'radial-gradient(700px 240px at 100% 0%, color-mix(in srgb, var(--amber) 18%, transparent), var(--surface))' }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-md">
              <p className="cluster-font mb-1 text-[11px] font-bold tracking-[0.25em]" style={{ color: 'var(--amber)' }}>DEALER NETWORK ◈ OPEN</p>
              <h2 className="text-2xl font-extrabold">عندك معرض أو أسطول؟</h2>
              <p className="mt-2 text-sm leading-6 text-dim">سجّل معرضك، ارفع عربياتك بلوحاتها المصرية، واستقبل طلبات الحجز في الوقت الفعلي من لوحة عمليات كاملة.</p>
            </div>
            <button className="primary btn-shine px-6 py-3 text-base font-extrabold" onClick={() => goTo('dealer')}>
              سجّل معرضك ←
            </button>
          </div>
          <span className="scan-line absolute inset-x-0 bottom-0" />
        </div>
      </section>
    </div>
  );
}