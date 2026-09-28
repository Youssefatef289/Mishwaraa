import './globals.css';
import AppFrame from '@/components/app-frame';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export const metadata = { title: 'مشوار | Mishwar', description: 'Car rental marketplace for Egypt' };

export default async function Layout({ children }: { children: React.ReactNode }) {
  let user: { name: string; role?: string } | null = null;
  if (isSupabaseConfigured) {
    try {
      const s = await createClient();
      const { data: { user: u } } = await s.auth.getUser();
      if (u) {
        const { data: profile } = await s.from('profiles').select('role').eq('id', u.id).maybeSingle();
        const role = (profile?.role as string | undefined) ?? null;
        let name = ((u.user_metadata as Record<string, unknown>)?.full_name as string | undefined) ?? '';
        if (role === 'dealer') {
          const { data: dealer } = await s.from('dealers').select('name').eq('user_id', u.id).maybeSingle();
          name = (dealer?.name as string | undefined) || ((u.user_metadata as Record<string, unknown>)?.dealer_name as string | undefined) || name;
        }
        user = { name, role: role ?? undefined };
      }
    } catch {}
  }
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppFrame user={user}>{children}</AppFrame>
      </body>
    </html>
  );
}
