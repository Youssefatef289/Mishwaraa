import React, { useState } from 'react';
import type { Profile } from '@/src/core/types';

export type ScreenType = 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer' | 'admin' | 'owner' | 'profile' | 'dealer_profile';

interface MobileBottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  role: Profile['role'] | 'guest';
  unreadCount?: number;
  onOpenAddCar?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ 
  currentScreen, 
  onNavigate, 
  role,
  unreadCount = 0,
  onOpenAddCar
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Helper to know if we're dealing with a dealer/owner looking at their own dashboard
  const isDealerContext = (role === 'dealer' || role === 'car_owner') && currentScreen === 'dealer';

  const handleCenterAction = () => {
    if (isDealerContext && onOpenAddCar) {
      onOpenAddCar();
    } else {
      // Customer context -> Browse cars
      onNavigate('checkout');
    }
  };

  const renderNavItems = () => {
    if (role === 'super_admin') {
      return (
        <>
          <NavItem icon="home" label="الرئيسية" screen="home" current={currentScreen} onClick={() => onNavigate('home')} />
          <NavItem icon="dashboard" label="Dashboard" screen="admin" current={currentScreen} onClick={() => onNavigate('admin')} />
          <CenterAddButton onClick={handleCenterAction} />
          <NavItem icon="notifications" label="إشعارات" badge={unreadCount} screen="notifications" current={currentScreen} onClick={() => {}} />
          <NavItem icon="person" label="حسابي" screen="profile" current={currentScreen} onClick={() => {}} />
        </>
      );
    }

    if (isDealerContext) {
      return (
        <>
          <NavItem icon="home" label="الرئيسية" screen="home" current={currentScreen} onClick={() => onNavigate('home')} />
          <NavItem icon="directions_car" label="سياراتي" screen="dealer" current={currentScreen} onClick={() => onNavigate('dealer')} />
          <CenterAddButton onClick={handleCenterAction} />
          <NavItem icon="list_alt" label="الطلبات" badge={unreadCount} screen="bookings" current={currentScreen} onClick={() => onNavigate('bookings')} />
          <NavItem icon="person" label="حسابي" screen="profile" current={currentScreen} onClick={() => {}} />
        </>
      );
    }

    // Customer or public viewer
    return (
      <>
        <NavItem icon="home" label="الرئيسية" screen="home" current={currentScreen} onClick={() => onNavigate('home')} />
        <NavItem icon="directions_car" label="السيارات" screen="checkout" current={currentScreen} onClick={() => onNavigate('checkout')} />
        <CenterAddButton onClick={handleCenterAction} />
        <NavItem icon="receipt_long" label="حجوزاتي" badge={unreadCount} screen="bookings" current={currentScreen} onClick={() => onNavigate('bookings')} />
        <NavItem icon="person" label="حسابي" screen="profile" current={currentScreen} onClick={() => {}} />
      </>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] pb-safe md:hidden">
        <div className="flex justify-between items-center h-[68px] px-2 max-w-lg mx-auto relative">
          {renderNavItems()}
        </div>
      </nav>
    </>
  );
};

const NavItem = ({ icon, label, screen, current, badge = 0, onClick }: any) => {
  const isActive = current === screen;
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-200 ${
        isActive ? 'text-[#b7791f] scale-105' : 'text-gray-400 hover:text-gray-700'
      }`}
    >
      <div className="relative">
        <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
          {icon}
        </span>
        {badge > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#b7791f] text-white text-[10px] font-black rounded-full shadow-sm ring-2 ring-white">
            {badge > 99 ? '+99' : badge}
          </span>
        )}
      </div>
      <span className={`text-[10px] whitespace-nowrap ${isActive ? 'font-black' : 'font-bold'}`}>{label}</span>
    </button>
  );
};

const CenterAddButton = ({ onClick }: { onClick: () => void }) => (
  <div className="relative -top-6 flex justify-center w-16">
    <button
      onClick={onClick}
      className="flex items-center justify-center w-14 h-14 rounded-full bg-[#b7791f] text-white shadow-[0_8px_20px_rgba(183,121,31,0.3)] hover:shadow-[0_12px_25px_rgba(183,121,31,0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95 border-4 border-white"
    >
      <span className="material-symbols-outlined text-[32px]">add</span>
    </button>
  </div>
);
