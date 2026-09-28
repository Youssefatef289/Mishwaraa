'use client';
import { useState } from 'react';
import type { Device, ScreenId } from '../data';
import { ACTIVE_BOOKING, COMPLETED_TRIPS, UPCOMING_BOOKING } from '../data';
import { CarArt, LiveChip, PickupMap, Plate } from '../ui';
import { CheckIcon } from '@/components/icons';
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, GpsIcon, MapPinIcon, WalletIcon, WhatsAppIcon } from '../icons';

const fmt = (n: number) => n.toLocaleString('en-US');
type Tab = 'current' | 'done' | 'cancelled';

export default function MyBookingsScreen({ device, goTo }: { device: Device; goTo: (s: ScreenId) => void }) {
  const [tab, setTab] = useState<Tab>('current');
  const [openDrawer, setOpenDrawer] = useState(true);

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'current', label: 'الحالية والقادمة', count: 2 },
    { id: 'done', label: 'المكتملة', count: 4 },
    { id: 'cancelled', label: 'الملغاة', count: 0 },
  ];

  return (
    <div className="screen-enter px-4 py-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">حجوزاتي ومساراتي</h1>
          <p className="mt-1 text-xs text-dim">بوابة العميل الرقمية — تتبع رحلاتك ووثائق الاستلام من مكان واحد.</p>
        </div>
        <LiveChip />
      </div>

      {/* تبويبات التنقل السريع */}
      <div className="surface flex overflow-hidden p-1" role="tablist" aria-label="تبويبات الحجوزات">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition"
            style={tab === t.id ? { background: 'var(--amber)', color: '#fff' } : { color: 'var(--dim)' }}
          >
            {t.label}
            <span className="cluster-font rounded px-1.5 text-[10px]" style={tab === t.id ? { background: 'rgba(255,255,255,.25)' } : { background: 'var(--surface-2)' }}>
              0{t.count}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {tab === 'current' && (
          <>
            {/* بطاقة الحجز النشط الفاخرة */}
            <div className="relative overflow-hidden rounded-2xl border p-4" style={{ borderColor: 'var(--amber)', background: 'linear-gradient(135deg, color-mix(in srgb, var(--amber) 12%, var(--surface)), var(--surface))' }}>
              <p className="cluster-font mb-2 text-[10px] font-bold tracking-[0.25em]" style={{ color: 'var(--amber)' }}>ACTIVE TRIP ◈ {ACTIVE_BOOKING.id}</p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CarArt car={ACTIVE_BOOKING.car} className="h-14 w-28" />
                  <div>
                    <p className="font-extrabold">{ACTIVE_BOOKING.car.name}</p>
                    <p className="mt-1"><Plate code={ACTIVE_BOOKING.car.plate} size="sm" /></p>
                  </div>
                </div>
                <div className="text-xs">
                  <p className="text-dim">مسار الرحلة</p>
                  <p className="mt-1 flex items-center gap-2 font-extrabold">
                    التجمع الخامس <span className="cluster-font text-teal">→</span> مارينا 5
                  </p>
                  <p className="cluster-font mt-0.5 text-[10px] text-dim">{ACTIVE_BOOKING.start} ← {ACTIVE_BOOKING.end} · {ACTIVE_BOOKING.days} أيام · {fmt(ACTIVE_BOOKING.distanceKm)} كم</p>
                </div>
              </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border p-3" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface) 40%, transparent)' }}>
                  <p className="flex items-center gap-1.5 text-xs font-bold"><WalletIcon className="h-4 w-4 text-amber" /> بيان الدفع</p>
                  <ul className="mt-2 space-y-1 text-[11px] text-dim">
                    <li className="flex justify-between"><span>إيجار {ACTIVE_BOOKING.days} أيام</span><b className="cluster-font">{fmt(13300)} ج.م</b></li>
                    <li className="flex justify-between"><span>وثيقة التأمين الشامل</span><b className="cluster-font">{fmt(840)} ج.م</b></li>
                    <li className="flex justify-between"><span>الوديعة المستردة</span><b className="cluster-font">{fmt(3000)} ج.م</b></li>
                    <li className="flex justify-between border-t pt-1 text-xs font-extrabold" style={{ borderColor: 'var(--border)' }}>
                      <span className="text-text">المدفوع</span><b className="cluster-font" style={{ color: 'var(--amber)' }}>{fmt(17140)} ج.م</b>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold"><MapPinIcon className="h-4 w-4 text-teal" /> نافذة إحداثيات موقع الاستلام</p>
                  <PickupMap from="بوابة التجمع الخامس" to="مارينا 5" coords={ACTIVE_BOOKING.coords} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="https://maps.google.com/?q=30.0325,31.4365" target="_blank" rel="noreferrer" className="secondary flex items-center gap-1.5 text-xs"><GpsIcon className="h-4 w-4" /> فتح في خرائط جوجل</a>
                <a href="https://wa.me/201001234567" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white" style={{ background: '#1FA855' }}><WhatsAppIcon className="h-4 w-4" /> تتبع الاستلام</a>
              </div>
            </div>

            {/* بطاقة الحجز القادم — كيا سبورتاج 2024 */}
            <div className="surface overflow-hidden">
              <button type="button" onClick={() => setOpenDrawer(!openDrawer)} className="flex w-full items-center justify-between gap-3 p-4 text-start">
                <div className="flex items-center gap-3">
                  <CarArt car={UPCOMING_BOOKING.car} className="h-12 w-24" />
                  <div>
                    <p className="text-sm font-extrabold">{UPCOMING_BOOKING.car.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-dim">
                      <ClockIcon className="h-3.5 w-3.5" /> قادمة · {UPCOMING_BOOKING.start} ← {UPCOMING_BOOKING.end} · {UPCOMING_BOOKING.days} أيام
                    </p>
                  </div>
                </div>
                {openDrawer ? <ChevronUpIcon className="h-5 w-5 shrink-0 text-dim" /> : <ChevronDownIcon className="h-5 w-5 shrink-0 text-dim" />}
              </button>
              {openDrawer && (
                <div className="fade-up border-t p-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="grid gap-3 text-[11px] sm:grid-cols-2">
                    <div className="rounded-lg bg-surface-2 p-3">
                      <p className="text-dim">مسار المشوار</p>
                      <p className="mt-1 font-extrabold">{UPCOMING_BOOKING.route}</p>
                      <p className="cluster-font mt-1 text-[10px] text-teal">{fmt(UPCOMING_BOOKING.distanceKm)} كم · باقة 800 كم مشمولة</p>
                    </div>
                    <div className="rounded-lg bg-surface-2 p-3">
                      <p className="text-dim">بيان الدفع</p>
                      <p className="mt-1 font-extrabold">مدفوع مقدمًا <b className="cluster-font" style={{ color: 'var(--amber)' }}>{fmt(UPCOMING_BOOKING.paid)} ج.م</b></p>
                      <p className="mt-0.5 text-[10px] text-dim">الدفع الباقي <span className="cluster-font" style={{ color: 'var(--teal)' }}>0 ج.م</span></p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="secondary text-xs">تعديل الموعد</button>
                    <button className="danger text-xs" disabled title="الإلغاء يتم عبر خدمة العملاء">إلغاء الحجز</button>
                    <span className="ms-auto text-[10px] text-dim">الإلغاء المجاني متاح حتى {UPCOMING_BOOKING.start}</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
                {/* التبويب المكتمل */}
        {tab === 'done' && (
          <div className="space-y-3">
            {COMPLETED_TRIPS.map((t) => (
              <article key={t.id} className="surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <CarArt car={t.car} className="h-11 w-20" />
                    <div>
                      <p className="text-sm font-extrabold">{t.car.name}</p>
                      <p className="text-[11px] text-dim">{t.route} · <span className="cluster-font">{t.start} ← {t.end}</span></p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: t.inspected ? 'rgba(34,122,80,.12)' : 'rgba(178,59,49,.12)', color: t.inspected ? 'var(--green)' : 'var(--red)' }}>
                      <CheckIcon className="h-3 w-3" /> {t.inspected ? 'فحص ميكانيكي ناجح' : 'خصم فحص'}
                    </span>
                    <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: t.depositRefunded ? 'rgba(24,110,110,.12)' : 'rgba(242,169,60,.15)', color: t.depositRefunded ? 'var(--teal)' : 'var(--amber)' }}>
                      {t.depositRefunded ? 'وديعة مستردة 3,000 ج.م' : '150 ج.م خصم إضافي'}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-dim">تم الدفع: <b className="cluster-font" style={{ color: 'var(--amber)' }}>{fmt(t.paid)} ج.م</b> · كود الرحلة <b className="cluster-font">{t.id}</b></p>
              </article>
            ))}
          </div>
        )}

        {/* التبويب الملغى */}
        {tab === 'cancelled' && (
          <div className="surface p-10 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ background: 'var(--green)' }}>
              <CheckIcon className="h-7 w-7" />
            </span>
            <p className="mt-3 text-lg font-extrabold">لا توجد إلغاءات</p>
            <p className="mt-1 text-sm text-dim">سجل الحجوزات الملغاة فارغ — كل رحلاتك في موعدها.</p>
          </div>
        )}
      </div>
    </div>
  );
}