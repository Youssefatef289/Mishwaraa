import React, { useState } from 'react';
import { Car, Booking } from '@/src/core/types';
import { ROUTE_OPTIONS } from '@/src/data/mockData';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';
import { HighwayDivider } from '@/src/shared/HighwayDivider';

interface CheckoutScreenProps {
  selectedCar: Car;
  onConfirmBooking: (booking: Booking) => void;
  onBackToHome: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  selectedCar,
  onConfirmBooking,
  onBackToHome,
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState('sahel');
  const [days, setDays] = useState(4);
  const [pickupDate, setPickupDate] = useState('2025-07-18');
  const [pickupTime, setPickupTime] = useState('10:00 ص');
  const [returnDate, setReturnDate] = useState('2025-07-21');
  const [returnTime, setReturnTime] = useState('08:00 م');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const selectedRoute =
    ROUTE_OPTIONS.find((r) => r.id === selectedRouteId) || ROUTE_OPTIONS[0];

  // Dynamic calculations
  const dailyPrice = selectedCar.dailyPrice;
  const rentalSubtotal = dailyPrice * days;
  const insuranceFee = selectedCar.insurancePrice;
  const serviceFee = selectedCar.serviceFee;
  const deposit = selectedCar.deposit;
  const totalPrice = rentalSubtotal + insuranceFee + serviceFee;

  const handleConfirm = () => {
    if (!termsAccepted || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setSuccessMessage(true);
      setTimeout(() => {
        const newBooking: Booking = {
          id: `b-${Math.floor(1000 + Math.random() * 9000)}`,
          code: `MSH-${selectedCar.plateNumbers}`,
          car: selectedCar,
          pickupLocation: 'فرع التجمع الخامس (القاهرة) - شارع التسعين الشمالي',
          dropoffLocation: `${selectedRoute.name} - نقطة تسليم مشوار المعتمدة`,
          pickupDate: 'الخميس 18 يوليو 2025',
          pickupTime: pickupTime,
          returnDate: 'الأحد 21 يوليو 2025',
          returnTime: returnTime,
          days: days,
          distanceKm: selectedRoute.distanceKm,
          dailyPrice: dailyPrice,
          rentalSubtotal: rentalSubtotal,
          insuranceFee: insuranceFee,
          serviceFee: serviceFee,
          deposit: deposit,
          totalPrice: totalPrice,
          status: 'confirmed',
          statusAr: 'مؤكد وجاهز للاستلام',
          officerName: 'كابتن عصام منصور',
          officerPhone: '01098877665',
          officerAvatar:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCJlus0IDjhG5bWPV86KNeaAtk4KVpg54S8ECBRN1Rf8bhUtUfeAg7pNgXY00mzZdL-Eu05hj1Ks12QyPiiiPKl0lqipYvBwG0teYl8op3UsCGTFkxYeI9RVOALA4HlSsavFL4hZyZa15n4ET50k3l0uggUY7GLBs7PnTJq_Tr0X1XAelFjZMjZj3KOz9dYC131HvzikYLh8PNwaUDqkpGvuVwpUjS0Z5ccu6zYSN-eR51O-zilO4xw',
          insurancePolicyNumber: 'POL-EGY-2025-09941-SH',
          createdAt: new Date().toISOString(),
        };

        onConfirmBooking(newBooking);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-100px)]">
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f6969] hover:text-[#884e00] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          <span>الرجوع إلى قائمة أسطول السيارات</span>
        </button>

        <span className="text-xs text-[#534437] font-mono-numeric">
          حجز فوري • بدون وساطة
        </span>
      </div>

      {/* Top Highway Step Progress Indicator (RTL layout) */}
      <section className="w-full bg-white p-4 sm:p-5 rounded-xl shadow-xs mb-6 relative overflow-hidden border border-[#d9c3b1]/40">
        {/* Ambient Highway Dash Track */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 hidden md:block pointer-events-none">
          <div className="w-full border-t-2 border-dashed border-[#884e00]/40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {/* Step 1: Completed */}
          <div className="flex items-center gap-3 bg-[#eef4ff] md:bg-transparent p-3 md:p-0 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[#056a41] text-white flex items-center justify-center shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[20px]">check</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono-numeric text-xs text-[#056a41] font-bold tracking-wider">
                المرحلة 01
              </span>
              <span className="font-bold text-sm text-[#121c28]">بيانات السيارة</span>
            </div>
          </div>

          {/* Step 2: Active Target */}
          <div className="flex items-center gap-3 bg-[#884e00]/10 md:bg-transparent p-3 md:p-0 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[#884e00] text-white flex items-center justify-center shadow-md ring-4 ring-[#884e00]/20 shrink-0 font-mono-numeric font-bold text-sm">
              02
            </div>
            <div className="flex flex-col">
              <span className="font-mono-numeric text-xs text-[#884e00] font-bold tracking-wider">
                المرحلة الحالية
              </span>
              <span className="font-bold text-sm text-[#121c28]">وجهة الرحلة والمدة</span>
            </div>
          </div>

          {/* Step 3: Upcoming */}
          <div className="flex items-center gap-3 opacity-60 bg-[#eef4ff] md:bg-transparent p-3 md:p-0 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-[#dfe9fa] text-[#534437] flex items-center justify-center shrink-0 font-mono-numeric font-bold text-sm">
              03
            </div>
            <div className="flex flex-col">
              <span className="font-mono-numeric text-xs text-[#534437] tracking-wider">
                المرحلة الأخيرة
              </span>
              <span className="text-sm text-[#534437]">الحساب والتأكيد</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Layout: Main Form Flow vs Telematics Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Column: Steps Details (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card Step 1: Selected Car Telematics Summary */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col gap-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-1 border-b border-[#d9c3b1]/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#056a41] animate-pulse" />
                <span className="font-mono-numeric text-xs text-[#056a41] font-bold uppercase">
                  تم اختيار المركبة بنجاح
                </span>
              </div>

              {/* Egyptian License Plate Badge */}
              <EgyptianPlateBadge
                letters={selectedCar.plateLetters}
                numbers={selectedCar.plateNumbers}
                statusText="متاح للحجز"
                statusColor="tertiary"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Car Image Preview */}
              <div className="sm:w-5/12 h-44 rounded-lg overflow-hidden relative shadow-inner bg-[#dfe9fa]">
                <img
                  className="w-full h-full object-cover"
                  src={selectedCar.image}
                  alt={selectedCar.name}
                />
                <div className="absolute bottom-2 right-2 bg-[#121c28]/80 backdrop-blur-md text-white px-2 py-0.5 rounded font-mono-numeric text-xs">
                  موديل {selectedCar.year}
                </div>
              </div>

              {/* Car Specs Details */}
              <div className="sm:w-7/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-lg text-[#121c28]">{selectedCar.name}</h2>
                    <span className="bg-[#884e00]/10 text-[#884e00] px-2 py-0.5 rounded text-xs font-bold">
                      الفئة الفاخرة
                    </span>
                  </div>

                  {/* Verified Dealer Info */}
                  <div className="flex items-start gap-2 mt-2 p-2 rounded bg-[#eef4ff]">
                    <span
                      className="material-symbols-outlined text-[#0f6969] text-[18px] mt-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-[#121c28] font-bold">
                        {selectedCar.dealerName}
                      </span>
                      <span className="text-[11px] text-[#534437]">{selectedCar.location}</span>
                    </div>
                  </div>
                </div>

                {/* Inclusions Pill Grid */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-dashed border-[#d9c3b1]/50 text-xs text-[#534437]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#056a41]">
                      health_and_safety
                    </span>
                    <span>تأمين شامل ضد الغير</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#056a41]">
                      published_with_changes
                    </span>
                    <span>فحص ميكانيكي معتمد</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0f6969]">
                      airline_seat_recline_extra
                    </span>
                    <span>مقاعد جلد مريحة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#0f6969]">
                      ac_unit
                    </span>
                    <span>تكييف هواء مزدوج</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <HighwayDivider />

          {/* Card Step 2: Trip & Destination Inputs */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-1 border-b border-[#d9c3b1]/30">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#884e00] text-white flex items-center justify-center font-mono-numeric text-xs font-bold">
                  02
                </div>
                <h3 className="font-bold text-base text-[#121c28]">
                  تحديد مسار الرحلة والتواريخ
                </h3>
              </div>
              <span className="text-xs text-[#884e00] bg-[#ffdcbf]/50 px-2 py-0.5 rounded font-bold">
                نظام التعقب الكيلومتري
              </span>
            </div>

            {/* Routes Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Departure City */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#121c28] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                    my_location
                  </span>
                  <span>نقطة الانطلاق (مقر المعرض)</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value="القاهرة (التجمع الخامس)"
                    className="w-full h-11 bg-[#eef4ff] px-3 text-[#121c28] text-xs font-bold rounded shadow-inner cursor-not-allowed border border-[#d9c3b1]/40 focus:outline-none"
                  />
                  <span className="absolute left-3 material-symbols-outlined text-[#867465] text-[18px]">
                    lock
                  </span>
                </div>
                <span className="text-[11px] text-[#534437]">
                  الاستلام المباشر من فرع التجمع الخامس
                </span>
              </div>

              {/* Destination City with Egyptian Routes Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#121c28] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#0f6969]">
                    pin_drop
                  </span>
                  <span>الوجهة ومسار السفر</span>
                </label>
                <div className="relative flex items-center">
                  <select
                    value={selectedRouteId}
                    onChange={(e) => setSelectedRouteId(e.target.value)}
                    className="w-full h-11 bg-[#e5efff] px-3 text-[#121c28] text-xs font-bold rounded shadow-xs border border-[#d9c3b1]/60 focus:outline-none focus:ring-2 focus:ring-[#884e00] appearance-none cursor-pointer"
                  >
                    {ROUTE_OPTIONS.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute left-3 pointer-events-none material-symbols-outlined text-[#534437]">
                    expand_more
                  </span>
                </div>
                <span className="text-[11px] text-[#0f6969] font-medium">
                  {selectedRoute.roadName} - مشمول بالدعم
                </span>
              </div>

              {/* Pickup Date & Time */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#121c28] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#056a41]">
                    calendar_today
                  </span>
                  <span>تاريخ وتوقيت الاستلام</span>
                </label>
                <div className="w-full h-11 bg-[#eef4ff] px-3 flex items-center justify-between rounded shadow-xs border border-[#d9c3b1]/40">
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="bg-transparent font-mono-numeric text-xs font-bold text-[#121c28] outline-none"
                  />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="bg-white px-2 py-0.5 rounded text-xs font-mono-numeric text-[#884e00] font-bold border border-[#d9c3b1]/40"
                  >
                    <option value="10:00 ص">10:00 ص</option>
                    <option value="12:00 م">12:00 م</option>
                    <option value="02:00 م">02:00 م</option>
                  </select>
                </div>
              </div>

              {/* Return Date & Time */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-[#121c28] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                    event_available
                  </span>
                  <span>تاريخ وتوقيت الإرجاع</span>
                </label>
                <div className="w-full h-11 bg-[#eef4ff] px-3 flex items-center justify-between rounded shadow-xs border border-[#d9c3b1]/40">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="bg-transparent font-mono-numeric text-xs font-bold text-[#121c28] outline-none"
                  />
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="bg-white px-2 py-0.5 rounded text-xs font-mono-numeric text-[#884e00] font-bold border border-[#d9c3b1]/40"
                  >
                    <option value="08:00 م">08:00 م</option>
                    <option value="10:00 م">10:00 م</option>
                    <option value="06:00 م">06:00 م</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Telematics Calculated Metric Chips */}
            <div className="mt-1 p-3 bg-[#e5efff] rounded-lg grid grid-cols-2 gap-4 border border-[#d9c3b1]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-[#0f6969]/15 text-[#0f6969] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">timer</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#534437] block">المدة المحسوبة</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#121c28]">{days} أيام كاملة</span>
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => setDays(Math.max(1, days - 1))}
                        className="w-5 h-5 rounded bg-white text-xs font-bold flex items-center justify-center text-[#121c28] shadow-xs cursor-pointer hover:bg-[#dfe9fa]"
                        title="إنقاص يوم"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setDays(days + 1)}
                        className="w-5 h-5 rounded bg-white text-xs font-bold flex items-center justify-center text-[#121c28] shadow-xs cursor-pointer hover:bg-[#dfe9fa]"
                        title="زيادة يوم"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-r border-[#d9c3b1]/50 pr-4">
                <div className="w-10 h-10 rounded bg-[#884e00]/15 text-[#884e00] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">speed</span>
                </div>
                <div>
                  <span className="text-[11px] text-[#534437] block">مسافة الطريق التقديرية</span>
                  <span className="font-mono-numeric font-bold text-sm text-[#121c28]">
                    {selectedRoute.distanceKm} كم ذهاب وعودة
                  </span>
                </div>
              </div>
            </div>

            {/* Highway Safety Notice */}
            <div className="flex items-center gap-2 bg-[#9ff5c1]/30 p-2.5 rounded text-[#056a41]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span className="text-xs font-semibold">
                مشمول بالدعم الميداني وتتبع الأعطال عبر بوابات الرسوم السريعة على مدار 24 ساعة.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Digital Dashboard / Odometer Price Readout Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24">
          {/* High-Tech Car Cluster Panel */}
          <div className="bg-[#1E232B] text-white p-5 rounded-xl shadow-xl border-t-4 border-[#c97a1e] flex flex-col gap-4 relative overflow-hidden">
            {/* Subtle Glow Grid Background Accent */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-[#3AA6A6]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#F2A93C]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Instrument Cluster Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3AA6A6] animate-ping" />
                <span className="font-mono-numeric text-xs text-[#3AA6A6] tracking-wider uppercase font-bold">
                  حاسبة العداد الرقمي
                </span>
              </div>
              <span className="font-mono-numeric text-[11px] text-white/50 tracking-wider">
                LIVE READOUT
              </span>
            </div>

            {/* Monospace Odometer Gauges Dual Card */}
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
              {/* Days Meter */}
              <div className="flex flex-col items-center justify-center p-2 bg-[#14171C] rounded">
                <span className="text-[10px] text-white/60 mb-1">عداد الأيام (DAYS)</span>
                <div className="flex items-center gap-1 font-mono-numeric">
                  <span className="bg-[#242A34] text-[#F2A93C] text-xl px-2 py-0.5 rounded tracking-widest font-bold">
                    {String(days).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-white/60 font-sans">أيام</span>
                </div>
              </div>

              {/* Distance Meter */}
              <div className="flex flex-col items-center justify-center p-2 bg-[#14171C] rounded">
                <span className="text-[10px] text-white/60 mb-1">المسافة المقدرة (EST DIST)</span>
                <div className="flex items-center gap-1 font-mono-numeric">
                  <span className="bg-[#242A34] text-[#3AA6A6] text-xl px-2 py-0.5 rounded tracking-widest font-bold">
                    {String(selectedRoute.distanceKm).padStart(4, '0')}
                  </span>
                  <span className="text-xs text-white/60 font-sans">كم</span>
                </div>
              </div>
            </div>

            {/* Itemized Cost Breakdown Matrix */}
            <div className="flex flex-col gap-2.5 text-xs text-white/80">
              <div className="flex items-center justify-between">
                <span>سعر الإيجار اليومي</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono-numeric text-sm font-bold text-white">
                    {dailyPrice.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-[10px]">ج.م</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>المجموع الفرعي للإيجار ({days} أيام)</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono-numeric text-sm font-bold text-white">
                    {rentalSubtotal.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-[10px]">ج.م</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  وثيقة تأمين الطرق السريعة
                  <span className="material-symbols-outlined text-[14px] text-[#3AA6A6]">info</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono-numeric text-sm font-bold text-white">
                    {insuranceFee.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-[10px]">ج.م</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span>رسوم الخدمة وضريبة القيمة المضافة</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono-numeric text-sm font-bold text-white">
                    {serviceFee.toLocaleString('ar-EG')}
                  </span>
                  <span className="text-[10px]">ج.م</span>
                </div>
              </div>

              {/* Refundable Deposit Alert Box */}
              <div className="bg-white/5 p-2 rounded flex items-center justify-between text-xs text-white/90 border border-white/10 mt-1">
                <div className="flex flex-col">
                  <span className="text-white font-semibold">مبلغ التأمين المسترد (Deposit)</span>
                  <span className="text-[10px] text-[#3AA6A6]">يُرد فور فحص السيارة بعد الإرجاع</span>
                </div>
                <div className="flex items-center gap-1 font-mono-numeric font-bold text-white">
                  <span>{deposit.toLocaleString('ar-EG')}</span>
                  <span className="text-[10px] font-sans">ج.م</span>
                </div>
              </div>
            </div>

            {/* Total Price Glowing Readout */}
            <div className="bg-[#14171C] p-4 rounded-xl border border-[#c97a1e]/40 shadow-inner flex flex-col gap-1 text-center relative overflow-hidden">
              <span className="text-[11px] text-white/70 tracking-wider uppercase font-semibold">
                الإجمالي المستحق للدفع عند الاستلام
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-1">
                <span className="font-mono-numeric text-3xl sm:text-4xl text-[#F2A93C] font-bold tracking-tight drop-shadow-[0_2px_8px_rgba(242,169,60,0.35)]">
                  {totalPrice.toLocaleString('ar-EG')}
                </span>
                <span className="text-sm text-[#F2A93C] font-bold">جنيه مصري</span>
              </div>
              <span className="text-[10px] text-white/60">
                شامل ضريبة القيمة المضافة ومصاريف السفر
              </span>
            </div>

            {/* Terms Agreement Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                id="terms-toggle"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#c97a1e] focus:ring-[#c97a1e] accent-[#c97a1e] cursor-pointer"
              />
              <label
                htmlFor="terms-toggle"
                className="text-xs text-white/80 leading-relaxed cursor-pointer select-none"
              >
                أقر بمطابقة رخصة القيادة السارية وموافقتي على شروط الفحص والتسليم الخاصة بالمعرض وتأمين
                الطريق المعتمد.
              </label>
            </div>

            {/* Big Primary CTA Button */}
            <button
              onClick={handleConfirm}
              disabled={!termsAccepted || isSubmitting}
              className={`w-full py-3.5 px-4 rounded-lg font-bold text-sm sm:text-base text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                successMessage
                  ? 'bg-[#056a41]'
                  : isSubmitting
                  ? 'bg-[#ab6300] opacity-90'
                  : termsAccepted
                  ? 'bg-[#c97a1e] hover:bg-[#ab6300] active:scale-98 shadow-[#c97a1e]/20'
                  : 'bg-gray-600 opacity-50 cursor-not-allowed'
              }`}
            >
              {isSubmitting && !successMessage ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>جاري إصدار تصريح الحجز الرقمي...</span>
                </>
              ) : successMessage ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">done_all</span>
                  <span>تم الحجز بنجاح - إصدار التذكرة!</span>
                </>
              ) : (
                <>
                  <span>تأكيد طلب الحجز والدفع عند الاستلام</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </>
              )}
            </button>

            {/* Trust Badges */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-white/80">
                <span className="material-symbols-outlined text-[#056a41] text-[16px]">
                  check_circle
                </span>
                <span>إلغاء مجاني حتى 24 ساعة قبل موعد بدء الرحلة</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-white/80">
                <span className="material-symbols-outlined text-[#3AA6A6] text-[16px]">shield</span>
                <span>ضمان مشوار لحماية العميل والمعرض والتعويض الفوري</span>
              </div>
            </div>
          </div>

          {/* Quick Agency Location Snapshot */}
          <div className="bg-white p-3 rounded-lg shadow-xs border border-[#d9c3b1]/40 flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#eef4ff] flex items-center justify-center text-[#884e00] shrink-0">
              <span className="material-symbols-outlined text-[24px]">storefront</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xs text-[#121c28]">موقع استلام السيارة</span>
              <span className="text-[11px] text-[#534437]">
                محور المشير طنطاوي، بجوار محطة أون رن، القاهرة
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
