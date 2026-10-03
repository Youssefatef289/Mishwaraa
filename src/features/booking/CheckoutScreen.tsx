import React, { useState } from 'react';
import { Car, Booking } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';

interface CheckoutScreenProps {
  selectedCar: Car;
  onConfirmBooking: (booking: Booking) => void;
  onBackToHome: () => void;
}

const DESTINATIONS = [
  { id: 'sahel', name: 'الساحل الشمالي', distanceKm: 280 },
  { id: 'alex', name: 'الإسكندرية', distanceKm: 220 },
  { id: 'cairo', name: 'داخل القاهرة', distanceKm: 100 },
  { id: 'sokhna', name: 'العين السخنة', distanceKm: 140 },
  { id: 'hurghada', name: 'الغردقة', distanceKm: 460 },
  { id: 'sharm', name: 'شرم الشيخ', distanceKm: 500 },
];

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  selectedCar,
  onConfirmBooking,
  onBackToHome,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState('cairo');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedRoute = DESTINATIONS.find((r) => r.id === selectedRouteId) || DESTINATIONS[0];

  // Basic days calc
  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const dailyPrice = selectedCar.dailyPrice;
  const rentalSubtotal = dailyPrice * days;
  const insuranceFee = selectedCar.insurancePrice || 0;
  const serviceFee = selectedCar.serviceFee || 0;
  const deposit = selectedCar.deposit || 0;
  const totalPrice = rentalSubtotal + insuranceFee + serviceFee;

  const handleConfirm = () => {
    if (!termsAccepted || isSubmitting || !pickupDate || !returnDate) return;

    setIsSubmitting(true);

    const booking: Booking = {
      id: `BKG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      car: selectedCar,
      pickupLocation: 'مقر المعرض',
      dropoffLocation: selectedRoute.name,
      pickupDate: pickupDate,
      pickupTime: '10:00 ص',
      returnDate: returnDate,
      returnTime: '10:00 ص',
      days,
      distanceKm: selectedRoute.distanceKm,
      dailyPrice,
      rentalSubtotal,
      insuranceFee,
      serviceFee,
      deposit,
      totalPrice,
      status: 'pending',
      statusAr: 'قيد المراجعة',
      officerName: selectedCar.dealerName || 'المعرض',
      officerPhone: '+20 100 000 0000',
      officerAvatar: 'https://ui-avatars.com/api/?name=Dealer&background=121c28&color=fff',
      insurancePolicyNumber: 'INS-0000',
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmBooking(booking);
    }, 1200);
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-['Tajawal'] pb-24 md:pb-12">
      {/* Top Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <button onClick={onBackToHome} className="text-gray-500 hover:text-gray-900 transition-colors font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            عودة للسيارات
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">{selectedCar.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content (Left/Top on mobile) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Gallery Section */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-[30vh] md:h-[500px] w-full rounded-[1.5rem] overflow-hidden group">
                <img 
                  src={selectedCar.image} 
                  alt={selectedCar.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-[#c97a1e] rounded-full text-xs font-black">{selectedCar.year}</span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">{selectedCar.categoryAr}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black mb-2 drop-shadow-lg">{selectedCar.name}</h1>
                  <p className="text-white/80 font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    {selectedCar.dealerName || "معرض معتمد"}
                  </p>
                </div>
                <div className="absolute bottom-6 left-6">
                  <EgyptianPlateBadge letters={selectedCar.plateLetters} numbers={selectedCar.plateNumbers} />
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">مواصفات السيارة</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'speed', label: 'ناقل الحركة', value: selectedCar.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال' },
                  { icon: 'local_gas_station', label: 'الوقود', value: selectedCar.fuel === 'gasoline' ? 'بنزين' : 'كهرباء' },
                  { icon: 'airline_seat_recline_normal', label: 'المقاعد', value: `${selectedCar.seats || 5} مقاعد` },
                  { icon: 'add_road', label: 'الممشى', value: selectedCar.mileage || '10,000 كم' }
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-[#c97a1e]/20 hover:bg-[#c97a1e]/5 transition-all">
                    <span className="material-symbols-outlined text-3xl text-gray-400 mb-2">{spec.icon}</span>
                    <span className="text-xs text-gray-500 font-bold mb-1">{spec.label}</span>
                    <span className="text-sm font-black text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Details Form */}
            <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-6">تفاصيل الحجز</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الاستلام</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400">calendar_today</span>
                    </div>
                    <input 
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#2c7a7b] focus:border-[#2c7a7b] block pr-12 p-3.5 font-bold outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ التسليم</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400">event_available</span>
                    </div>
                    <input 
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-[#2c7a7b] focus:border-[#2c7a7b] block pr-12 p-3.5 font-bold outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">الوجهة المقصودة</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DESTINATIONS.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setSelectedRouteId(dest.id)}
                      className={`p-3 rounded-xl border-2 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        selectedRouteId === dest.id 
                          ? 'border-[#2c7a7b] bg-[#2c7a7b]/10 text-[#2c7a7b]' 
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200'
                      }`}
                    >
                      {selectedRouteId === dest.id && <span className="material-symbols-outlined text-[18px]">check_circle</span>}
                      {dest.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* Sidebar (Right/Bottom on mobile) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 sticky top-28">
              <h3 className="text-xl font-black text-gray-900 mb-6">ملخص الحجز</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">سعر اليوم</span>
                  <span className="font-black text-lg text-gray-900">{dailyPrice} ج.م</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">مدة الإيجار</span>
                  <span className="font-black text-lg text-gray-900">{days} أيام</span>
                </div>
                
                <div className="h-px bg-gray-100 my-2"></div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">إجمالي الإيجار</span>
                  <span className="font-bold text-gray-900">{rentalSubtotal} ج.م</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">تأمين شامل (يومي)</span>
                  <span className="font-bold text-gray-900">{insuranceFee > 0 ? `${insuranceFee} ج.م` : 'مجاناً'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-bold">رسوم الخدمة</span>
                  <span className="font-bold text-gray-900">{serviceFee > 0 ? `${serviceFee} ج.م` : 'مجاناً'}</span>
                </div>
              </div>

              <div className="p-4 bg-[#c97a1e]/10 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-black text-[#b7791f]">الإجمالي المطلوب</span>
                  <span className="text-3xl font-black text-[#b7791f]">{totalPrice}</span>
                </div>
                <div className="text-left text-xs font-bold text-[#b7791f]/70">ج.م</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6 flex items-start gap-3">
                <span className="material-symbols-outlined text-gray-400 mt-0.5">info</span>
                <div>
                  <span className="block text-sm font-bold text-gray-900 mb-1">تأمين مسترد</span>
                  <span className="block text-xs font-medium text-gray-500 leading-relaxed">
                    يتم دفع تأمين نقدي بقيمة {deposit} ج.م عند استلام السيارة ويسترد بالكامل عند إرجاعها سليمة.
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded hover:border-[#2c7a7b] checked:bg-[#2c7a7b] checked:border-[#2c7a7b] transition-colors"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span className="material-symbols-outlined absolute text-white text-[16px] pointer-events-none opacity-0 peer-checked:opacity-100">check</span>
                </div>
                <span className="text-xs font-bold text-gray-600 leading-relaxed select-none">
                  أوافق على <a href="#" className="text-[#2c7a7b] hover:underline">شروط وأحكام الإيجار</a> والمسؤولية الكاملة عن السيارة خلال فترة الحجز.
                </span>
              </label>

              <button
                onClick={handleConfirm}
                disabled={!termsAccepted || isSubmitting || !pickupDate || !returnDate}
                className="w-full bg-[#121c28] text-white py-4 rounded-xl font-black text-lg hover:bg-[#c97a1e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    جاري إرسال الطلب...
                  </>
                ) : (
                  <>
                    تأكيد الطلب
                    <span className="material-symbols-outlined">arrow_left_alt</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
