import React, { useEffect, useState } from 'react';
import type { ChatMessage } from '@/src/lib/chat';
import { loadBookingMessages, sendBookingMessage, subscribeBookingMessages } from '@/src/lib/chat';
import { ChatThread } from '@/src/shared/ChatThread';

interface BookingChatProps {
  bookingId: string;
  currentUserId: string | null;
}

/** محادثة الحجز — بين العميل والمعرض */
export const BookingChat: React.FC<BookingChatProps> = ({ bookingId, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // تحميل الرسائل الأولية
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    loadBookingMessages(bookingId).then((msgs) => {
      if (!cancelled && msgs) {
        setMessages(msgs);
        // تحديث آخر وقت مشاهدة
        localStorage.setItem(`chat-seen-${bookingId}`, new Date().toISOString());
        setUnread(0);
      }
    });
    return () => { cancelled = true; };
  }, [bookingId, open]);

  // الاشتراك المباشر
  useEffect(() => {
    const unsub = subscribeBookingMessages(bookingId, (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (!open) {
        setUnread((prev) => prev + 1);
      } else {
        localStorage.setItem(`chat-seen-${bookingId}`, new Date().toISOString());
      }
    });
    return unsub;
  }, [bookingId, open]);

  // حساب عدد الرسائل غير المقروءة عند التحميل
  useEffect(() => {
    const lastSeen = localStorage.getItem(`chat-seen-${bookingId}`);
    if (!lastSeen) return;
    loadBookingMessages(bookingId).then((msgs) => {
      if (msgs) {
        const unseen = msgs.filter(
          (m) => m.sender_id !== currentUserId && new Date(m.created_at) > new Date(lastSeen),
        ).length;
        setUnread(unseen);
      }
    });
  }, [bookingId, currentUserId]);

  const handleSend = async (body: string) => {
    return sendBookingMessage(bookingId, body);
  };

  return (
    <div className="mt-2">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) {
            localStorage.setItem(`chat-seen-${bookingId}`, new Date().toISOString());
            setUnread(0);
          }
        }}
        className="flex items-center gap-1.5 text-xs font-bold text-[#0f6969] hover:text-[#884e00] cursor-pointer transition-colors relative"
      >
        <span className="material-symbols-outlined text-[16px]">chat</span>
        <span>{open ? 'إخفاء المحادثة' : 'محادثة الحجز'}</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-3 w-4 h-4 bg-[#884e00] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-2">
          <ChatThread
            messages={messages}
            currentUserId={currentUserId}
            onSend={handleSend}
            title="محادثة الحجز"
            placeholder="اكتب رسالتك للمعرض أو العميل..."
          />
        </div>
      )}
    </div>
  );
};
