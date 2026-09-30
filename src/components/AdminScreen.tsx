import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SupportChat } from './SupportChat';

interface AdminScreenProps {
  currentUserId: string | null;
  onBackToHome: () => void;
}

interface DealerRow {
  id: string;
  name: string;
  city: string;
  status: string;
}

/** شاشة الإدارة — عرض المعارض والرد على طلبات الدعم */
export const AdminScreen: React.FC<AdminScreenProps> = ({ currentUserId, onBackToHome }) => {
  const [dealers, setDealers] = useState<DealerRow[]>([]);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from('dealers')
        .select('id, name, city, status')
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) setDealers(data as DealerRow[]);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Header */}
      <div className="h-16 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#d9c3b1]/40 z-40 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#884e00] text-[22px]">admin_panel_settings</span>
          <h1 className="font-bold text-base text-[#121c28]">لوحة إدارة مشوار</h1>
          <span className="font-mono-numeric text-xs text-[#0f6969] bg-[#a4f0ef]/50 px-2 py-0.5 rounded font-bold">
            SUPER ADMIN
          </span>
        </div>
        <button
          onClick={onBackToHome}
          className="text-xs font-bold text-[#0f6969] hover:text-[#884e00] bg-[#eef4ff] px-3 py-1.5 rounded-lg border border-[#d9c3b1]/40 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          <span>العودة للرئيسية</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1200px] mx-auto w-full p-4 sm:p-6 gap-6">
        {/* قائمة المعارض */}
        <div className="lg:w-80 shrink-0 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-[#121c28]">المعارض المسجلة</h2>
            <span className="text-[11px] text-[#534437] bg-[#eef4ff] px-2 py-0.5 rounded font-bold font-mono-numeric">
              {dealers.length} معرض
            </span>
          </div>

          {loading ? (
            <div className="text-center text-xs text-[#534437] py-8">جارٍ التحميل...</div>
          ) : dealers.length === 0 ? (
            <div className="text-center text-xs text-[#534437] py-8">لا توجد معارض مسجلة بعد</div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
              {dealers.map((dealer) => (
                <button
                  key={dealer.id}
                  onClick={() => setSelectedDealerId(dealer.id)}
                  className={`w-full text-right p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedDealerId === dealer.id
                      ? 'bg-[#884e00]/10 border-[#884e00] shadow-sm'
                      : 'bg-white border-[#d9c3b1]/40 hover:border-[#884e00]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#121c28]">{dealer.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        dealer.status === 'approved'
                          ? 'bg-[#9ff5c1] text-[#002111]'
                          : dealer.status === 'pending'
                            ? 'bg-[#ffdcbf] text-[#884e00]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}
                    >
                      {dealer.status === 'approved' ? 'معتمد' : dealer.status === 'pending' ? 'قيد المراجعة' : dealer.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#534437] flex items-center gap-1 mt-1">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {dealer.city}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* نافذة المحادثة */}
        <div className="flex-1">
          {selectedDealerId ? (
            <div className="bg-white rounded-xl shadow-xs border border-[#d9c3b1]/40 p-4">
              <div className="mb-3 flex items-center gap-2 pb-2 border-b border-[#d9c3b1]/30">
                <span className="material-symbols-outlined text-[#0f6969] text-[20px]">support_agent</span>
                <div>
                  <span className="font-bold text-sm text-[#121c28]">
                    محادثة الدعم — {dealers.find((d) => d.id === selectedDealerId)?.name}
                  </span>
                  <p className="text-[10px] text-[#534437]">ردودك ستظهر للمعرض فوراً عبر Realtime</p>
                </div>
              </div>
              <SupportChat
                dealerId={selectedDealerId}
                currentUserId={currentUserId}
                title={`محادثة مع ${dealers.find((d) => d.id === selectedDealerId)?.name ?? 'المعرض'}`}
                alwaysOpen
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-xs border border-[#d9c3b1]/40 p-8 text-center">
              <span className="material-symbols-outlined text-[#d9c3b1] text-[48px] mb-3 block">forum</span>
              <p className="text-sm text-[#534437]">اختر معرضاً من القائمة لبدء محادثة الدعم</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
