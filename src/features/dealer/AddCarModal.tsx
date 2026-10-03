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
  const [plateLetters, setPlateLetters] = useState('');
  const [plateNumbers, setPlateNumbers] = useState('');
  const [dailyPrice, setDailyPrice] = useState('');
  const [transmission, setTransmission] = useState('automatic');
  const [fuel, setFuel] = useState('gasoline');
  const [seats, setSeats] = useState('5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCar: Car = {
      id: `car-custom-${Date.now()}`,
      name,
      year: parseInt(year) || 2024,
      category,
      categoryAr: category === 'suv' ? 'عائلية SUV' : category === 'sedan' ? 'سيدان' : 'فاخرة',
      plateLetters: plateLetters || 'أ ب ج',
      plateNumbers: plateNumbers || '١٢٣٤',
      dailyPrice: parseInt(dailyPrice) || 1500,
      dealerName: 'معرضي الخاص',
      location: 'القاهرة',
      mileage: '0 كم',
      transmission,
      seats: parseInt(seats) || 5,
      fuel,
      status: 'available',
      statusAr: 'متاح',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      deposit: 2000,
      insurancePrice: 200,
      serviceFee: 50,
      routeAllowanceKm: 300,
    };

    onAddCar(newCar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-['Tajawal']">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-[slideUp_0.3s_ease-out]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900">إضافة سيارة جديدة</h2>
            <p className="text-xs text-gray-500 font-bold mt-1">أدخل بيانات السيارة لعرضها للإيجار</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="add-car-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-sm font-black text-[#c97a1e] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">directions_car</span>
                البيانات الأساسية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">اسم السيارة (النوع والموديل)</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="مثال: هيونداي توسان" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">سنة الصنع</label>
                  <select value={year} onChange={e => setYear(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors">
                    {[2025,2024,2023,2022,2021,2020,2019].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">الفئة</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors">
                    <option value="sedan">سيدان</option>
                    <option value="suv">عائلية SUV</option>
                    <option value="luxury">فاخرة</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Specs */}
            <div>
              <h3 className="text-sm font-black text-[#c97a1e] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">build</span>
                المواصفات التقنية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">ناقل الحركة</label>
                  <select value={transmission} onChange={e => setTransmission(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors">
                    <option value="automatic">أوتوماتيك</option>
                    <option value="manual">مانيوال</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">الوقود</label>
                  <select value={fuel} onChange={e => setFuel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors">
                    <option value="gasoline">بنزين</option>
                    <option value="electric">كهرباء</option>
                    <option value="hybrid">هايبرد</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">عدد المقاعد</label>
                  <select value={seats} onChange={e => setSeats(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors">
                    <option value="2">2 مقاعد</option>
                    <option value="4">4 مقاعد</option>
                    <option value="5">5 مقاعد</option>
                    <option value="7">7 مقاعد</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Pricing & Plates */}
            <div>
              <h3 className="text-sm font-black text-[#c97a1e] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                التسعير واللوحات
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">الإيجار اليومي (ج.م)</label>
                  <input type="number" value={dailyPrice} onChange={e => setDailyPrice(e.target.value)} required placeholder="مثال: 1500" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">حروف اللوحة</label>
                    <input type="text" value={plateLetters} onChange={e => setPlateLetters(e.target.value)} placeholder="أ ب ج" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors text-center" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">أرقام اللوحة</label>
                    <input type="text" value={plateNumbers} onChange={e => setPlateNumbers(e.target.value)} placeholder="1234" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-[#c97a1e] focus:border-[#c97a1e] outline-none transition-colors text-center" />
                  </div>
                </div>
              </div>
            </div>

            {/* Image Upload placeholder */}
            <div>
              <h3 className="text-sm font-black text-[#c97a1e] mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">image</span>
                صور السيارة
              </h3>
              <div className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 hover:border-[#c97a1e]/50 cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-3xl mb-2">cloud_upload</span>
                <span className="text-xs font-bold">اضغط أو اسحب الصور هنا</span>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 z-10">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            إلغاء
          </button>
          <button type="submit" form="add-car-form" className="px-8 py-2.5 rounded-xl font-black bg-[#121c28] text-white hover:bg-[#c97a1e] transition-colors shadow-lg active:scale-95">
            حفظ وإضافة
          </button>
        </div>

      </div>
    </div>
  );
};
