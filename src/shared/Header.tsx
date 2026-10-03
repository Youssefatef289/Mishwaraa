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
  isMobileView = false,
  onToggleMobileView,
  onOpenRegisterDealerModal,
  userName,
  onOpenAuth,
  onSignOut,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all duration-300">
      <div className="h-16 md:h-20 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 cursor-pointer text-right group"
          >
            <span className="font-sans font-black text-2xl text-[#b7791f]">
              مشوار
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold">
            <button
              onClick={() => onNavigate("home")}
              className={`py-1 transition-colors cursor-pointer ${
                currentScreen === "home"
                  ? "text-[#b7791f] border-b-2 border-[#b7791f]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate("checkout")}
              className={`py-1 transition-colors cursor-pointer ${
                currentScreen === "checkout"
                  ? "text-[#b7791f] border-b-2 border-[#b7791f]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              السيارات
            </button>
            <button
              onClick={() => onNavigate("dealer_profile")}
              className={`py-1 transition-colors cursor-pointer ${
                currentScreen === "dealer_profile"
                  ? "text-[#b7791f] border-b-2 border-[#b7791f]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              المعارض
            </button>
            {userName && (
              <button
                onClick={() => onNavigate("bookings")}
                className={`py-1 transition-colors cursor-pointer ${
                  currentScreen === "bookings"
                    ? "text-[#b7791f] border-b-2 border-[#b7791f]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                حجوزاتي
              </button>
            )}
            <button className="py-1 transition-colors cursor-pointer text-gray-600 hover:text-gray-900">
              تواصل معنا
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {!userName ? (
            <>
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all text-sm font-bold cursor-pointer"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white bg-[#b7791f] hover:bg-[#d69e2e] transition-all text-sm font-bold cursor-pointer shadow-md"
              >
                إنشاء حساب
              </button>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer"
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://ui-avatars.com/api/?name=User&background=b7791f&color=fff"
                />
                <span className="hidden sm:inline text-sm font-bold text-gray-800">
                  {userName}
                </span>
                <span className="material-symbols-outlined text-[20px] text-gray-500">
                  expand_more
                </span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-[fadeIn_0.2s_ease-out]">
                  <button onClick={() => { setIsProfileDropdownOpen(false); onNavigate('profile'); }} className="w-full text-right px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">حسابي</button>
                  <button onClick={() => { setIsProfileDropdownOpen(false); onNavigate('bookings'); }} className="w-full text-right px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">حجوزاتي</button>
                  <button onClick={() => setIsProfileDropdownOpen(false)} className="w-full text-right px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between">الرسائل <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">2</span></button>
                  <button onClick={() => setIsProfileDropdownOpen(false)} className="w-full text-right px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50">الإشعارات</button>
                  <div className="h-px bg-gray-100 my-1"></div>
                  {onSignOut && (
                    <button onClick={() => { setIsProfileDropdownOpen(false); onSignOut(); }} className="w-full text-right px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50">
                      تسجيل الخروج
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
