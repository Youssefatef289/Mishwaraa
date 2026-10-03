import React, { useState } from "react";
import { Car } from "@/src/core/types";
import { EgyptianPlateBadge } from "@/src/shared/EgyptianPlateBadge";
import { MOCK_CARS } from "@/src/data/mockData";

interface HomeScreenProps {
  carsOverride?: Car[];
  dbConnected?: boolean;
  onSelectCar: (car: Car) => void;
  onOpenBookingModal: (car: Car) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  carsOverride,
  dbConnected = false,
  onSelectCar,
  onOpenBookingModal,
}) => {
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
  const cars = carsOverride ?? (isDemoMode ? MOCK_CARS : []);
  const availableCars = cars.filter((c) => c.status === "available");

  const categories = [
    { id: "all", name: "الكل", icon: "directions_car" },
    { id: "sedan", name: "سيدان", icon: "car_repair" },
    { id: "suv", name: "عائلية SUV", icon: "rv_hookup" },
    { id: "luxury", name: "فاخرة", icon: "workspace_premium" },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-24 md:pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#121c28] to-[#1a293b] pt-24 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#b7791f]/10 blur-[120px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#2c7a7b]/20 blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            مشوارك يبدأ من هنا
            <span className="block text-[#b7791f] mt-2">بكل سهولة وأمان</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            اكتشف مجموعة واسعة من السيارات للإيجار بأسعار تنافسية. احجز سيارتك
            المثالية الآن واستمتع برحلتك القادمة.
          </p>

          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#b7791f]/50 transition-colors">
              <span className="material-symbols-outlined text-[#2c7a7b]">
                location_on
              </span>
              <input
                type="text"
                placeholder="مدينة الاستلام"
                className="bg-transparent border-none outline-none w-full text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#b7791f]/50 transition-colors">
              <span className="material-symbols-outlined text-[#2c7a7b]">
                calendar_month
              </span>
              <input
                type="text"
                placeholder="تاريخ الاستلام"
                className="bg-transparent border-none outline-none w-full text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-normal"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>
            <div className="flex-1 w-full flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#b7791f]/50 transition-colors">
              <span className="material-symbols-outlined text-[#2c7a7b]">
                event
              </span>
              <input
                type="text"
                placeholder="تاريخ التسليم"
                className="bg-transparent border-none outline-none w-full text-gray-900 font-bold placeholder:text-gray-400 placeholder:font-normal"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>
            <button className="w-full md:w-auto px-8 py-4 bg-[#b7791f] text-white font-bold rounded-xl shadow-lg shadow-[#b7791f]/30 hover:bg-[#d69e2e] hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">search</span>
              بحث
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        {/* Categories Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex gap-2 overflow-x-auto no-scrollbar mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all flex-1 justify-center ${
                activeCategory === cat.id
                  ? "bg-[#121c28] text-white shadow-md font-bold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {cat.icon}
              </span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-gray-900">أحدث السيارات</h2>
            <p className="text-sm text-gray-500 mt-1">
              تشكيلة مختارة من أفضل السيارات المتاحة حالياً
            </p>
          </div>
          <button className="text-sm font-bold text-[#2c7a7b] hover:text-[#234e52] flex items-center gap-1 transition-colors">
            عرض الكل
            <span className="material-symbols-outlined text-[18px] rtl:rotate-180">
              arrow_forward
            </span>
          </button>
        </div>

        {availableCars.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-gray-300">
                no_crash
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              لا توجد سيارات متاحة حالياً
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              عذراً، لا يوجد سيارات متوفرة في قاعدة البيانات تطابق بحثك أو لم
              يتم إضافة سيارات بعد.
            </p>
            {isDemoMode && (
              <button className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl">
                إلغاء الفلاتر
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableCars.map((car) => (
              <div
                key={car.id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => onSelectCar(car)}
              >
                {/* Car Image Container */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {car.isFeatured && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#b7791f] to-[#d69e2e] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">
                        star
                      </span>
                      مميز
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3">
                    <EgyptianPlateBadge
                      letters={car.plateLetters}
                      numbers={car.plateNumbers}
                    />
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md shrink-0">
                      <span className="material-symbols-outlined text-[14px]">
                        calendar_today
                      </span>
                      {car.year}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      storefront
                    </span>
                    {car.dealerName}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-6">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">
                        speed
                      </span>
                      {car.transmission}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">
                        local_gas_station
                      </span>
                      {car.fuel}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#2c7a7b]">
                        {car.dailyPrice}
                      </span>
                      <span className="text-xs font-bold text-gray-500 mr-1">
                        ج.م / يوم
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBookingModal(car);
                      }}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#b7791f] hover:bg-[#b7791f] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* How it works Section */}
      <section className="bg-white mt-24 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              كيف يعمل مشوار؟
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              خطوات بسيطة وسريعة لتأجير سيارتك المفضلة والبدء في رحلتك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#2c7a7b]/10 rounded-2xl flex items-center justify-center text-[#2c7a7b] mb-6 relative">
                <span className="material-symbols-outlined text-3xl">
                  search
                </span>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-[#2c7a7b] text-[#2c7a7b] flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">اختر سيارتك</h3>
              <p className="text-sm text-gray-500">
                تصفح مجموعة واسعة من السيارات واختر ما يناسبك
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#2c7a7b]/10 rounded-2xl flex items-center justify-center text-[#2c7a7b] mb-6 relative">
                <span className="material-symbols-outlined text-3xl">
                  event_available
                </span>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-[#2c7a7b] text-[#2c7a7b] flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">حدد الموعد</h3>
              <p className="text-sm text-gray-500">
                اختر تواريخ الاستلام والتسليم المناسبة لك
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#2c7a7b]/10 rounded-2xl flex items-center justify-center text-[#2c7a7b] mb-6 relative">
                <span className="material-symbols-outlined text-3xl">
                  fact_check
                </span>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-[#2c7a7b] text-[#2c7a7b] flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">أكد الحجز</h3>
              <p className="text-sm text-gray-500">
                راجع تفاصيل الحجز وانتظر تأكيد المعرض
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-[#2c7a7b]/10 rounded-2xl flex items-center justify-center text-[#2c7a7b] mb-6 relative">
                <span className="material-symbols-outlined text-3xl">
                  directions_car
                </span>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-[#2c7a7b] text-[#2c7a7b] flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">استلم وانطلق</h3>
              <p className="text-sm text-gray-500">
                استلم سيارتك من المعرض وابدأ رحلتك بأمان
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
