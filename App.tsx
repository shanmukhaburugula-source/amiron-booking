
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import History from './components/History';
import BookingModal from './components/BookingModal';
import ManageBookingModal from './components/ManageBookingModal';
import ProfileModal from './components/ProfileModal';
import { User, Booking, ActiveView } from './types';
import { getLocalTimezone } from './utils/dateHelpers';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { syncUserToFirestore } from './services/userService';
import { getUserBookings } from './services/bookingService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [managingBooking, setManagingBooking] = useState<Booking | null>(null);
  const [timezone, setTimezone] = useState(getLocalTimezone());
  const [activeView, setActiveView] = useState<ActiveView>(ActiveView.DASHBOARD);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const baseUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          emailVerified: firebaseUser.emailVerified,
          photoFileName: "default_profile.png"
        };
        
        try {
          const firestoreData = await syncUserToFirestore(baseUser);
          setUser({ ...baseUser, ...firestoreData });
          
          // Fetch user bookings from Firestore sub-collection
          const userBookings = await getUserBookings(firebaseUser.uid);
          setBookings(userBookings);
        } catch (error) {
          console.error("Error syncing user or fetching bookings:", error);
          setUser(baseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setBookings([]);
      setIsBookingModalOpen(false);
      setManagingBooking(null);
      setActiveView(ActiveView.DASHBOARD);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const handleBookingConfirm = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking]);
    setIsBookingModalOpen(false);
  };

  const cancelBooking = (id: string) => {
    // Note: In a real scenario, we'd also delete from Firestore sub-collection and globalBookings
    setBookings(prev => prev.filter(b => b.id !== id));
    setManagingBooking(null);
  };

  const rescheduleBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    setManagingBooking(null);
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-12 h-12 border-[6px] border-purple-50 dark:border-zinc-800 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onLoginSuccess={() => {}} />;
  }

  const upcomingBookings = bookings.filter(b => new Date(b.date) >= new Date(new Date().setHours(0,0,0,0)));
  const pastBookings = bookings.filter(b => new Date(b.date) < new Date(new Date().setHours(0,0,0,0)));

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      onHome={() => { setActiveView(ActiveView.DASHBOARD); setIsBookingModalOpen(false); setManagingBooking(null); }}
      onViewHistory={() => setActiveView(ActiveView.HISTORY)}
      onEditProfile={() => setIsProfileModalOpen(true)}
      timezone={timezone}
      onTimezoneChange={setTimezone}
      isDarkMode={isDarkMode}
      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
    >
      <div className="relative min-h-screen w-full">
        {activeView === ActiveView.DASHBOARD ? (
          <Dashboard 
            bookings={upcomingBookings} 
            onBookNew={() => setIsBookingModalOpen(true)}
            onManageBooking={(b) => setManagingBooking(b)}
          />
        ) : (
          <History 
            bookings={pastBookings} 
            onBack={() => setActiveView(ActiveView.DASHBOARD)} 
          />
        )}
      </div>

      {isBookingModalOpen && (
        <BookingModal 
          user={user}
          onClose={() => setIsBookingModalOpen(false)}
          onConfirm={handleBookingConfirm}
          userTimezone={timezone}
        />
      )}

      {managingBooking && (
        <ManageBookingModal 
          booking={managingBooking}
          onClose={() => setManagingBooking(null)}
          onCancel={cancelBooking}
          onReschedule={rescheduleBooking}
        />
      )}

      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdate={(updatedUser) => setUser(prev => prev ? ({ ...prev, ...updatedUser }) : null)}
        />
      )}
    </Layout>
  );
};

export default App;
