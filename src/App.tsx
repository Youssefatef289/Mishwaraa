import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Car, Booking, DealerRequest } from './types';
import { MOCK_CARS, INITIAL_ACTIVE_BOOKING } from './data/mockData';
import { supabase, isSupabaseConfigured, getCurrentUser, signOutUser } from './lib/supabase';
import { loadLiveCars, loadDealerOps, loadMyBookings, persistBooking, respondToBooking, setCarStatus } from './lib/integration';
import { AuthModal } from './components/AuthModal';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeScreen } from './components/HomeScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { ConfirmationScreen } from './components/ConfirmationScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';
import { DealerDashboardScreen } from './components/DealerDashboardScreen';
import { AddCarModal } from './components/AddCarModal';
import { SettlementsModal } from './components/SettlementsModal';
import { RegisterDealerModal } from './components/RegisterDealerModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'checkout' | 'confirmation' | 'bookings' | 'dealer'
  >('home');
  const [selectedCar, setSelectedCar] = useState<Car>(MOCK_CARS[0]);
  const [activeBooking, setActiveBooking] = useState<Booking>(INITIAL_ACTIVE_BOOKING);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  // Modals state
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [isSettlementsOpen, setIsSettlementsOpen] = useState(false);
  const [isRegisterDealerOpen, setIsRegisterDealerOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  // ===== الربط المباشر مع قاعدة البيانات (Supabase) =====
  const [liveCars, setLiveCars] = useState<Car[] | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [dealerOps, setDealerOps] = useState<{ fleet: Car[]; requests: DealerRequest[] } | null>(null);
  const [liveBookings, setLiveBookings] = useState<Booking[] | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<'customer' | 'dealer'>('customer');

  // تحميل الجلسة والأسطول عند الإقلاع + الاستماع لتغيّر حالة المصادقة
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const u = await getCurrentUser();
      if (cancelled) return;
      setUser(u);
      const cars = await loadLiveCars();
      if (!cancelled && cars && cars.length) {
        setLiveCars(cars);
        setSelectedCar(cars[0]);
      }
      if (u) {
        const ops = await loadDealerOps();
        if (!cancelled && ops) setDealerOps(ops);
        const bk = await loadMyBookings();
        if (!cancelled && bk) setLiveBookings(bk);
      }
    })();

    const sub = supabase?.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (!nextUser) {
        setDealerOps(null);
        setLiveBookings(null);
        return;
      }
      loadDealerOps().then((ops) => { if (ops) setDealerOps(ops); });
      loadMyBookings().then((bk) => { if (bk) setLiveBookings(bk); });
    });
    return () => {
      cancelled = true;
      sub?.data.subscription.unsubscribe();
    };
  }, []);

  const handleAuthed = (u: User) => {
    setUser(u);
    loadDealerOps().then((ops) => { if (ops) setDealerOps(ops); });
    loadMyBookings().then((bk) => { if (bk) setLiveBookings(bk); });
    showToast('مرحباً بك في مشوار! تمت مزامنة حسابك.');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setDealerOps(null);
    setLiveBookings(null);
    showToast('تم تسجيل الخروج بنجاح.');
  };

  const handleRespondRequest = (id: string, status: 'confirmed' | 'declined') => {
    respondToBooking(id, status === 'confirmed' ? 'confirmed' : 'rejected').then((res) => {
      if (res.ok) showToast('تمت مزامنة رد المعرض مع قاعدة البيانات.');
      else if (res.error !== 'request-id') showToast(res.error || 'تعذرت المزامنة — يعمل الوضع التجريبي.');
    });
  };

  const handleToggleCar = (id: string, status: 'available' | 'maintenance') => {
    setCarStatus(id, status).then((res) => {
      if (!res.ok && res.error !== 'car-id' && res.error) showToast(res.error);
    });
  };

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3000);
  };

  const handleSelectCarForCheckout = (car: Car) => {
    setSelectedCar(car);
    setCurrentScreen('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setActiveBooking(newBooking);
    setCurrentScreen('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // حفظ الحجز في قاعدة البيانات عند توفرها وحساب مسجل
    if (liveCars && user && newBooking.car) {
      const dbCar = liveCars.find((c) => c.id === newBooking.car.id);
      if (dbCar) {
        persistBooking({
          carId: dbCar.id,
          originCity: dbCar.location.split('،')[0] || dbCar.location,
          destination: newBooking.dropoffLocation,
          distanceKm: newBooking.distanceKm,
          days: newBooking.days,
          startDate: new Date().toISOString().slice(0, 10),
          pricePerDay: newBooking.dailyPrice,
          totalPrice: newBooking.totalPrice,
        }).then((res) => {
          showToast(res.ok ? 'تم حفظ الحجز في قاعدة البيانات بنجاح.' : res.error || 'يعمل الوضع المحلي.');
        });
      }
    } else if (isSupabaseConfigured && !user) {
      showToast('سجّل دخولك من زر «حسابي» لحفظ الحجز في حسابك على مشوار.');
    }
  };

  const handleAddCarToFleet = (newCar: Car) => {
    MOCK_CARS.push(newCar);
    showToast(`تمت إضافة ${newCar.name} لأسطول المعرض بنجاح!`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c28] flex flex-col font-sans selection:bg-[#ffdcbf] selection:text-[#2d1600]">
      {/* Global Toast */}
      {globalToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#121c28] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#3aa6a6] flex items-center gap-2 text-xs font-bold animate-bounce">
          <span className="material-symbols-outlined text-[#3aa6a6] text-[18px]">verified</span>
          <span>{globalToast}</span>
        </div>
      )}

      {/* Main Top Header (hidden when in Dealer Dashboard for full operations layout) */}
      {currentScreen !== 'dealer' && (
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isMobileView={isMobileView}
          onToggleMobileView={() => setIsMobileView(!isMobileView)}
          onOpenRegisterDealerModal={() => setIsRegisterDealerOpen(true)}
          userName={isSupabaseConfigured ? (user?.email?.split('@')[0] ?? user?.email) : undefined}
          onOpenAuth={() => { setAuthMode('signin'); setShowAuthModal(true); }}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Content Area: Responsive or Mobile Simulator Frame */}
      <div
        className={`flex-1 flex flex-col transition-all ${
          isMobileView
            ? 'max-w-[430px] mx-auto my-4 bg-white rounded-3xl shadow-2xl border-8 border-[#27313e] overflow-hidden min-h-[880px] pb-16 relative'
            : 'w-full'
        }`}
      >
        {/* Mobile Device Notch Simulation in Mobile View */}
        {isMobileView && (
          <div className="w-full bg-[#1e232b] text-white py-1 px-4 flex items-center justify-between text-[11px] font-mono-numeric select-none z-50">
            <span>09:41</span>
            <div className="w-20 h-4 bg-black rounded-full mx-auto" />
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
              <span className="material-symbols-outlined text-[14px]">wifi</span>
              <span className="material-symbols-outlined text-[14px]">battery_full</span>
            </div>
          </div>
        )}

        {/* Screen 1: Home / Discovery */}
        {currentScreen === 'home' && (
          <HomeScreen
            carsOverride={liveCars ?? undefined}
            dbConnected={Boolean(liveCars)}
            onSelectCar={handleSelectCarForCheckout}
            onNavigateToDealer={() => {
              setCurrentScreen('dealer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegisterDealerModal={() => setIsRegisterDealerOpen(true)}
          />
        )}

        {/* Screen 2: Checkout / Trip Configuration */}
        {currentScreen === 'checkout' && (
          <CheckoutScreen
            selectedCar={selectedCar}
            onConfirmBooking={handleBookingConfirmed}
            onBackToHome={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 3: Confirmation & Digital Boarding Pass Ticket */}
        {currentScreen === 'confirmation' && (
          <ConfirmationScreen
            booking={activeBooking}
            onNavigateToBookings={() => {
              setCurrentScreen('bookings');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToHome={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 4: Customer Bookings Portal */}
        {currentScreen === 'bookings' && (
          <MyBookingsScreen
            activeBooking={activeBooking}
            liveBookings={liveBookings ?? undefined}
            onNewBookingClick={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDigitalTicket={() => {
              setCurrentScreen('confirmation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Screen 5: Dealer Operations Dashboard */}
        {currentScreen === 'dealer' && (
          <DealerDashboardScreen
            onBackToCustomer={() => {
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAddCarModal={() => setIsAddCarOpen(true)}
            onOpenSettlementsModal={() => setIsSettlementsOpen(true)}
            fleetOverride={dealerOps?.fleet ?? undefined}
            requestsOverride={dealerOps?.requests ?? undefined}
            onRespondRequest={handleRespondRequest}
            onToggleCar={handleToggleCar}
          />
        )}

        {/* Mobile Bottom Navigation in Mobile Simulator View */}
        {isMobileView && (
          <MobileBottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => {
              setCurrentScreen(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCallSupport={() => showToast('الخط الساخن المباشر لطوارئ الطرق السريعة: 19822')}
          />
        )}
      </div>

      {/* Main Footer (shown in Desktop view for customer screens) */}
      {currentScreen !== 'dealer' && !isMobileView && (
        <Footer
          onNavigate={(screen) => {
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {/* Modals */}
      <AddCarModal
        isOpen={isAddCarOpen}
        onClose={() => setIsAddCarOpen(false)}
        onAddCar={handleAddCarToFleet}
      />

      <SettlementsModal
        isOpen={isSettlementsOpen}
        onClose={() => setIsSettlementsOpen(false)}
      />

      <RegisterDealerModal
        isOpen={isRegisterDealerOpen}
        onClose={() => setIsRegisterDealerOpen(false)}
        onSuccess={() => {
          showToast('تم إرسال طلب تسجيل معرضك بنجاح! شكراً لانضمامك إلى مشوار.');
        }}
      />

      <AuthModal
        isOpen={showAuthModal}
        initialMode={authMode}
        initialRole={authRole}
        onClose={() => setShowAuthModal(false)}
        onAuthed={handleAuthed}
      />
    </div>
  );
}
