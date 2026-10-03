import React, { useState, useEffect } from "react";
import { Car, DealerRequest } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';

interface DealerDashboardScreenProps {
  fleetOverride?: Car[];
  requestsOverride?: DealerRequest[];
  onRespondRequest?: (id: string, status: "confirmed" | "declined") => void;
  onToggleCar?: (id: string, status: "available" | "maintenance") => void;
  onBackToCustomer: () => void;
  onOpenAddCarModal: () => void;
  onOpenSettlementsModal: () => void;
}

export const DealerDashboardScreen: React.FC<DealerDashboardScreenProps> = ({
  fleetOverride = [],
  requestsOverride = [],
  onRespondRequest,
  onToggleCar,
  onBackToCustomer,
  onOpenAddCarModal,
  onOpenSettlementsModal,
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [fleet, setFleet] = useState<Car[]>(fleetOverride);
  const [requests, setRequests] = useState<DealerRequest[]>(requestsOverride);

  useEffect(() => {
    if (fleetOverride.length) setFleet(fleetOverride);
  }, [fleetOverride]);

  useEffect(() => {
    if (requestsOverride.length) setRequests(requestsOverride);
  }, [requestsOverride]);

  // Statistics
  const totalCars = fleet.length;
  const availableCars = fleet.filter(c => c.status === 'available').length;
  const rentedCars = fleet.filter(c => c.status === 'rented').length;
  
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const confirmedRequests = requests.filter(r => r.status === 'confirmed').length;
  const totalRevenue = requests.filter(r => r.status === 'completed' || r.status === 'confirmed').reduce((acc, r) => acc + r.totalPrice, 0);

  const renderSidebar = () => (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-l border-gray-100 min-h-screen fixed right-0 top-0 z-40 pt-24 pb-8">
      <div className="px-6 mb-8">
        <h2 className="text-xl font-black text-gray-900">لوحة تحكم المعرض</h2>
        <p className="text-xs text-gray-500 font-bold mt-1">إدارة السيارات والحجوزات</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {[
          { id: 'dashboard', icon: 'dashboard', label: 'الرئيسية' },
          { id: 'cars', icon: 'directions_car', label: 'سياراتي' },
          { id: 'bookings', icon: 'receipt_long', label: 'الحجوزات', badge: pendingRequests },
          { id: 'messages', icon: 'chat', label: 'الرسائل' },
          { id: 'notifications', icon: 'notifications', label: 'الإشعارات' },
          { id: 'profile', icon: 'storefront', label: 'موقع المعرض' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
              activeTab === item.id 
                ? 'bg-[#121c28] text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </div>
            {item.badge ? (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === item.id ? 'bg-[#c97a1e] text-white' : 'bg-red-100 text-red-600'}`}>
                {item.badge}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="px-4 mt-auto space-y-2">
        <button 
          onClick={onOpenSettlementsModal}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-bold text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          المستحقات المالية
        </button>
        <button 
          onClick={onBackToCustomer}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#c97a1e] bg-[#c97a1e]/10 hover:bg-[#c97a1e]/20 transition-all font-bold text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">visibility</span>
          عرض الموقع كعميل
        </button>
      </div>
    </aside>
  );

  const renderDashboardHome = () => (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-1">مرحباً بك!</h2>
          <p className="text-gray-500 font-medium">إليك نظرة عامة على نشاط معرضك اليوم.</p>
        </div>
        <button onClick={onOpenAddCarModal} className="hidden sm:flex bg-[#c97a1e] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#ab6300] transition-colors items-center gap-2 shadow-md">
          <span className="material-symbols-outlined">add</span>
          إضافة سيارة جديدة
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'إجمالي السيارات', value: totalCars, icon: 'directions_car', color: 'text-gray-600', bg: 'bg-gray-100' },
          { label: 'المتاحة', value: availableCars, icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'المحجوزة', value: rentedCars, icon: 'lock', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'طلبات جديدة', value: pendingRequests, icon: 'fiber_new', color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'حجوزات مؤكدة', value: confirmedRequests, icon: 'task_alt', color: 'text-[#2c7a7b]', bg: 'bg-[#2c7a7b]/10' },
          { label: 'الإيرادات المتوقعة', value: `${totalRevenue} ج.م`, icon: 'payments', color: 'text-[#121c28]', bg: 'bg-gray-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 mb-1">{stat.label}</span>
              <span className="block text-xl font-black text-gray-900">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-gray-900">أحدث الطلبات</h3>
            <button onClick={() => setActiveTab('bookings')} className="text-[#c97a1e] text-sm font-bold hover:underline">عرض الكل</button>
          </div>
          {pendingRequests === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد طلبات جديدة حالياً.</div>
          ) : (
            <div className="space-y-4">
              {requests.filter(r => r.status === 'pending').slice(0, 3).map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#121c28] rounded-full flex items-center justify-center text-white font-bold">
                      {req.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{req.carName}</h4>
                      <p className="text-xs text-gray-500">{req.customerName} • {req.period}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onRespondRequest?.(req.id, 'confirmed')} className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <button onClick={() => onRespondRequest?.(req.id, 'declined')} className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCars = () => (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-900">سياراتي</h2>
        <button onClick={onOpenAddCarModal} className="bg-[#121c28] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#c97a1e] transition-colors items-center gap-2 flex shadow-md">
          <span className="material-symbols-outlined text-[20px]">add</span>
          إضافة سيارة
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-500">السيارة</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500">السعر اليومي</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500">الحالة</th>
                <th className="px-6 py-4 text-xs font-black text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fleet.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">لا توجد سيارات مضافة حالياً.</td>
                </tr>
              ) : fleet.map((car) => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={car.image} alt={car.name} className="w-16 h-12 rounded-lg object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm mb-1">{car.name}</p>
                        <EgyptianPlateBadge letters={car.plateLetters} numbers={car.plateNumbers} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-[#2c7a7b]">{car.dailyPrice}</span> ج.م
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      car.status === 'available' ? 'bg-green-100 text-green-700' :
                      car.status === 'rented' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {car.statusAr}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#c97a1e] transition-colors rounded-lg hover:bg-[#c97a1e]/10">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => onToggleCar?.(car.id, car.status === 'available' ? 'maintenance' : 'available')}
                        className={`p-2 transition-colors rounded-lg ${car.status === 'available' ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-amber-500 hover:text-green-500 hover:bg-green-50'}`}
                        title={car.status === 'available' ? 'إيقاف السيارة' : 'إتاحة السيارة'}
                      >
                        <span className="material-symbols-outlined text-[20px]">{car.status === 'available' ? 'block' : 'check_circle'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <h2 className="text-2xl font-black text-gray-900">طلبات الحجز</h2>
      
      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-500">
            لا توجد حجوزات حالياً.
          </div>
        ) : requests.map(req => (
          <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1">
              <div>
                <span className="text-xs text-gray-500 font-bold block mb-1">العميل</span>
                <span className="font-bold text-gray-900 text-sm block">{req.customerName}</span>
                <span className="text-xs text-gray-500">{req.customerPhone}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block mb-1">السيارة</span>
                <span className="font-bold text-gray-900 text-sm block">{req.carName}</span>
                <span className="text-xs text-gray-500">{req.route}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block mb-1">المدة</span>
                <span className="font-bold text-gray-900 text-sm block">{req.days} أيام</span>
                <span className="text-xs text-gray-500">{req.period}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 font-bold block mb-1">الإجمالي</span>
                <span className="font-black text-[#2c7a7b] text-lg block">{req.totalPrice} ج.م</span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:border-r border-gray-100 md:pr-6">
              {req.status === 'pending' ? (
                <>
                  <button onClick={() => onRespondRequest?.(req.id, 'confirmed')} className="px-6 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-sm">
                    قبول
                  </button>
                  <button onClick={() => onRespondRequest?.(req.id, 'declined')} className="px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors">
                    رفض
                  </button>
                </>
              ) : (
                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                  req.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  req.status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {req.statusAr}
                </span>
              )}
              <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-[#c97a1e]/10 hover:text-[#c97a1e] transition-colors">
                <span className="material-symbols-outlined">chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-['Tajawal'] flex">
      {renderSidebar()}
      
      <main className="flex-1 lg:mr-64 p-4 sm:p-8 pt-24 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboardHome()}
          {activeTab === 'cars' && renderCars()}
          {activeTab === 'bookings' && renderBookings()}
          {['messages', 'notifications', 'profile'].includes(activeTab) && (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <span className="material-symbols-outlined text-6xl mb-4">construction</span>
               <h3 className="text-xl font-bold text-gray-900 mb-2">قريباً</h3>
               <p>هذا القسم قيد التطوير في المراحل القادمة.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};
