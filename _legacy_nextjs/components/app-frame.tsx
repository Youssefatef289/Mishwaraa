'use client';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

// الفريم العام للموقع — يخفي الشريط والفوتر داخل التجربة التفاعلية /demo
// حتي تعمل شاشات التجربة بعرض الشاشة الكامل داخل مُحاكي الأجهزة.
export default function AppFrame({ user, children }: { user: { name: string; role?: string } | null; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/demo')) return <>{children}</>;
  return (
    <>
      <Navbar user={user} />
      <main className="mx-auto max-w-[960px] p-5 md:p-7">{children}</main>
      <Footer />
    </>
  );
}