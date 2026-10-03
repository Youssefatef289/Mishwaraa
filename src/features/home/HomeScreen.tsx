import React, { useState, useEffect } from "react";
import { Car } from "@/src/core/types";
import { EgyptianPlateBadge } from "@/src/shared/EgyptianPlateBadge";
import { loadLiveCars, loadApprovedDealers } from "@/src/lib/integration";

interface HomeScreenProps {
  onSelectCar: (car: Car) => void;
  onOpenBookingModal: (car: Car) => void;
  onNavigateToDealer?: (id: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectCar,
  onOpenBookingModal,
  onNavigateToDealer,
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [liveCars, approvedDealers] = await Promise.all([
        loadLiveCars(),
        loadApprovedDealers(),
      ]);
      if (liveCars) setCars(liveCars);
      if (approvedDealers) setDealers(approvedDealers);
      setLoading(false);
    }
    fetchData();
  }, []);

  const availableCars = cars.filter((c) => c.status === "available");
  
  const categories = [
    { id: "all", name: "الكل", icon: "directions_car" },
    { id: "sedan", name: "سيدان", icon: "directions_car" },
    { id: "suv", name: "عائلية SUV", icon: "rv_hookup" },
    { id: "luxury", name: "فاخرة", icon: "workspace_premium" },
  ];
  
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCars =
    activeCategory === "all"
      ? availableCars
      : availableCars.filter((c) => {
          if (activeCategory === "suv" && c.categoryEn === "suv") return true;
          if (activeCategory === "sedan" && c.categoryEn === "economy") return true;
          if (activeCategory === "luxury" && c.categoryEn === "luxury") return true;
          return false;
        });

  return (
    <div className="w-full pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2000&q=80"
            alt="Mishwaraa Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center mt-12 animate-[slideUp_0.8s_ease-out]">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            مشوارك يبدأ من هنا
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl font-medium">
            اختار عربيتك، حدد موعدك، واحجز مشوارك بسهولة.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-full shadow-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl md:rounded-full border border-transparent focus-within:border-[#b7791f]/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400">directions_car</span>
              <input type="text" placeholder="نوع السيارة..." className="w-full bg-transparent border-none focus:outline-none text-gray-800 font-medium" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl md:rounded-full border border-transparent focus-within:border-[#b7791f]/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400">calendar_month</span>
              <input type="text" placeholder="تاريخ البداية" className="w-full bg-transparent border-none focus:outline-none text-gray-800 font-medium" />
            </div>
            <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl md:rounded-full border border-transparent focus-within:border-[#b7791f]/50 transition-colors">
              <span className="material-symbols-outlined text-gray-400">location_on</span>
              <input type="text" placeholder="الوجهة" className="w-full bg-transparent border-none focus:outline-none text-gray-800 font-medium" />
            </div>
            <button className="md:w-32 bg-[#b7791f] text-white px-6 py-3 rounded-xl md:rounded-full font-bold hover:bg-[#d69e2e] transition-colors shadow-md active:scale-95 flex items-center justify-center">
              ابحث
            </button>
          </div>
          
          <div className="mt-8">
            <button className="text-white border-b border-white/50 pb-1 hover:border-white transition-colors font-medium">
              استكشف السيارات
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">الفئات</h2>
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 pb-4 snap-x">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-center shrink-0 w-32 md:w-auto p-4 rounded-2xl flex flex-col items-center gap-3 transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#b7791f]/10 text-[#b7791f] border-2 border-[#b7791f]"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                <span className="font-bold">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl font-black text-gray-900">اكتشف السيارات</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-[380px] shadow-sm"></div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col border border-gray-100"
                  onClick={() => onSelectCar(car)}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                      {car.year}
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <EgyptianPlateBadge letters={car.plateLetters} numbers={car.plateNumbers} />
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
                        <p className="text-sm text-gray-500">{car.dealerName || "معرض مميز"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-[18px]">speed</span>
                        {car.transmission}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-[18px]">local_gas_station</span>
                        {car.fuel}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-[#2c7a7b]">{car.dailyPrice}</span>
                        <span className="text-sm text-gray-500 font-bold mr-1">ج.م/يوم</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenBookingModal(car);
                        }}
                        className="bg-[#121c28] text-white px-5 py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md"
                      >
                        احجز الآن
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد سيارات متاحة</h3>
              <p className="text-gray-500">جرب البحث في فئة أخرى أو لاحقاً.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Dealers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-900 mb-10">المعارض المميزة</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse bg-gray-50 rounded-3xl h-[300px]"></div>
              ))}
            </div>
          ) : dealers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dealers.map((dealer) => (
                <div key={dealer.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                  <div className="relative h-32">
                    <img src={dealer.cover} alt="Cover" className="w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                  </div>
                  <div className="px-6 pb-6 relative -mt-10">
                    <div className="w-20 h-20 bg-white rounded-2xl p-1.5 shadow-md mb-4 mx-auto relative z-10">
                      <div className="w-full h-full bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-3xl">storefront</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{dealer.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {dealer.city}
                      </p>
                      <button 
                        onClick={() => onNavigateToDealer?.(dealer.id)}
                        className="w-full py-2.5 bg-gray-50 text-[#b7791f] font-bold rounded-xl hover:bg-[#b7791f] hover:text-white transition-colors"
                      >
                        زيارة المعرض
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-4">store</span>
              <h3 className="text-lg font-bold text-gray-900">لا توجد معارض حالياً</h3>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-[#121c28] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-center mb-16">كيف يعمل مشوار؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: 'directions_car', title: 'اختر السيارة', desc: 'تصفح السيارات المتاحة وقارن بينها' },
              { icon: 'event_available', title: 'حدد موعدك', desc: 'اختر تاريخ البداية والنهاية' },
              { icon: 'send', title: 'أرسل طلب الحجز', desc: 'سيتم إرسال طلبك للمعرض للموافقة' },
              { icon: 'task_alt', title: 'استلم تأكيد الحجز', desc: 'تواصل مع المعرض واستلم سيارتك' },
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-[#b7791f]">
                  <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 mb-6">جاهز تبدأ مشوارك؟</h2>
          <p className="text-xl text-gray-500 mb-10">آلاف السيارات بانتظارك من أفضل المعارض المعتمدة.</p>
          <button className="bg-[#b7791f] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#d69e2e] transition-colors shadow-lg shadow-[#b7791f]/30 active:scale-95">
            استكشف السيارات الآن
          </button>
        </div>
      </section>
    </div>
  );
};
