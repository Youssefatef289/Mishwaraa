import React, { useEffect, useState } from "react";
import { Car, DealerRequest } from "../types";
import { MOCK_CARS, INITIAL_DEALER_REQUESTS } from "../data/mockData";
import { EgyptianPlateBadge } from "./EgyptianPlateBadge";
import { HighwayDivider } from "./HighwayDivider";

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
  fleetOverride,
  requestsOverride,
  onRespondRequest,
  onToggleCar,
  onBackToCustomer,
  onOpenAddCarModal,
  onOpenSettlementsModal,
}) => {
  const [fleet, setFleet] = useState<Car[]>(
    fleetOverride ?? MOCK_CARS.slice(4),
  );
  const [requests, setRequests] = useState<DealerRequest[]>(
    requestsOverride ?? INITIAL_DEALER_REQUESTS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("dashboard");

  useEffect(() => {
    if (fleetOverride) setFleet(fleetOverride);
  }, [fleetOverride]);

  useEffect(() => {
    if (requestsOverride) setRequests(requestsOverride);
  }, [requestsOverride]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggleCarAvailability = (carId: string) => {
    const car = fleet.find((item) => item.id === carId);
    if (car)
      onToggleCar?.(
        carId,
        car.status === "maintenance" ? "available" : "maintenance",
      );
    setFleet((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          const newStatus =
            car.status === "available" ? "reserved" : "available";
          const newStatusAr =
            newStatus === "available" ? "متاح للحجز الآن" : "غير معروض بالمنصة";
          return { ...car, status: newStatus, statusAr: newStatusAr };
        }
        return car;
      }),
    );
    showToast("تم تحديث حالة إتاحة المركبة بالمنصة بنجاح.");
  };

  const handleCompleteMaintenance = (carId: string) => {
    setFleet((prev) =>
      prev.map((car) => {
        if (car.id === carId) {
          return {
            ...car,
            status: "available",
            statusAr: "متاح للحجز الآن - بعد الصيانة",
          };
        }
        return car;
      }),
    );
    showToast(
      "تم اعتماد الفحص الدوري وتأكيد انتهاء الصيانة وإعادة تفعيل السيارة.",
    );
  };

  const handleAcceptRequest = (reqId: string) => {
    onRespondRequest?.(reqId, "confirmed");
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "confirmed",
              statusAr: "حجز مؤكد وجاري التجهيز",
            }
          : r,
      ),
    );
    showToast("تم قبول طلب الحجز وإرسال كود التأكيد للعميل.");
  };

  const handleDeclineRequest = (reqId: string) => {
    onRespondRequest?.(reqId, "declined");
    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: "declined",
              statusAr: "تم الاعتذار لعدم الإتاحة",
            }
          : r,
      ),
    );
    showToast("تم تسجيل الاعتذار وتوجيه العميل لخيارات بديلة بالشبكة.");
  };

  const filteredFleet = fleet.filter(
    (c) =>
      c.name.includes(searchQuery) ||
      c.plateLetters.includes(searchQuery) ||
      c.plateNumbers.includes(searchQuery),
  );

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#121c28] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#3aa6a6] flex items-center gap-2 text-xs font-bold animate-bounce">
          <span className="material-symbols-outlined text-[#3aa6a6] text-[18px]">
            verified
          </span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar for Dealer View */}
      <div className="h-16 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#d9c3b1]/40 z-40 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#534437]">
            <span className="material-symbols-outlined text-[#884e00] text-[18px]">
              alt_route
            </span>
            <span className="font-bold">
              شبكة مصر للطرق السريعة نشطة (محور القاهرة / الساحل)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCustomer}
            className="text-xs font-bold text-[#0f6969] hover:text-[#884e00] bg-[#eef4ff] px-3 py-1.5 rounded-lg border border-[#d9c3b1]/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              visibility
            </span>
            <span>معاينة المنصة العامة للمسافرين</span>
          </button>

          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-[#d9c3b1]"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UEkxMemjP9Ew19bEaX8hcWGBp8Rq3UxWll9VMOKUjUMpZaQUJHB1ygwzwLPWCVePi0vxGxSmsBW5MU1QfdkrI3PyM_zvpfkhd9xbvJr20dEpQ1edI7sn3IWMEjGWkTaL6q5DyO7EwiEUjLeB_0UP2bLyIpL5wU0rKjSgb4OV2J0mCYkOC-ccFn1iYYXWCOrgzFnMKYwyO_lPvpySCOOK-b16R1_IQC7tz8N96SxXVdjmqlN4xZHZq_sEA"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Right Sidebar for Desktop */}
        <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-l border-[#d9c3b1]/40 flex flex-col justify-between p-4 shrink-0 shadow-xs">
          <div>
            <div className="mb-6 flex items-center justify-between pb-3 border-b border-[#d9c3b1]/30">
              <div className="flex items-center gap-2">
                <div className="border border-[#d9c3b1] rounded px-2 py-0.5 bg-[#eef4ff] flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-[#867465]" />
                  <span className="font-bold text-base text-[#884e00]">
                    مشوار
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#867465]" />
                </div>
              </div>
              <span className="font-mono-numeric text-xs text-[#0f6969] bg-[#a4f0ef]/50 px-1.5 py-0.5 rounded font-bold">
                المعارض
              </span>
            </div>

            <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setActiveNav("dashboard")}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeNav === "dashboard"
                    ? "bg-[#ab6300] text-white"
                    : "text-[#534437] hover:bg-[#eef4ff]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  dashboard
                </span>
                <span>لوحة العمليات</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("fleet");
                  showToast("عرض كافة سيارات أسطول المعرض.");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeNav === "fleet"
                    ? "bg-[#ab6300] text-white"
                    : "text-[#534437] hover:bg-[#eef4ff]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  directions_car
                </span>
                <span>أسطول السيارات</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("reservations");
                  showToast("سجل حجوزات المعرض مع العملاء.");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeNav === "reservations"
                    ? "bg-[#ab6300] text-white"
                    : "text-[#534437] hover:bg-[#eef4ff]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  receipt_long
                </span>
                <span>سجل الحجوزات</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav("telematics");
                  showToast("تتبع تيليماتكس مباشر لسرعات ومواقع المركبات.");
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  activeNav === "telematics"
                    ? "bg-[#ab6300] text-white"
                    : "text-[#534437] hover:bg-[#eef4ff]"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  sensors
                </span>
                <span>التتبع والتيليماتكس</span>
              </button>

              <button
                onClick={onOpenSettlementsModal}
                className="flex items-center gap-2 px-3 py-2 rounded text-xs font-bold text-[#534437] hover:bg-[#eef4ff] transition-colors whitespace-nowrap cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  payments
                </span>
                <span>الحسابات والتسوية</span>
              </button>
            </nav>
          </div>

          <div className="pt-3 border-t border-[#d9c3b1]/40 hidden lg:block">
            <div className="flex items-center justify-between text-xs text-[#534437]">
              <span>حالة الرادار والشبكة:</span>
              <span className="inline-flex items-center gap-1.5 text-[#056a41] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#056a41] animate-ping" />
                متصل
              </span>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Screen Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[960px] mx-auto w-full flex flex-col gap-6">
          {/* Welcome Row */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center flex-wrap gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-[#121c28]">
                  معرض النخبة موتورز
                </h1>
                <span className="text-xs text-[#534437]">
                  (المهندسين، الجيزة)
                </span>

                {/* Verified Dealer Egyptian License Plate Badge */}
                <div className="relative px-3 py-1 bg-[#eef4ff] rounded border border-[#d9c3b1] inline-flex items-center gap-2 shadow-xs">
                  <span className="w-1 h-1 rounded-full bg-[#867465]" />
                  <span className="font-mono-numeric text-xs text-[#0f6969] font-bold tracking-wider">
                    ت ر خ ١ ٠ ٨ ٤
                  </span>
                  <span className="text-[#d9c3b1]">|</span>
                  <span className="text-xs text-[#056a41] font-bold flex items-center gap-1">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    معرض معتمد
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#867465]" />
                </div>
              </div>

              <p className="text-xs text-[#534437]">
                نظام تشغيل وإدارة أسطول المركبات ومزامنة طلبات تأجير الطرق
                السريعة الفورية
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={onOpenAddCarModal}
                className="bg-[#884e00] hover:bg-[#ab6300] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  add_circle
                </span>
                <span>إضافة سيارة جديدة</span>
              </button>
              <button
                onClick={onOpenSettlementsModal}
                className="bg-[#0f6969] hover:bg-[#0f6969]/90 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  summarize
                </span>
                <span>تقرير التسويات المالية</span>
              </button>
            </div>
          </div>

          {/* Telematics & Fleet Key Metrics Row (4 Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#534437]">
                  السيارات المتاحة بالمعرض
                </span>
                <span className="p-1 rounded-md bg-[#056a41]/10 text-[#056a41]">
                  <span className="material-symbols-outlined text-[18px]">
                    check_circle
                  </span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-mono-numeric text-2xl text-[#056a41] font-bold bg-[#eef4ff] px-2 py-0.5 rounded">
                  14
                </span>
                <span className="text-xs text-[#534437]">من أصل 18 مركبة</span>
              </div>
              <div className="w-full bg-[#dfe9fa] h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#056a41] h-full rounded-full"
                  style={{ width: "77%" }}
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#534437]">
                  طلبات الحجز قيد المراجعة
                </span>
                <span className="p-1 rounded-md bg-[#884e00]/10 text-[#884e00]">
                  <span className="material-symbols-outlined text-[18px]">
                    pending_actions
                  </span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-mono-numeric text-2xl text-[#884e00] font-bold bg-[#ffdcbf]/40 px-2 py-0.5 rounded">
                  03
                </span>
                <span className="text-xs text-[#884e00] font-bold">
                  إجراء فوري مطلوب
                </span>
              </div>
              <div className="w-full bg-[#dfe9fa] h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#884e00] h-full rounded-full"
                  style={{ width: "50%" }}
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#534437]">
                  الحجوزات المؤكدة هذا الشهر
                </span>
                <span className="p-1 rounded-md bg-[#0f6969]/10 text-[#0f6969]">
                  <span className="material-symbols-outlined text-[18px]">
                    route
                  </span>
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-mono-numeric text-2xl text-[#0f6969] font-bold bg-[#a4f0ef]/40 px-2 py-0.5 rounded">
                  27
                </span>
                <span className="text-xs text-[#534437]">رحلة ناجحة</span>
              </div>
              <div className="w-full bg-[#dfe9fa] h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#0f6969] h-full rounded-full"
                  style={{ width: "88%" }}
                />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#534437]">
                  إجمالي إيرادات الشهر الحالي
                </span>
                <span className="p-1 rounded-md bg-[#eef4ff] text-[#121c28]">
                  <span className="material-symbols-outlined text-[18px]">
                    account_balance_wallet
                  </span>
                </span>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="font-mono-numeric text-2xl text-[#121c28] font-bold">
                  84,250
                </span>
                <span className="text-xs text-[#534437]">ج.م</span>
              </div>
              <div className="flex items-center gap-1 mt-2 text-[#056a41] text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  trending_up
                </span>
                <span>+14.2% مقارنة بالشهر السابق</span>
              </div>
            </div>
          </div>

          <HighwayDivider />

          {/* Two-Column Main Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Right Column: Fleet Management (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#884e00] text-[22px]">
                    directions_car
                  </span>
                  <h2 className="font-bold text-base text-[#121c28]">
                    إدارة أسطول المعرض
                  </h2>
                </div>
                <span className="font-mono-numeric text-xs bg-[#eef4ff] px-2 py-0.5 rounded text-[#534437] font-bold">
                  {filteredFleet.length} مركبات معروضة
                </span>
              </div>

              {/* Filter / Search Bar */}
              <div className="bg-white p-2 rounded-xl shadow-xs border border-[#d9c3b1]/40 flex items-center gap-2">
                <div className="flex-1 relative flex items-center">
                  <span className="material-symbols-outlined absolute right-3 text-[#534437] text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث برقم اللوحة، الموديل، أو الفئة..."
                    className="w-full bg-[#eef4ff] text-[#121c28] pr-9 pl-3 py-1.5 rounded text-xs focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#121c28] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    tune
                  </span>
                  <span>إعادة تعيين</span>
                </button>
              </div>

              {/* Fleet List Cards */}
              <div className="flex flex-col gap-4">
                {filteredFleet.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-xl p-4 shadow-xs border border-[#d9c3b1]/40 flex flex-col gap-3 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Car Thumbnail */}
                      <div className="w-full sm:w-44 h-28 rounded-lg overflow-hidden shrink-0 relative bg-[#dfe9fa]">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-[#121c28]/85 text-white text-[10px] px-1.5 py-0.5 rounded">
                          {car.categoryAr}
                        </span>
                      </div>

                      {/* Specs */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-[#121c28]">
                              {car.name}
                            </h3>
                            <EgyptianPlateBadge
                              letters={car.plateLetters}
                              numbers={car.plateNumbers}
                              variant="white"
                            />
                          </div>

                          <div className="flex items-center gap-2 text-[#534437] text-xs mt-1">
                            <span className="flex items-center gap-1 font-mono-numeric">
                              <span className="material-symbols-outlined text-[14px]">
                                speed
                              </span>
                              {car.mileage}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">
                                local_gas_station
                              </span>
                              {car.fuel}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-[#d9c3b1]/40">
                          <div className="flex items-baseline gap-1">
                            <span className="font-mono-numeric text-base text-[#884e00] font-bold">
                              {car.dailyPrice.toLocaleString("ar-EG")}
                            </span>
                            <span className="text-[11px] text-[#534437]">
                              ج.م / اليوم
                            </span>
                          </div>

                          <div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                                car.status === "available"
                                  ? "bg-[#9ff5c1] text-[#002111]"
                                  : car.status === "rented"
                                    ? "bg-[#a4f0ef] text-[#002020]"
                                    : "bg-[#ffdad6] text-[#ba1a1a]"
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                              {car.statusAr}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Vehicle Controls Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#eef4ff] gap-2 flex-wrap text-xs">
                      {car.status === "maintenance" ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] text-[#534437]">
                            انتهاء الصيانة المتوقع: اليوم ٦:٠٠ م
                          </span>
                          <button
                            onClick={() => handleCompleteMaintenance(car.id)}
                            className="px-2.5 py-1 rounded bg-[#056a41] text-white hover:bg-[#056a41]/90 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              check_box
                            </span>
                            <span>تأكيد انتهاء الصيانة</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={car.status === "available"}
                                onChange={() =>
                                  handleToggleCarAvailability(car.id)
                                }
                                className="sr-only peer"
                              />
                              <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-[#056a41] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all" />
                            </label>
                            <span className="text-[11px] text-[#534437]">
                              {car.status === "available"
                                ? "معروض بالمنصة"
                                : "موقوف مؤقتاً"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                showToast(`تعديل بيانات مركبة ${car.name}`)
                              }
                              className="px-2.5 py-1 rounded bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#121c28] font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                edit
                              </span>
                              <span>تعديل</span>
                            </button>
                            <button
                              onClick={() =>
                                showToast(
                                  `سجل رحلات وفحص ${car.name}: 12 رحلة مسجلة بنجاح.`,
                                )
                              }
                              className="px-2.5 py-1 rounded bg-[#eef4ff] hover:bg-[#dfe9fa] text-[#121c28] font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                history
                              </span>
                              <span>سجل الرحلات</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left Column: Incoming Booking Requests (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#884e00] text-[22px]">
                    assignment_late
                  </span>
                  <h2 className="font-bold text-base text-[#121c28]">
                    طلبات الحجز الواردة
                  </h2>
                </div>
                <span className="bg-[#884e00]/10 text-[#884e00] font-mono-numeric text-xs px-2 py-0.5 rounded font-bold">
                  {requests.filter((r) => r.status === "pending").length} طلبات
                  جديدة
                </span>
              </div>

              {/* Requests List */}
              <div className="flex flex-col gap-3">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className={`bg-white rounded-xl p-4 shadow-xs border border-[#d9c3b1]/40 flex flex-col gap-2.5 relative overflow-hidden ${
                      req.status === "pending"
                        ? "border-t-4 border-t-[#884e00]"
                        : req.status === "confirmed"
                          ? "border-t-4 border-t-[#056a41]"
                          : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono-numeric text-xs font-bold text-[#884e00]">
                          طلب حجز #{req.code}
                        </span>
                        <h3 className="font-bold text-sm text-[#121c28] mt-0.5">
                          {req.customerName}
                        </h3>
                        <p className="font-mono-numeric text-[11px] text-[#534437]">
                          {req.customerPhone}
                        </p>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          req.status === "pending"
                            ? "bg-[#ffdcbf] text-[#884e00]"
                            : req.status === "confirmed"
                              ? "bg-[#9ff5c1] text-[#002111]"
                              : req.status === "completed"
                                ? "bg-[#eef4ff] text-[#534437]"
                                : "bg-[#ffdad6] text-[#ba1a1a]"
                        }`}
                      >
                        {req.statusAr}
                      </span>
                    </div>

                    <div className="bg-[#eef4ff] p-2.5 rounded-lg flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[#534437]">
                          السيارة المطلوبة:
                        </span>
                        <span className="font-bold text-[#121c28]">
                          {req.carName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#534437]">مسار المشوار:</span>
                        <span className="text-[#0f6969] font-bold">
                          {req.route}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#534437]">فترة الحجز:</span>
                        <span className="font-mono-numeric text-[#121c28]">
                          {req.period}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#d9c3b1]/30">
                        <span className="font-bold text-[#534437]">
                          إجمالي الحساب:
                        </span>
                        <span className="font-mono-numeric text-sm text-[#884e00] font-bold">
                          {req.totalPrice.toLocaleString("ar-EG")} ج.م
                        </span>
                      </div>
                    </div>

                    {/* Actions based on Request Status */}
                    {req.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => handleAcceptRequest(req.id)}
                          className="bg-[#056a41] hover:bg-[#056a41]/90 text-white text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all active:scale-95 shadow-xs cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            check
                          </span>
                          <span>قبول وتجهيز السيارة</span>
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="bg-[#eef4ff] hover:bg-[#ffdad6] text-[#ba1a1a] text-xs py-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            close
                          </span>
                          <span>اعتذار / غير متاح</span>
                        </button>
                      </div>
                    ) : req.status === "confirmed" ? (
                      <div className="flex items-center justify-between pt-1">
                        <a
                          href={`tel:${req.customerPhone}`}
                          className="text-[#0f6969] text-xs font-bold flex items-center gap-1 hover:underline"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            call
                          </span>
                          <span>اتصال بالعميل للتنسيق</span>
                        </a>
                        <span className="font-mono-numeric text-[11px] text-[#056a41] font-bold">
                          الدفعة مسددة بالكامل
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[#056a41] font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">
                            verified
                          </span>
                          <span>تم فحص السيارة وإغلاق العقد</span>
                        </span>
                        <span className="font-mono-numeric text-xs font-bold text-[#121c28]">
                          {req.totalPrice.toLocaleString("ar-EG")} ج.م
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Highway Safety Telematics Reminder Card */}
              <div className="bg-[#eef4ff] p-4 rounded-xl flex items-center gap-3 border border-[#d9c3b1]/40">
                <span className="material-symbols-outlined text-[#884e00] text-[28px] shrink-0">
                  speed
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-[#121c28]">
                    إشعار نظام السلامة المرورية
                  </span>
                  <p className="text-[11px] text-[#534437] leading-relaxed mt-0.5">
                    جميع مركبات المعرض مزودة بأجهزة تحديد السرعة القصوى ومتابعة
                    ضغط الإطارات لطرق السفر السريعة طبقاً للائحة منصة مشوار.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
