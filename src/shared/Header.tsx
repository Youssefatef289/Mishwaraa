import React, { useState } from "react";

interface HeaderProps {
  currentScreen: "home" | "checkout" | "confirmation" | "bookings" | "dealer" | "admin" | "owner" | "profile" | "dealer_profile";
  onNavigate: (screen: "home" | "checkout" | "confirmation" | "bookings" | "dealer" | "admin" | "owner" | "profile" | "dealer_profile") => void;
  isMobileView?: boolean;
  onToggleMobileView?: () => void;
  onOpenRegisterDealerModal?: () => void;
  userName?: string;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  userName,
  onOpenAuth,
  onSignOut,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <>
      {/* 1. Desktop Navbar (Hidden on Mobile) */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 transition-all duration-300 font-['Tajawal']">
        <div className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Right side (Logo & Links) */}
          <div className="flex items-center gap-10">
            <button onClick={() => onNavigate("home")} className="cursor-pointer transition-transform hover:scale-105">
              <img src="/logo.png" alt="مشوار" className="h-10 w-auto object-contain" />
            </button>

            <nav className="flex items-center gap-8 text-sm font-bold">
              <button onClick={() => onNavigate("home")} className={`py-2 border-b-2 ${currentScreen === "home" ? "text-[#c97a1e] border-[#c97a1e]" : "text-gray-600 hover:text-gray-900 border-transparent"}`}>
                الرئيسية
              </button>
              <button onClick={() => onNavigate("checkout")} className={`py-2 border-b-2 ${currentScreen === "checkout" ? "text-[#c97a1e] border-[#c97a1e]" : "text-gray-600 hover:text-gray-900 border-transparent"}`}>
                السيارات
              </button>
              <button onClick={() => onNavigate("dealer_profile")} className={`py-2 border-b-2 ${currentScreen === "dealer_profile" ? "text-[#c97a1e] border-[#c97a1e]" : "text-gray-600 hover:text-gray-900 border-transparent"}`}>
                المعارض
              </button>
              {userName && (
                <button onClick={() => onNavigate("bookings")} className={`py-2 border-b-2 ${currentScreen === "bookings" ? "text-[#c97a1e] border-[#c97a1e]" : "text-gray-600 hover:text-gray-900 border-transparent"}`}>
                  حجوزاتي
                </button>
              )}
            </nav>
          </div>

          {/* Left side (Auth / Profile) */}
          <div className="flex items-center gap-4">
            {!userName ? (
              <>
                <button onClick={onOpenAuth} className="px-6 py-2.5 rounded-full text-gray-700 hover:bg-gray-50 text-sm font-bold">
                  تسجيل الدخول
                </button>
                <button onClick={onOpenAuth} className="px-6 py-2.5 rounded-full text-white bg-[#121c28] hover:bg-[#c97a1e] text-sm font-bold shadow-lg shadow-[#121c28]/20">
                  إنشاء حساب
                </button>
              </>
            ) : (
              <div className="relative">
                <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} className="flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-2 rounded-full border border-gray-100 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#c97a1e] text-white flex items-center justify-center font-bold text-sm">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-800">{userName}</span>
                  <span className="material-symbols-outlined text-[20px] text-gray-400">expand_more</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <button onClick={() => { setIsProfileDropdownOpen(false); onNavigate('profile'); }} className="w-full text-right px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#c97a1e] flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">person</span> حسابي
                    </button>
                    <button onClick={() => { setIsProfileDropdownOpen(false); onNavigate('bookings'); }} className="w-full text-right px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#c97a1e] flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span> حجوزاتي
                    </button>
                    <div className="h-px bg-gray-100 my-2 mx-4"></div>
                    {onSignOut && (
                      <button onClick={() => { setIsProfileDropdownOpen(false); onSignOut(); }} className="w-full text-right px-5 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px]">logout</span> تسجيل الخروج
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Mobile Top App Bar (Visible ONLY on Mobile) */}
      <header className="md:hidden sticky top-0 z-50 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100 h-16 px-4 flex items-center justify-between font-['Tajawal']">
        {/* Right: Logo */}
        <button onClick={() => onNavigate("home")} className="flex items-center">
          <img src="/logo.png" alt="مشوار" className="h-8 w-auto object-contain" />
        </button>

        {/* Left: App Icons */}
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate("checkout")} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          {userName ? (
            <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors relative">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          ) : (
            <button onClick={onOpenAuth} className="w-9 h-9 rounded-full bg-[#121c28] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[20px]">login</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
};
