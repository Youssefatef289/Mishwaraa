import React from 'react';

interface FooterProps {
  onNavigate?: (screen: 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#121c28] text-white pt-16 pb-8 font-['Tajawal'] border-t-[6px] border-[#c97a1e]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Bio */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="bg-white p-2 rounded-2xl w-fit">
              <img src="/logo.png" alt="مشوار" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              المنصة الأولى والأكثر موثوقية لتأجير السيارات في مصر. نجمع لك أفضل المعارض والسيارات في مكان واحد لتجربة حجز سهلة، سريعة، وآمنة.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c97a1e] transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c97a1e] transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c97a1e] transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-white mb-2">روابط سريعة</h3>
            <button onClick={() => onNavigate?.('home')} className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">الرئيسية</button>
            <button onClick={() => onNavigate?.('checkout')} className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">تصفح السيارات</button>
            <button onClick={() => onNavigate?.('dealer')} className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">المعارض المعتمدة</button>
            <a href="#" className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">من نحن</a>
            <a href="#" className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">اتصل بنا</a>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-white mb-2">فئات السيارات</h3>
            <a href="#" className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">سيارات اقتصادية</a>
            <a href="#" className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">سيارات سيدان</a>
            <a href="#" className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">عائلية SUV</a>
            <a href="#" className="text-right text-gray-400 hover:text-[#c97a1e] transition-colors font-bold text-sm w-fit">سيارات فاخرة</a>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-black text-white mb-2">تواصل معنا</h3>
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
              <span className="material-symbols-outlined text-[#c97a1e]">location_on</span>
              القاهرة، مصر
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
              <span className="material-symbols-outlined text-[#c97a1e]">call</span>
              +20 100 000 0000
            </div>
            <div className="flex items-center gap-3 text-gray-400 text-sm font-bold">
              <span className="material-symbols-outlined text-[#c97a1e]">mail</span>
              support@mishwaraa.com
            </div>
          </div>
          
        </div>

        <div className="h-px w-full bg-white/10 mb-8"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500">
          <p>© {new Date().getFullYear()} منصة مشوار. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
            <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
