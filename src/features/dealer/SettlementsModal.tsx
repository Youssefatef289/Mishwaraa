import React from 'react';

interface SettlementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettlementsModal: React.FC<SettlementsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#d9c3b1] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#d9c3b1]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0f6969] text-[24px]">payments</span>
            <h3 className="font-bold text-base text-[#121c28]">تقرير التسويات المالية والأرباح</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dfe9fa] flex items-center justify-center text-[#121c28] hover:bg-[#d9e3f4] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs">
          <div className="p-3.5 bg-[#eef4ff] rounded-lg border border-[#d9c3b1]/40 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#534437] block">صافي أرباح المعرض هذا الشهر:</span>
              <span className="font-mono-numeric text-2xl font-bold text-[#884e00]">
                84,250 <span className="text-xs font-sans">ج.م</span>
              </span>
            </div>
            <span className="bg-[#9ff5c1] text-[#002111] px-2.5 py-1 rounded-full text-[11px] font-bold">
              جاهز للتحويل البنكي
            </span>
          </div>

          <div className="border border-[#d9c3b1]/40 rounded-lg overflow-hidden">
            <div className="bg-[#dfe9fa] px-3 py-2 font-bold text-xs text-[#121c28]">
              سجل الدفعات الأسبوعية الأخيرة
            </div>
            <div className="divide-y divide-[#d9c3b1]/30">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#121c28] block">تسوية الأسبوع الثالث (يوليو 2025)</span>
                  <span className="text-[10px] text-[#534437]">تم التحويل لحساب بنك مصر CIB</span>
                </div>
                <span className="font-mono-numeric font-bold text-[#056a41]">28,400 ج.م ✓</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#121c28] block">تسوية الأسبوع الثاني (يوليو 2025)</span>
                  <span className="text-[10px] text-[#534437]">تم التحويل لحساب بنك مصر CIB</span>
                </div>
                <span className="font-mono-numeric font-bold text-[#056a41]">31,250 ج.م ✓</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#121c28] block">تسوية الأسبوع الأول (يوليو 2025)</span>
                  <span className="text-[10px] text-[#534437]">تم التحويل لحساب بنك مصر CIB</span>
                </div>
                <span className="font-mono-numeric font-bold text-[#056a41]">24,600 ج.م ✓</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#a4f0ef]/20 rounded-lg text-[11px] text-[#0f6969] leading-relaxed">
            • يتم تحويل مستحقات المعارض بشكل دوري كل يوم خميس بدون أي عمولات خفية.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d9c3b1]/40">
          <button
            onClick={() => {
              window.print();
            }}
            className="px-4 py-2 rounded-lg bg-[#0f6969] hover:bg-[#0f6969]/90 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>طباعة كشف الحساب</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#dfe9fa] text-[#121c28] font-bold text-xs cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
