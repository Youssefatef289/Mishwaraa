'use client';
import { useMemo, useState } from 'react';
import { CheckIcon } from '@/components/icons';
import type { Device, Trip } from '../data';
import { DESTINATIONS, FLEET, computeTrip } from '../data';
import { CarArt, Cluster, Plate, Stepper } from '../ui';
import { CameraIcon, CaretIcon, FuelIcon, GearIcon, LockIcon, SeatIcon, ShieldIcon, SnowIcon } from '../icons';

const fmt = (n: number) => n.toLocaleString('en-US');
const STEPS = ['بيانات المركبة', 'وجهة الرحلة والمدة', 'الحساب والتأكيد'];

export default function CheckoutScreen({ device, carId, onConfirmed }: { device: Device; carId: string; onConfirmed: (t: Trip) => void }) {
  const [carSel, setCarSel] = useState(carId);
  const car = FLEET.find((c) => c.id === carSel) ?? FLEET[0];
  const [step, setStep] = useState(0);
  const [destination, setDestination] = useState('الساحل الشمالي');
  const [days, setDays] = useState(7);
  const [startDate, setStartDate] = useState('2026-10-12');
  const [license, setLicense] = useState('');
  const [ack1, setAck1] = useState(false);
  const [ack2, setAck2] = useState(false);
  const [ack3, setAck3] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const trip = useMemo(() => computeTrip(car, destination, startDate, days), [car, destination, startDate, days]);

  function confirm() {
    if (confirming) return;
    setConfirming(true);
    setTimeout(() => onConfirmed(trip), 950);
  }

  return (
    <div className="screen-enter px-4 py-5">
      <p className="cluster-font mb-1 text-[11px] font-bold tracking-[0.3em]" style={{ color: 'var(--teal)' }}>CHECKOUT // EG-HIGHWAY</p>
      <h1 className="text-2xl font-extrabold sm:text-3xl">تأكيد المسار والحساب</h1>

      <div className="mb-5 mt-4 overflow-x-auto rounded-lg border p-3" style={{ background: 'var(--surface)' }}>
        <Stepper steps={STEPS} current={step} onGo={(i) => { if (i <= step) setStep(i); }} />
      </div>

      {/* المرحلة 01 — بيانات المركبة */}
      {step === 0 && (
        <section className="fade-up space-y-4">
          <div>
            <p className="mb-2 text-xs font-bold text-dim">اختر المركبة من الأسطول المعتمد:</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {FLEET.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCarSel(c.id)}
                  className="surface flex items-center gap-3 p-2 text-start transition"
                  style={c.id === car.id ? { borderColor: 'var(--amber)', boxShadow: '0 0 0 2px var(--amber)' } : undefined}
                >
                  <CarArt car={c} className="h-14 w-28 shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-extrabold">{c.name}</span>
                    <span className="mt-1 block"><Plate code={c.plate} size="sm" /></span>
                    <span className="cluster-font mt-1 block text-xs font-bold" style={{ color: 'var(--amber)' }}>{fmt(c.pricePerDay)} ج/يوم</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* المواصفات الفنية الشاملة */}
          <div className="surface overflow-hidden p-4 sm:p-5">
            <div className="relative">
              <CarArt car={car} className="h-24 w-full" />
              <span className="absolute right-2 top-1"><Plate code={car.plate} /></span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
              <div className="rounded-lg bg-surface-2 p-2"><span className="flex items-center gap-1.5 font-bold"><SeatIcon className="h-4 w-4 text-teal" />{car.seats} ركاب</span></div>
              <div className="rounded-lg bg-surface-2 p-2"><span className="flex items-center gap-1.5 font-bold"><GearIcon className="h-4 w-4 text-teal" />{car.transmission}</span></div>
              <div className="rounded-lg bg-surface-2 p-2"><span className="flex items-center gap-1.5 font-bold"><FuelIcon className="h-4 w-4 text-teal" />{car.fuel}</span></div>
              <div className="rounded-lg bg-surface-2 p-2"><span className="flex items-center gap-1.5 font-bold"><SnowIcon className="h-4 w-4 text-teal" />مكيف</span></div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {car.features.map((f) => (
                <span key={f} className="rounded-full border px-2 py-0.5 text-[10px] font-bold text-dim"><span style={{ color: 'var(--teal)' }}>✓</span> {f}</span>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-dim">
              <span>معرض: <b className="text-text">{car.dealer}</b> — نقطة الاستلام: <b className="text-text">{car.city}</b></span>
              <span className="flex items-center gap-1"><CameraIcon className="h-4 w-4" />صور المعرض</span>
            </div>
            <button className="primary btn-shine mt-4 w-full text-sm" onClick={() => setStep(1)}>
              التالي: وجهة الرحلة والمدة <CaretIcon className="h-4 w-4 inline-block" />
            </button>
          </div>
        </section>
      )}
      {/* المرحلة 02 — وجهة الرحلة والمدة */}
      {step === 1 && (
        <section className="fade-up space-y-4">
          <div className="surface p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-dim">الانطلاق من {car.city}</p>
                <p className="mt-0.5 text-sm font-extrabold">اختر الوجهة على الـ EG-HIGHWAY</p>
              </div>
              <span className="cluster-font rounded bg-surface-2 px-2 py-1 text-[10px] font-bold text-teal">ORIGIN: {car.city.toUpperCase()}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.name}
                  type="button"
                  onClick={() => setDestination(d.name)}
                  className="rounded-xl border p-3 text-start transition"
                  style={destination === d.name ? { borderColor: 'var(--amber)', background: 'color-mix(in srgb, var(--amber) 10%, var(--surface))' } : { borderColor: 'var(--border)' }}
                >
                  <p className="text-sm font-extrabold">{d.name}</p>
                  <p className="cluster-font mt-0.5 text-xs font-bold" style={{ color: 'var(--teal)' }}>{fmt(d.km)} كم</p>
                </button>
              ))}
            </div>
          </div>

          <div className="surface p-4 sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-dim">مدة الرحلة</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <button className="danger h-9 w-9 text-lg" onClick={() => setDays(Math.max(1, days - 1))}>−</button>
                  <span className="cluster-font flex h-9 min-w-12 items-center justify-center rounded-lg border px-2 text-lg font-bold">{days}</span>
                  <button className="primary h-9 w-9 text-lg" onClick={() => setDays(Math.min(30, days + 1))}>+</button>
                  <span className="text-xs text-dim">يوم</span>
                </div>
              </div>
              <label className="block text-xs font-bold text-dim">
                تاريخ الاستلام
                <input type="date" className="mt-1" value={startDate} onChange={(e) => setStartDate(e.target.value || '2026-10-12')} />
              </label>
              <div className="text-xs text-dim">
                <p>العودة المقدّرة:</p>
                <p className="cluster-font text-sm font-bold text-text">{trip.start} ← {trip.end}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* المرحلة 03 — الحساب والتأكيد */}
      {step === 2 && (
        <section className="fade-up space-y-4">
          <div className="surface p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3">
                <CarArt car={car} className="h-12 w-24" />
                <div>
                  <p className="font-extrabold">{car.name}</p>
                  <p className="mt-0.5 text-xs text-dim">من {trip.from} إلى {trip.to}</p>
                </div>
              </div>
              <Plate code={car.plate} size="sm" />
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-dim">إقرار رخصة القيادة:</p>
              <label className="flex items-center gap-2 text-sm">
                <input type="text" dir="ltr" placeholder="رقم رخصة القيادة (14 رقمًا)" value={license}
                  onChange={(e) => setLicense(e.target.value)} className="cluster-font font-bold" style={{ maxWidth: 220 }} />
              </label>
              <p className="flex items-center gap-2 border rounded-lg p-3 text-xs text-dim bg-surface-2">
                <LockIcon className="h-4 w-4 shrink-0 text-teal" />
                بياناتك مشفّرة ولا تُشارك إلا مع المعرض المعتمد لغرض التسليم والفحص.
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-dim">الإقرارات وشروط الفحص:</p>
              <label className="flex items-start gap-2 text-xs leading-5">
                <input type="checkbox" className="mt-0.5 w-auto" checked={ack1} onChange={(e) => setAck1(e.target.checked)} />
                أقر بأنني أحمل رخصة قيادة سارية المفعول وأطابق بياناتها مع هويتي.
              </label>
              <label className="flex items-start gap-2 text-xs leading-5">
                <input type="checkbox" className="mt-0.5 w-auto" checked={ack2} onChange={(e) => setAck2(e.target.checked)} />
                أوافق على شروط الفحص الفني (التقرير الكامل عند الاستلام والإرجاع).
              </label>
              <label className="flex items-start gap-2 text-xs leading-5">
                <input type="checkbox" className="mt-0.5 w-auto" checked={ack3} onChange={(e) => setAck3(e.target.checked)} />
                سأعيد المركبة بموعد التسليم وبحالة الاستلام (نفس عداد الوقود).
              </label>
            </div>

            <button
              type="button"
              onClick={confirm}
              disabled={!license || !ack1 || !ack2 || !ack3}
              className="primary btn-shine mt-5 w-full py-3 text-base font-extrabold"
            >
              {confirming ? 'جاري إصدار التذكرة…' : 'تأكيد الحجز وإصدار التذكرة'}
            </button>
            {!license && step === 2 && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-dim">
                <ShieldIcon className="h-3.5 w-3.5" /> أدخل رقم الرخصة وأكّد الإقرارات لتفعيل الزر.
              </p>
            )}
          </div>
        </section>
      )}
      {/* لوحة العداد الرقمية المظلمة */}
      <div className="mt-5">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-dim">
          <span className="scan-line inline-block w-8" /> لوحة العداد الرقمي — احتساب لحظي فوري
        </p>
        <Cluster
          title="INSTRUMENT CLUSTER // EGP"
          cells={[
            { label: 'الأيام', value: `${days}`, suffix: 'يوم' },
            { label: 'المسافة', value: fmt(trip.distanceKm), suffix: 'كم' },
            { label: 'باقة الكيلومترات', value: `${trip.packageKm}`, suffix: 'كم مشمولة' },
            { label: 'تكلفة الإيجار', value: fmt(trip.rentCost), suffix: 'ج.م' },
            { label: 'وثيقة التأمين', value: fmt(trip.insuranceCost), suffix: 'ج.م' },
            { label: 'كيلومترات إضافية', value: fmt(trip.extraKmCost), suffix: 'ج.م' },
            { label: 'الوديعة المستردة', value: fmt(trip.deposit), suffix: 'ج.م', accent: true },
          ]}
          totalLabel="الإجمالي المدفوع الآن (تشمل الوديعة 3,000 ج.م)"
          totalValue={`${fmt(trip.total)} ج.م`}
        />
        {trip.extraKmCost > 0 && (
          <p className="mt-2 flex items-center gap-2 rounded-lg border p-2.5 text-[11px] text-dim" style={{ borderColor: 'var(--amber)', background: 'color-mix(in srgb, var(--amber) 8%, transparent)' }}>
            <CheckIcon className="h-4 w-4 shrink-0 text-amber" />
            وجهتك بعد باقة الـ 800 كم — سيتم احتساب الكيلومترات الزائدة {fmt(trip.distanceKm - trip.packageKm)} كم × {car.perKm} ج فقط.
          </p>
        )}
      </div>
    </div>
  );
}