'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ChatThread, { type ChatMessage } from '@/components/chat-thread';
import { sendBookingMessage } from '@/app/actions';

const seenKey = (bookingId: string) => `mishwar-booking-chat-seen-${bookingId}`;

export default function BookingChat({ bookingId, viewerId, status, label }: { bookingId: string; viewerId: string; status: string; label: string }) {
  // الحجز الملغي/المرفوض: الشات يتحول للاطلاع بس (تاريخ المحادثة) من غير صندوق كتابة. باقي الحالات: تفاعلي.
  const readOnly = status === 'rejected' || status === 'cancelled';
  const [open, setOpen] = useState(readOnly);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => {
    const s = createClient();
    void s.from('booking_messages').select('id,sender_id,sender_role,body,created_at')
      .eq('booking_id', bookingId).order('created_at', { ascending: true }).limit(200)
      .then(({ data }) => {
        if (!data) return;
        const rows = data as ChatMessage[];
        if (rows.length) setMessages((prev) => {
          const merged = [...prev];
          for (const m of rows) if (!merged.some((x) => x.id === m.id)) merged.push(m);
          return merged.sort((a, b) => a.created_at.localeCompare(b.created_at));
        });
      });
    // أحداث الإدراج فقط — الرسائل ثابتة (لا تعديل/حذف في هذه النسخة).
    const ch = s.channel(`booking-chat-${bookingId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'booking_messages', filter: `booking_id=eq.${bookingId}` }, (payload) => {
        const m = payload.new as ChatMessage;
        setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
        if (openRef.current) { localStorage.setItem(seenKey(bookingId), new Date().toISOString()); setUnread(0); }
      }).subscribe();
    return () => { s.removeChannel(ch) };
  }, [bookingId]);
  useEffect(() => {
    const stored = localStorage.getItem(seenKey(bookingId));
    const since = stored ? new Date(stored).getTime() : 0;
    setUnread(open ? 0 : messages.filter((m) => new Date(m.created_at).getTime() > since).length);
  }, [messages, open, bookingId]);
  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) { localStorage.setItem(seenKey(bookingId), new Date().toISOString()); setUnread(0); }
  }
  return (
    <div className="mt-2">
      {!readOnly && (
        <div className="flex items-center justify-between gap-2">
          <button type="button" className="secondary" onClick={toggle}>{label}{open ? ' — إغلاق' : ''}</button>
          {!open && unread > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold" title="رسايل جديدة" style={{ background: 'var(--amber)', color: '#fff' }}>{unread > 99 ? '99+' : unread}</span>
          )}
        </div>
      )}
      {(open || readOnly) && (
        <ChatThread messages={messages} viewerId={viewerId} readOnly={readOnly}
          onSend={async (body) => { await sendBookingMessage(bookingId, body); }} />
      )}
    </div>
  );
}