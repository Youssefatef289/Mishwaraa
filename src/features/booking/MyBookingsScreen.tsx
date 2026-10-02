import React, { useState } from "react";
import { Booking } from '@/src/core/types';
import { INITIAL_COMPLETED_BOOKINGS } from '@/src/data/mockData';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';
import { HighwayDivider } from '@/src/shared/HighwayDivider';

interface MyBookingsScreenProps {
  activeBooking: Booking;
  liveBookings?: Booking[];
  onNewBookingClick: () => void;
  onViewDigitalTicket: () => void;
}

export const MyBookingsScreen: React.FC<MyBookingsScreenProps> = ({
  activeBooking,
  liveBookings,
  onNewBookingClick,
  onViewDigitalTicket,
}) => {
  const displayedBooking =
    liveBookings?.find(
      (booking) =>
        booking.status === "confirmed" || booking.status === "pending",
    ) ?? activeBooking;
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "cancelled"
  >("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSecondaryDetails, setShowSecondaryDetails] = useState(false);
  const [gpsModalOpen, setGpsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121c28] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#3aa6a6] flex items-center gap-2 text-xs font-bold animate-bounce">
          <span className="material-symbols-outlined text-[#3aa6a6] text-[18px]">
            info
          </span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* GPS Location Modal */}
      {gpsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-[#d9c3b1] flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#d9c3b1]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#884e00] text-[24px]">
                  assistant_navigation
                </span>
                <h3 className="font-bold text-base text-[#121c28]">
                  إحداثيات موقع الاستلام (GPS)
                </h3>
              </div>
              <button
                onClick={() => setGpsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#dfe9fa] flex items-center justify-center text-[#121c28] hover:bg-[#d9e3f4] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <div className="p-3 bg-[#eef4ff] rounded-lg">
                <span className="text-[11px] text-[#534437] block">
                  نقطة المعرض المعتمدة:
                </span>
                <span className="font-bold text-sm text-[#121c28]">
                  فرع معرض الأقصى أوتو - شارع التسعين الشمالي، التجمع الخامس
                </span>
                <span className="font-mono-numeric text-xs text-[#0f6969] block mt-1">
                  GPS: 30°01'28.2"N 31°28'19.6"E
                </span>
              </div>

              <div className="text-xs text-[#534437] leading-relaxed">
                مسؤول الفرع كابتن عصام منصور بانتظارك. سيتم تجهيز السيارة مسبقاً
                وتفعيل المحرك إلكترونياً فور مسح التذكرة.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#d9c3b1]/40">
              <button
                onClick={() => {
                  setGpsModalOpen(false);
                  window.open(
                    "https://maps.google.com/?q=New+Cairo+Egypt",
                    "_blank",
                  );
                }}
                className="px-4 py-2 bg-[#884e00] hover:bg-[#ab6300] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">
                  near_me
                </span>
                <span>فتح في خرائط Google</span>
              </button>
              <button
                onClick={() => setGpsModalOpen(false)}
                className="px-3 py-2 bg-[#dfe9fa] text-[#121c28] rounded-lg text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Page Title */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#0f6969] font-mono-numeric text-xs font-bold">
              <span className="material-symbols-outlined text-[18px]">
                verified_user
              </span>
              <span>بوابة العميل الرقمية • مسارات القيادة المعتمدة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#121c28] tracking-tight">
              حجوزاتي ومسارات الرحلة
            </h1>
            <p className="text-xs sm:text-sm text-[#534437] max-w-xl">
              متابعة دقيقة لمسارات رحلاتك القادمة، أسطول السيارات المخصص لك،
              ووثائق التأمين الإلزامي والرقمي للطرق السريعة في مصر.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() =>
                showToast(
                  "جاري تصدير التقرير السنوي لحجوزاتك الرسمية بصيغة PDF...",
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded bg-white text-[#121c28] text-xs font-bold border border-[#d9c3b1] shadow-xs hover:bg-[#eef4ff] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                download
              </span>
              <span>تقرير الحجوزات السنوي (PDF)</span>
            </button>
            <button
              onClick={onNewBookingClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#884e00] hover:bg-[#ab6300] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                add_circle
              </span>
              <span>حجز سيارة جديدة</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-xl p-3 shadow-xs border border-[#d9c3b1]/40 flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Segmented Control Tabs */}
          <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "active"
                  ? "bg-[#884e00] text-white shadow-xs"
                  : "text-[#534437] hover:bg-[#eef4ff]"
              }`}
            >
              <span>الحجوزات الحالية والقادمة</span>
              <span
                className={`px-1.5 py-0.5 rounded-full font-mono-numeric text-[10px] ${
                  activeTab === "active"
                    ? "bg-white/25 text-white"
                    : "bg-[#dfe9fa] text-[#121c28]"
                }`}
              >
                02
              </span>
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "completed"
                  ? "bg-[#884e00] text-white shadow-xs"
                  : "text-[#534437] hover:bg-[#eef4ff]"
              }`}
            >
              <span>الحجوزات المكتملة</span>
              <span
                className={`px-1.5 py-0.5 rounded-full font-mono-numeric text-[10px] ${
                  activeTab === "completed"
                    ? "bg-white/25 text-white"
                    : "bg-[#dfe9fa] text-[#121c28]"
                }`}
              >
                04
              </span>
            </button>

            <button
              onClick={() => setActiveTab("cancelled")}
              className={`px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "cancelled"
                  ? "bg-[#884e00] text-white shadow-xs"
                  : "text-[#534437] hover:bg-[#eef4ff]"
              }`}
            >
              <span>الملغاة</span>
              <span
                className={`px-1.5 py-0.5 rounded-full font-mono-numeric text-[10px] ${
                  activeTab === "cancelled"
                    ? "bg-white/25 text-white"
                    : "bg-[#dfe9fa] text-[#121c28]"
                }`}
              >
                00
              </span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث برقم الحجز، السيارة، أو المعرض..."
              className="w-full h-10 pr-9 pl-3 bg-[#eef4ff] rounded-lg text-xs text-[#121c28] placeholder:text-[#867465] border border-[#d9c3b1]/40 focus:outline-none focus:ring-1 focus:ring-[#884e00]"
            />
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#534437] text-[18px]">
              search
            </span>
          </div>
        </div>
      </section>

      <HighwayDivider />

      {/* Conditional Content based on Tabs */}
      {activeTab === "active" && (
        <>
          {/* Primary Featured Active Booking Card (Hyundai Tucson 2024) */}
          <section className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-[#d9c3b1]/40 flex flex-col gap-5">
            {/* Top Level Status Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 p-4 sm:p-5 bg-[#eef4ff]/70 border-b border-[#d9c3b1]/40 rounded-t-xl">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative bg-white px-3 py-1 rounded flex items-center gap-2 shadow-xs border border-[#d9c3b1]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#056a41]" />
                  <span className="text-xs font-bold text-[#056a41]">
                    {activeBooking.statusAr}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#056a41]" />
                </div>

                <div className="flex items-center gap-1 font-mono-numeric text-xs font-bold text-[#884e00] bg-[#ffdcbf]/40 px-2.5 py-1 rounded">
                  <span>كود الحجز:</span>
                  <span>{activeBooking.code}</span>
                </div>

                {/* Egyptian License Plate */}
                <EgyptianPlateBadge
                  letters={activeBooking.car.plateLetters}
                  numbers={activeBooking.car.plateNumbers}
                  variant="white"
                />
              </div>

              {/* Telematics Sync Pill */}
              <div className="flex items-center gap-2 text-xs text-[#534437] font-mono-numeric">
                <span className="w-2 h-2 rounded-full bg-[#056a41] animate-pulse" />
                <span>تتبع تيليفاتكس متصل • تحديث فوري للطرق السريعة</span>
              </div>
            </div>

            {/* Main Vehicle & Route Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Vehicle Viewport & Specs (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="relative w-full h-52 rounded-lg overflow-hidden bg-[#dfe9fa] group">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUIJ4LJ5TnDJwL1oJffxYy6E4y2G8i9ucTvAi8EvPEppt4VT3WozmuRACU0gpY6xag3VWkNbRpCXn4Fiiu55vBG0lR06w61HlwdVK1Q2hBW3PdpGWaE-Oqt1xH1EkCEJRrANJT92gxh3FaVWY-vE7k_kvvONVsUgN5t86YJk-WntEUlnKn1hogWGZHO9ZsPZFUVMMhIuVI82LiFKQoJM2CD9dal5igzWxlRiz8Sd1VOVQT1u32WAft"
                    alt={activeBooking.car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121c28]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-white/90 font-mono-numeric text-[11px] text-[#884e00] font-bold">
                        موديل {activeBooking.car.year}
                      </span>
                      <h2 className="text-lg font-bold text-white drop-shadow-xs mt-0.5">
                        {activeBooking.car.name} NX4
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#0f6969] text-white text-[11px] font-bold">
                      SUV فاخرة
                    </span>
                  </div>
                </div>

                {/* Technical Spec Badges */}
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="bg-[#eef4ff] p-2 rounded flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#0f6969] text-[18px]">
                      auto_transmission
                    </span>
                    <span className="text-[10px] text-[#534437]">
                      ناقل الحركة
                    </span>
                    <span className="text-xs font-bold text-[#121c28]">
                      أوتوماتيك
                    </span>
                  </div>
                  <div className="bg-[#eef4ff] p-2 rounded flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#0f6969] text-[18px]">
                      local_gas_station
                    </span>
                    <span className="text-[10px] text-[#534437]">الوقود</span>
                    <span className="font-mono-numeric text-xs font-bold text-[#121c28]">
                      بنزين 95
                    </span>
                  </div>
                  <div className="bg-[#eef4ff] p-2 rounded flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#0f6969] text-[18px]">
                      airline_seat_recline_normal
                    </span>
                    <span className="text-[10px] text-[#534437]">المقاعد</span>
                    <span className="font-mono-numeric text-xs font-bold text-[#121c28]">
                      5 ركاب
                    </span>
                  </div>
                  <div className="bg-[#eef4ff] p-2 rounded flex flex-col items-center">
                    <span className="material-symbols-outlined text-[#0f6969] text-[18px]">
                      speed
                    </span>
                    <span className="text-[10px] text-[#534437]">المسافة</span>
                    <span className="font-mono-numeric text-xs font-bold text-[#121c28]">
                      800 كم
                    </span>
                  </div>
                </div>

                {/* Dealer Provenance Panel */}
                <div className="bg-[#eef4ff] p-3 rounded-lg flex items-center justify-between border border-[#d9c3b1]/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-[#0f6969] text-white flex items-center justify-center font-bold text-sm">
                      <span className="material-symbols-outlined text-[20px]">
                        storefront
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-[#121c28]">
                          {activeBooking.car.dealerName}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#ffdcbf] font-mono-numeric text-[10px] text-[#2d1600] font-bold">
                          شريك ذهبي
                        </span>
                      </div>
                      <p className="text-[11px] text-[#534437] mt-0.5">
                        فرع التجمع الخامس • شارع التسعين الشمالي، القاهرة
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#884e00] text-[18px]">
                    verified
                  </span>
                </div>
              </div>

              {/* Trip Path & Milestones (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                {/* Highway Route Timeline */}
                <div className="bg-[#eef4ff]/70 p-4 rounded-xl flex flex-col gap-3 border border-[#d9c3b1]/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-[#121c28] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#884e00] text-[20px]">
                        alt_route
                      </span>
                      <span>مسار وتسلسل استلام وتسليم السيارة</span>
                    </span>
                    <span className="font-mono-numeric text-xs text-[#0f6969] bg-[#a4f0ef]/50 px-2 py-0.5 rounded font-bold">
                      مدة الإيجار: {activeBooking.days} أيام كاملة
                    </span>
                  </div>

                  <div className="relative flex flex-col gap-4 pr-3">
                    {/* Timeline Vertical Connecting Line */}
                    <div className="absolute right-2 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#884e00] via-[#0f6969] to-[#056a41]" />

                    {/* Pickup Point */}
                    <div className="relative flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#884e00] ring-4 ring-[#884e00]/20 shrink-0 mt-1 z-10" />
                      <div className="flex-1 bg-white p-2.5 rounded shadow-xs border border-[#d9c3b1]/40">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-xs font-bold text-[#884e00]">
                            نقطة الاستلام والانطلاق
                          </span>
                          <span className="font-mono-numeric text-[11px] text-[#534437]">
                            {activeBooking.pickupDate} •{" "}
                            {activeBooking.pickupTime}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#121c28] mt-0.5">
                          {activeBooking.pickupLocation}
                        </p>
                        <p className="text-[11px] text-[#534437] mt-0.5">
                          جاهزية التفتيش الفني وتوقيع محضر الفحص الرقمي عبر
                          التطبيق
                        </p>
                      </div>
                    </div>

                    {/* Return Point */}
                    <div className="relative flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#056a41] ring-4 ring-[#056a41]/20 shrink-0 mt-1 z-10" />
                      <div className="flex-1 bg-white p-2.5 rounded shadow-xs border border-[#d9c3b1]/40">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span className="text-xs font-bold text-[#056a41]">
                            نقطة التسليم والإنهاء
                          </span>
                          <span className="font-mono-numeric text-[11px] text-[#534437]">
                            {activeBooking.returnDate} •{" "}
                            {activeBooking.returnTime}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-[#121c28] mt-0.5">
                          {activeBooking.dropoffLocation}
                        </p>
                        <p className="text-[11px] text-[#534437] mt-0.5">
                          تسليم مرن مع فحص مستشعرات الوقود وتيليفاتكس
                          الكيلومترات
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Distance & Policy strip */}
                  <div className="bg-white p-2 rounded flex items-center justify-around text-center shadow-xs border border-[#d9c3b1]/30">
                    <div>
                      <span className="text-[10px] text-[#534437] block">
                        المسافة المشمولة
                      </span>
                      <span className="font-mono-numeric text-xs font-bold text-[#884e00]">
                        800 كم
                      </span>
                    </div>
                    <div className="w-px h-6 bg-[#d9c3b1]/60" />
                    <div>
                      <span className="text-[10px] text-[#534437] block">
                        سعر الكيلو الإضافي
                      </span>
                      <span className="font-mono-numeric text-xs font-bold text-[#121c28]">
                        5.50 ج.م
                      </span>
                    </div>
                    <div className="w-px h-6 bg-[#d9c3b1]/60" />
                    <div>
                      <span className="text-[10px] text-[#534437] block">
                        سياسة الوقود
                      </span>
                      <span className="text-xs font-bold text-[#0f6969]">
                        ممتلئ إلى ممتلئ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Handover Officer Card */}
                <div className="bg-[#eef4ff] p-3 sm:p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 border border-[#d9c3b1]/40">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-white shrink-0 border border-[#0f6969]/30">
                      <img
                        className="w-full h-full object-cover"
                        src={activeBooking.officerAvatar}
                        alt={activeBooking.officerName}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#534437]">
                        مسؤول التسليم والاستلام
                      </span>
                      <h4 className="font-bold text-sm text-[#121c28]">
                        {activeBooking.officerName}
                      </h4>
                      <div className="flex items-center gap-1 font-mono-numeric text-xs text-[#0f6969]">
                        <span className="material-symbols-outlined text-[14px]">
                          call
                        </span>
                        <span>{activeBooking.officerPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <a
                      href={`tel:${activeBooking.officerPhone}`}
                      className="px-3 py-1.5 rounded bg-white text-[#0f6969] text-xs font-bold border border-[#d9c3b1] shadow-xs hover:bg-[#0f6969] hover:text-white transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        phone_in_talk
                      </span>
                      <span>اتصال مباشر</span>
                    </a>
                    <a
                      href={`https://wa.me/2${activeBooking.officerPhone}?text=استفسار حجز ${activeBooking.code}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded bg-[#056a41] text-white text-xs font-bold shadow-xs hover:bg-[#056a41]/90 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        chat
                      </span>
                      <span>واتساب</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Bento: Insurance Policy & Financial Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 border-t border-[#d9c3b1]/40">
              {/* Digital Insurance Certificate Panel (7 Cols) */}
              <div className="lg:col-span-7 bg-[#eef4ff]/50 rounded-xl p-4 flex flex-col justify-between gap-3 border border-[#d9c3b1]/40">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded bg-[#056a41]/10 text-[#056a41] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">
                        security
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-[#121c28]">
                          وثيقة التأمين الشامل للطرق السريعة
                        </h3>
                        <span className="px-1.5 py-0.5 rounded bg-[#9ff5c1] text-[#002111] font-mono-numeric text-[10px] font-bold">
                          سارية ومفعلة
                        </span>
                      </div>
                      <p className="text-[11px] text-[#534437]">
                        بالشراكة الرسمية مع أليانز مصر للتأمين • تغطية حوادث
                        وسرقة بنسبة تحمل صفرية (Zero Deductible)
                      </p>
                    </div>
                  </div>

                  <div className="text-left font-mono-numeric text-[11px] text-[#534437] bg-white px-2 py-1 rounded border border-[#d9c3b1]/40 shrink-0">
                    <span className="block text-[9px] text-[#867465]">
                      رقم الوثيقة
                    </span>
                    <span className="font-bold text-[#121c28]">
                      {activeBooking.insurancePolicyNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded flex items-center gap-1.5 border border-[#d9c3b1]/30">
                    <span className="material-symbols-outlined text-[#056a41] text-[16px]">
                      verified
                    </span>
                    <span>تحمل صفري للأضرار</span>
                  </div>
                  <div className="bg-white p-2 rounded flex items-center gap-1.5 border border-[#d9c3b1]/30">
                    <span className="material-symbols-outlined text-[#056a41] text-[16px]">
                      support_agent
                    </span>
                    <span>طوارئ 24/7 (19822)</span>
                  </div>
                  <div className="bg-white p-2 rounded flex items-center gap-1.5 border border-[#d9c3b1]/30">
                    <span className="material-symbols-outlined text-[#056a41] text-[16px]">
                      swap_driving_apps
                    </span>
                    <span>سيارة بديلة فورية</span>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                  <button
                    onClick={onViewDigitalTicket}
                    className="text-[#0f6969] hover:text-[#884e00] text-xs font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      picture_as_pdf
                    </span>
                    <span>عرض وتحميل وثيقة التأمين والتذكرة الرقمية</span>
                  </button>

                  <a
                    href="tel:19822"
                    className="px-3 py-1 rounded bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold inline-flex items-center gap-1 hover:bg-[#ba1a1a] hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      car_crash
                    </span>
                    <span>طلب ونش أو مساعدة طوارئ بالطريق</span>
                  </a>
                </div>
              </div>

              {/* Financial Summary (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-xl p-4 flex flex-col justify-between gap-2 shadow-xs border border-[#d9c3b1]/40">
                <div className="flex items-center justify-between pb-2 border-b border-[#d9c3b1]/30">
                  <span className="font-bold text-xs text-[#121c28]">
                    ملخص الحساب المالي
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#056a41] font-mono-numeric text-xs font-bold">
                    <span className="material-symbols-outlined text-[15px]">
                      check_circle
                    </span>
                    <span>مدفوع بالكامل</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#534437]">
                    <span>
                      سعر الإيجار الأساسي ({activeBooking.days} أيام ×{" "}
                      {activeBooking.dailyPrice.toLocaleString("ar-EG")} ج.م)
                    </span>
                    <span className="font-mono-numeric font-bold text-[#121c28]">
                      {activeBooking.rentalSubtotal.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#534437]">
                    <span>وثيقة تأمين الطرق الشاملة (تحمل صفري)</span>
                    <span className="font-mono-numeric font-bold text-[#121c28]">
                      {activeBooking.insuranceFee.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[#534437]">
                    <span>رسوم الخدمة الرقمية والضريبة المضافة</span>
                    <span className="font-mono-numeric font-bold text-[#121c28]">
                      {activeBooking.serviceFee.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>

                  <div className="pt-2 mt-1 border-t border-[#d9c3b1]/30 flex items-center justify-between">
                    <span className="font-bold text-sm text-[#121c28]">
                      الإجمالي المدفوع
                    </span>
                    <span className="font-mono-numeric text-lg text-[#884e00] font-bold">
                      {activeBooking.totalPrice.toLocaleString("ar-EG")}{" "}
                      <span className="text-xs font-normal font-sans">ج.م</span>
                    </span>
                  </div>
                </div>

                {/* Refundable Deposit Alert Box */}
                <div className="bg-[#eef4ff] p-2 rounded flex items-center justify-between text-xs border border-[#d9c3b1]/30">
                  <div className="flex items-center gap-1 text-[#534437]">
                    <span className="material-symbols-outlined text-[#0f6969] text-[15px]">
                      lock_reset
                    </span>
                    <span>الوديعة المستردة المعلقة:</span>
                  </div>
                  <span className="font-mono-numeric text-xs text-[#0f6969] font-bold">
                    {activeBooking.deposit.toLocaleString("ar-EG")} ج.م (تسترد
                    فور الفحص)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() =>
                    showToast(
                      "يمكنك تعديل التواريخ بالتنسيق المباشر مع المعرض المعتمد.",
                    )
                  }
                  className="w-full sm:w-auto px-3.5 py-2 rounded bg-[#eef4ff] text-[#121c28] hover:bg-[#dfe9fa] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#d9c3b1]/40"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    edit_calendar
                  </span>
                  <span>تعديل التواريخ أو المسار</span>
                </button>
                <button
                  onClick={onViewDigitalTicket}
                  className="w-full sm:w-auto px-3.5 py-2 rounded bg-[#eef4ff] text-[#121c28] hover:bg-[#dfe9fa] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#d9c3b1]/40"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    receipt_long
                  </span>
                  <span>التذكرة الرقمية الرسمية</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setGpsModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2 rounded bg-[#0f6969] text-white hover:bg-[#0f6969]/90 text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    location_on
                  </span>
                  <span>فتح إحداثيات موقع الاستلام بالخرائط (GPS)</span>
                </button>
              </div>
            </div>
          </section>

          {/* Secondary Upcoming Booking Card (Kia Sportage 2024) */}
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#884e00] text-[20px]">
                  schedule
                </span>
                <h3 className="font-bold text-base text-[#121c28]">
                  الحجز القادم التالي
                </h3>
              </div>
              <span className="font-mono-numeric text-xs text-[#534437]">
                متبقي 14 يوماً على الموعد
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#d9c3b1]/40 flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Car Thumbnail & Metadata */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-44 h-28 rounded-lg overflow-hidden bg-[#dfe9fa] shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={displayedBooking.car.image}
                    alt={displayedBooking.car.name}
                  />
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/90 text-[#884e00] font-mono-numeric text-[10px] font-bold">
                    2024
                  </span>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-[#9ff5c1] text-[#002111] font-mono-numeric text-[10px] font-bold">
                      مؤكد ومحجوز
                    </span>
                    <span className="font-mono-numeric text-xs text-[#884e00] font-bold">
                      كود: {displayedBooking.code}
                    </span>
                    <span className="font-mono-numeric text-[11px] text-[#534437]">
                      لوحة: أ ن ر 3159
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-[#121c28]">
                    كيا سبورتاج 2024 • مشوار إسكندرية نهاية الأسبوع
                  </h4>

                  <div className="flex items-center gap-4 text-[#534437] text-xs flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#0f6969]">
                        store
                      </span>
                      <span>معرض أوتو ستار (سموحة، الإسكندرية)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-[#884e00]">
                        calendar_month
                      </span>
                      <span>1 أغسطس - 3 أغسطس 2025 (3 أيام)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Financials & Quick Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-2 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                <div className="text-right lg:text-left w-full sm:w-auto">
                  <span className="text-[10px] text-[#534437] block">
                    إجمالي الحجز
                  </span>
                  <span className="font-mono-numeric text-xl text-[#884e00] font-bold">
                    {displayedBooking.totalPrice.toLocaleString("ar-EG")}{" "}
                    <span className="text-xs font-normal font-sans">ج.م</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() =>
                      setShowSecondaryDetails(!showSecondaryDetails)
                    }
                    className="px-3 py-1.5 rounded bg-[#eef4ff] text-[#121c28] hover:bg-[#dfe9fa] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {showSecondaryDetails ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                  </button>
                  <button
                    onClick={() =>
                      showToast(
                        "تم إرسال تذكير الموعد وتأكيد الحجز إلى هاتفك المحمول.",
                      )
                    }
                    className="px-3 py-1.5 rounded bg-[#884e00] text-white hover:bg-[#ab6300] text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>تفاصيل الحجز</span>
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_back
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Drawer for Next Booking */}
            {showSecondaryDetails && (
              <div className="bg-[#eef4ff] p-4 rounded-xl border border-[#d9c3b1]/40 flex flex-col gap-2 text-xs text-[#121c28]">
                <div className="flex items-center justify-between pb-1 border-b border-[#d9c3b1]/30">
                  <span className="text-[#534437]">نقطة الاستلام المحددة:</span>
                  <span className="font-bold">
                    فرع سموحة، شارع فوزي معاذ، الإسكندرية
                  </span>
                </div>
                <div className="flex items-center justify-between pb-1 border-b border-[#d9c3b1]/30">
                  <span className="text-[#534437]">
                    الوثائق المطلوبة عند الوصول:
                  </span>
                  <span>بطاقة الرقم القومي + رخصة قيادة مصرية سارية</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#534437]">
                    رقم التواصل المخصص بالمعرض:
                  </span>
                  <span className="font-mono-numeric font-bold text-[#0f6969]">
                    01229988110
                  </span>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* Completed Bookings Tab */}
      {activeTab === "completed" && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[#121c28]">
              سجل الرحلات المكتملة والمستلمة
            </h3>
            <span className="text-xs text-[#056a41] bg-[#9ff5c1]/30 px-2 py-0.5 rounded font-bold">
              جميع الودائع مستردة بنجاح
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {INITIAL_COMPLETED_BOOKINGS.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-[#d9c3b1]/40 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#dfe9fa] shrink-0">
                    <img
                      src={booking.car.image}
                      alt={booking.car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-numeric text-xs font-bold text-[#884e00]">
                        {booking.code}
                      </span>
                      <span className="text-[11px] text-[#056a41] bg-[#9ff5c1]/30 px-2 py-0.5 rounded font-bold">
                        {booking.statusAr}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-[#121c28] mt-1">
                      {booking.car.name}
                    </h4>
                    <p className="text-xs text-[#534437] mt-0.5">
                      {booking.pickupDate} — {booking.returnDate} (
                      {booking.days} أيام)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[#534437] block">
                      المبلغ المسدد
                    </span>
                    <span className="font-mono-numeric font-bold text-base text-[#121c28]">
                      {booking.totalPrice.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      showToast(
                        `تم استرداد مبلغ الوديعة (${booking.deposit.toLocaleString("ar-EG")} ج.م) لحسابك البنكي.`,
                      )
                    }
                    className="px-3 py-1.5 rounded bg-[#eef4ff] text-[#0f6969] text-xs font-bold hover:bg-[#dfe9fa] transition-colors cursor-pointer"
                  >
                    تفاصيل الفحص والوديعة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cancelled Bookings Tab */}
      {activeTab === "cancelled" && (
        <section className="bg-white rounded-xl p-8 text-center border border-[#d9c3b1]/40 flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-4xl text-[#867465]">
            event_busy
          </span>
          <h4 className="font-bold text-base text-[#121c28]">
            لا توجد حجوزات ملغاة
          </h4>
          <p className="text-xs text-[#534437] max-w-sm">
            جميع حجوزاتك على شبكة مشوار موثقة ومؤكدة بنسبة تنفيذ تتجاوز 99.4%
            على الطرق المصرية.
          </p>
        </section>
      )}

      {/* Interactive Customer Support Banner */}
      <section className="bg-[#eef4ff] rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d9c3b1]/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#884e00]/10 text-[#884e00] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">
              headset_mic
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm sm:text-base text-[#121c28]">
              هل تحتاج لمساعدة في استلام السيارة أو تغيير نقطة الوصول؟
            </h4>
            <p className="text-xs text-[#534437] mt-0.5">
              فريق عمليات مشوار متاح على مدار الساعة لمتابعة حركتك وتنسيق
              التوصيل المباشر في جميع محافظات مصر.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <a
            href="tel:19822"
            className="px-4 py-2 rounded bg-white text-[#884e00] border border-[#884e00]/30 hover:bg-[#884e00] hover:text-white font-mono-numeric text-sm font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>19822</span>
          </a>
          <button
            onClick={() =>
              showToast(
                "جاري تحويلك إلى مشرف عمليات مشوار المناوب على المحور السريع...",
              )
            }
            className="px-4 py-2 rounded bg-[#0f6969] hover:bg-[#0f6969]/90 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            محادثة المشرف الفوري
          </button>
        </div>
      </section>
    </div>
  );
};
