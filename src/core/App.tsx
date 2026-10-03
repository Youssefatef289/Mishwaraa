import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Car, Booking, DealerRequest, Profile } from '@/src/core/types';
import { MOCK_CARS, INITIAL_ACTIVE_BOOKING } from '@/src/data/mockData';
import { supabase, isSupabaseConfigured, getCurrentUser, signOutUser } from '@/src/lib/supabase';
import { loadLiveCars, loadDealerOps, loadMyBookings, persistBooking, respondToBooking, setCarStatus } from '@/src/lib/integration';
import { AuthModal } from '@/src/features/auth/AuthModal';
import { Header } from '@/src/shared/Header';
import { Footer } from '@/src/shared/Footer';
import { HomeScreen } from '@/src/features/home/HomeScreen';
import { CheckoutScreen } from '@/src/features/booking/CheckoutScreen';
import { ConfirmationScreen } from '@/src/features/booking/ConfirmationScreen';
import { MyBookingsScreen } from '@/src/features/booking/MyBookingsScreen';
import { DealerDashboardScreen } from '@/src/features/dealer/DealerDashboardScreen';
import { RegisterDealerModal } from '@/src/features/dealer/RegisterDealerModal';
import { MobileBottomNav, ScreenType } from '@/src/shared/MobileBottomNav';
import { AdminScreen } from '@/src/features/admin/AdminScreen';
import { OwnerDashboardScreen } from '@/src/features/owner/OwnerDashboardScreen';
import { PublicDealerScreen } from '@/src/features/dealer/PublicDealerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);

  const [isMobileView, setIsMobileView] = useState(false);
  const [isRegisterDealerOpen, setIsRegisterDealerOpen] = useState(false);

  // Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<'customer' | 'dealer' | 'car_owner'>('customer');

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [liveCars, setLiveCars] = useState<Car[] | null>(null);
  const [dealerOps, setDealerOps] = useState<{ fleet: Car[]; requests: DealerRequest[]; status?: string } | null>(null);
  const [liveBookings, setLiveBookings] = useState<Booking[] | null>(null);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  useEffect(() => {
    if (isSupabaseConfigured) {
      getCurrentUser().then(async ({ user: u, profile: p }) => {
        setUser(u);
        setProfile(p);
        if (u && p) {
          if (p.role === 'dealer') {
            setCurrentScreen('dealer');
          } else if (p.role === 'super_admin') {
            setCurrentScreen('admin');
          } else if (p.role === 'car_owner') {
            setCurrentScreen('owner');
          }
        }
      });
      loadLiveCars().then(setLiveCars);
    } else if (isDemoMode) {
      setLiveCars(MOCK_CARS);
      setActiveBooking(INITIAL_ACTIVE_BOOKING);
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (user && profile?.role === 'dealer' && isSupabaseConfigured) {
      loadDealerOps().then(setDealerOps);
    }
    if (user && profile?.role === 'customer' && isSupabaseConfigured) {
      loadMyBookings().then(setLiveBookings);
    }
  }, [user, profile, currentScreen]);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3000);
  };

  const handleAuthed = async (u: User) => {
    setUser(u);
    setShowAuthModal(false);
    showToast('تم تسجيل الدخول بنجاح!');
    
    // Refresh profile to redirect
    if (isSupabaseConfigured) {
      const { profile: p } = await getCurrentUser();
      setProfile(p);
      if (p?.role === 'dealer') setCurrentScreen('dealer');
      if (p?.role === 'car_owner') setCurrentScreen('owner');
      if (p?.role === 'super_admin') setCurrentScreen('admin');
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setProfile(null);
    setCurrentScreen('home');
    showToast('تم تسجيل الخروج.');
  };

  const handleConfirmBooking = async (b: Booking) => {
    if (!user) {
      setAuthMode('signin');
      setAuthRole('customer');
      setShowAuthModal(true);
      return;
    }
    if (isSupabaseConfigured) {
      const ok = await persistBooking(b);
      if (ok) {
        setActiveBooking(b);
        setCurrentScreen('confirmation');
      } else {
        showToast('حدث خطأ أثناء الحجز، يرجى المحاولة مرة أخرى.');
      }
    } else {
      setActiveBooking(b);
      setCurrentScreen('confirmation');
    }
  };

  const isDesktopDealer = profile?.role === 'dealer' && currentScreen === 'dealer';
  const isDesktopOwner = profile?.role === 'car_owner' && currentScreen === 'owner';
  const isDesktopAdmin = profile?.role === 'super_admin' && currentScreen === 'admin';
  const hideHeaderFooter = isDesktopDealer || isDesktopOwner || isDesktopAdmin;

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f9ff] font-['Tajawal',sans-serif] pb-safe flex flex-col">
      {globalToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl animate-[slideDown_0.3s_ease-out] font-bold">
          {globalToast}
        </div>
      )}

      {!hideHeaderFooter && (
        <Header
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
          isMobileView={isMobileView}
          onToggleMobileView={() => setIsMobileView(!isMobileView)}
          onOpenRegisterDealerModal={() => setIsRegisterDealerOpen(true)}
          userName={profile?.full_name || user?.email?.split('@')[0]}
          onOpenAuth={() => {
            setAuthMode('signin');
            setAuthRole('customer');
            setShowAuthModal(true);
          }}
          onSignOut={handleSignOut}
        />
      )}

      <div className={`flex-1 ${isMobileView ? 'max-w-[428px] mx-auto w-full bg-white shadow-2xl relative overflow-hidden' : ''}`}>
        {currentScreen === 'admin' && profile?.role === 'super_admin' && (
          <AdminScreen />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            carsOverride={liveCars ?? undefined}
            dbConnected={isSupabaseConfigured}
            onSelectCar={(car) => {
              setSelectedCar(car);
              setCurrentScreen('checkout');
            }}
            onOpenBookingModal={(car) => {
              setSelectedCar(car);
              setCurrentScreen('checkout');
            }}
          />
        )}

        {currentScreen === 'checkout' && selectedCar && (
          <CheckoutScreen
            car={selectedCar}
            onBack={() => setCurrentScreen('home')}
            onConfirm={handleConfirmBooking}
          />
        )}

        {currentScreen === 'confirmation' && activeBooking && (
          <ConfirmationScreen
            booking={activeBooking}
            onBackHome={() => setCurrentScreen('home')}
            onViewBookings={() => setCurrentScreen('bookings')}
          />
        )}

        {currentScreen === 'bookings' && (
          <MyBookingsScreen
            bookings={liveBookings ?? (isDemoMode ? [INITIAL_ACTIVE_BOOKING] : [])}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'dealer' && profile?.role === 'dealer' && (
          <DealerDashboardScreen
            onBackToCustomer={() => setCurrentScreen('home')}
            onOpenAddCarModal={() => {}}
            onOpenSettlementsModal={() => {}}
            fleetOverride={dealerOps?.fleet ?? undefined}
            requestsOverride={dealerOps?.requests ?? undefined}
            onRespondRequest={async (id, status) => {
              if (isSupabaseConfigured) {
                await respondToBooking(id, status);
                loadDealerOps().then(setDealerOps);
              }
            }}
            onToggleCar={async (id, status) => {
              if (isSupabaseConfigured) {
                await setCarStatus(id, status);
                loadDealerOps().then(setDealerOps);
              }
            }}
          />
        )}

        {currentScreen === 'owner' && profile?.role === 'car_owner' && (
          <OwnerDashboardScreen
            onBackToCustomer={() => setCurrentScreen('home')}
            onOpenAddCarModal={() => {}}
            fleetOverride={dealerOps?.fleet ?? undefined}
            requestsOverride={dealerOps?.requests ?? undefined}
            onRespondRequest={async (id, status) => {
              if (isSupabaseConfigured) {
                await respondToBooking(id, status);
                loadDealerOps().then(setDealerOps);
              }
            }}
            onToggleCar={async (id, status) => {
              if (isSupabaseConfigured) {
                await setCarStatus(id, status);
                loadDealerOps().then(setDealerOps);
              }
            }}
          />
        )}

        {(isMobileView || (typeof window !== 'undefined' && window.innerWidth < 768)) && !hideHeaderFooter && (
          <MobileBottomNav
            currentScreen={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            role={profile?.role || 'guest'}
          />
        )}
      </div>

      {!hideHeaderFooter && <Footer onNavigate={(s) => setCurrentScreen(s)} />}

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
