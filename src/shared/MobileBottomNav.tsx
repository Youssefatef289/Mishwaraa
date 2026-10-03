import React from 'react';

interface MobileBottomNavProps {
  currentScreen: 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer' | 'admin' | 'owner' | 'profile' | 'dealer_profile';
  onNavigate: (screen: 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer' | 'admin' | 'owner' | 'profile' | 'dealer_profile') => void;
  onCallSupport: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onCallSupport,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe font-['Tajawal']">
      <div className="flex justify-between items-center h-16 px-4">
        
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[4rem] transition-colors ${
            currentScreen === 'home' ? 'text-[#c97a1e]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: currentScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}>
            home
          </span>
          <span className={`text-[10px] ${currentScreen === 'home' ? 'font-black' : 'font-bold'}`}>الرئيسية</span>
        </button>

        {/* Cars (Checkout) */}
        <button
          onClick={() => onNavigate('checkout')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[4rem] transition-colors ${
            currentScreen === 'checkout' ? 'text-[#c97a1e]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: currentScreen === 'checkout' ? "'FILL' 1" : "'FILL' 0" }}>
            directions_car
          </span>
          <span className={`text-[10px] ${currentScreen === 'checkout' ? 'font-black' : 'font-bold'}`}>السيارات</span>
        </button>

        {/* FAB (Floating Action Button for Support/Call) */}
        <div className="relative -top-5">
          <button
            onClick={onCallSupport}
            className="w-14 h-14 bg-[#121c28] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#121c28]/30 hover:bg-[#c97a1e] transition-colors hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-[28px] animate-pulse">support_agent</span>
          </button>
        </div>

        {/* Bookings */}
        <button
          onClick={() => onNavigate('bookings')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[4rem] transition-colors ${
            currentScreen === 'bookings' ? 'text-[#c97a1e]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: currentScreen === 'bookings' ? "'FILL' 1" : "'FILL' 0" }}>
            receipt_long
          </span>
          <span className={`text-[10px] ${currentScreen === 'bookings' ? 'font-black' : 'font-bold'}`}>حجوزاتي</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[4rem] transition-colors ${
            currentScreen === 'profile' ? 'text-[#c97a1e]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: currentScreen === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>
            person
          </span>
          <span className={`text-[10px] ${currentScreen === 'profile' ? 'font-black' : 'font-bold'}`}>حسابي</span>
        </button>

      </div>
    </nav>
  );
};
