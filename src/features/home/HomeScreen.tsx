import React, { useState } from "react";
import { Car } from '@/src/core/types';
import { MOCK_CARS } from '@/src/data/mockData';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';
import { HighwayDivider } from '@/src/shared/HighwayDivider';

interface HomeScreenProps {
  carsOverride?: Car[];
  dbConnected?: boolean;
  onSelectCar: (car: Car) => void;
  onNavigateToDealer: () => void;
  onOpenRegisterDealerModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  carsOverride,
  dbConnected = false,
  onSelectCar,
  onNavigateToDealer,
  onOpenRegisterDealerModal,
}) => {
  const [selectedCity, setSelectedCity] = useState("cairo");
  const [pickupDate, setPickupDate] = useState("2025-07-18");
  const [returnDate, setReturnDate] = useState("2025-07-21");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredCars = (carsOverride?.length ? carsOverride : MOCK_CARS).filter(
    (c) => {
      if (categoryFilter === "all") return true;
      return c.category === categoryFilter;
    },
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const el = document.getElementById("featured-fleet");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[960px] mx-auto px-4 sm:px-6 py-6">
      {/* 1. Hero Highway Banner Strip */}
      <div className="relative w-full overflow-hidden rounded-xl bg-[#ffffff] p-5 sm:p-8 shadow-xs mb-6 border border-[#d9c3b1]/40">
        <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#884e00]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#0f6969]/10 blur-3xl pointer-events-none" />

        {/* Editorial Tag */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef4ff] text-[#534437] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#056a41] animate-pulse" />
            <span>منصة الإيجار المعتمدة رسمياً في مصر</span>
            {dbConnected && <span className="text-[#056a41]">متصل</span>}
          </div>
          <div className="font-mono-numeric text-xs text-[#867465] tracking-wider font-bold">
            EG-HIGHWAY // 2025
          </div>
        </div>

        {/* Main Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl text-[#121c28] font-black leading-tight tracking-tight">
              مشوارك يبدأ بسيارة تثق فيها —{" "}
              <span className="text-[#ab6300] relative inline-block underline decoration-[#884e00]/30 underline-offset-4">
                مباشرة من أفضل معارض مصر
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#534437] leading-relaxed max-w-xl">
              نربطك فوراً بأوثق معارض السيارات المعتمدة في القاهرة، الإسكندرية،
              الساحل الشمالي، والغردقة. استلم سيارتك بتقرير فحص رقمي دقيق وتأمين
              شامل يغطي أدق تفاصيل مسارك.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#featured-fleet"
                className="inline-flex items-center gap-2 bg-[#884e00] hover:bg-[#ab6300] text-white font-bold text-sm sm:text-base px-6 py-3 rounded-lg shadow-md transition-all active:translate-y-0.5"
              >
                <span>تصفح السيارات الآن</span>
                <span className="material-symbols-outlined text-[18px]">
                  arrow_back
                </span>
              </a>
              <button
                onClick={onOpenRegisterDealerModal}
                className="inline-flex items-center gap-2 bg-[#ffffff] hover:bg-[#eef4ff] text-[#0f6969] border border-[#0f6969] font-bold text-sm sm:text-base px-5 py-3 rounded-lg shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  car_rental
                </span>
                <span>سجّل معرضك معنا</span>
              </button>
            </div>

            {/* Telematics Stat Bar */}
            <div className="grid grid-cols-3 gap-2.5 pt-3">
              <div className="p-2.5 bg-[#eef4ff] rounded-lg border border-[#d9c3b1]/40">
                <div className="font-mono-numeric text-base sm:text-lg text-[#884e00] font-bold">
                  15,000+
                </div>
                <div className="text-[11px] text-[#534437]">رحلة ناجحة</div>
              </div>
              <div className="p-2.5 bg-[#eef4ff] rounded-lg border border-[#d9c3b1]/40">
                <div className="font-mono-numeric text-base sm:text-lg text-[#0f6969] font-bold">
                  350+
                </div>
                <div className="text-[11px] text-[#534437]">معرض معتمد</div>
              </div>
              <div className="p-2.5 bg-[#eef4ff] rounded-lg border border-[#d9c3b1]/40">
                <div className="font-mono-numeric text-base sm:text-lg text-[#056a41] font-bold">
                  4.9 / 5.0
                </div>
                <div className="text-[11px] text-[#534437]">
                  تقييم المسافرين
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative overflow-hidden rounded-xl shadow-lg bg-[#dfe9fa] h-[300px] sm:h-[340px] border border-[#d9c3b1]/50">
              <img
                className="w-full h-full object-cover"
                alt="New Alamein coastal highway driving experience"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9PA3q6QcYuprjKbhshCO96zoVnaYZzJXoMBjJ8WweRYq4ao15O71qNEy-vThgwKxkzdnZuETqZakR8zBMv0mN3IGbXy6Ehpvor50IoITrGfUJbvN7YajOR3lWdbaeIksbTOBaorYOCu0HMKKFc4ZDTaV9k4_-cDfkzHtMP1Wa3A7NSWwA4BLaK9IbvoM2foUHi517JO2Yz1seyeVTfj9hY1ec5wRzmiMJYCtSs-wsH8_rm933sYtr"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121c28]/85 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <span className="text-[11px] text-white/80 block">
                      الوجهة الأكثر طلباً اليوم
                    </span>
                    <p className="font-bold text-base">طريق الساحل الدولي</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-2.5 py-1 rounded font-mono-numeric text-xs font-bold text-white border border-white/20">
                    KM 120.4 LIVE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Quick Search & Trip Filter Bar */}
        <div className="mt-6 bg-[#eef4ff] p-3 sm:p-4 rounded-xl shadow-xs border border-[#d9c3b1]/50">
          <div className="flex items-center gap-1.5 mb-2 text-[#534437] text-xs font-semibold">
            <span className="material-symbols-outlined text-[#884e00] text-[18px]">
              commute
            </span>
            <span>حدد تفاصيل مسارك للبحث المباشر</span>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3"
          >
            {/* City Selector */}
            <div className="lg:col-span-3 flex flex-col bg-white p-2 rounded-lg border border-[#d9c3b1]/40 shadow-xs">
              <label className="text-[11px] text-[#534437] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0f6969]">
                  location_on
                </span>
                مدينة الاستلام
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-[#121c28] outline-none py-1 cursor-pointer"
              >
                <option value="cairo">القاهرة الكبرى</option>
                <option value="giza">الجيزة والشيخ زايد</option>
                <option value="alex">الإسكندرية (سموحة / الكورنيش)</option>
                <option value="northcoast">الساحل الشمالي والعلمين</option>
                <option value="hurghada">الغردقة والجونة</option>
                <option value="sharm">شرم الشيخ</option>
              </select>
            </div>

            {/* Pickup Date */}
            <div className="lg:col-span-2 flex flex-col bg-white p-2 rounded-lg border border-[#d9c3b1]/40 shadow-xs">
              <label className="text-[11px] text-[#534437] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0f6969]">
                  calendar_today
                </span>
                تاريخ الاستلام
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full bg-transparent font-mono-numeric text-xs font-bold text-[#121c28] outline-none py-1"
              />
            </div>

            {/* Return Date */}
            <div className="lg:col-span-2 flex flex-col bg-white p-2 rounded-lg border border-[#d9c3b1]/40 shadow-xs">
              <label className="text-[11px] text-[#534437] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0f6969]">
                  event_repeat
                </span>
                تاريخ الإرجاع
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full bg-transparent font-mono-numeric text-xs font-bold text-[#121c28] outline-none py-1"
              />
            </div>

            {/* Vehicle Category */}
            <div className="lg:col-span-3 flex flex-col bg-white p-2 rounded-lg border border-[#d9c3b1]/40 shadow-xs">
              <label className="text-[11px] text-[#534437] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#0f6969]">
                  directions_car
                </span>
                فئة المركبة
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-[#121c28] outline-none py-1 cursor-pointer"
              >
                <option value="all">كل الفئات المتوفرة</option>
                <option value="suv">SUV عائلية</option>
                <option value="sedan">سيدان مريحة</option>
                <option value="4x4">دفع رباعي وسفاري</option>
                <option value="economy">اقتصادية وعملية</option>
              </select>
            </div>

            {/* Search Submit Button */}
            <div className="lg:col-span-2 flex items-end">
              <button
                type="submit"
                className="w-full h-full min-h-[46px] bg-[#ab6300] hover:bg-[#884e00] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
                <span>بحث متاح</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <HighwayDivider />

      {/* 3. How It Works Section (Roadmap 01-03) */}
      <section className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <span className="font-mono-numeric text-xs text-[#0f6969] bg-[#a4f0ef]/50 px-2 py-0.5 rounded font-bold">
              ROADMAP 01-03
            </span>
            <h2 className="text-2xl font-bold text-[#121c28] mt-1">
              كيف يعمل مشوار؟
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#534437] max-w-md">
            خطوات حجز واضحة ومباشرة بدون تعقيد، مستوحاة من انسيابية وسرعة الطرق
            السريعة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e5efff] flex items-center justify-center text-[#884e00]">
                <span className="material-symbols-outlined text-[22px]">
                  car_tag
                </span>
              </div>
              <span className="font-mono-numeric text-3xl text-[#884e00]/25 font-black">
                01
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#121c28] mb-1.5">
                اختر سيارتك ومعرضك
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                استعرض أساطيل معارض موثقة بمواصفات حقيقية وسعر يومي محدد دون
                وساطة مجهولة أو تغيير للأسعار عند المعاينة.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#d9c3b1]/30 text-[11px] font-bold text-[#0f6969] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                check_circle
              </span>
              <span>فحص 24 نقطة ميكانيكية</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e5efff] flex items-center justify-center text-[#884e00]">
                <span className="material-symbols-outlined text-[22px]">
                  speed
                </span>
              </div>
              <span className="font-mono-numeric text-3xl text-[#884e00]/25 font-black">
                02
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#121c28] mb-1.5">
                حدد المسار وباقة الكيلومتر
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                حجز شفاف يوضح تكلفة المسافة، وثيقة التأمين الشامل، ومقدار
                الكيلومترات اليومية الممنوحة بدون شروط غامضة.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#d9c3b1]/30 text-[11px] font-bold text-[#0f6969] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                check_circle
              </span>
              <span>احتساب فوري للعقد المالي</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#e5efff] flex items-center justify-center text-[#884e00]">
                <span className="material-symbols-outlined text-[22px]">
                  key
                </span>
              </div>
              <span className="font-mono-numeric text-3xl text-[#884e00]/25 font-black">
                03
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-[#121c28] mb-1.5">
                استلم فوراً برقم اللوحة
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                كود حجز رسمي وموثق، ومحضر فحص رقمي بصور حية لحالة الهيكل قبل
                انطلاقك مباشرة من بوابة المعرض.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-[#d9c3b1]/30 text-[11px] font-bold text-[#0f6969] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                check_circle
              </span>
              <span>استلام في أقل من 10 دقائق</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Standards & Highway Safety Matrix */}
      <section className="mb-10">
        <div className="bg-[#eef4ff] p-5 sm:p-6 rounded-xl border border-[#d9c3b1]/40">
          <div className="mb-4">
            <span className="font-mono-numeric text-xs text-[#884e00] font-bold uppercase tracking-wider">
              STANDARDS &amp; WARRANTY
            </span>
            <h2 className="text-xl font-bold text-[#121c28] mt-1">
              معايير الأمان على الطريق السريع
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-xs border border-[#d9c3b1]/30 flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded bg-[#2e8358]/15 text-[#056a41] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  verified_user
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#121c28]">
                تأمين شامل بدون قلق
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                معتمد ضد الحوادث والسرقة مع نسبة تحمل واضحة ومحددة مسبقاً في
                عقدك الإلكتروني.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-xs border border-[#d9c3b1]/30 flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded bg-[#a4f0ef]/50 text-[#0f6969] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  build_circle
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#121c28]">
                أسطول مفحوص بدقة
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                معاينة دورية للإطارات والمكابح وتكييف الهواء وكفاءة المحرك لضمان
                راحة كاملة.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-xs border border-[#d9c3b1]/30 flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded bg-[#ffdcbf] text-[#884e00] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  support_agent
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#121c28]">
                دعم طريق 24/7
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                فريق طوارئ ومساعدة على جميع المحاور السريعة (الصحراوي، الإقليمي،
                والساحلي).
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-xs border border-[#d9c3b1]/30 flex flex-col gap-1.5">
              <div className="w-8 h-8 rounded bg-[#e5efff] text-[#121c28] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  receipt_long
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#121c28]">
                تسعير رقمي شفاف
              </h3>
              <p className="text-xs text-[#534437] leading-relaxed">
                لا توجد رسوم خفية أو إكراميات مفروضة. السعر المحسوب هو القيمة
                النهائية للاستلام.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HighwayDivider />

      {/* 5. Verified Fleet Showcase Section */}
      <section
        className="flex flex-col gap-4 mb-10 scroll-mt-24"
        id="featured-fleet"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="font-mono-numeric text-xs text-[#0f6969] uppercase bg-[#a4f0ef]/50 px-2 py-0.5 rounded font-bold">
              VERIFIED FLEET
            </span>
            <h2 className="text-2xl font-bold text-[#121c28] mt-1">
              سيارات مميزة جاهزة للانطلاق
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#534437]">
            <span>تحديث فوري لمدن مصر</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#056a41] animate-pulse" />
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl overflow-hidden shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div className="p-4 pb-0 flex flex-col gap-2">
                {/* Plate Badge Header */}
                <div className="flex items-center justify-between">
                  <EgyptianPlateBadge
                    letters={car.plateLetters}
                    numbers={car.plateNumbers}
                    statusText={car.statusAr}
                    statusColor={
                      car.status === "available" ? "tertiary" : "primary"
                    }
                  />
                  <span className="text-xs font-bold text-[#0f6969] bg-[#a4f0ef]/30 px-2 py-0.5 rounded">
                    {car.dealerName}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div>
                    <h3 className="font-bold text-lg text-[#121c28]">
                      {car.name}
                    </h3>
                    <p className="text-xs text-[#534437] flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[14px] text-[#867465]">
                        location_on
                      </span>
                      {car.location}
                    </p>
                  </div>
                  <span className="text-xs text-[#534437] bg-[#eef4ff] px-2 py-0.5 rounded font-medium">
                    {car.categoryAr}
                  </span>
                </div>

                {/* Car Image Preview */}
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-[#dfe9fa] my-1">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#121c28]/85 text-white px-2 py-0.5 rounded font-mono-numeric text-[11px]">
                    عداد {car.year}
                  </div>
                  {car.isFeatured && (
                    <div className="absolute top-2 right-2 bg-[#884e00] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
                      الأكثر طلباً
                    </div>
                  )}
                </div>

                {/* Spec Badges Strip */}
                <div className="grid grid-cols-4 gap-1 py-1.5 text-center text-xs text-[#534437] bg-[#eef4ff] rounded-lg">
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                      speed
                    </span>
                    <span className="text-[11px] mt-0.5">{car.mileage}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                      auto_transmission
                    </span>
                    <span className="text-[11px] mt-0.5 truncate max-w-[70px]">
                      {car.transmission}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                      airline_seat_recline_normal
                    </span>
                    <span className="text-[11px] mt-0.5">
                      {car.seats} مقاعد
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="material-symbols-outlined text-[16px] text-[#884e00]">
                      local_gas_station
                    </span>
                    <span className="text-[11px] mt-0.5">{car.fuel}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="p-4 pt-3 bg-white flex items-center justify-between border-t border-[#d9c3b1]/20 mt-2">
                <div>
                  <span className="text-[11px] text-[#534437] block">
                    سعر الإيجار اليومي
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-mono-numeric text-xl text-[#884e00] font-bold">
                      {car.dailyPrice.toLocaleString("ar-EG")}
                    </span>
                    <span className="text-xs text-[#121c28] font-bold">
                      ج.م / يوم
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCar(car)}
                  className="bg-[#884e00] hover:bg-[#ab6300] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <span>احجز الآن</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_back
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HighwayDivider />

      {/* 6. Trust & Quality Assurance Metric Section */}
      <section className="bg-white p-5 sm:p-7 rounded-xl shadow-xs border border-[#d9c3b1]/40 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 flex flex-col gap-2.5">
            <span className="font-mono-numeric text-xs text-[#884e00] font-bold uppercase tracking-wider">
              SAFETY FIRST
            </span>
            <h2 className="text-2xl font-bold text-[#121c28]">
              لماذا مشوار هو خيارك الأوثق؟
            </h2>
            <p className="text-xs sm:text-sm text-[#534437] leading-relaxed">
              سوق تأجير السيارات في مصر اعتاد على المفاجآت، ولكن في مشوار صممنا
              المنصة لتكون كأجهزة القياس الدقيقة في لوحة سيارتك: لا غموض، لا
              مصاريف إضافية عند الاستلام، ولا تأخير في تسليم الودائع.
            </p>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#121c28]">
                <span className="material-symbols-outlined text-[#056a41] text-[18px]">
                  check_circle
                </span>
                <span>
                  عقود إلكترونية رسمية متوافقة مع القوانين واللوائح المرورية
                  المصرية.
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#121c28]">
                <span className="material-symbols-outlined text-[#056a41] text-[18px]">
                  check_circle
                </span>
                <span>
                  استرداد مبلغ التأمين النقدي فور تسليم السيارة بدون مماطلة.
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#121c28]">
                <span className="material-symbols-outlined text-[#056a41] text-[18px]">
                  check_circle
                </span>
                <span>
                  صور ومعاينات 360 درجة لحالة السيارة قبل تحركها من ساحة المعرض.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-[#eef4ff] p-5 rounded-xl border border-[#d9c3b1]/40 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#d9c3b1]/40">
                <span className="font-bold text-sm text-[#121c28]">
                  مؤشر الجودة الميداني
                </span>
                <span className="font-mono-numeric text-xs text-[#056a41] bg-[#2e8358]/15 px-2 py-0.5 rounded font-bold">
                  99.4% التزام
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#534437]">
                      تطابق السيارة المستلمة مع المعروض
                    </span>
                    <span className="font-mono-numeric font-bold text-[#121c28]">
                      99.8%
                    </span>
                  </div>
                  <div className="w-full bg-[#dfe9fa] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#884e00] h-full rounded-full"
                      style={{ width: "99.8%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#534437]">
                      سرعة التسليم الفوري (أقل من 15 دقيقة)
                    </span>
                    <span className="font-mono-numeric font-bold text-[#121c28]">
                      96.2%
                    </span>
                  </div>
                  <div className="w-full bg-[#dfe9fa] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0f6969] h-full rounded-full"
                      style={{ width: "96.2%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#534437]">
                      استرداد التأمين خلال 24 ساعة كحد أقصى
                    </span>
                    <span className="font-mono-numeric font-bold text-[#121c28]">
                      98.9%
                    </span>
                  </div>
                  <div className="w-full bg-[#dfe9fa] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#056a41] h-full rounded-full"
                      style={{ width: "98.9%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Dealer Onboarding Banner (Dark Asphalt Theme) */}
      <section className="relative overflow-hidden rounded-xl bg-[#27313e] text-[#eaf1ff] p-6 sm:p-8 shadow-md mb-6">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-col gap-2">
            <div className="inline-flex items-center gap-1.5 bg-[#884e00]/25 text-[#ffb873] px-3 py-1 rounded w-fit text-xs font-bold font-mono-numeric">
              <span className="material-symbols-outlined text-[16px]">
                storefront
              </span>
              <span>شركاء المعارض والأسطول</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              هل تمتلك معرض سيارات أو أسطول تأجير في مصر؟
            </h2>
            <p className="text-xs sm:text-sm text-[#eaf1ff]/80 leading-relaxed max-w-xl">
              انضم لأكثر من 350 معرض معتمد. احصل على لوحة تحكم سحابية لإدارة
              الحجوزات، تحصيل المدفوعات فورياً، وفحص المركبات برمجياً لرفع نسبة
              تشغيل أسطولك لأكثر من 85%.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1 text-[#eaf1ff]/90">
                <span className="material-symbols-outlined text-[#ffb873] text-[16px]">
                  check
                </span>
                <span>بدون رسوم تسجيل أولية</span>
              </div>
              <div className="flex items-center gap-1 text-[#eaf1ff]/90">
                <span className="material-symbols-outlined text-[#ffb873] text-[16px]">
                  check
                </span>
                <span>عقود رقمية ملزمة</span>
              </div>
              <div className="flex items-center gap-1 text-[#eaf1ff]/90">
                <span className="material-symbols-outlined text-[#ffb873] text-[16px]">
                  check
                </span>
                <span>تحصيل كاش أو بنكي فوري</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2.5 items-start lg:items-end">
            <button
              onClick={onOpenRegisterDealerModal}
              className="w-full sm:w-auto bg-[#884e00] hover:bg-[#ab6300] text-white font-bold text-sm px-6 py-3 rounded-lg text-center shadow-md transition-all active:scale-98 cursor-pointer"
            >
              سجّل أسطولك مجاناً
            </button>
            <button
              onClick={onNavigateToDealer}
              className="text-xs text-[#ffb873] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>معاينة لوحة تحكم المعارض المباشرة</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_back
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
