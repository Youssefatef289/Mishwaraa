'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import { createClient } from '@/lib/supabase/client';
import { CarIcon, MenuIcon, CloseIcon } from '@/components/icons';

const LINKS = [
  { href: '/cars', label: 'السيارات' },
  { href: '/bookings', label: 'حجوزاتي' },
  { href: '/dashboard', label: 'لوحة المعرض' },
];

export default function Navbar({ user }: { user: { name: string; role?: string } | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === '/cars' ? pathname === '/cars' || pathname.startsWith('/cars/') : pathname === href) || (href === '/dashboard' && pathname === '/dashboard');
  const close = () => setOpen(false);
  async function signOut() {
    try {
      const s = createClient();
      await s.auth.signOut();
    } catch {}
    router.push('/');
    router.refresh();
  }
  const linkClass = (active: boolean) => (active ? 'text-amber border-b-2 border-amber' : 'text-dim border-b-2 border-transparent hover:text-amber') + ' py-1 text-sm';
  return (
    <header className="sticky top-0 z-40 border-b" style={{ background: 'var(--surface)' }}>
      <nav className="mx-auto flex max-w-[960px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-1.5 text-2xl font-extrabold" onClick={close}>
          <CarIcon className="h-6 w-12 text-amber" />
          <span className="text-amber">مشوار</span>
        </Link>
        <div className="hidden items-center gap-4 sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(isActive(l.href))}>{l.label}</Link>
          ))}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-amber">{user.name.slice(0, 1)}</span>
              <span className="max-w-[150px] truncate text-sm text-text">{user.name}</span>
              <button onClick={signOut} className="secondary py-1.5 text-sm">خروج</button>
            </div>
          ) : (
            <Link href="/auth" className={linkClass(pathname === '/auth' || pathname === '/login')}>دخول</Link>
          )}
          <ThemeToggle />
        </div>
        <div className="flex items-center gap-2 sm:hidden">
          <ThemeToggle />
          <button aria-label="القائمة" onClick={() => setOpen(!open)} className="border px-2.5 py-1.5">{open ? <CloseIcon /> : <MenuIcon />}</button>
        </div>
      </nav>
      {open && (
        <div className="border-b sm:hidden">
          <div className="mx-auto flex max-w-[960px] flex-col gap-2 px-4 py-3 text-sm">
            <Link href="/" onClick={close} className={linkClass(pathname === '/')}>الرئيسية</Link>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className={linkClass(isActive(l.href))}>{l.label}</Link>
            ))}
            {user ? (
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 text-sm font-bold text-amber">{user.name.slice(0, 1)}</span>
                <span className="truncate text-text">{user.name}</span>
                <button onClick={signOut} className="secondary text-sm">خروج</button>
              </div>
            ) : (
              <Link href="/auth" onClick={close} className={linkClass(pathname === '/auth' || pathname === '/login')}>دخول</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}