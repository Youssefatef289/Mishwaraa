import React, { useState } from "react";
import { Booking } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';

interface MyBookingsScreenProps {
  activeBooking?: Booking;
  liveBookings?: Booking[];
  onNewBookingClick: () => void;
  onViewDigitalTicket: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  activeBooking,
  liveBookings = [],
  onNewBookingClick,
  onViewDigitalTicket,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");

  const allBookings = activeBooking ? [activeBooking, ...liveBookings.filter(b => b.id !== activeBooking.id)] : liveBookings;
  
  const filteredBookings = activeTab === "all" 
    ? allBookings 
    : allBookings.filter((b) => b.status === activeTab);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'pending_actions', label: 'قيد المراجعة' };
      case 'confirmed': return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'thumb_up', label: 'مؤكد' };
      case 'completed': return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: 'task_alt', label: 'مكتمل' };
      case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: 'cancel', label: 'ملغي' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: 'info', label: status };
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen font-['Tajawal'] pb-24 md:pb-12 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">حجوزاتي</h1>
            <p className="text-sm font-medium text-gray-500">تابع حالة طلباتك وحجوزاتك السابقة</p>
          </div>
          <button
            onClick={onNewBookingClick}
            className="bg-[#121c28] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#c97a1e] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            حجز جديد
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-6 scrollbar-hide">
          {[
            { id: "all", label: "الكل" },
            { id: "pending", label: "قيد المراجعة" },
            { id: "confirmed", label: "مؤكدة" },
            { id: "completed", label: "مكتملة" },
            { id: "cancelled", label: "ملغاة" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                activeTab === tab.id
                  ? "bg-[#121c28] text-white border-[#121c28] shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-gray-300">receipt_long</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد حجوزات في هذا القسم</h3>
            <p className="text-gray-500 font-medium mb-8">لم تقم بأي حجوزات مطابقة لحالة التصفية الحالية.</p>
            <button
              onClick={onNewBookingClick}
              className="bg-[#c97a1e] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#ab6300] transition-colors shadow-md"
            >
              تصفح السيارات المتاحة
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredBookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              return (
                <div key={booking.id} className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-shadow">
                  {/* Image Section */}
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden shrink-0">
                    <img src={booking.car.image} alt={booking.car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 bg-white/95 backdrop-blur shadow-sm ${status.color}`}>
                        <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
                        {status.label}
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <EgyptianPlateBadge letters={booking.car.plateLetters} numbers={booking.car.plateNumbers} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-xs font-black text-gray-400 block mb-1">رقم الحجز: {booking.code}</span>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{booking.car.name}</h3>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-[#c97a1e]">storefront</span>
                          {booking.car.dealerName}
                        </div>
                      </div>
                      <div className="text-right bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <span className="block text-xs font-bold text-gray-500 mb-0.5">التكلفة</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-[#2c7a7b]">{booking.totalPrice}</span>
                          <span className="text-xs font-bold text-gray-500">ج.م</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 block mb-1">تاريخ الاستلام</span>
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-gray-400">calendar_today</span>
                          {booking.pickupDate}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-gray-500 block mb-1">مكان الاستلام</span>
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-gray-400">location_on</span>
                          {booking.pickupLocation}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
                      <button 
                        onClick={onViewDigitalTicket}
                        className="flex-1 bg-white text-gray-900 border border-gray-200 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                        التفاصيل
                      </button>
                      <button className="flex-1 bg-white text-[#b7791f] border border-[#b7791f]/30 py-2.5 rounded-xl text-sm font-bold hover:bg-[#b7791f]/5 transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        محادثة
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
