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
  const [activeCategory, setActiveCategory] = useState("all");

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
    { id: "all", name: "الكل", icon: "apps", desc: "جميع الفئات" },
    { id: "sedan", name: "سيدان", icon: "directions_car", desc: "عملية ومريحة" },
    { id: "suv", name: "عائلية SUV", icon: "rv_hookup", desc: "مساحة واسعة" },
    { id: "luxury", name: "فاخرة", icon: "workspace_premium", desc: "رفاهية مطلقة" },
  ];

  const filteredCars = activeCategory === "all"
      ? availableCars
      : availableCars.filter((c) => {
          if (activeCategory === "suv" && c.categoryEn === "suv") return true;
          if (activeCategory === "sedan" && c.categoryEn === "economy") return true;
          if (activeCategory === "luxury" && c.categoryEn === "luxury") return true;
          return false;
        });

  return (
    <div className="w-full bg-[#f8f9fa] min-h-screen pb-24 md:pb-0 font-['Tajawal']">
      {/* 1. Hero Section - Ultra Modern */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-[#121c28]">
        {/* Abstract Background Patterns */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#121c28]/80 via-[#121c28]/60 to-[#f8f9fa]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center text-center mt-10">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#ffb873] text-sm font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            المنصة الأولى لتأجير السيارات في مصر
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            مشوارك <span className="text-[#c97a1e]">يبدأ من هنا</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl font-medium leading-relaxed">
            اكتشف آلاف السيارات المتاحة للإيجار من أفضل المعارض المعتمدة. تجربة حجز سهلة، سريعة، وآمنة.
          </p>

          {/* Premium Search Box */}
          <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl md:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] p-3 flex flex-col md:flex-row gap-3 border border-white/50">
            <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-gray-50/80 rounded-2xl md:rounded-full hover:bg-gray-100 transition-colors cursor-text group border border-transparent focus-within:border-[#c97a1e]/50">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#c97a1e] group-focus-within:bg-[#c97a1e] group-focus-within:text-white transition-colors">
                <span className="material-symbols-outlined">directions_car</span>
              </div>
              <div className="flex flex-col text-right flex-1">
                <span className="text-[11px] font-bold text-gray-500 mb-0.5">نوع السيارة</span>
                <input type="text" placeholder="ابحث عن سيارة أحلامك..." className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-bold placeholder-gray-400 text-sm" />
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-gray-50/80 rounded-2xl md:rounded-full hover:bg-gray-100 transition-colors cursor-text group border border-transparent focus-within:border-[#c97a1e]/50">
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2c7a7b] group-focus-within:bg-[#2c7a7b] group-focus-within:text-white transition-colors">
                <span className="material-symbols-outlined">calendar_month</span>
              </div>
              <div className="flex flex-col text-right flex-1">
                <span className="text-[11px] font-bold text-gray-500 mb-0.5">موعد الاستلام</span>
                <input type="text" placeholder="اختر التاريخ..." className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-bold placeholder-gray-400 text-sm" />
              </div>
            </div>

            <button className="md:w-auto bg-[#c97a1e] text-white px-10 py-4 rounded-2xl md:rounded-full font-black text-lg hover:bg-[#ab6300] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">search</span>
              البحث الآن
            </button>
          </div>
        </div>
      </section>

      {/* 2. Quick Categories */}
      <section className="relative z-20 -mt-16 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-white text-[#c97a1e] shadow-xl border-2 border-[#c97a1e] -translate-y-2"
                  : "bg-white/90 backdrop-blur-md text-gray-600 shadow-lg border-2 border-transparent hover:-translate-y-1 hover:shadow-xl"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                activeCategory === cat.id ? "bg-[#c97a1e]/10" : "bg-gray-50"
              }`}>
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>
              <h3 className="font-black text-lg mb-1 text-gray-900">{cat.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{cat.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Cars */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#c97a1e] font-black text-sm tracking-widest uppercase mb-2 block">الأسطول المتاح</span>
            <h2 className="text-4xl font-black text-gray-900">سيارات تناسب كل مشوار</h2>
          </div>
          <button className="flex items-center gap-2 text-[#2c7a7b] font-bold hover:gap-3 transition-all">
            عرض كل السيارات
            <span className="material-symbols-outlined text-[20px] rotate-180">arrow_right_alt</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-[2rem] h-[450px] shadow-sm"></div>
            ))}
          </div>
        ) : filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                onClick={() => onSelectCar(car)}
                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100 flex flex-col"
              >
                {/* Image Box */}
                <div className="relative h-64 overflow-hidden p-3">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60"></div>
                  </div>
                  {/* Badges */}
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-sm font-black text-[#121c28] shadow-lg">
                    {car.year}
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <EgyptianPlateBadge letters={car.plateLetters} numbers={car.plateNumbers} />
                  </div>
                </div>
                
                {/* Content Box */}
                <div className="p-6 pt-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-1.5">{car.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-[#c97a1e]">storefront</span>
                        {car.dealerName || "معرض معتمد"}
                      </div>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-3 px-2">
                      <span className="material-symbols-outlined text-gray-400 mb-1 text-[22px]">speed</span>
                      <span className="text-xs font-bold text-gray-700">{car.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-3 px-2">
                      <span className="material-symbols-outlined text-gray-400 mb-1 text-[22px]">local_gas_station</span>
                      <span className="text-xs font-bold text-gray-700">{car.fuel === 'gasoline' ? 'بنزين' : 'كهرباء'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-3 px-2">
                      <span className="material-symbols-outlined text-gray-400 mb-1 text-[22px]">airline_seat_recline_normal</span>
                      <span className="text-xs font-bold text-gray-700">5 مقاعد</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-bold mb-0.5">السعر لليوم</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[#2c7a7b]">{car.dailyPrice}</span>
                        <span className="text-sm font-bold text-gray-600">ج.م</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenBookingModal(car);
                      }}
                      className="bg-[#121c28] text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-[#c97a1e] hover:shadow-lg hover:shadow-[#c97a1e]/30 transition-all active:scale-95 flex items-center gap-2"
                    >
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-gray-300">directions_car</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">لا توجد سيارات في هذه الفئة</h3>
            <p className="text-gray-500 font-medium">جرب البحث في فئة أخرى أو قم بإلغاء الفلاتر.</p>
          </div>
        )}
      </section>

      {/* 4. Top Dealers */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-[#c97a1e] font-black text-sm tracking-widest uppercase mb-2 block">شركاء النجاح</span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">معارض سيارات معتمدة</h2>
            <p className="text-gray-500 font-medium">نحن نعمل فقط مع أفضل المعارض الموثوقة لضمان جودة السيارات ومستوى الخدمة.</p>
          </div>
          
          {dealers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {dealers.slice(0, 3).map((dealer) => (
                <div key={dealer.id} className="bg-gray-50 rounded-[2rem] p-3 flex flex-col group hover:bg-[#121c28] transition-colors duration-500 cursor-pointer">
                  <div className="h-40 w-full rounded-[1.5rem] overflow-hidden relative mb-6">
                    <img src={dealer.cover} alt="Cover" className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                        <img src={dealer.logo} alt="Logo" className="w-full h-full rounded-xl object-cover" />
                      </div>
                      <div className="text-white">
                        <h3 className="font-black text-xl leading-tight">{dealer.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-300">
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {dealer.city}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm font-medium mb-6 group-hover:text-gray-400 line-clamp-2">
                      {dealer.bio}
                    </p>
                    <button 
                      onClick={() => onNavigateToDealer?.(dealer.id)}
                      className="w-full py-3.5 bg-white text-gray-900 font-bold rounded-xl group-hover:bg-[#c97a1e] group-hover:text-white transition-all shadow-sm"
                    >
                      عرض سيارات المعرض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. How It Works - Minimalist */}
      <section className="py-24 bg-[#121c28] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4">خطوات بسيطة لمشوارك</h2>
            <p className="text-gray-400 font-medium">أجر سيارتك في أقل من 3 دقائق بدون تعقيدات</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#2c7a7b]/50 to-transparent z-0"></div>
            
            {[
              { icon: 'search', title: '1. ابحث وقارن', desc: 'تصفح السيارات المتاحة وحدد الموعد والمكان المناسب لك' },
              { icon: 'task_alt', title: '2. تأكيد الحجز', desc: 'أرسل طلب الحجز وسيتم تأكيده فوراً من قبل المعرض' },
              { icon: 'key', title: '3. استلم المفتاح', desc: 'تواصل مع المعرض لاستلام سيارتك وانطلق في مشوارك' }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[#1e2a3b] border-4 border-[#121c28] flex items-center justify-center mb-8 shadow-xl relative group">
                  <div className="absolute inset-0 rounded-full bg-[#2c7a7b] opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-500"></div>
                  <span className="material-symbols-outlined text-4xl text-[#c97a1e] group-hover:text-white relative z-10 transition-colors">
                    {step.icon}
                  </span>
                </div>
                <h3 className="text-2xl font-black mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Footer */}
      <section className="py-24 bg-[#c97a1e] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -right-20 -top-40 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-md">مستعد لبدء رحلتك؟</h2>
          <p className="text-xl text-white/90 mb-10 font-bold max-w-2xl mx-auto">
            انضم لآلاف المستخدمين الذين يثقون في "مشوار" لتأجير سياراتهم يومياً
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-[#121c28] text-white px-10 py-5 rounded-full font-black text-lg hover:bg-gray-900 transition-all shadow-xl hover:-translate-y-1">
              ابدأ الحجز الآن
            </button>
            <button className="w-full sm:w-auto bg-white text-[#b7791f] px-10 py-5 rounded-full font-black text-lg hover:bg-gray-50 transition-all shadow-xl hover:-translate-y-1 border border-white/50">
              تسجيل حساب جديد
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
