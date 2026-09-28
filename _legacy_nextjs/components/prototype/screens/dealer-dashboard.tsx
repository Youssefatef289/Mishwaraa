'use client';
import { useMemo, useState } from 'react';
import type { Device } from '../data';
import { DEALER, FLEET_MANAGEMENT, REQUEST_POOL, SETTLEMENTS } from '../data';
import { Plate } from '../ui';
import { BellIcon, DocIcon, PlusIcon, RadarIcon, RefreshIcon, WifiIcon } from '../icons';
import { CheckIcon, CloseIcon } from '@/components/icons';

const fmt = (n: number) => n.toLocaleString('en-US');

type Request = { id: string; customer: string; carId: string; route: string; days: number; total: number; status: 'pending' | 'preparing' | 'declined' };
type ManagedCar = { id: string; name: string; plate: string; status: 'available' | 'maintenance' | 'approved' };

const CAR_NAMES: Record<string, string> = {
  sportage: 'كيا سبورتاج 2024',
  tucson: 'هيونداي توسان 2024',
  sunny: 'نيسان صني 2023',
};

export default function DealerDashboardScreen({ device }: { device: Device }) {
  const [requests, setRequests] = useState<Request[]>(REQUEST_POOL.map((r) => ({ ...r, status: 'pending' })));
  const [fleet, setFleet] = useState<ManagedCar[]>(FLEET_MANAGEMENT);
  const [modal, setModal] = useState<null | 'add' | 'settle'>(null);
  const [notice, setNotice] = useState('');

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const availableCount = fleet.filter((c) => c.status === 'available').length;

  function respond(id: string, status: 'preparing' | 'declined') {
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    setNotice(status === 'preparing' ? `تم تجهيز طلب ${id} وإخطار العميل بالتسليم.` : `تم الاعتذار عن ${id} وإخطار العميل.`);
  }

  function toggleCar(id: string) {
    setFleet((fl) =>
      fl.map((c) => (c.id === id ? { ...c, status: c.status === 'available' ? 'maintenance' : c.status === 'maintenance' ? 'available' : c.status } : c)),
    );
  }

  function approveMaintenance(id: string) {
    setFleet((fl) => fl.map((c) => (c.id === id ? { ...c, status: 'available' } : c)));
    setNotice('تم اعتماد انتهاء الصيانة الدورية — السيارة متاحة على المنصة من جديد.');
  }

  function addCar(f: FormData) {
    const name = String(f.get('name') || '').trim();
    const plate = String(f.get('plate') || '').trim();
    if (!name) {
      setNotice('أدخل اسم السيارة أولًا.');
      return;
    }
    setFleet((fl) => [...fl, { id: `FM-${Date.now()}`, name, plate: plate || '—', status: 'available' }]);
    setModal(null);
    setNotice(`تمت إضافة "${name}" إلى الأسطول وحجزها على المنصة.`);
  }

  return (
    <div className="screen-enter px-4 py-5">
      {/* رأس المعرض + رادار الشبكة */}
      <div className="surface relative overflow-hidden p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full border" style={{ borderColor: 'rgba(58,166,166,.4)', background: 'var(--surface-2)' }}>
              <svg viewBox="0 0 60 60" className="absolute inset-0 h-full w-full">
                <circle cx="30" cy="30" r="28" fill="none" stroke="rgba(58,166,166,.35)" strokeWidth="1" />
                <circle cx="30" cy="30" r="19" fill="none" stroke="rgba(58,166,166,.25)" strokeWidth="1" />
                <circle cx="30" cy="30" r="10" fill="none" stroke="rgba(58,166,166,.2)" strokeWidth="1" />
                <path className="radar-sweep" d="M30 30 L52 22" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="18" cy="15" r="2" fill="var(--green)" opacity="0.95" />
                <circle cx="42" cy="42" r="2" fill="var(--amber)" opacity="0.9" />
              </svg>
              <span className="relative flex h-5 w-5 items-center justify-center rounded-full" style={{ background: 'var(--amber)' }}>
                <RadarIcon className="h-3.5 w-3.5 text-white" />
              </span>
            </span>
            <div>
              <p className="flex items-center gap-2 text-xl font-extrabold">{DEALER.name}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-dim">
                <span className="plate plate-approved">معتمد</span>
                <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--green)' }}>
                  <WifiIcon className="h-3.5 w-3.5" /> متصل بالشبكة · بوابة EG-HIGHWAY
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-[11px] text-dim">
            <span className="flex items-center justify-between gap-3"><BellIcon className="h-4 w-4" /> طلبات منتظرة <b className="cluster-font text-lg" style={{ color: 'var(--amber)' }}>{pendingCount}</b></span>
            <span className="flex items-center justify-between gap-3"><WifiIcon className="h-4 w-4" /> تحديث مباشر <b style={{ color: 'var(--green)' }}>● مباشر</b></span>
          </div>
        </div>
      </div>
      {/* مؤشرات الأداء الحية */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'سيارات متاحة', value: String(availableCount), unit: 'سيارة', color: 'var(--teal)' },
          { label: 'طلبات قيد المراجعة', value: String(pendingCount), unit: 'طلب', color: 'var(--amber)' },
          { label: 'رحلات ناجحة', value: String(DEALER.trips), unit: 'رحلة', color: 'var(--green)' },
          { label: 'إيرادات الشهر', value: fmt(DEALER.revenue), unit: 'ج.م', color: 'var(--amber)' },
        ].map((kpi) => (
          <article key={kpi.label} className="surface p-3 sm:p-4">
            <p className="text-[11px] text-dim">{kpi.label}</p>
            <p className="cluster-font mt-1 text-xl font-bold sm:text-2xl" style={{ color: kpi.color }}>{kpi.value}</p>
            <p className="text-[10px] text-dim">{kpi.unit}</p>
          </article>
        ))}
      </div>

      {/* طلبات الحجز الفورية */}
      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><BellIcon className="h-5 w-5 text-amber" /> طلبات الحجز الفورية</h2>
          <span className="cluster-font rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: 'rgba(242,169,60,.15)', color: 'var(--amber)' }}>
            {pendingCount} قيد المراجعة
          </span>
        </div>
        {requests.map((r) => (
          <article key={r.id} className="surface mb-3 p-4" style={r.status === 'pending' ? { borderColor: 'rgba(242,169,60,.55)' } : undefined}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-extrabold">{CAR_NAMES[r.carId] ?? r.carId}</p>
                <p className="mt-0.5 text-[11px] text-dim">{r.customer} · {r.route}</p>
                <p className="cluster-font mt-1 text-[11px] font-bold" style={{ color: 'var(--amber)' }}>{r.days} أيام · {fmt(r.total)} ج.م</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {r.status === 'pending' && (
                  <>
                    <button className="primary flex items-center gap-1 text-xs" onClick={() => respond(r.id, 'preparing')}>
                      <CheckIcon className="h-3.5 w-3.5" /> قبول وتجهيز
                    </button>
                    <button className="danger text-xs" onClick={() => respond(r.id, 'declined')}>اعتذار</button>
                  </>
                )}
                {r.status === 'preparing' && <span className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: 'rgba(24,110,110,.12)', color: 'var(--teal)' }}>جاري التجهيز</span>}
                {r.status === 'declined' && <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: 'rgba(178,59,49,.12)', color: 'var(--red)' }}>تم الاعتذار</span>}
              </div>
            </div>
          </article>
        ))}
        {pendingCount === 0 && <p className="text-center text-sm text-dim">تم الرد على كل الطلبات الواردة — استقبال مباشر في انتظارك.</p>}
      </section>
      {/* إدارة الأسطول */}
      <section className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-extrabold">إدارة أسطول المعرض</h2>
          <div className="flex gap-2">
            <button className="secondary flex items-center gap-1 text-xs" onClick={() => setModal('settle')}>
              <DocIcon className="h-4 w-4" /> التسويات والأرباح
            </button>
            <button className="primary flex items-center gap-1 text-xs" onClick={() => setModal('add')}>
              <PlusIcon className="h-4 w-4" /> إضافة سيارة
            </button>
          </div>
        </div>
        <div className="surface divide-y" style={{ borderColor: 'var(--border)' }}>
          {fleet.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-extrabold text-white" style={{ background: 'var(--teal)' }}>
                  {c.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-bold">{c.name}</p>
                  {c.plate !== '—' ? <Plate code={c.plate} size="sm" /> : <span className="text-[10px] text-dim">{c.id}</span>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={c.status === 'available' ? { background: 'rgba(34,122,80,.12)', color: 'var(--green)' } : { background: 'rgba(242,169,60,.15)', color: 'var(--amber)' }}>
                  {c.status === 'available' ? 'متاحة على المنصة' : c.status === 'maintenance' ? 'صيانة دورية' : 'تم الاعتماد'}
                </span>
                {c.status === 'maintenance' && (
                  <button className="secondary text-xs" onClick={() => approveMaintenance(c.id)}>اعتماد انتهاء الصيانة</button>
                )}
                <button className="danger text-xs" onClick={() => toggleCar(c.id)}>
                  {c.status === 'available' ? 'رفع للصيانة' : 'إتاحة على المنصة'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* التنبيهات */}
      {notice && (
        <div className="fade-up mt-4 flex items-center justify-between gap-2 rounded-xl border p-3 text-sm" style={{ borderColor: 'var(--green)', background: 'rgba(34,122,80,.1)', color: 'var(--green)' }}>
          <span className="flex items-center gap-2"><CheckIcon className="h-4 w-4" /> {notice}</span>
          <button aria-label="إغلاق التنبيه" onClick={() => setNotice('')}><CloseIcon className="h-4 w-4" /></button>
        </div>
      )}
      {/* نافذة إضافة سيارة */}
      {modal === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,14,18,.6)' }} onClick={() => setModal(null)}>
          <div className="surface w-full max-w-sm p-5 fade-up" style={{ maxHeight: '86vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold">إضافة سيارة جديدة للأسطول</h3>
              <button aria-label="إغلاق" onClick={() => setModal(null)}><CloseIcon /></button>
            </div>
            <form action={addCar} className="space-y-3">
              <input name="name" placeholder="مثال: هيونداي توسان 2024" required />
              <input name="plate" placeholder="رقم اللوحة المصرية — س ج د 9418" />
              <select name="type" defaultValue="suv">
                <option value="suv">SUV</option>
                <option value="sedan">سيدان</option>
                <option value="luxury">فاخر</option>
                <option value="economy">اقتصادي</option>
              </select>
              <input name="price" type="number" min="0" placeholder="السعر لليوم (ج.م)" required />
              <div className="flex gap-2">
                <button className="primary flex-1">إضافة للأسطول</button>
                <button type="button" className="secondary" onClick={() => setModal(null)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تقرير التسويات والأرباح */}
      {modal === 'settle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(11,14,18,.6)' }} onClick={() => setModal(null)}>
          <div className="surface w-full max-w-md p-5 fade-up" style={{ maxHeight: '86vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="cluster-font text-[10px] font-bold tracking-[0.25em]" style={{ color: 'var(--teal)' }}>SETTLEMENT REPORT</p>
                <h3 className="text-lg font-extrabold">تقرير التسويات المالية والأرباح</h3>
              </div>
              <button aria-label="إغلاق" onClick={() => setModal(null)}><CloseIcon /></button>
            </div>
            <div className="space-y-2">
              {SETTLEMENTS.map((s) => (
                <div key={s.week} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-sm">
                  <span className="text-xs font-bold">{s.week} <span className="text-dim">({s.label})</span></span>
                  <span className="cluster-font font-bold">{fmt(s.value)} ج.م</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1.5 rounded-xl border p-4 text-sm" style={{ borderColor: 'var(--amber)' }}>
              <p className="flex justify-between text-xs"><span className="text-dim">إجمالي إيرادات الشهر</span><b className="cluster-font">{fmt(DEALER.revenue)} ج.م</b></p>
              <p className="flex justify-between text-xs"><span className="text-dim">عمولة المنصة (15%)</span><b className="cluster-font">{fmt(Math.round(DEALER.revenue * 0.15))} ج.م</b></p>
              <p className="flex justify-between border-t pt-2 text-sm font-extrabold" style={{ borderColor: 'var(--border)' }}>
                <span>صافي أرباح المعرض</span>
                <b className="cluster-font" style={{ color: 'var(--green)' }}>{fmt(DEALER.revenue - Math.round(DEALER.revenue * 0.15))} ج.م</b>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="primary btn-shine flex-1 text-sm" onClick={() => { setModal(null); setNotice('تم تصدير تقرير التسويات بصياغة PDF إلى بريدك.'); }}>
                <RefreshIcon className="me-1 inline h-4 w-4" /> تصدير التقرير
              </button>
              <button className="secondary" onClick={() => setModal(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}