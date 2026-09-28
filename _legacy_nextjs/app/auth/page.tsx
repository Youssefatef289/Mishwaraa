'use client';
import { useState } from 'react';
import { signIn, signUp } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const [newUser, setNewUser] = useState(false);
  const [dealer, setDealer] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  async function submit(f: FormData) {
    try {
      setError('');
      newUser ? await signUp(f) : await signIn(f);
      router.push(newUser && dealer ? '/dashboard' : '/cars');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'حدث خطأ');
    }
  }
  return (
    <section className="mx-auto max-w-md">
      <h1 className="mb-2 text-3xl font-bold">{newUser ? 'إنشاء حساب' : 'تسجيل الدخول'}</h1>
      <p className="mb-6 text-sm text-dim">{newUser ? 'سجّل حسابك عشان تبدأ تختار عربيتك وتأجرها.' : 'ارجع كمل رحلتك من حيث ما وقفت.'}</p>
      <form action={submit} className="surface space-y-3 p-6">
        <input name="email" type="email" placeholder="البريد الإلكتروني" required />
        <input name="password" type="password" placeholder="كلمة المرور (6 أحرف على الأقل)" minLength={6} required />
        {newUser && (
          <>
            <input name="full_name" placeholder="الاسم الكامل" required />
            <input name="phone" placeholder="رقم الهاتف" required />
            <select name="role" onChange={(e) => setDealer(e.target.value === 'dealer')}>
              <option value="customer">عميل</option>
              <option value="dealer">معرض سيارات</option>
            </select>
            {dealer && (
              <>
                <input name="dealer_name" placeholder="اسم المعرض" required />
                <input name="city" placeholder="المدينة" required />
                <input name="address" placeholder="العنوان" required />
              </>
            )}
          </>
        )}
        {error && <p className="text-danger">{error}</p>}
        <button className="primary w-full">{newUser ? 'إنشاء الحساب' : 'دخول'}</button>
      </form>
      <button className="mt-4 text-teal underline-offset-2 underline" onClick={() => setNewUser(!newUser)}>{newUser ? 'لديك حساب بالفعل؟ دخول' : 'حساب جديد'}</button>
    </section>
  );
}