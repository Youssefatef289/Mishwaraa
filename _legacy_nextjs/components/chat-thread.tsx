'use client';
// ملاحظة معروفة (قيد النسخة الحالية): الرسائل ثابتة — لا تعديل ولا حذف نهائيًا،
// ودي مقصودة علشان المحادثات تفضل سجل واضح وقابل للتدقيق.
import { useEffect, useRef, useState } from 'react';

export type ChatRole = 'customer' | 'dealer' | 'super_admin';
export type ChatMessage = {
  id: string;
  sender_id: string;
  sender_role: ChatRole;
  body: string;
  created_at: string;
};

const ROLE_LABEL: Record<ChatRole, string> = { customer: 'عميل', dealer: 'معرض', super_admin: 'إدارة' };
const ROLE_COLOR: Record<ChatRole, string> = { customer: 'var(--teal)', dealer: 'var(--green)', super_admin: 'var(--amber)' };

const HHMM = (iso: string): string => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}`;
};

export default function ChatThread({ messages, viewerId, readOnly, showRoles, onSend }: {
  messages: ChatMessage[];
  viewerId: string;
  readOnly?: boolean;
  showRoles?: boolean;
  onSend: (body: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);
  async function submit() {
    const body = draft.trim();
    if (!body || sending || readOnly) return;
    setSending(true);
    try {
      await onSend(body);
      setDraft('');
    } finally {
      setSending(false);
    }
  }
  return (
    <div dir="rtl" className="space-y-3">
      <div ref={listRef} className="max-h-64 overflow-y-auto rounded-lg border p-2 space-y-2" style={{ background: 'var(--surface-2)' }}>
        {messages.map((m) => {
          const own = m.sender_id === viewerId;
          // في الواجهة RTL، "جهة المُراسل" الطبيعية هي الحافة اليمنى — رسايلك على اليمين والطرف التاني على الشمال.
          return (
            <div key={m.id} className={`flex ${own ? 'justify-start' : 'justify-end'}`}>
              <div className="max-w-[85%] rounded-2xl border px-3 py-2 text-sm leading-7 whitespace-pre-wrap"
                style={{ background: own ? 'color-mix(in srgb, var(--amber) 14%, var(--surface))' : 'var(--surface)' }}>
                {showRoles && (
                  <p className="mb-1"><span className="plate" style={{ color: ROLE_COLOR[m.sender_role] }}>{ROLE_LABEL[m.sender_role]}</span></p>
                )}
                <p>{m.body}</p>
                <p className="mt-0.5"><span className="digital text-xs" style={{ color: 'var(--dim)' }}>{HHMM(m.created_at)}</span></p>
              </div>
            </div>
          );
        })}
        {!messages.length && <p className="text-xs text-dim">مفيش رسايل في المحادثة دي لغاية دلوقتي.</p>}
      </div>
      {!readOnly ? (
        <>
          <div className="road-divider" />
          <div className="flex items-center gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="اكتب رسالتك…" maxLength={1000}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } }} className="min-h-[42px] flex-1" />
            <button className="primary" disabled={sending} onClick={submit}>{sending ? 'جاري الإرسال…' : 'إرسال'}</button>
          </div>
        </>
      ) : (
        <p className="text-xs text-dim">المحادثة مقفولة — للاطلاع بس.</p>
      )}
    </div>
  );
}