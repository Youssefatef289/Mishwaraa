import React, { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { signInUser, signUpUser } from '@/src/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  initialRole?: 'customer' | 'dealer';
  onClose: () => void;
  onAuthed: (user: User) => void;
}

/** نافذة الدخول/إنشاء الحساب — الربط مع Supabase Auth */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode = 'signin', initialRole = 'customer', onClose, onAuthed }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [role, setRole] = useState<'customer' | 'dealer'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [city, setCity] = useState('cairo');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const CITY_LABELS: Record<string, string> = {
    cairo: 'القاهرة',
    giza: 'الجيزة',
    alex: 'الإسكندرية',
    sahel: 'الساحل الشمالي',
    hurghada: 'الغردقة',
    sharm: 'شرم الشيخ',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNote('');
    setBusy(true);
    try {
      if (mode === 'signin') {
        const res = await signInUser(email, password);
        if (!res.ok) setError(res.error ?? 'تعذر تسجيل الدخول.');
        else if (res.user) {
          onAuthed(res.user);
          onClose();
        } else setError('لم يتم العثور على الجلسة.');
      } else {
        const res = await signUpUser({
          email,
          password,
          fullName: fullName || dealerName,
          phone,
          role,
          dealerName: role === 'dealer' ? dealerName : undefined,
          city: role === 'dealer' ? CITY_LABELS[city] : undefined,
        });
        if (!res.ok) setError(res.error ?? 'تعذر إنشاء الحساب.');
        else if (res.user) {
          onAuthed(res.user);
          onClose();
        } else {
          setNote('تم إنشاء الحساب. راجع بريدك الإلكتروني لتأكيد البريد إن لزم، ثم سجّل دخولك.');
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[#d9c3b1] flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9c3b1]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#884e00] text-[24px]">account_circle</span>
            <div>
              <h3 className="font-bold text-base text-[#121c28]">حساب مشوار الموحد</h3>
              <p className="text-[10px] text-[#534437]">تسجيل الدخول يربط حجوزاتك بمدونتك المباشرة من قاعدة البيانات</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#dfe9fa] flex items-center justify-center text-[#121c28] hover:bg-[#d9e3f4] cursor-pointer">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden bg-[#eef4ff] p-0.5 text-xs">
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${mode === 'signin' ? 'bg-[#884e00] text-white' : 'text-[#534437]'}`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-2 rounded-md font-bold transition-all ${mode === 'signup' ? 'bg-[#884e00] text-white' : 'text-[#534437]'}`}
          >
            حساب جديد
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          {mode === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`px-3 py-2 rounded-lg border font-bold transition-all ${role === 'customer' ? 'border-[#884e00] bg-[#ffdcbf]/40 text-[#884e00]' : 'border-[#d9c3b1]/60 text-[#534437]'}`}
                >
                  عميل
                </button>
                <button
                  type="button"
                  onClick={() => setRole('dealer')}
                  className={`px-3 py-2 rounded-lg border font-bold transition-all ${role === 'dealer' ? 'border-[#0f6969] bg-[#a4f0ef]/40 text-[#0f6969]' : 'border-[#d9c3b1]/60 text-[#534437]'}`}
                >
                  معرض / أسطول
                </button>
              </div>
              <div>
                <label className="font-bold text-[#121c28] block mb-1">{role === 'dealer' ? 'اسم المعرض' : 'الاسم الكامل'}</label>
                <input
                  type="text"
                  required
                  value={role === 'dealer' ? dealerName : fullName}
                  onChange={(e) => (role === 'dealer' ? setDealerName(e.target.value) : setFullName(e.target.value))}
                  placeholder={role === 'dealer' ? 'مثال: معرض النخبة موتورز' : 'الاسم الثلاثي'}
                  className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-[#121c28] block mb-1">الهاتف</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 font-mono-numeric"
                />
              </div>
              {role === 'dealer' && (
                <div>
                  <label className="font-bold text-[#121c28] block mb-1">المدينة / المقر</label>
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40">
                    {Object.entries(CITY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
          <div>
            <label className="font-bold text-[#121c28] block mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-[#121c28] block mb-1">كلمة المرور</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 أحرف على الأقل"
              className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 focus:outline-none"
            />
          </div>

          {error && <p className="text-[#ba1a1a] bg-[#ffdad6]/60 px-3 py-2 rounded-lg font-bold">{error}</p>}
          {note && (
            <p className="text-[#056a41] bg-[#9ff5c1]/40 px-3 py-2 rounded-lg font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              {note}
            </p>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#534437] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#0f6969]">lock</span>
              بياناتك مشفّرة عبر Supabase Auth
            </span>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2.5 bg-[#884e00] hover:bg-[#ab6300] text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {busy && <span className="material-symbols-outlined animate-spin text-[15px]">sync</span>}
              {mode === 'signin' ? 'دخول' : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};