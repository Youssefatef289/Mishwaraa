'use client';
import type { Device, ScreenId, Trip } from '../data';
import { INSURANCE_DOC, OFFICER } from '../data';
import { CarArt, Plate, QRView } from '../ui';
import { CheckIcon } from '@/components/icons';
import { GpsIcon, PhoneIcon, ShieldIcon, TicketIcon, WhatsAppIcon } from '../icons';

const fmt = (n: number) => n.toLocaleString('en-US');

export default function BoardingPassScreen({ device, trip, goTo }: { device: Device; trip: Trip; goTo: (s: ScreenId) => void }) {
  return (
    <div className="screen-enter px-4 py-5">
      {/* بانر التأكيد الأخضر */}
      <div className="relative overflow-hidden rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--green)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--green) 22%, var(--surface)), var(--surface))' }}>
        <span className="scan-line absolute inset-x-0 top-0" style={{ background: 'repeating-linear-gradient(90deg, var(--green) 0 12px, transparent 12px 24px)' }} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="pulse-glow flex h-12 w-12 items-center justify-center rounded-full text-white" style={{ background: 'var(--green)' }}>
              <CheckIcon className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xl font-extrabold" style={{ color: 'var(--green)' }}>تم تأكيد حجزك بنجاح</p>
              <p className="text-xs text-dim">التذكرة الرقمية جاهزة — استلم سيارتك من بوابة المعرض خلال دقيقتين.</p>
            </div>
          </div>
          <div dir="ltr" className="cluster-font rounded-lg border-2 border-dashed px-4 py-2 text-lg font-bold" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
            {trip.code}
          </div>
        </div>
      </div>

      {/* التذكرة الرقمية */}
      <div className="surface mt-4 overflow-hidden">
        <div className="flex items-center justify-between gap-3 p-4" style={{ background: 'var(--surface-2)' }}>
          <p className="flex items-center gap-2 text-sm font-extrabold"><TicketIcon className="h-5 w-5 text-amber" /> تذكرة الرحلة الرقمية</p>
          <span className="cluster-font rounded bg-white px-2 py-0.5 text-[10px] font-bold text-teal">BOARDING PASS</span>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CarArt car={trip.car} className="h-16 w-32" />
              <div>
                <p className="font-extrabold">{trip.car.name}</p>
                <p className="mt-1"><Plate code={trip.car.plate} size="sm" /></p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border p-2">
                <p className="text-[10px] text-dim">نقطة الانطلاق</p>
                <p className="mt-0.5 font-bold">{trip.from}</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-[10px] text-dim">نقطة الوصول</p>
                <p className="mt-0.5 font-bold">{trip.to}</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-[10px] text-dim">المدة</p>
                <p className="cluster-font mt-0.5 font-bold">{trip.days} أيام · {trip.start} ← {trip.end}</p>
              </div>
              <div className="rounded-lg border p-2">
                <p className="text-[10px] text-dim">باقة الكيلومترات</p>
                <p className="cluster-font mt-0.5 font-bold">{trip.packageKm} كم مشمولة</p>
              </div>
            </div>
            <p className="rounded-lg p-2.5 text-[11px] leading-5 text-dim" style={{ background: 'var(--surface-2)' }}>
              المسافة المباشرة على طريق الساحل البالغة <b className="cluster-font text-teal">{fmt(trip.distanceKm)} كم</b> تندرج داخل باقة الـ 800 كم — بدون أي تكلفة إضافية.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
            <QRView code={trip.code} size={device === 'phone' ? 128 : 148} />
          </div>
        </div>
        <p className="border-t p-3 text-center text-[10px] text-dim" style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}>
          اعرض رمز الاستجابة عند بوابة استلام المعرض لإتمام التسليم خلال دقيقتين · بوابة الاستلام: <span className="font-bold text-text">{trip.from}</span>
        </p>
      </div>
      {/* تصريح القيادة المروري الرقمي */}
      <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'var(--teal)', background: 'color-mix(in srgb, var(--teal) 7%, var(--surface))' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="cluster-font text-[10px] font-bold tracking-[0.25em]" style={{ color: 'var(--teal)' }}>DIGITAL DRIVING PERMIT</p>
            <h2 className="mt-1 text-base font-extrabold sm:text-lg">تصريح سفر وقيادة مروري رقمي</h2>
            <p className="mt-2 text-[11px] leading-5 text-dim">
              صادر باسم صاحب الحجز والمطابق لرقم رخصة القيادة المسجلة، ساري طوال المدة المسموحة ويسري على الطرق السريعة المصرية.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <p>رقم الحجز: <b className="cluster-font text-teal">{trip.code}</b></p>
              <p>المركبة: <b>{trip.car.name}</b></p>
              <p>صلاحية السير: <b className="cluster-font">{trip.start} ← {trip.end}</b></p>
              <p>منطقة السير: <b>الطرق السريعة المسموحة</b></p>
            </div>
          </div>
          <QRView code={`${trip.code}-DL`} size={96} />
        </div>
      </div>

      {/* مسؤول التسليم المعتمد */}
      <div className="surface mt-4 p-4">
        <p className="cluster-font mb-3 text-[10px] font-bold tracking-[0.25em]" style={{ color: 'var(--amber)' }}>AUTHORIZED DELIVERY OFFICER</p>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-extrabold text-white" style={{ background: 'linear-gradient(135deg, var(--teal), #0B3D91)' }}>
            عم
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold">{OFFICER.name}</p>
            <p className="text-xs text-dim">{OFFICER.role}</p>
            <p className="cluster-font mt-1 text-[10px] text-teal">{OFFICER.badge}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${OFFICER.phone.replace(/\s/g, '')}`} className="primary flex items-center gap-1.5 text-xs">
              <PhoneIcon className="h-4 w-4" /> اتصال مباشر
            </a>
            <a href={`https://wa.me/${OFFICER.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ background: '#1FA855' }}>
              <WhatsAppIcon className="h-4 w-4" /> واتساب
            </a>
            <a href="https://maps.google.com/?q=30.0325,31.4365" target="_blank" rel="noreferrer" className="secondary flex items-center gap-1.5 text-xs">
              <GpsIcon className="h-4 w-4" /> موقع GPS
            </a>
          </div>
        </div>
      </div>

      {/* وثيقة التأمين الشامل */}
      <div className="surface mt-4 rounded-2xl border p-4" style={{ borderColor: 'var(--amber)', background: 'color-mix(in srgb, var(--amber) 8%, var(--surface))' }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-extrabold"><ShieldIcon className="h-5 w-5 text-amber" /> {INSURANCE_DOC.title}</p>
          <span className="cluster-font rounded bg-white px-2 py-0.5 text-[10px] font-bold" style={{ color: 'var(--amber)' }}>{INSURANCE_DOC.policy}</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="text-xs text-dim"><b className="text-text">نسبة التحمل:</b> {INSURANCE_DOC.deductible}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-dim">وطوارئ ونش الطرق على مدار الساعة:</p>
            <span className="cluster-font rounded-lg border border-dashed px-2.5 py-1 text-lg font-bold" style={{ color: 'var(--red)', borderColor: 'var(--red)' }}>{INSURANCE_DOC.emergency}</span>
          </div>
        </div>
        <ul className="mt-3 grid gap-1.5 text-[11px] text-dim sm:grid-cols-2">
          {INSURANCE_DOC.bullet.map((b) => (
            <li key={b} className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 shrink-0 text-success" /> {b}</li>
          ))}
        </ul>
      </div>

      {/* أزرار الإجراء */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="primary btn-shine flex-1 text-sm" onClick={() => goTo('bookings')}>فتح في حجوزاتي</button>
        <button className="secondary flex-1 text-sm" onClick={() => goTo('home')}>عودة للرئيسية</button>
      </div>
    </div>
  );
}