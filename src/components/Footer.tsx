import React from 'react';

interface FooterProps {
  onNavigate?: (screen: 'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#ffffff] mt-12 border-t border-[#d9c3b1]">
      <div className="w-full h-0.5 border-b-2 border-dashed border-[#884e00]/20" />
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 flex flex-col gap-3">
            <div className="inline-flex items-center justify-between border-2 border-[#d9c3b1] rounded p-1.5 bg-[#ffffff] relative w-fit shadow-xs">
              <span className="w-1 h-1 rounded-full bg-[#867465] absolute top-1 right-1" />
              <span className="w-1 h-1 rounded-full bg-[#867465] absolute top-1 left-1" />
              <span className="w-1 h-1 rounded-full bg-[#867465] absolute bottom-1 right-1" />
              <span className="w-1 h-1 rounded-full bg-[#867465] absolute bottom-1 left-1" />
              <span className="font-bold text-lg text-[#884e00] px-2">مشوار</span>
              <span className="font-mono-numeric text-[11px] text-[#0f6969] bg-[#a4f0ef]/50 px-1 py-0.5 rounded font-bold">
                مصر
              </span>
            </div>
            <p className="text-xs text-[#534437] leading-relaxed">
              منصة حجز واستئجار السيارات الموثوقة في مصر. تقنية تجمع أدق مواصفات الأسطول بضمان وشفافية الطرق السريعة المصرية.
            </p>
          </div>

          {/* Col 2: Covered Governorates */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm text-[#121c28]">المحافظات المغطاة</span>
            <ul className="flex flex-col gap-1.5 text-xs text-[#534437]">
              <li>
                <button
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  تأجير في القاهرة
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  تأجير في الإسكندرية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  تأجير في شرم الشيخ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  تأجير في الساحل الشمالي
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Warranties */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm text-[#121c28]">السياسات والضمان</span>
            <ul className="flex flex-col gap-1.5 text-xs text-[#534437]">
              <li>
                <button
                  onClick={() => onNavigate?.('checkout')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  شروط الخدمة والتعاقد
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('confirmation')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  وثيقة التأمين الشامل
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('bookings')}
                  className="hover:text-[#884e00] transition-colors cursor-pointer"
                >
                  مساعدة ودعم العملاء
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Us */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm text-[#121c28]">تواصل معنا</span>
            <div className="flex flex-col gap-1.5 text-xs text-[#534437]">
              <div className="flex items-center gap-2">
                <span>الخط الساخن:</span>
                <a
                  href="tel:19822"
                  className="font-mono-numeric text-base text-[#884e00] font-bold hover:underline"
                >
                  19822
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span>بريد الدعم:</span>
                <span className="font-mono-numeric text-[11px]">support@mishwar.eg</span>
              </div>
              <div className="mt-1">
                <span className="inline-block px-2 py-0.5 rounded bg-[#2e8358]/15 text-[#056a41] text-[11px] font-bold">
                  دعم فني وتيليفاتكس 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Rights Bar */}
        <div className="mt-8 pt-4 border-t border-[#d9c3b1]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#534437]">
          <p>© 2025 منصة مشوار لتأجير السيارات. جميع الحقوق محفوظة لجمهورية مصر العربية.</p>
          <div className="flex items-center gap-2 font-mono-numeric text-[11px]">
            <span>EG-ROAD-MARKET-V2.4</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
