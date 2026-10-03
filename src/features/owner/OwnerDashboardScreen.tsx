import React, { useState } from "react";
import { Car, DealerRequest } from '@/src/core/types';
import { EgyptianPlateBadge } from '@/src/shared/EgyptianPlateBadge';

interface OwnerDashboardScreenProps {
  fleetOverride?: Car[];
  requestsOverride?: DealerRequest[];
  onRespondRequest?: (id: string, status: "confirmed" | "declined") => void;
  onToggleCar?: (id: string, status: "available" | "maintenance") => void;
  onBackToCustomer: () => void;
  onOpenAddCarModal: () => void;
}

export const OwnerDashboardScreen: React.FC<OwnerDashboardScreenProps> = ({
  fleetOverride,
  requestsOverride,
  onRespondRequest,
  onToggleCar,
  onBackToCustomer,
  onOpenAddCarModal,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'requests'>('overview');
  
  const fleet = fleetOverride || [];
  const requests = requestsOverride || [];

  const totalCars = fleet.length;
  const availableCars = fleet.filter(c => c.status === 'available').length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const estimatedRevenue = requests.filter(r => r.status === 'confirmed').reduce((acc, r) => acc + r.totalPrice, 0);

  const handleToggleCar = (id: string, currentStatus: string) => {
    if (onToggleCar) {
      onToggleCar(id, currentStatus === 'available' ? 'maintenance' : 'available');
    }
  };

  const Sidebar = () => (
    <div className="hidden md:flex flex-col w-64 bg-white border-l border-gray-100 min-h-screen p-4 sticky top-0">
      <div className="flex items-center gap-3 mb-8 px-2 cursor-pointer" onClick={onBackToCustomer}>
        <div className="w-10 h-10 bg-gradient-to-tr from-[#2c7a7b] to-[#234e52] rounded-full flex items-center justify-center text-white shadow-md">
          <span className="material-symbols-outlined text-2xl">person</span>
        </div>
        <div>
          <h2 className="font-black text-gray-900 text-lg leading-tight">لوحة المالك</h2>
          <span className="text-xs text-gray-500">حساب شخصي</span>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        <SidebarItem icon="dashboard" label="نظرة عامة" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <SidebarItem icon="directions_car" label="سياراتي" badge={totalCars} active={activeTab === 'cars'} onClick={() => setActiveTab('cars')} />
        <SidebarItem icon="list_alt" label="الطلبات" badge={pendingRequests} badgeColor="bg-red-500" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors w-full text-right">
          <span className="material-symbols-outlined text-[20px]">account_circle</span>
          <span className="text-sm font-bold">تعديل حسابي</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9ff]">
      <Sidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">مرحباً بك في لوحة تحكم المالك</h1>
            <p className="text-gray-500 text-sm mt-1">أدر سياراتك الشخصية المعروضة للإيجار وتابع طلبات الحجز الخاصة بك.</p>
          </div>
          <button onClick={onOpenAddCarModal} className="flex items-center gap-2 px-6 py-2.5 bg-[#2c7a7b] text-white font-bold rounded-xl hover:bg-[#234e52] transition-all shadow-md active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add</span>
            إضافة سيارة جديدة
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon="directions_car" label="سياراتي" value={totalCars} color="text-[#2c7a7b]" bg="bg-[#2c7a7b]/10" />
              <StatCard icon="check_circle" label="متاح للتأجير" value={availableCars} color="text-green-600" bg="bg-green-50" />
              <StatCard icon="notifications_active" label="طلبات جديدة" value={pendingRequests} color="text-red-600" bg="bg-red-50" />
              <StatCard icon="account_balance_wallet" label="أرباحي (تقريبي)" value={`${estimatedRevenue.toLocaleString()} ج`} color="text-[#b7791f]" bg="bg-[#b7791f]/10" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-gray-900">أحدث الطلبات</h3>
                <button onClick={() => setActiveTab('requests')} className="text-sm text-[#2c7a7b] font-bold hover:underline">عرض الكل</button>
              </div>
              
              {requests.length === 0 ? (
                <EmptyState icon="inbox" title="لا توجد طلبات" message="ستظهر طلبات استئجار سياراتك هنا." />
              ) : (
                <div className="space-y-4">
                  {requests.slice(0, 3).map(req => (
                    <div key={req.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 bg-[#2c7a7b]/10 rounded-full flex items-center justify-center text-[#2c7a7b] shrink-0">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{req.customerName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{req.carName} • {req.days} أيام</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          req.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          req.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          req.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {req.statusAr}
                        </span>
                        <span className="font-black text-gray-900">{req.totalPrice} ج</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cars' && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            {fleet.length === 0 ? (
              <EmptyState icon="directions_car" title="ليس لديك سيارات" message="قم بإضافة سيارتك الشخصية لتبدأ في جني الأرباح." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {fleet.map(car => (
                  <div key={car.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-40">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                        car.status === 'available' ? 'bg-green-500' : 'bg-orange-500'
                      }`}>
                        {car.statusAr}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{car.name}</h3>
                          <p className="text-xs text-gray-500">{car.categoryAr} • {car.year}</p>
                        </div>
                        <EgyptianPlateBadge letters={car.plateLetters} numbers={car.plateNumbers} />
                      </div>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <div>
                          <span className="font-black text-[#2c7a7b]">{car.dailyPrice} ج</span>
                          <span className="text-xs text-gray-500"> / يوم</span>
                        </div>
                        <button 
                          onClick={() => handleToggleCar(car.id, car.status)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                            car.status === 'available' 
                              ? 'border-orange-200 text-orange-700 hover:bg-orange-50'
                              : 'border-green-200 text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {car.status === 'available' ? 'إيقاف مؤقت' : 'تفعيل للإيجار'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-6 animate-[fadeIn_0.3s_ease-out]">
            {requests.length === 0 ? (
              <EmptyState icon="receipt_long" title="لا توجد طلبات" message="الطلبات الواردة على سياراتك ستظهر هنا لتتمكن من مراجعتها." />
            ) : (
              <div className="space-y-4">
                {requests.map(req => (
                  <div key={req.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8 flex-1">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">المستأجر</p>
                        <p className="font-bold text-gray-900">{req.customerName}</p>
                        <p className="text-xs text-gray-500">{req.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">السيارة</p>
                        <p className="font-bold text-gray-900">{req.carName}</p>
                        <p className="text-xs text-gray-500">{req.pickupTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">المدة</p>
                        <p className="font-bold text-gray-900">{req.days} أيام</p>
                        <p className="font-black text-[#2c7a7b]">{req.totalPrice} ج</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                      {req.status === 'pending' ? (
                        <>
                          <button onClick={() => onRespondRequest?.(req.id, 'confirmed')} className="flex-1 md:flex-none px-6 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition-colors shadow-sm">قبول العرض</button>
                          <button onClick={() => onRespondRequest?.(req.id, 'declined')} className="flex-1 md:flex-none px-6 py-2 bg-red-50 text-red-600 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors">الرفض</button>
                        </>
                      ) : (
                        <span className={`px-4 py-2 text-sm font-bold rounded-lg ${
                          req.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          req.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {req.statusAr}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

// --- Helper Components ---

const SidebarItem = ({ icon, label, badge, badgeColor = "bg-[#2c7a7b]", active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-[#121c28] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
    {badge !== undefined && badge > 0 && (
      <span className={`min-w-[20px] h-5 rounded-full ${badgeColor} text-white text-[10px] font-bold flex items-center justify-center px-1.5`}>
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ icon, label, value, color, bg }: any) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
      <span className="material-symbols-outlined text-[28px]">{icon}</span>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  </div>
);

const EmptyState = ({ icon, title, message }: any) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-4xl text-gray-300">{icon}</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm">{message}</p>
  </div>
);
