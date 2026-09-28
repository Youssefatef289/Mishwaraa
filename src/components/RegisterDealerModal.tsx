import React, { useState } from 'react';

interface RegisterDealerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RegisterDealerModal: React.FC<RegisterDealerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [dealershipName, setDealershipName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('cairo');
  const [fleetCount, setFleetCount] = useState('10');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#d9c3b1] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9c3b1]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#884e00] text-[24px]">storefront</span>
            <h3 className="font-bold text-base text-[#121c28]">تسجيل معرض جديد في شبكة مشوار</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dfe9fa] flex items-center justify-center text-[#121c28] hover:bg-[#d9e3f4] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-[#056a41] text-5xl">check_circle</span>
            <h4 className="font-bold text-base text-[#121c28]">تم استلام طلب انضمام معرضك بنجاح!</h4>
            <p className="text-[#534437] max-w-xs leading-relaxed">
              سيتواصل معك فريق توثيق الأسطول وشبكة مشوار خلال 24 ساعة لتركيب أجهزة التيليماتكس وتفعيل لوحة التحكم.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-[#121c28] block mb-1">اسم المعرض أو الشركة</label>
              <input
                type="text"
                required
                value={dealershipName}
                onChange={(e) => setDealershipName(e.target.value)}
                placeholder="مثال: معرض الأهرام أوتو / النيل لتأجير السيارات"
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#121c28] block mb-1">اسم المسؤول</label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="الاسم الثلاثي"
                  className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40"
                />
              </div>
              <div>
                <label className="font-bold text-[#121c28] block mb-1">رقم الهاتف للتواصل</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 font-mono-numeric"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#121c28] block mb-1">المدينة / المقر الرئيسي</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40"
                >
                  <option value="cairo">القاهرة</option>
                  <option value="giza">الجيزة</option>
                  <option value="alex">الإسكندرية</option>
                  <option value="sahel">الساحل الشمالي</option>
                  <option value="hurghada">الغردقة</option>
                  <option value="sharm">شرم الشيخ</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-[#121c28] block mb-1">عدد سيارات الأسطول التقريبي</label>
                <input
                  type="number"
                  value={fleetCount}
                  onChange={(e) => setFleetCount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 font-mono-numeric"
                />
              </div>
            </div>

            <div className="p-3 bg-[#eef4ff] rounded-lg text-[11px] text-[#534437] space-y-1">
              <div>✓ بدون رسوم تسجيل أولية</div>
              <div>✓ عقود إلكترونية موثقة لحماية سياراتك والتحصيل الفوري</div>
              <div>✓ رفع نسبة إشغال الأسطول بنسبة تتجاوز 85% على المحاور السريعة</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d9c3b1]/40 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#dfe9fa] text-[#121c28] font-bold cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#884e00] hover:bg-[#ab6300] text-white font-bold cursor-pointer"
              >
                تأكيد طلب الانضمام
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
