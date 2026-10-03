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
import { AdminScreen } from '@/src/features/admin/AdminScreen';
import { PublicDealerScreen } from '@/src/features/dealer/PublicDealerScreen';
import { MobileBottomNav } from '@/src/shared/MobileBottomNav';

export type ScreenType = "home" | "checkout" | "confirmation" | "bookings" | "dealer" | "admin" | "owner" | "profile" | "dealer_profile";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);

  // Auth State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authRole, setAuthRole] = useState<'customer' | 'dealer'>('customer');

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [liveCars, setLiveCars] = useState<Car[] | null>(null);
  const [dealerOps, setDealerOps] = useState<{ fleet: Car[]; requests: DealerRequest[]; status?: string } | null>(null);
  const [liveBookings, setLiveBookings] = useState<Booking[] | null>(null);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  useEffect(() => {
    if (isSupabaseConfigured) {
      getCurrentUser().then((u) => {
        setUser(u);
        const p = u?.user_metadata as Profile | undefined;
        if (p) {
          setProfile(p);
          if (p.role === 'dealer') setCurrentScreen('dealer');
          else if (p.role === 'super_admin') setCurrentScreen('admin');
          else if (p.role === 'car_owner') setCurrentScreen('owner');
        }
      });
      loadLiveCars().then(setLiveCars);
    } else if (isDemoMode) {
      setLiveCars(MOCK_CARS);
      setActiveBooking(INITIAL_ACTIVE_BOOKING);
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (user && (profile?.role === 'dealer' || profile?.role === 'car_owner') && isSupabaseConfigured) {
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
    
    if (isSupabaseConfigured) {
      const currentUser = await getCurrentUser();
      const p = currentUser?.user_metadata as Profile | undefined;
      if (p) {
        setProfile(p);
        if (p.role === 'dealer') setCurrentScreen('dealer');
        if (p.role === 'car_owner') setCurrentScreen('owner');
        if (p.role === 'super_admin') setCurrentScreen('admin');
      }
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
      const ok = await persistBooking({
        carId: b.car.id,
        originCity: b.pickupLocation,
        destination: b.dropoffLocation,
        distanceKm: b.distanceKm,
        days: b.days,
        startDate: b.pickupDate,
        pricePerDay: b.dailyPrice,
        totalPrice: b.totalPrice,
      });
      if (ok) {
        setActiveBooking(b);
        setCurrentScreen('confirmation');
      } else {
        showToast('حدث خطأ أثناء إرسال الطلب، يرجى المحاولة مرة أخرى.');
      }
    } else {
      setActiveBooking(b);
      setCurrentScreen('confirmation');
    }
  };

  const isDesktopDealer = profile?.role === 'dealer' && currentScreen === 'dealer';
  const isDesktopOwner = profile?.role === 'car_owner' && currentScreen === 'owner';
  const isDesktopAdmin = profile?.role === 'super_admin' && currentScreen === 'admin';
  const hideHeaderFooter = isDesktopDealer || isDesktopAdmin || isDesktopOwner;

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
          userName={profile?.full_name || user?.email?.split('@')[0]}
          onOpenAuth={() => {
            setAuthMode('signin');
            setAuthRole('customer');
            setShowAuthModal(true);
          }}
          onSignOut={handleSignOut}
        />
      )}

      <div className="flex-1 w-full relative">
        {currentScreen === 'admin' && profile?.role === 'super_admin' && (
          <AdminScreen currentUserId={user?.id || null} onBackToHome={() => setCurrentScreen('home')} />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            onNavigateToDealer={(id) => { setSelectedDealerId(id); setCurrentScreen('dealer_profile'); }}
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

        {currentScreen === 'dealer_profile' && (
          <PublicDealerScreen
            dealerId={selectedDealerId || undefined}
            onBack={() => setCurrentScreen('home')}
            onSelectCar={(car) => {
              setSelectedCar(car);
              setCurrentScreen('checkout');
            }}
          />
        )}

        {currentScreen === 'checkout' && selectedCar && (
          <CheckoutScreen
            selectedCar={selectedCar}
            onBackToHome={() => setCurrentScreen('home')}
            onConfirmBooking={handleConfirmBooking}
          />
        )}

        {currentScreen === 'confirmation' && activeBooking && (
          <ConfirmationScreen
            booking={activeBooking}
            onNavigateToHome={() => setCurrentScreen('home')}
            onNavigateToBookings={() => setCurrentScreen('bookings')}
          />
        )}

        {currentScreen === 'bookings' && (
          <MyBookingsScreen
            activeBooking={activeBooking || undefined}
            liveBookings={liveBookings ?? []}
            onNewBookingClick={() => setCurrentScreen('home')}
            onViewDigitalTicket={() => {}}
          />
        )}

        {(currentScreen === 'dealer' || currentScreen === 'owner') && (profile?.role === 'dealer' || profile?.role === 'car_owner') && (
          <DealerDashboardScreen
            onBackToCustomer={() => setCurrentScreen('home')}
            onOpenAddCarModal={() => {}}
            onOpenSettlementsModal={() => {}}
            fleetOverride={dealerOps?.fleet ?? []}
            requestsOverride={dealerOps?.requests ?? []}
            onRespondRequest={async (id, status) => {
              if (isSupabaseConfigured) {
                await respondToBooking(id, status === 'confirmed' ? 'confirmed' : 'rejected');
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

        {!hideHeaderFooter && (
          <MobileBottomNav 
            currentScreen={currentScreen} 
            onNavigate={(s) => setCurrentScreen(s)} 
            onCallSupport={() => window.location.href = 'tel:123456789'}
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
