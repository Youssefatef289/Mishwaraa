import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
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
        <Navbar user={user} />
        <main className="mx-auto max-w-[960px] p-5 md:p-7">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
