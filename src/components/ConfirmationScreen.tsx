import React, { useState } from 'react';
import { Booking } from '../types';
import { EgyptianPlateBadge } from './EgyptianPlateBadge';
import { HighwayDivider } from './HighwayDivider';

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

  const handleAddToCalendar = () => {
    showToast('تمت إضافة مواعيد الاستلام والتسليم لرحلة مشوار إلى تقويم جهازك بنجاح.');
  };

  return (
    <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121c28] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#3aa6a6] flex items-center gap-2 text-xs font-bold animate-bounce">
          <span className="material-symbols-outlined text-[#3aa6a6] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Success Confirmation Banner */}
      <section className="w-full bg-[#2e8358] text-white rounded-xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-[#9ff5c1]/20 blur-2xl pointer-events-none" />
        <div className="absolute right-10 -top-8 w-32 h-32 rounded-full bg-[#a4f0ef]/15 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#056a41] flex items-center justify-center shadow-md shrink-0 ring-4 ring-[#9ff5c1]/30 animate-pulse">
              <span
                className="material-symbols-outlined text-[#9ff5c1] text-[30px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  تم تأكيد حجزك بنجاح! رحلتك جاهزة للانطلاق
                </h1>
                <span className="bg-[#9ff5c1] text-[#002111] font-mono-numeric text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  CONFIRMED
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed">
                تم إرسال نسخة من التذكرة الرقمية وتصريح القيادة إلى رقم الواتساب وبريدك الإلكتروني
                المسجل. رمز التتبع المشترك المعتمد:
                <span className="font-mono-numeric font-bold text-[#9ff5c1] mx-1">
                  {booking.code}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Utility CTAs */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-2 bg-[#056a41] hover:bg-[#056a41]/80 text-white rounded-lg shadow-xs transition-all text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>طباعة التذكرة</span>
            </button>
            <button
              onClick={handleAddToCalendar}
              className="flex items-center gap-1 px-3 py-2 bg-white/15 hover:bg-white/25 text-white rounded-lg transition-all text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>إضافة للتقويم</span>
            </button>
          </div>
        </div>
      </section>

      <HighwayDivider />

      {/* 2. Master Digital Boarding Pass Ticket */}
      <div className="w-full bg-white rounded-xl shadow-md border border-[#d9c3b1]/40 relative overflow-hidden">
        {/* Top Vehicle Identity & Regulatory Barcode Header */}
        <div className="bg-[#dfe9fa] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#d9c3b1]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f6969] text-[22px]">
              directions_car
            </span>
            <span className="font-bold text-sm text-[#121c28]">
              تصريح قيادة وسفر مروري رقمي - صادر ومعتمد
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#534437]">المرجع المشفر:</span>
            <span className="font-mono-numeric text-xs text-[#884e00] font-bold tracking-widest bg-white px-2 py-0.5 rounded border border-[#d9c3b1]/50">
              {booking.code}-TCK
            </span>
          </div>
        </div>

        {/* Ticket Main Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Vehicle Visual & Specs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[11px] text-[#0f6969] font-bold uppercase tracking-wider block">
                    مركبة الكروس أوفر المعتمدة
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#121c28]">
                    {booking.car.name}
                  </h2>
                  <p className="text-xs text-[#534437]">
                    فئة تيربو سمارت بلس | دفع أمامي ديناميكي | لون رمادي فحمي ميتاليك
                  </p>
                </div>

                {/* License Plate Badge */}
                <EgyptianPlateBadge
                  letters={booking.car.plateLetters}
                  numbers={booking.car.plateNumbers}
                  variant="white"
                />
              </div>

              {/* Vehicle Visual Preview */}
              <div className="relative w-full h-52 sm:h-64 rounded-xl overflow-hidden shadow-inner bg-[#dfe9fa] my-1">
                <img
                  className="w-full h-full object-cover"
                  src={booking.car.image}
                  alt={booking.car.name}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                  <span className="material-symbols-outlined text-[#056a41] text-[18px]">
                    gpp_good
                  </span>
                  <span className="text-xs text-[#056a41] font-bold">فحص تليماتكس معتمد 100%</span>
                </div>
                <div className="absolute top-3 left-3 bg-[#121c28]/85 backdrop-blur-md text-white px-2.5 py-0.5 rounded font-mono-numeric text-xs">
                  ODOMETER: 18,420 KM
                </div>
              </div>
            </div>

            {/* Vehicle Technical Cluster Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#eef4ff] p-3 rounded-lg border border-[#d9c3b1]/40">
              <div className="flex items-center gap-2 p-1">
                <span className="material-symbols-outlined text-[#0f6969] text-[20px]">
                  airline_seat_recline_extra
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#534437]">السعة</span>
                  <span className="text-xs font-bold text-[#121c28]">5 مقاعد جلد</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-1">
                <span className="material-symbols-outlined text-[#0f6969] text-[20px]">ac_unit</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#534437]">التكييف</span>
                  <span className="text-xs font-bold text-[#121c28]">تكييف مزدوج</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-1">
                <span className="material-symbols-outlined text-[#0f6969] text-[20px]">speed</span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#534437]">الناقل</span>
                  <span className="text-xs font-bold text-[#121c28]">أوتوماتيك 7 سرعات</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-1">
                <span className="material-symbols-outlined text-[#0f6969] text-[20px]">
                  local_gas_station
                </span>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#534437]">الوقود</span>
                  <span className="text-xs font-bold text-[#121c28]">بنزين 95 ممتاز</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boarding Pass QR Strip & Pick-up Gate Code (5 Cols) */}
          <div className="lg:col-span-5 bg-[#eef4ff] p-5 rounded-xl flex flex-col justify-between items-center text-center relative border border-[#d9c3b1]/40">
            <div className="w-full flex items-center justify-between pb-2 text-[#534437] border-b border-[#d9c3b1]/30">
              <span className="text-xs font-bold">بوابة الاستلام الرقمي السريع</span>
              <span className="flex items-center gap-1 font-mono-numeric text-xs text-[#0f6969] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#0f6969] animate-ping" />
                جاهز للمسح
              </span>
            </div>

            {/* Digital QR Stamp Graphic */}
            <div className="w-full py-4 flex flex-col items-center justify-center">
              <div className="p-3 bg-white rounded-xl shadow-md flex items-center justify-center relative border border-[#d9c3b1]/40">
                {/* Clean Vector SVG QR Code */}
                <svg className="w-36 h-36 text-[#121c28]" fill="currentColor" viewBox="0 0 160 160">
                  <path d="M10 10h40v40h-40zM20 20h20v20h-20zM110 10h40v40h-40zM120 20h20v20h-20zM10 110h40v40h-40zM20 120h20v20h-20z" />
                  <rect height="10" width="10" x="25" y="25" />
                  <rect height="10" width="10" x="125" y="25" />
                  <rect height="10" width="10" x="25" y="125" />
                  <rect height="20" width="10" x="60" y="10" />
                  <rect height="10" width="15" x="80" y="20" />
                  <rect height="10" width="40" x="60" y="40" />
                  <rect height="10" width="30" x="10" y="60" />
                  <rect height="15" width="15" x="50" y="60" />
                  <rect height="10" width="20" x="75" y="60" />
                  <rect height="10" width="40" x="110" y="60" />
                  <rect height="20" width="20" x="20" y="80" />
                  <rect height="15" width="30" x="50" y="85" />
                  <rect height="10" width="20" x="90" y="80" />
                  <rect height="20" width="30" x="120" y="80" />
                  <rect height="20" width="20" x="60" y="110" />
                  <rect height="40" width="10" x="90" y="100" />
                  <rect height="10" width="20" x="110" y="110" />
                  <rect height="30" width="10" x="140" y="110" />
                  <rect height="10" width="30" x="70" y="140" />
                  <rect height="20" width="15" x="120" y="130" />
                </svg>

                {/* Central Key Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-8 h-8 rounded-full bg-[#884e00] flex items-center justify-center text-white shadow-md">
                    <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                  </div>
                </div>
              </div>

              <p className="font-mono-numeric text-xs text-[#534437] mt-3">
                CODE:{' '}
                <span className="text-[#121c28] font-bold">EGY-2025-{booking.code}</span>
              </p>
            </div>

            <div className="w-full bg-[#e5efff] p-3 rounded-lg flex flex-col gap-1 text-right border border-[#d9c3b1]/40">
              <div className="flex items-center gap-1.5 text-[#0f6969]">
                <span className="material-symbols-outlined text-[18px]">electric_bolt</span>
                <span className="text-xs font-bold">تسليم ذكي فوري (دقيقتين):</span>
              </div>
              <p className="text-[11px] text-[#534437] leading-relaxed">
                أظهر هذا الرمز لموظف بوابة مشوار في المعرض. سيتم التحقق إلكترونياً وتفعيل المحرك
                واستلام المفتاح دون عقود ورقية أو انتظار.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Journey Route & Telematics Trajectory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Travel Itinerary (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#d9c3b1]/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#884e00] text-[22px]">
                  alt_route
                </span>
                <h3 className="font-bold text-base text-[#121c28]">
                  مسار الرحلة والمواعيد الرسمية
                </h3>
              </div>
              <span className="font-mono-numeric text-xs bg-[#e5efff] px-2.5 py-1 rounded text-[#0f6969] font-bold">
                {booking.days} أيام سفر كاملة
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative py-4 pr-6 flex flex-col gap-6">
              {/* Dashed Road Line */}
              <div className="absolute right-[22px] top-6 bottom-6 w-0.5 border-r-2 border-dashed border-[#884e00]/40" />

              {/* Departure Milestone */}
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0f6969] flex items-center justify-center text-white shrink-0 shadow-xs z-10">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#0f6969]">محطة الانطلاق والاستلام</span>
                    <span className="font-mono-numeric text-[11px] bg-[#dfe9fa] px-1.5 py-0.5 rounded text-[#121c28]">
                      القاهرة
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#121c28] mt-0.5">
                    معرض الأقصى أوتو - شارع التسعين الشمالي
                  </h4>
                  <p className="text-xs text-[#534437]">
                    بجوار محور محمد بن زايد، التجمع الخامس
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[#884e00]">
                    <span className="material-symbols-outlined text-[16px]">event_available</span>
                    <span className="font-mono-numeric text-xs font-bold">
                      {booking.pickupDate} | {booking.pickupTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Return Milestone */}
              <div className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#884e00] flex items-center justify-center text-white shrink-0 shadow-xs z-10">
                  <span className="material-symbols-outlined text-[20px]">flag</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#884e00]">محطة الوصول والإرجاع</span>
                    <span className="font-mono-numeric text-[11px] bg-[#dfe9fa] px-1.5 py-0.5 rounded text-[#121c28]">
                      الساحل الشمالي
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#121c28] mt-0.5">
                    مقر مشوار للخدمة السريعة
                  </h4>
                  <p className="text-xs text-[#534437]">
                    طريق الإسكندرية - مطروح الساحلي، بوابة 2، مارينا 5
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[#884e00]">
                    <span className="material-symbols-outlined text-[16px]">event_busy</span>
                    <span className="font-mono-numeric text-xs font-bold">
                      {booking.returnDate} | {booking.returnTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telematics Allowance Strip */}
          <div className="mt-4 pt-3 bg-[#eef4ff] p-3 rounded-lg flex flex-wrap items-center justify-between gap-2 border border-[#d9c3b1]/40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0f6969] text-[22px]">radar</span>
              <div>
                <span className="text-xs font-bold text-[#121c28]">
                  الكيلومترات المضمنة للرحلة
                </span>
                <p className="text-[11px] text-[#534437]">200 كم مجانية لكل يوم عبر شبكة المحاور</p>
              </div>
            </div>
            <div className="text-left font-mono-numeric text-lg font-bold text-[#121c28]">
              {booking.car.routeAllowanceKm || 800}{' '}
              <span className="text-xs text-[#534437] font-sans">كم إجمالي</span>
            </div>
          </div>
        </div>

        {/* Certified Host & Officer Contact Card (1 Col) */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0f6969]">شريك مشوار الذهبي المعتمد</span>
              <div className="flex items-center text-[#884e00]">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-[#d9c3b1] bg-[#dfe9fa]">
                <img
                  className="w-full h-full object-cover"
                  src={booking.officerAvatar}
                  alt={booking.officerName}
                />
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-sm text-[#121c28]">{booking.officerName}</h4>
                <span className="text-[11px] text-[#534437]">مدير تسليم معرض الأقصى أوتو</span>
                <span className="font-mono-numeric text-[11px] text-[#056a41] font-bold">
                  سجل تجاري: #8491-EG
                </span>
              </div>
            </div>

            <p className="text-xs text-[#534437] bg-[#eef4ff] p-3 rounded-lg leading-relaxed border border-[#d9c3b1]/30">
              "سيارتكم خضعت للغسيل والتعقيم وفحص ضغط الإطارات وأنظمة التبريد استعداداً لطريق السفر
              الصحراوي."
            </p>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <a
              href={`tel:${booking.officerPhone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0f6969] text-white rounded-lg text-xs font-bold shadow-xs hover:opacity-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">call</span>
              <span className="font-mono-numeric">{booking.officerPhone}</span>
              <span className="text-[10px] opacity-80">(اتصال مباشر)</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/2${booking.officerPhone}?text=تأكيد حجز مشوار كود ${booking.code}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 bg-[#056a41] text-white rounded-lg text-xs font-bold hover:bg-[#056a41]/90 transition-all text-center"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>واتساب</span>
              </a>
              <button
                onClick={() =>
                  showToast(
                    'جاري تشغيل خريطة Google للتوجه إلى إحداثيات فرع التسعين الشمالي: 30.0245° N, 31.4721° E'
                  )
                }
                className="flex items-center justify-center gap-1.5 py-2 bg-[#dfe9fa] text-[#121c28] rounded-lg text-xs font-bold hover:bg-[#d9e3f4] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">near_me</span>
                <span>موقع GPS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Comprehensive Zero-Deductible Insurance Policy */}
      <div className="w-full bg-white rounded-xl p-5 shadow-xs border border-[#d9c3b1]/40 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#056a41]/15 text-[#056a41] flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield_with_heart
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-[#121c28]">
                وثيقة التأمين الشامل للطرق السريعة (تغطية 100%)
              </h4>
              <span className="font-mono-numeric text-xs bg-[#9ff5c1] text-[#002111] font-bold px-2 py-0.5 rounded">
                نسبة تحمل 0% (Zero Deductible)
              </span>
            </div>
            <p className="text-xs text-[#534437] max-w-xl leading-relaxed">
              المركبة مؤمنة بالكامل ضد حوادث التصادم والأضرار الجانبية والسرقة. تشمل تغطية إطارات وزجاج
              مجانية معتمدة من هيئة الرقابة المالية.
            </p>
            <div className="font-mono-numeric text-xs text-[#0f6969] font-bold">
              رقم الوثيقة الرسمية: {booking.insurancePolicyNumber}
            </div>
          </div>
        </div>

        <div className="bg-[#eef4ff] px-4 py-2.5 rounded-xl flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-start border border-[#d9c3b1]/40">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#534437] font-bold">طوارئ الطرق ونش 24/7</span>
            <span className="font-mono-numeric text-lg font-bold text-[#884e00]">19822</span>
          </div>
          <a
            href="tel:19822"
            className="w-10 h-10 rounded-full bg-[#884e00] text-white flex items-center justify-center shadow-xs hover:opacity-90 transition-all"
            title="اتصال طوارئ"
          >
            <span className="material-symbols-outlined text-[20px]">sos</span>
          </a>
        </div>
      </div>

      {/* 5. Financial Matrix & Security Deposit Breakdown */}
      <div className="w-full bg-white rounded-xl p-5 shadow-xs border border-[#d9c3b1]/40">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9c3b1]/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f6969] text-[22px]">
              receipt_long
            </span>
            <h3 className="font-bold text-base text-[#121c28]">بيان الحساب والرسوم المدفوعة</h3>
          </div>
          <span className="font-mono-numeric text-xs bg-[#9ff5c1] text-[#002111] px-2.5 py-1 rounded font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            مدفوع بالكامل عند الاستلام
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-3">
          <div className="bg-[#eef4ff] p-4 rounded-xl flex flex-col justify-between border border-[#d9c3b1]/30">
            <span className="text-xs text-[#534437]">
              إيجار المركبة ({booking.days} أيام × {booking.dailyPrice.toLocaleString('ar-EG')} ج.م)
            </span>
            <div className="font-mono-numeric text-lg font-bold text-[#121c28] mt-2">
              {booking.rentalSubtotal.toLocaleString('ar-EG')}{' '}
              <span className="text-xs text-[#534437] font-sans">ج.م</span>
            </div>
          </div>

          <div className="bg-[#eef4ff] p-4 rounded-xl flex flex-col justify-between border border-[#d9c3b1]/30">
            <span className="text-xs text-[#534437]">التأمين الشامل وضريبة الخدمة</span>
            <div className="font-mono-numeric text-lg font-bold text-[#121c28] mt-2">
              {(booking.insuranceFee + booking.serviceFee).toLocaleString('ar-EG')}{' '}
              <span className="text-xs text-[#534437] font-sans">ج.م</span>
            </div>
          </div>

          <div className="bg-[#884e00]/10 p-4 rounded-xl flex flex-col justify-between border border-[#884e00]/20">
            <span className="text-xs text-[#884e00] font-bold">إجمالي المبلغ المسدد الآن</span>
            <div className="font-mono-numeric text-xl font-bold text-[#884e00] mt-2">
              {booking.totalPrice.toLocaleString('ar-EG')}{' '}
              <span className="text-xs text-[#884e00] font-sans">ج.م</span>
            </div>
          </div>

          <div className="bg-[#0f6969]/10 p-4 rounded-xl flex flex-col justify-between border border-[#0f6969]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#0f6969] font-bold">الوديعة الرقمية المعلقة</span>
              <span className="material-symbols-outlined text-[#0f6969] text-[18px]">lock</span>
            </div>
            <div>
              <div className="font-mono-numeric text-xl font-bold text-[#0f6969] mt-2">
                {booking.deposit.toLocaleString('ar-EG')}{' '}
                <span className="text-xs text-[#0f6969] font-sans">ج.م</span>
              </div>
              <span className="text-[10px] text-[#534437] block mt-0.5">
                تسترد تلقائياً خلال 24 ساعة فور الفحص
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Next Steps Workflow & CTAs */}
      <div className="w-full bg-[#dfe9fa] p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d9c3b1]/50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#884e00] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[24px]">car_rental</span>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-sm text-[#121c28]">ما هي خطوتك التالية؟</h4>
            <p className="text-xs text-[#534437]">
              يمكنك متابعة عداد الرحلة الحي وتحديثات الطريق وتفويضات المرور عبر لوحة حجوزاتي.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <button
            onClick={onNavigateToBookings}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#884e00] hover:bg-[#ab6300] text-white rounded-lg text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>الانتقال إلى حجوزاتي</span>
          </button>
          <button
            onClick={onNavigateToHome}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-[#eef4ff] text-[#121c28] border border-[#d9c3b1] rounded-lg text-sm font-bold transition-all cursor-pointer"
          >
            <span>العودة للرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
