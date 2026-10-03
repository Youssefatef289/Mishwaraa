import React, { useState, useEffect } from 'react';
import { Car } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';
import { loadLiveCars, loadApprovedDealers } from "@/src/lib/integration";

interface PublicDealerScreenProps {
  dealerId?: string;
  onBack: () => void;
  onSelectCar: (car: Car) => void;
}

export const PublicDealerScreen: React.FC<PublicDealerScreenProps> = ({
  dealerId,
  onBack,
  onSelectCar,
}) => {
  const [dealer, setDealer] = useState<any>(null);
  const [dealerCars, setDealerCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [liveCars, approvedDealers] = await Promise.all([
        loadLiveCars(),
        loadApprovedDealers(),
      ]);
      
      const foundDealer = approvedDealers?.find(d => d.id === dealerId) || approvedDealers?.[0];
      if (foundDealer) {
        setDealer(foundDealer);
        const cars = liveCars?.filter(c => c.dealerName === foundDealer.name) || liveCars?.slice(0, 4) || [];
        setDealerCars(cars);
      }
      setLoading(false);
    }
    fetchData();
  }, [dealerId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c97a1e]/30 border-t-[#c97a1e] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!dealer) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">store_off</span>
        <h2 className="text-2xl font-black text-gray-900 mb-4">المعرض غير موجود</h2>
        <button onClick={onBack} className="bg-[#121c28] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#c97a1e] transition-colors">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const availableCars = dealerCars.filter(c => c.status === 'available');

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-['Tajawal'] pb-24 md:pb-12">
      {/* Hero Cover */}
      <div className="relative h-[30vh] md:h-[400px] w-full">
        <img src={dealer.cover} alt={dealer.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <button
          onClick={onBack}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
        </button>
      </div>

      {/* Dealer Info Card (Overlapping) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-24 z-20 mb-12">
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] bg-white p-2 shadow-xl shrink-0 -mt-16 md:-mt-20 relative z-30">
            <img src={dealer.logo} alt="Logo" className="w-full h-full rounded-2xl object-cover" />
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{dealer.name}</h1>
            <p className="text-gray-500 font-medium mb-6 max-w-2xl">{dealer.bio}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-gray-600">
                <span className="material-symbols-outlined text-[18px] text-[#c97a1e]">location_on</span>
                {dealer.city}
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-sm font-bold text-gray-600">
                <span className="material-symbols-outlined text-[18px] text-[#2c7a7b]">directions_car</span>
                {dealerCars.length} سيارة مضافة
              </div>
              <button className="bg-[#121c28] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#c97a1e] transition-colors flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-[18px]">call</span>
                تواصل معنا
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
          السيارات المتاحة للإيجار
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{availableCars.length}</span>
        </h2>

        {availableCars.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">directions_car</span>
            <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد سيارات متاحة حالياً</h3>
            <p className="text-gray-500 font-medium">عذراً، المعرض لا يملك سيارات متاحة للإيجار في الوقت الحالي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableCars.map((car) => (
              <div
                key={car.id}
                onClick={() => onSelectCar(car)}
                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 flex flex-col"
              >
                <div className="relative h-56 overflow-hidden p-3">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent opacity-60"></div>
                  </div>
                  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-sm font-black text-gray-900 shadow-lg">
                    {car.year}
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <EgyptianPlateBadge letters={car.plateLetters} numbers={car.plateNumbers} />
                  </div>
                </div>
                
                <div className="p-6 pt-2 flex flex-col flex-1">
                  <h3 className="text-2xl font-black text-gray-900 mb-6">{car.name}</h3>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-2 px-1">
                      <span className="material-symbols-outlined text-gray-400 mb-1 text-[20px]">speed</span>
                      <span className="text-[11px] font-bold text-gray-700">{car.transmission === 'automatic' ? 'أوتوماتيك' : 'مانيوال'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-2 px-1">
                      <span className="material-symbols-outlined text-gray-400 mb-1 text-[20px]">local_gas_station</span>
                      <span className="text-[11px] font-bold text-gray-700">{car.fuel === 'gasoline' ? 'بنزين' : 'كهرباء'}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl py-2 px-1">
                      <span className="material-symbols-outlined text-gray-400 mb-1 text-[20px]">airline_seat_recline_normal</span>
                      <span className="text-[11px] font-bold text-gray-700">{car.seats || 5} مقاعد</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-2xl font-black text-[#2c7a7b]">{car.dailyPrice}</span>
                      <span className="text-xs text-gray-500 font-bold mr-1">ج.م/يوم</span>
                    </div>
                    <button className="bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-bold group-hover:bg-[#121c28] group-hover:text-white transition-colors">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
