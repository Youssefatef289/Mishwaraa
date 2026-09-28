'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import StatusChip from '@/components/status-chip';
import SupportChat from '@/components/support-chat';

export default function AdminPanel({ initialDealers, bookings, adminId, chatThreads }: { initialDealers: any[]; bookings: any[]; adminId: string; chatThreads: { dealer_id: string; last_at: string }[] }) {
  const [dealers, setDealers] = useState(initialDealers);
  async function setStatus(id: string, status: string) {
    const s = createClient();
    const { error } = await s.from('dealers').update({ status }).eq('id', id);
    if (!error) setDealers(dealers.map((d) => d.id === id ? { ...d, status } : d));
  }
  const pendingCount = dealers.filter((d) => d.status === 'pending').length;
  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-bold">إدارة المنصة</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="surface p-4">
          <p className="text-sm text-dim">معارض بانتظار المراجعة</p>
          <p className="mt-1 text-3xl font-bold text-amber"><span className="digital">{pendingCount}</span></p>
        </div>
        <div className="surface p-4">
          <p className="text-sm text-dim">إجمالي المعارض</p>
          <p className="mt-1 text-3xl font-bold text-teal"><span className="digital">{dealers.length}</span></p>
        </div>
        <div className="surface p-4">
          <p className="text-sm text-dim">كل الحجوزات</p>
          <p className="mt-1 text-3xl font-bold text-success"><span className="digital">{bookings.length}</span></p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="mb-4 text-xl font-bold">المعارض</h2>
          {dealers.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 border-b py-3">
              <div>
                <p className="font-bold">{d.name} · {d.city}</p>
                <p className="text-sm text-dim">{d.address}</p>
              </div>
              <span className="flex flex-wrap items-center gap-2">
                <StatusChip status={d.status} />
                <button className="primary" onClick={() => setStatus(d.id, 'approved')}>اعتماد</button>
                <button className="danger" onClick={() => setStatus(d.id, 'suspended')}>إيقاف</button>
              </span>
            </div>
          ))}
        </div>
        <div className="surface p-5">
          <h2 className="mb-4 text-xl font-bold">كل الحجوزات</h2>
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b py-3">
              <span className="font-bold">{b.cars?.name} · {b.dealers?.name}</span>
              <StatusChip status={b.status} />
            </div>
          ))}
        </div>
      </div>
      <div className="surface p-5">
        <h2 className="mb-4 text-xl font-bold">دعم المعارض</h2>
        {chatThreads.length ? chatThreads.map((t) => {
          const d = dealers.find((x) => x.id === t.dealer_id);
          return (
            <div key={t.dealer_id} className="border-b py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{d?.name || 'معرض'} · {d?.city || ''}</p>
                  <p className="text-sm text-dim">آخر رسالة: <span className="digital">{t.last_at.slice(11, 16)}</span></p>
                </div>
                <StatusChip status={d?.status ?? 'pending'} />
              </div>
              <SupportChat dealerId={t.dealer_id} viewerId={adminId} label="فتح المحادثة" showRoles />
            </div>
          );
        }) : <p className="text-dim">مفيش محادثات مفتوحة مع المعارض دلوقتي.</p>}
      </div>
    </section>
  );
}