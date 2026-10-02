// طبقة المحادثات — مشوار
// booking_messages: محادثة بين العميل والمعرض على حجز محدد
// dealer_admin_messages: محادثة بين المعرض وإدارة مشوار
import { supabase } from '@/src/lib/supabase';

// ========== أنواع الرسائل ==========

export interface ChatMessage {
  id: string;
  body: string;
  sender_id: string;
  sender_role: string;
  created_at: string;
}

const isUUID = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

// ========== رسائل الحجز (booking_messages) ==========

/** تحميل رسائل حجز معيّن */
export async function loadBookingMessages(bookingId: string): Promise<ChatMessage[] | null> {
  if (!supabase || !isUUID(bookingId)) return null;
  try {
    const { data, error } = await supabase
      .from('booking_messages')
      .select('id, body, sender_id, sender_role, created_at')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true })
      .limit(200);
    if (error || !data) return null;
    return data as ChatMessage[];
  } catch {
    return null;
  }
}

/** إرسال رسالة على حجز */
export async function sendBookingMessage(
  bookingId: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ' };
  if (!isUUID(bookingId)) return { ok: false, error: 'booking-id' };
  if (!body.trim()) return { ok: false, error: 'الرسالة فارغة' };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'سجّل دخولك أولاً.' };
    // استخراج الدور من الملف الشخصي
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    const senderRole = (profile as Record<string, any> | null)?.role ?? 'customer';
    const { error } = await supabase.from('booking_messages').insert({
      booking_id: bookingId,
      sender_id: user.id,
      sender_role: senderRole,
      body: body.trim(),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'خطأ غير متوقع' };
  }
}

/** الاشتراك المباشر في رسائل حجز عبر Supabase Realtime */
export function subscribeBookingMessages(
  bookingId: string,
  onInsert: (msg: ChatMessage) => void,
): (() => void) {
  if (!supabase || !isUUID(bookingId)) return () => {};
  const channel = supabase
    .channel(`booking-chat-${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'booking_messages',
        filter: `booking_id=eq.${bookingId}`,
      },
      (payload) => {
        const row = payload.new as Record<string, any>;
        onInsert({
          id: row.id,
          body: row.body,
          sender_id: row.sender_id,
          sender_role: row.sender_role,
          created_at: row.created_at,
        });
      },
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// ========== رسائل الدعم (dealer_admin_messages) ==========

/** تحميل رسائل دعم المعرض مع الإدارة */
export async function loadSupportMessages(dealerId: string): Promise<ChatMessage[] | null> {
  if (!supabase || !isUUID(dealerId)) return null;
  try {
    const { data, error } = await supabase
      .from('dealer_admin_messages')
      .select('id, body, sender_id, sender_role, created_at')
      .eq('dealer_id', dealerId)
      .order('created_at', { ascending: true })
      .limit(200);
    if (error || !data) return null;
    return data as ChatMessage[];
  } catch {
    return null;
  }
}

/** إرسال رسالة دعم */
export async function sendSupportMessage(
  dealerId: string,
  body: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ' };
  if (!isUUID(dealerId)) return { ok: false, error: 'dealer-id' };
  if (!body.trim()) return { ok: false, error: 'الرسالة فارغة' };
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'سجّل دخولك أولاً.' };
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    const senderRole = (profile as Record<string, any> | null)?.role ?? 'customer';
    const { error } = await supabase.from('dealer_admin_messages').insert({
      dealer_id: dealerId,
      sender_id: user.id,
      sender_role: senderRole,
      body: body.trim(),
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'خطأ غير متوقع' };
  }
}

/** الاشتراك في رسائل الدعم عبر Realtime */
export function subscribeSupportMessages(
  dealerId: string,
  onInsert: (msg: ChatMessage) => void,
): (() => void) {
  if (!supabase || !isUUID(dealerId)) return () => {};
  const channel = supabase
    .channel(`support-chat-${dealerId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'dealer_admin_messages',
        filter: `dealer_id=eq.${dealerId}`,
      },
      (payload) => {
        const row = payload.new as Record<string, any>;
        onInsert({
          id: row.id,
          body: row.body,
          sender_id: row.sender_id,
          sender_role: row.sender_role,
          created_at: row.created_at,
        });
      },
    )
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
