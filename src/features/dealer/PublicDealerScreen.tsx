import React from 'react';
import { Car } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';
import { MOCK_CARS } from '@/src/data/mockData';

interface PublicDealerScreenProps {
  dealerId?: string; // in a real app, fetch dealer by ID
  dealerName?: string;
  onBack: () => void;
  onSelectCar: (car: Car) => void;
}

export const PublicDealerScreen: React.FC<PublicDealerScreenProps> = ({
  dealerId,
  dealerName = "معرض مشوار المتميز",
  onBack,
  onSelectCar,
}) => {
  // In a real scenario, filter by dealerId. Here we mock some cars.
  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
  const dealerCars = isDemoMode ? MOCK_CARS.slice(0, 4) : [];
  const availableCars = dealerCars.filter(c => c.status === 'available');

  return (
    <div className="bg-[#f8f9ff] min-h-screen pb-24 md:pb-12">
      {/* Hero Cover */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#121c28] to-[#1a293b]">
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/30 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-black/50 transition-colors"
        >
          <span className="material-symbols-outlined rtl:rotate-180">arrow_back</span>
        </button>
        <img 
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Dealer Cover" 
          className="w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-20 mb-12">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-right">
          {/* Logo */}
          <div className="w-32 h-32 bg-white rounded-2xl shadow-md border border-gray-100 p-2 shrink-0 -mt-16 md:mt-0 relative overflow-hidden">
            <div className="w-full h-full bg-[#121c28] rounded-xl flex items-center justify-center text-[#b7791f]">
              <span className="material-symbols-outlined text-5xl">storefront</span>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">{dealerName}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-bold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-[#2c7a7b]">location_on</span>
                    القاهرة، مدينة نصر
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px] text-yellow-500">star</span>
                    4.8 (120 تقييم)
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#b7791f] text-white font-bold rounded-xl hover:bg-[#d69e2e] transition-colors shadow-md flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  اتصال
                </button>
                <button className="flex-1 md:flex-none px-6 py-2.5 bg-[#2c7a7b]/10 text-[#2c7a7b] font-bold rounded-xl hover:bg-[#2c7a7b]/20 transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  مراسلة
                </button>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
              نحن في معرض مشوار نحرص على تقديم أفضل السيارات المتاحة للإيجار بأسعار تنافسية وحالة ممتازة. جميع سياراتنا تخضع لفحص دوري لضمان سلامتك وراحتك أثناء القيادة.
            </p>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black text-gray-900 mb-6">السيارات المتاحة ({availableCars.length})</h2>
        
        {availableCars.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-gray-300">directions_car</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد سيارات متاحة</h3>
            <p className="text-gray-500">هذا المعرض ليس لديه سيارات متاحة للإيجار حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableCars.map((car) => (
              <div 
                key={car.id} 
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => onSelectCar(car)}
              >
                {/* Car Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 right-3">
                    <EgyptianPlateBadge letters={car.plateLetters} numbers={car.plateNumbers} />
                  </div>
                </div>

                {/* Car Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{car.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md shrink-0">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {car.year}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-6 mt-2">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">speed</span>
                      {car.transmission}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">local_gas_station</span>
                      {car.fuel}
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-[#2c7a7b]">{car.dailyPrice}</span>
                      <span className="text-xs font-bold text-gray-500 mr-1">ج.م / يوم</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCar(car);
                      }}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#b7791f] hover:bg-[#b7791f] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">arrow_forward</span>
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
