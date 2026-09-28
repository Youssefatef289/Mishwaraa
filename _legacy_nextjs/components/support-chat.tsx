'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ChatThread, { type ChatMessage } from '@/components/chat-thread';
import { sendDealerAdminMessage } from '@/app/actions';

const seenKey = (dealerId: string) => `mishwar-dealer-chat-seen-${dealerId}`;

export default function SupportChat({ dealerId, viewerId, label, showRoles }: { dealerId: string; viewerId: string; label: string; showRoles?: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);
  useEffect(() => {
    const s = createClient();
    void s.from('dealer_admin_messages').select('id,sender_id,sender_role,body,created_at')
      .eq('dealer_id', dealerId).order('created_at', { ascending: true }).limit(200)
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
    const ch = s.channel(`dealer-chat-${dealerId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'dealer_admin_messages', filter: `dealer_id=eq.${dealerId}` }, (payload) => {
        const m = payload.new as ChatMessage;
        setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m]);
        if (openRef.current) { localStorage.setItem(seenKey(dealerId), new Date().toISOString()); setUnread(0); }
      }).subscribe();
    return () => { s.removeChannel(ch) };
  }, [dealerId]);
  useEffect(() => {
    const stored = localStorage.getItem(seenKey(dealerId));
    const since = stored ? new Date(stored).getTime() : 0;
    setUnread(open ? 0 : messages.filter((m) => new Date(m.created_at).getTime() > since).length);
  }, [messages, open, dealerId]);
  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) { localStorage.setItem(seenKey(dealerId), new Date().toISOString()); setUnread(0); }
  }
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="secondary" onClick={toggle}>{label}{open ? ' — إغلاق' : ''}</button>
        {!open && unread > 0 && (
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold" title="رسايل جديدة" style={{ background: 'var(--amber)', color: '#fff' }}>{unread > 99 ? '99+' : unread}</span>
        )}
      </div>
      {open && (
        <ChatThread messages={messages} viewerId={viewerId} showRoles={showRoles}
          onSend={async (body) => { await sendDealerAdminMessage(dealerId, body); }} />
      )}
    </div>
  );
}