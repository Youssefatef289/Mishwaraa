import React, { useState } from 'react';
import { Car } from '@/src/core/types';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (car: Car) => void;
}

export const AddCarModal: React.FC<AddCarModalProps> = ({ isOpen, onClose, onAddCar }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('2024');
  const [category, setCategory] = useState('suv');
  const [plateLetters, setPlateLetters] = useState('أ ب ج');
  const [plateNumbers, setPlateNumbers] = useState('1234');
  const [dailyPrice, setDailyPrice] = useState('1500');
  const [transmission, setTransmission] = useState('أوتوماتيك');
  const [fuel, setFuel] = useState('بنزين 95');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCar: Car = {
      id: `car-custom-${Date.now()}`,
      name,
      year: parseInt(year) || 2024,
      category,
      categoryAr:
        category === 'suv'
          ? 'SUV عائلية'
          : category === 'sedan'
          ? 'سيدان فاخرة'
          : category === '4x4'
          ? 'دفع رباعي'
          : 'اقتصادية وعملية',
      plateLetters,
      plateNumbers,
      dailyPrice: parseInt(dailyPrice) || 1500,
      dealerName: 'معرض النخبة موتورز',
      location: 'المهندسين، الجيزة',
      mileage: '20,000 كم',
      transmission,
      seats: category === 'suv' ? 7 : 5,
      fuel,
      status: 'available',
      statusAr: 'متاح للحجز الآن',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA7nGPX2g4lxuEYIbHx9_FewWiQoKFQO_5q6tjdJm_ltZ-WS4Hi-vuKk2oARrPzhGIzv49sKw70t9vVvHxrnRsMYWXRWAc96IA4vLMvtRdtIBavo1K-bEEGwKoeQqyfa3mWD2tuJSLODryhVgISurEX-p0gy00C9ZbUPtriZF3YnZRM_52TBybMtK0nYwjP3thlWzkGrMDsnFe5rjO-sQdgj7Bv9lEFnyM8BmVIvqDbZrDtquR7lagN',
      deposit: 3000,
      insurancePrice: 500,
      serviceFee: 350,
      routeAllowanceKm: 800,
    };

    onAddCar(newCar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#d9c3b1] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9c3b1]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#884e00] text-[24px]">add_circle</span>
            <h3 className="font-bold text-base text-[#121c28]">إضافة سيارة جديدة لأسطول المعرض</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dfe9fa] flex items-center justify-center text-[#121c28] hover:bg-[#d9e3f4] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div>
            <label className="font-bold text-[#121c28] block mb-1">اسم وموديل المركبة</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: هيونداي توسان 2024 / تويوتا فورتشنر"
              className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#121c28] block mb-1">سنة الصنع</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 font-mono-numeric"
              />
            </div>
            <div>
              <label className="font-bold text-[#121c28] block mb-1">فئة المركبة</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40"
              >
                <option value="suv">SUV عائلية</option>
                <option value="sedan">سيدان مريحة</option>
                <option value="4x4">دفع رباعي 4x4</option>
                <option value="economy">اقتصادية وعملية</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#121c28] block mb-1">حروف اللوحة المصرية</label>
              <input
                type="text"
                value={plateLetters}
                onChange={(e) => setPlateLetters(e.target.value)}
                placeholder="س ج د"
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40"
              />
            </div>
            <div>
              <label className="font-bold text-[#121c28] block mb-1">أرقام اللوحة</label>
              <input
                type="text"
                value={plateNumbers}
                onChange={(e) => setPlateNumbers(e.target.value)}
                placeholder="9418"
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 font-mono-numeric"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#121c28] block mb-1">سعر الإيجار اليومي (ج.م)</label>
              <input
                type="number"
                value={dailyPrice}
                onChange={(e) => setDailyPrice(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40 font-mono-numeric"
              />
            </div>
            <div>
              <label className="font-bold text-[#121c28] block mb-1">ناقل الحركة</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1]/40"
              >
                <option value="أوتوماتيك">أوتوماتيك</option>
                <option value="CVT أوتوماتيك">CVT أوتوماتيك</option>
                <option value="دبل كلتش 7 سرعات">دبل كلتش 7 سرعات</option>
              </select>
            </div>
          </div>

          <div className="p-3 bg-[#eef4ff] rounded-lg text-[11px] text-[#534437] mt-1">
            ✓ سيتم تفعيل جهاز تتبع التيليماتكس وربط السيارة مباشرة بشبكة مشوار للطرق السريعة.
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
              إضافة السيارة للأسطول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
