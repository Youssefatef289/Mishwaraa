'use client';
import { useState } from 'react';
import Link from 'next/link';
import { calculateQuote, createBooking } from '@/app/actions';

export default function BookingWizard({ car }: { car: { id: string; name: string; price: number; perKm: number; city: string } }) {
  const [step, setStep] = useState(1);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(1);
  const [date, setDate] = useState('');
  const [quote, setQuote] = useState<{ distanceKm: number; totalPrice: number } | null>(null);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  async function quoteIt() {
    try {
      setError('');
      setQuote(await calculateQuote(car.city, destination, days, car.price, car.perKm));
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطأ');
    }
  }
  async function confirm() {
    try {
      await createBooking({ carId: car.id, destination, days, startDate: date, terms });
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'خطأ');
    }
  }
  return (
    <section className="mx-auto max-w-xl">
      <h1 className="mb-2 text-3xl font-bold">حجز {car.name}</h1>
      <p className="my-4 text-sm text-dim">الخطوة <span className="digital">{step}</span> من 3</p>
      {step === 1 && (
        <div className="surface space-y-4 p-6">
          <p>الانطلاق: <b>{car.city}</b></p>
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="مدينة الوجهة" />
          <input type="number" min="1" value={days} onChange={(e) => setDays(+e.target.value)} placeholder="عدد الأيام" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          <button onClick={() => setStep(2)} disabled={!destination || !date} className="primary">التالي</button>
        </div>
      )}
      {step === 2 && (
        <div className="surface p-6">
          <p>سنحسب المسافة من {car.city} إلى {destination}.</p>
          <button onClick={quoteIt} className="primary mt-4">احسب السعر</button>
        </div>
      )}
      {step === 3 && quote && (
        <div className="surface space-y-4 p-6">
          <p>المسافة: <b><span className="digital">{quote.distanceKm.toFixed(1)}</span> كم</b></p>
          <p className="text-xl">السعر الإجمالي: <b className="text-amber"><span className="digital">{quote.totalPrice.toFixed(2)}</span> جنيه</b></p>
          <label className="flex gap-2">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
            <span>أوافق على <Link className="text-teal underline" href="/terms" target="_blank">الشروط والأحكام</Link></span>
          </label>
          <button onClick={confirm} disabled={!terms} className="primary">تأكيد طلب الحجز</button>
        </div>
      )}
      {step === 4 && (
        <div className="surface border p-6" style={{ borderColor: 'var(--green)' }}>
          <h2 className="text-xl font-bold text-success">تم إرسال طلبك</h2>
          <p className="mt-2 text-dim">سيتواصل المعرض معك بعد مراجعة الطلب.</p>
        </div>
      )}
      {error && <p className="mt-3 text-danger">{error}</p>}
    </section>
  );
}