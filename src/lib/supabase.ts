// طبقة الاتصال بـ Supabase — مشوار
// تعمل مع متغيرات VITE_ أو NEXT_PUBLIC_ وتعود بصفر (بدون اتصال) عند غياب الإعداد.
import { createClient, SupabaseClient, type User } from '@supabase/supabase-js';

const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined) ||
  '';

const anonKey =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  '';

export const supabase: SupabaseClient | null = url && anonKey ? createClient(url, anonKey) : null;
export const isSupabaseConfigured: boolean = Boolean(url && anonKey);

/** المستخدم الحالي أو null */
export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

/** تسجيل الدخول */
export async function signInUser(email: string, password: string): Promise<{ ok: boolean; error?: string; user?: User }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ — املأ VITE_SUPABASE_* في .env.local' };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user ?? undefined };
}

/** إنشاء حساب جديد (عميل/معرض) — الـ trigger ينشئ profile و dealer تلقائياً */
export async function signUpUser(input: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'dealer';
  dealerName?: string;
  city?: string;
  address?: string;
}): Promise<{ ok: boolean; error?: string; user?: User }> {
  if (!supabase) return { ok: false, error: 'Supabase غير مهيأ — املأ VITE_SUPABASE_* في .env.local' };
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        role: input.role,
        full_name: input.fullName,
        phone: input.phone,
        dealer_name: input.role === 'dealer' ? input.dealerName || input.fullName : undefined,
        city: input.role === 'dealer' ? input.city || 'Cairo' : undefined,
        address: input.role === 'dealer' ? input.address || '—' : undefined,
      },
    },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, user: data.user ?? undefined };
}

/** تسجيل الخروج */
export async function signOutUser(): Promise<void> {
  try {
    await supabase?.auth.signOut();
  } catch {
    /* ignore */
  }
}