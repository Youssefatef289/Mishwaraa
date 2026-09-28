'use client';
import { useState } from 'react';
import type { ReactElement } from 'react';
import Link from 'next/link';
import { CarIcon } from '@/components/icons';
import type { Device, ScreenId, Trip } from './data';
import { DEFAULT_TRIP, FLEET } from './data';
import HomeScreen from './screens/home';
import CheckoutScreen from './screens/checkout';
import BoardingPassScreen from './screens/boarding-pass';
import MyBookingsScreen from './screens/my-bookings';
import DealerDashboardScreen from './screens/dealer-dashboard';
import { CaretIcon, GridIcon, HomeIcon, RadarIcon, RefreshIcon, RouteIcon, TicketIcon } from './icons';

const NAV: { id: ScreenId; label: string; icon: (p: { className?: string }) => ReactElement }[] = [
  { id: 'home', label: 'الرئيسية', icon: HomeIcon },
  { id: 'checkout', label: 'الحجز الدفع', icon: RouteIcon },
  { id: 'boarding-pass', label: 'التذكرة', icon: TicketIcon },
  { id: 'bookings', label: 'حجوزاتي', icon: GridIcon },
  { id: 'dealer', label: 'لوحة المعرض', icon: RadarIcon },
];

export default function PrototypeShell() {
  const [screen, setScreen] = useState<ScreenId>('home');
  const [device, setDevice] = useState<Device>('desktop');
  const [carId, setCarId] = useState(FLEET[0].id);
  const [trip, setTrip] = useState<Trip>(DEFAULT_TRIP);

  const goTo = (s: ScreenId) => setScreen(s);
  const onBook = (id: string) => { setCarId(id); setScreen('checkout'); };
  const onConfirmed = (t: Trip) => { setTrip(t); setScreen('boarding-pass'); };

  const activeScreen = (() => {
    switch (screen) {
      case 'checkout': return <CheckoutScreen key={carId} device={device} carId={carId} onConfirmed={onConfirmed} />;
      case 'boarding-pass': return <BoardingPassScreen device={device} trip={trip} goTo={goTo} />;
      case 'bookings': return <MyBookingsScreen device={device} goTo={goTo} />;
      case 'dealer': return <DealerDashboardScreen device={device} />;
      default: return <HomeScreen device={device} goTo={goTo} onBook={onBook} />;
    }
  })();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ===== شريط التحكم العلوي ===== */}
      <header className="sticky top-0 z-40 border-b" style={{ background: 'var(--surface)' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <CarIcon className="h-5 w-10 text-amber" />
            <div>
              <p className="text-sm font-extrabold leading-none">سياراتاا <span className="text-amber">· محاكي التجربة</span></p>
              <p className="cluster-font mt-1 flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-dim">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--green)' }} /> EG-HIGHWAY // 2025 DEMO
              </p>
            </div>
          </div>

          {/* التنقل بين الشاشات */}
          <nav className="demo-scroll order-3 flex w-full gap-1 overflow-x-auto pb-0.5 lg:order-none lg:w-auto">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setScreen(n.id)}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition"
                  style={screen === n.id ? { background: 'var(--amber)', color: '#fff' } : { color: 'var(--dim)' }}
                >
                  <Icon className="h-4 w-4" /> {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* تبديل وضع العرض */}
            <div className="flex overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold transition"
                style={device === 'desktop' ? { background: 'var(--teal)', color: '#fff' } : { color: 'var(--dim)' }}
              >
                <GridIcon className="h-4 w-4" /> سطح المكتب <span className="cluster-font hidden sm:inline">960px</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('phone')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold transition"
                style={device === 'phone' ? { background: 'var(--teal)', color: '#fff' } : { color: 'var(--dim)' }}
              >
                <HomeIcon className="h-4 w-4" /> الهاتف
              </button>
            </div>
            <Link href="/" className="secondary hidden items-center gap-1 px-3 py-1.5 text-xs md:flex">
              التطبيق الحقيقي <CaretIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
        <span className="scan-line block h-[2px] w-full" />
      </header>
            {/* ===== العرض — سطح المكتب الكامل 960px ===== */}
      {device === 'desktop' && (
        <main className="mx-auto flex w-full max-w-[960px] flex-col gap-4 px-4 py-5">
          {/* شريط متصفح تجريبي للجهاز */}
          <div className="flex items-center gap-3 rounded-t-xl border border-b-0 px-3 py-2" style={{ background: 'var(--surface-2)' }}>
            <span className="flex gap-1.5">
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: '#E2574C' }} />
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: '#F2A93C' }} />
              <i className="h-2.5 w-2.5 rounded-full" style={{ background: '#4CAF7D' }} />
            </span>
            <span dir="ltr" className="cluster-font mx-auto flex items-center gap-2 rounded-md px-3 py-1 text-[10px] text-dim" style={{ background: 'var(--surface)' }}>
              <i className="h-2 w-2 rounded-full border border-current" /> sayaarataa.example/experience
              <RefreshIcon className="h-3 w-3 opacity-60" />
            </span>
            <span className="hidden text-[10px] text-dim sm:block">{NAV.find((n) => n.id === screen)?.label}</span>
          </div>
          <div className="rounded-b-xl border" style={{ background: 'var(--bg)' }}>
            {activeScreen}
          </div>
          <p className="text-center text-[11px] text-dim">استخدم الشريط العلوي للتنقل بين الشاشات وتبديل وضع العرض · جميع البيانات معاينة توضيحية.</p>
        </main>
      )}

      {/* ===== العرض — الهاتف الذكي مع شريط التنقل السفلي ===== */}
      {device === 'phone' && (
        <main className="mx-auto flex w-full justify-center px-4 py-6">
          <div className="phone-frame relative flex w-[390px] flex-col overflow-hidden rounded-[2.6rem] border-4" style={{ borderColor: 'var(--surface-2)', height: 'min(72vh, 780px)', background: 'var(--bg)' }}>
            {/* نوتش */}
            <div className="relative z-10 flex h-8 shrink-0 items-center justify-center bg-[#0B0E12]">
              <span className="h-2.5 w-24 rounded-full bg-black/70" />
            </div>
            {/* شريط حالة الهاتف */}
            <div className="flex shrink-0 items-center justify-between px-5 py-1.5 text-[10px] font-bold" style={{ background: '#0B0E12', color: '#EDEFF3' }}>
              <span className="cluster-font">9:41</span>
              <span className="flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--green)' }} /> {NAV.find((n) => n.id === screen)?.label}</span>
              <span dir="ltr" className="cluster-font flex items-center gap-1">98% <i className="inline-block h-2 w-3 rounded-[2px] border border-current" /></span>
            </div>
            {/* محتوى الشاشة */}
            <div className="demo-scroll relative flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
              {activeScreen}
              <div className="h-24" />
            </div>
            {/* شريط التنقل السفلي الأصيل */}
            <nav className="absolute inset-x-0 bottom-0 z-20 border-t px-1 pb-2 pt-1" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }} aria-label="شريط التنقل السفلي">
              <div className="flex">
                {NAV.map((n) => {
                  const Icon = n.icon;
                  const active = n.id === screen;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => setScreen(n.id)}
                      data-active={active}
                      className="phone-nav-btn"
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" />
                      {n.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </main>
      )}
    </div>
  );
}