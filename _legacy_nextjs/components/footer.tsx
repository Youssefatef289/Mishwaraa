import Link from 'next/link';
import { CarIcon } from '@/components/icons';

const QUICK = [
  { href: '/', label: 'الرئيسية' },
  { href: '/cars', label: 'السيارات' },
  { href: '/#about', label: 'من نحن' },
  { href: '/#services', label: 'خدماتنا' },
  { href: '/auth', label: 'سجّل معرضك' },
];

const LEGAL = [
  { href: '/terms', label: 'شروط الاستخدام' },
  { href: '/privacy', label: 'سياسة الخصوصية' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-10 border-t" style={{ background: 'var(--surface-2)' }}>
      <div className="mx-auto grid max-w-[960px] gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-1.5 text-2xl font-extrabold">
            <CarIcon className="h-6 w-12 text-amber" />
            <span className="text-amber">مشوار</span>
          </p>
          <p className="mt-2 text-sm leading-6 text-dim">منصة تأجير السيارات اللي بتوصّلك بالمعرض الصح في مصر.</p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-teal">روابط سريعة</h2>
          <ul className="space-y-2 text-sm">
            {QUICK.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-dim transition hover:text-amber">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-teal">قانوني</h2>
          <ul className="space-y-2 text-sm">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-dim transition hover:text-amber">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-bold text-teal">تواصل معانا</h2>
          <ul className="space-y-2 text-sm text-dim">
            <li><span className="digital">16560</span> — الخط الساخن</li>
            <li>hello@mishwar.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-sm text-dim" style={{ background: 'var(--surface-2)' }}>
        © {year} مشوار · كل الحقوق محفوظة
      </div>
    </footer>
  );
}