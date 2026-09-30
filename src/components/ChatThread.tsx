import React, { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../lib/chat';

interface ChatThreadProps {
  /** رسائل المحادثة */
  messages: ChatMessage[];
  /** معرّف المستخدم الحالي لتحديد جهة الرسالة */
  currentUserId: string | null;
  /** إرسال رسالة جديدة */
  onSend: (body: string) => Promise<{ ok: boolean; error?: string }>;
  /** عنوان اختياري لنافذة المحادثة */
  title?: string;
  /** placeholder لحقل الإدخال */
  placeholder?: string;
  /** هل المحادثة مغلقة (لا يمكن الإرسال)? */
  disabled?: boolean;
}

/** مكون محادثة قابل لإعادة الاستخدام — فقاعات RTL */
export const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  currentUserId,
  onSend,
  title,
  placeholder = 'اكتب رسالتك...',
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي لآخر رسالة
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || sending || disabled) return;
    setSending(true);
    const res = await onSend(inputValue.trim());
    if (res.ok) setInputValue('');
    setSending(false);
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col bg-[#eef4ff] rounded-xl border border-[#d9c3b1]/40 overflow-hidden">
      {/* عنوان */}
      {title && (
        <div className="px-3 py-2 bg-white border-b border-[#d9c3b1]/30 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0f6969] text-[18px]">chat</span>
          <span className="font-bold text-xs text-[#121c28]">{title}</span>
        </div>
      )}

      {/* منطقة الرسائل */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-2 p-3 max-h-[280px] min-h-[120px] overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="text-center text-[11px] text-[#534437] py-6">
            لا توجد رسائل بعد — ابدأ المحادثة
          </div>
        )}
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                  isMine
                    ? 'bg-[#884e00] text-white rounded-br-sm'
                    : 'bg-white text-[#121c28] border border-[#d9c3b1]/40 rounded-bl-sm'
                }`}
              >
                <p>{msg.body}</p>
                <span
                  className={`block text-[10px] mt-1 font-mono-numeric ${
                    isMine ? 'text-white/60' : 'text-[#867465]'
                  }`}
                >
                  {formatTime(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* حقل الإرسال */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-2 bg-white border-t border-[#d9c3b1]/30"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={disabled ? 'المحادثة مغلقة' : placeholder}
          disabled={disabled || sending}
          className="flex-1 bg-[#eef4ff] text-[#121c28] text-xs px-3 py-2 rounded-lg border border-[#d9c3b1]/30 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || sending || disabled}
          className="bg-[#884e00] hover:bg-[#ab6300] disabled:opacity-40 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">
            {sending ? 'sync' : 'send'}
          </span>
        </button>
      </form>
    </div>
  );
};
