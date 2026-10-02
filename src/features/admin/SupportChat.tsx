import React, { useEffect, useState } from 'react';
import type { ChatMessage } from '@/src/lib/chat';
import { loadSupportMessages, sendSupportMessage, subscribeSupportMessages } from '@/src/lib/chat';
import { ChatThread } from '@/src/shared/ChatThread';

interface SupportChatProps {
  dealerId: string;
  currentUserId: string | null;
  /** عنوان اختياري */
  title?: string;
  /** إظهار المحادثة مباشرة بدون زر تبديل */
  alwaysOpen?: boolean;
}

/** محادثة الدعم — بين المعرض وإدارة مشوار */
export const SupportChat: React.FC<SupportChatProps> = ({
  dealerId,
  currentUserId,
  title = 'تواصل مع إدارة مشوار',
  alwaysOpen = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(alwaysOpen);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadSupportMessages(dealerId).then((msgs) => {
      if (!cancelled && msgs) setMessages(msgs);
    });
    return () => { cancelled = true; };
  }, [dealerId, open]);

  useEffect(() => {
    const unsub = subscribeSupportMessages(dealerId, (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return unsub;
  }, [dealerId]);

  const handleSend = async (body: string) => {
    return sendSupportMessage(dealerId, body);
  };

  if (alwaysOpen) {
    return (
      <ChatThread
        messages={messages}
        currentUserId={currentUserId}
        onSend={handleSend}
        title={title}
        placeholder="اكتب رسالتك لإدارة مشوار..."
      />
    );
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-bold text-[#0f6969] hover:text-[#884e00] cursor-pointer transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">support_agent</span>
        <span>{open ? 'إخفاء الدعم' : title}</span>
      </button>

      {open && (
        <div className="mt-2">
          <ChatThread
            messages={messages}
            currentUserId={currentUserId}
            onSend={handleSend}
            title={title}
            placeholder="اكتب رسالتك لإدارة مشوار..."
          />
        </div>
      )}
    </div>
  );
};
