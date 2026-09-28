import React from 'react';

interface MobileBottomNavProps {
  currentScreen: 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer';
  onNavigate: (screen: 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer') => void;
  onCallSupport: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  onCallSupport,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#d9c3b1]/40 shadow-[0_-2px_10px_rgba(20,23,28,0.06)] pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 cursor-pointer transition-colors ${
            currentScreen === 'home' ? 'text-[#884e00] font-bold' : 'text-[#534437]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'home' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[11px]">الرئيسية</span>
        </button>

        {/* Cars Catalog */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 cursor-pointer transition-colors ${
            currentScreen === 'checkout' ? 'text-[#884e00] font-bold' : 'text-[#534437]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'checkout' ? "'FILL' 1" : "'FILL' 0" }}
          >
            directions_car
          </span>
          <span className="text-[11px]">السيارات</span>
        </button>

        {/* My Bookings */}
        <button
          onClick={() => onNavigate('bookings')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 cursor-pointer transition-colors ${
            currentScreen === 'bookings' || currentScreen === 'confirmation'
              ? 'text-[#884e00] font-bold'
              : 'text-[#534437]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{
              fontVariationSettings:
                currentScreen === 'bookings' || currentScreen === 'confirmation'
                  ? "'FILL' 1"
                  : "'FILL' 0",
            }}
          >
            confirmation_number
          </span>
          <span className="text-[11px]">حجوزاتي</span>
        </button>

        {/* Dealer / Help */}
        <button
          onClick={() => onNavigate('dealer')}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 cursor-pointer transition-colors ${
            currentScreen === 'dealer' ? 'text-[#884e00] font-bold' : 'text-[#534437]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[22px]"
            style={{ fontVariationSettings: currentScreen === 'dealer' ? "'FILL' 1" : "'FILL' 0" }}
          >
            storefront
          </span>
          <span className="text-[11px]">المعارض</span>
        </button>

        {/* Support Hotline */}
        <button
          onClick={onCallSupport}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 cursor-pointer transition-colors text-[#0f6969]"
        >
          <span className="material-symbols-outlined text-[22px]">support_agent</span>
          <span className="text-[11px]">طوارئ 19822</span>
        </button>
      </div>
    </nav>
  );
};
