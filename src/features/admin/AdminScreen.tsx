import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';

interface AdminScreenProps {
  currentUserId: string | null;
  onBackToHome: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ currentUserId, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderSidebar = () => (
    <aside className="hidden lg:flex flex-col w-64 bg-[#121c28] text-white min-h-screen fixed right-0 top-0 z-40 pt-24 pb-8">
      <div className="px-6 mb-8 text-center">
        <div className="w-16 h-16 bg-[#c97a1e] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(201,122,30,0.4)]">
          <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
        </div>
        <h2 className="text-xl font-black">لوحة الإدارة العليا</h2>
        <p className="text-xs text-gray-400 font-bold mt-1">Super Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {[
          { id: 'dashboard', icon: 'dashboard', label: 'الرئيسية' },
          { id: 'users', icon: 'group', label: 'المستخدمين' },
          { id: 'dealers', icon: 'storefront', label: 'المعارض', badge: '3 طلبات' },
          { id: 'owners', icon: 'key', label: 'مُلاك السيارات' },
          { id: 'cars', icon: 'directions_car', label: 'السيارات' },
          { id: 'bookings', icon: 'receipt_long', label: 'الحجوزات' },
          { id: 'settings', icon: 'settings', label: 'الإعدادات' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === item.id 
                ? 'bg-[#c97a1e] text-white shadow-md' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </div>
            {item.badge && (
              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-[10px] font-black">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <button 
          onClick={onBackToHome}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-bold text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          الخروج للموقع
        </button>
      </div>
    </aside>
  );

  const renderDashboardHome = () => (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">نظرة عامة على النظام</h2>
        <p className="text-gray-500 font-medium">إحصائيات المنصة الشاملة</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'إجمالي المستخدمين', value: '1,245', icon: 'group', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'المعارض المعتمدة', value: '42', icon: 'storefront', color: 'text-[#c97a1e]', bg: 'bg-[#c97a1e]/10' },
          { label: 'مُلاك السيارات', value: '156', icon: 'key', color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'السيارات المتاحة', value: '890', icon: 'directions_car', color: 'text-[#2c7a7b]', bg: 'bg-[#2c7a7b]/10' },
          { label: 'الحجوزات النشطة', value: '124', icon: 'receipt_long', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'الإيرادات (الشهر)', value: '450k', icon: 'payments', color: 'text-green-600', bg: 'bg-green-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.icon}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 mb-1">{stat.label}</span>
              <span className="block text-2xl font-black text-gray-900">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Approvals Needed */}
        <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">warning</span>
              معارض بانتظار الموافقة
            </h3>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm text-gray-400">
                    <span className="material-symbols-outlined">store</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">معرض الأبطال للسيارات</h4>
                    <p className="text-xs text-gray-500">القاهرة • مسجل منذ ساعتين</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm">اعتماد</button>
                  <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors">مراجعة</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Tajawal'] flex">
      {renderSidebar()}
      
      <main className="flex-1 lg:mr-64 p-4 sm:p-8 pt-24 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' ? renderDashboardHome() : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4 text-[#c97a1e]/50">construction</span>
              <h3 className="text-2xl font-black text-gray-900 mb-2">قسم تحت التطوير</h3>
              <p className="font-medium text-gray-500">سيتم تفعيل هذه الشاشة في التحديث القادم.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
