import React, { useState } from 'react';
import { Booking } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';

interface ConfirmationScreenProps {
  booking: Booking;
  onNavigateToBookings: () => void;
  onNavigateToHome: () => void;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  booking,
  onNavigateToBookings,
  onNavigateToHome,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-['Tajawal'] pb-24 md:pb-12 pt-10">
      
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl animate-[slideDown_0.3s_ease-out] font-bold">
          {toastMessage}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Success Header */}
        <div className="flex flex-col items-center justify-center text-center mb-10 animate-[slideUp_0.5s_ease-out]">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-white">check</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4">تم استلام طلبك بنجاح!</h1>
          <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto">
            تم إرسال طلب الحجز إلى المعرض للمراجعة. سيتم إرسال إشعار لك فور التأكيد.
          </p>
        </div>

        {/* Ticket Box */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative animate-[slideUp_0.7s_ease-out]">
          {/* Ticket styling top/bottom cuts */}
          <div className="absolute -left-4 top-1/2 w-8 h-8 bg-[#f8f9fa] rounded-full border-r border-gray-100"></div>
          <div className="absolute -right-4 top-1/2 w-8 h-8 bg-[#f8f9fa] rounded-full border-l border-gray-100"></div>
          
          {/* Top Section - Status & ID */}
          <div className="p-8 border-b border-dashed border-gray-200 bg-[#121c28] text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-gray-400 font-bold text-sm block mb-1">رقم الطلب</span>
                <span className="text-2xl font-black tracking-widest text-[#c97a1e]">{booking.code}</span>
              </div>
              <div className="px-6 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 font-black flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">pending_actions</span>
                قيد المراجعة
              </div>
            </div>
          </div>

          {/* Middle Section - Car & Dates */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="w-48 h-32 rounded-2xl overflow-hidden shrink-0 shadow-md">
                <img src={booking.car.image} alt={booking.car.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center md:text-right">
                <h2 className="text-2xl font-black text-gray-900 mb-2">{booking.car.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600 font-bold mb-4">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-[#c97a1e]">storefront</span> {booking.car.dealerName}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px] text-[#2c7a7b]">event_available</span> {booking.days} أيام</span>
                </div>
                <EgyptianPlateBadge letters={booking.car.plateLetters} numbers={booking.car.plateNumbers} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 mb-8">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 mb-1">الاستلام</span>
                <span className="font-black text-gray-900">{booking.pickupDate}</span>
                <span className="text-sm font-bold text-[#c97a1e]">{booking.pickupTime}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 mb-1">مكان الاستلام</span>
                <span className="font-black text-gray-900">{booking.pickupLocation}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 mb-1">التسليم</span>
                <span className="font-black text-gray-900">{booking.returnDate}</span>
                <span className="text-sm font-bold text-[#c97a1e]">{booking.returnTime}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 mb-1">مكان التسليم</span>
                <span className="font-black text-gray-900">{booking.dropoffLocation}</span>
              </div>
            </div>

            {/* Bottom Section - Price */}
            <div className="flex items-center justify-between p-6 bg-[#c97a1e]/10 rounded-2xl">
              <div>
                <span className="block text-sm font-black text-[#b7791f] mb-1">إجمالي التكلفة المتوقعة</span>
                <span className="block text-xs font-bold text-gray-600">شامل الإيجار، التأمين، والرسوم</span>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-[#b7791f]">{booking.totalPrice}</span>
                <span className="text-sm font-bold text-[#b7791f]/70 mr-1">ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={onNavigateToBookings}
            className="w-full sm:w-auto bg-[#121c28] text-white px-8 py-4 rounded-xl font-black hover:bg-[#c97a1e] transition-colors shadow-lg active:scale-95"
          >
            متابعة حالة الطلب
          </button>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl font-black hover:bg-gray-50 border border-gray-200 transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">print</span>
            طباعة الفاتورة
          </button>
          <button
            onClick={onNavigateToHome}
            className="w-full sm:w-auto text-gray-500 hover:text-gray-900 font-bold px-4 py-4 transition-colors"
          >
            العودة للرئيسية
          </button>
        </div>

      </div>
    </div>
  );
};
