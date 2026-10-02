import React from "react";

interface HeaderProps {
  currentScreen: "home" | "checkout" | "confirmation" | "bookings" | "dealer";
  onNavigate: (
    screen: "home" | "checkout" | "confirmation" | "bookings" | "dealer",
  ) => void;
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
  return (
    <header className="sticky top-0 w-full z-50 bg-[#ffffff]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(20,23,28,0.04)]">
      {/* Top Device Switcher / Screen Jumper bar for ease of testing all screens */}
      <div className="bg-[#1e232b] text-[#eaf1ff] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#3aa6a6]/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3aa6a6] animate-pulse"></span>
          <span className="font-mono-numeric text-[11px] text-[#ffdcbf] font-bold">
            EG-HIGHWAY // LIVE NETWORK
          </span>
          <span className="text-[#dfe9fa]/70 hidden sm:inline">
            منصة حجز سيارات السفر المعتمدة
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Screen Selector */}
          <span className="text-[#dfe9fa]/60 text-[11px] hidden md:inline">
            الانتقال السريع:
          </span>
          <div className="inline-flex rounded-md p-0.5 bg-[#14171c] text-[11px]">
            <button
              onClick={() => onNavigate("home")}
              className={`px-2 py-0.5 rounded transition-all ${
                currentScreen === "home"
                  ? "bg-[#c97a1e] text-white font-bold"
                  : "text-[#dfe9fa]/70 hover:text-white"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate("checkout")}
              className={`px-2 py-0.5 rounded transition-all ${
                currentScreen === "checkout"
                  ? "bg-[#c97a1e] text-white font-bold"
                  : "text-[#dfe9fa]/70 hover:text-white"
              }`}
            >
              حجز السيارة
            </button>
            <button
              onClick={() => onNavigate("confirmation")}
              className={`px-2 py-0.5 rounded transition-all ${
                currentScreen === "confirmation"
                  ? "bg-[#c97a1e] text-white font-bold"
                  : "text-[#dfe9fa]/70 hover:text-white"
              }`}
            >
              التذكرة الرقمية
            </button>
            <button
              onClick={() => onNavigate("bookings")}
              className={`px-2 py-0.5 rounded transition-all ${
                currentScreen === "bookings"
                  ? "bg-[#c97a1e] text-white font-bold"
                  : "text-[#dfe9fa]/70 hover:text-white"
              }`}
            >
              حجوزاتي
            </button>
            <button
              onClick={() => onNavigate("dealer")}
              className={`px-2 py-0.5 rounded transition-all ${
                currentScreen === "dealer"
                  ? "bg-[#c97a1e] text-white font-bold"
                  : "text-[#dfe9fa]/70 hover:text-white"
              }`}
            >
              لوحة المعارض
            </button>
          </div>

          {/* Device Viewport Toggle (Desktop / Mobile Simulator) */}
          {onToggleMobileView && (
            <button
              onClick={onToggleMobileView}
              title="تبديل وضع العرض بين الهاتف وسطح المكتب"
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                isMobileView
                  ? "bg-[#3aa6a6] text-[#002020] border-[#3aa6a6]"
                  : "bg-transparent text-[#ffdcbf] border-[#ffdcbf]/40 hover:bg-white/10"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isMobileView ? "stay_current_portrait" : "desktop_windows"}
              </span>
              <span>{isMobileView ? "وضع الهاتف" : "سطح المكتب"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Brand Navigation Bar */}
      <div className="h-16 md:h-20 max-w-[960px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mishwar Egyptian Highway Sign Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 cursor-pointer text-right group"
          >
            <div className="relative bg-[#eef4ff] px-2.5 py-1 rounded border border-[#d9c3b1] flex items-center gap-1.5 shadow-xs group-hover:border-[#884e00] transition-colors">
              <span className="w-1 h-1 rounded-full bg-[#867465]"></span>
              <span className="font-sans font-bold text-xl text-[#884e00]">
                مشوار
              </span>
              <span className="font-mono-numeric text-[11px] text-[#0f6969] uppercase bg-[#a4f0ef]/50 px-1 py-0.5 rounded font-bold">
                EGY
              </span>
              <span className="w-1 h-1 rounded-full bg-[#867465]"></span>
            </div>
            <span className="hidden xl:inline text-[11px] text-[#534437] font-medium leading-tight">
              منصة تأجير السيارات الأولى في مصر
            </span>
          </button>

          {/* Primary Nav Menu (Desktop) */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-medium">
            <button
              onClick={() => onNavigate("home")}
              className={`py-1 transition-colors cursor-pointer ${
                currentScreen === "home"
                  ? "text-[#884e00] font-bold border-b-2 border-[#884e00]"
                  : "text-[#534437] hover:text-[#121c28]"
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onNavigate("home")}
              className={`py-1 transition-colors cursor-pointer text-[#534437] hover:text-[#121c28]'`}
            >
              تصفح السيارات
            </button>
            <button
              onClick={() => onNavigate("bookings")}
              className={`py-1 transition-colors cursor-pointer ${
                currentScreen === "bookings"
                  ? "text-[#884e00] font-bold border-b-2 border-[#884e00]"
                  : "text-[#534437] hover:text-[#121c28]"
              }`}
            >
              حجوزاتي
            </button>
            <button
              onClick={() => onNavigate("dealer")}
              className={`py-1 transition-colors cursor-pointer ${
                currentScreen === "dealer"
                  ? "text-[#884e00] font-bold border-b-2 border-[#884e00]"
                  : "text-[#534437] hover:text-[#121c28]"
              }`}
            >
              لوحة تحكم المعارض
            </button>
          </nav>
        </div>

        {/* Right CTA & Account Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              if (onOpenRegisterDealerModal) {
                onOpenRegisterDealerModal();
              } else {
                onNavigate("dealer");
              }
            }}
            className="hidden sm:inline-flex items-center justify-center px-3.5 py-1.5 rounded text-[#0f6969] border border-[#0f6969] hover:bg-[#0f6969] hover:text-white transition-all text-xs font-bold cursor-pointer"
          >
            سجّل معرضك
          </button>

          <button
            onClick={() => (userName ? onNavigate("bookings") : onOpenAuth?.())}
            className="inline-flex items-center gap-2 bg-[#e5efff] hover:bg-[#dfe9fa] transition-colors px-2.5 py-1 rounded-full border border-[#d9c3b1] cursor-pointer"
          >
            <span className="hidden sm:inline text-xs font-medium text-[#121c28]">
              {userName ?? "حسابي"}
            </span>
            <img
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover ring-1 ring-[#884e00]/20"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UEkxMemjP9Ew19bEaX8hcWGBp8Rq3UxWll9VMOKUjUMpZaQUJHB1ygwzwLPWCVePi0vxGxSmsBW5MU1QfdkrI3PyM_zvpfkhd9xbvJr20dEpQ1edI7sn3IWMEjGWkTaL6q5DyO7EwiEUjLeB_0UP2bLyIpL5wU0rKjSgb4OV2J0mCYkOC-ccFn1iYYXWCOrgzFnMKYwyO_lPvpySCOOK-b16R1_IQC7tz8N96SxXVdjmqlN4xZHZq_sEA"
            />
          </button>
          {userName && onSignOut && (
            <button
              onClick={onSignOut}
              className="text-xs font-bold text-[#534437] hover:text-[#884e00] cursor-pointer"
            >
              خروج
            </button>
          )}
        </div>
      </div>

      {/* Dashed Road Motif Accent */}
      <div className="w-full h-0.5 border-b-2 border-dashed border-[#884e00]/30" />
    </header>
  );
};
