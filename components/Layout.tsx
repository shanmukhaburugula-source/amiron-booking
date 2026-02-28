
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import TimezonePicker from './TimezonePicker';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onHome: () => void;
  onViewHistory: () => void;
  onEditProfile: () => void;
  timezone: string;
  onTimezoneChange: (tz: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  onHome, 
  onViewHistory, 
  onEditProfile,
  timezone, 
  onTimezoneChange,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isTzPickerOpen, setIsTzPickerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  
  const profileRef = useRef<HTMLDivElement>(null);
  const tzRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (tzRef.current && !tzRef.current.contains(event.target as Node)) {
        setIsTzPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    setResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 5000);
    } catch (err) {
      setResendStatus('error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-x-hidden transition-colors duration-300">
      {/* Verification Banner */}
      {user && !user.emailVerified && (
        <div className="bg-purple-600 text-white px-6 py-2.5 flex items-center justify-center gap-4 text-xs font-bold animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <span>Your email is not verified. Check your inbox to unlock all features.</span>
          </div>
          <button 
            onClick={handleResendEmail}
            disabled={resending || resendStatus === 'sent'}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
          >
            {resending ? 'Sending...' : resendStatus === 'sent' ? 'Sent!' : 'Resend Email'}
          </button>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 px-4 md:px-10 py-5 flex items-center justify-between transition-all duration-300">
        <div 
          onClick={onHome}
          className="cursor-pointer group flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-purple-600 dark:bg-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-purple-500/20">
            <ICONS.Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 hidden sm:block">
            Amiron <span className="text-[#d8b4fe] font-light">Booking</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          {/* Theme Toggle */}
          <button 
            onClick={toggleDarkMode}
            className="group p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 relative overflow-hidden"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <div className="relative z-10">
              {isDarkMode ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform duration-500">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-zinc-600 group-hover:-rotate-12 transition-transform duration-500">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </div>
          </button>

          <div className="relative" ref={tzRef}>
            <button 
              onClick={() => setIsTzPickerOpen(!isTzPickerOpen)}
              className="flex items-center gap-2.5 px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-100 dark:border-zinc-800"
            >
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.15em]">Timezone</span>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{timezone}</span>
              </div>
            </button>

            {isTzPickerOpen && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                <TimezonePicker 
                  current={timezone} 
                  onSelect={(tz) => { onTimezoneChange(tz); setIsTzPickerOpen(false); }} 
                />
              </div>
            )}
          </div>

          <div className="h-8 w-px bg-zinc-100 dark:bg-zinc-800 hidden sm:block"></div>
          
          {user && (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-2xl text-purple-600 dark:text-purple-200 font-black text-sm transition-all hover:shadow-lg active:scale-90 border border-purple-50 dark:border-purple-900/50"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-100 dark:border-zinc-800 py-3 animate-in fade-in slide-in-from-top-3 duration-300">
                  <div className="px-5 py-3 border-b border-zinc-50 dark:border-zinc-800 mb-2">
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1">User Profile</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => { onViewHistory(); setIsProfileOpen(false); }}
                    className="w-full text-left px-5 py-3 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-3"
                  >
                    <ICONS.Calendar className="w-4 h-4" />
                    Booking History
                  </button>
                  <button 
                    onClick={() => { onEditProfile(); setIsProfileOpen(false); }}
                    className="w-full text-left px-5 py-3 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-3"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Account Settings
                  </button>
                  <div className="h-px bg-zinc-50 dark:bg-zinc-800 my-2"></div>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-5 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-3 font-bold"
                  >
                    <ICONS.Logout className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
        {children}
      </main>
      
      <footer className="w-full py-12 px-6 border-t border-zinc-50 dark:border-zinc-900 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">Amiron <span className="text-purple-300 font-light">Booking</span></h2>
             <p className="text-xs text-zinc-400 font-medium mt-1">Empowering elite teams with precision scheduling.</p>
          </div>
          <div className="flex gap-8 text-[10px] font-black text-zinc-300 dark:text-zinc-600 uppercase tracking-widest">
            <span className="hover:text-purple-300 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-purple-300 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-purple-300 cursor-pointer transition-colors">Contact</span>
          </div>
          <p className="text-zinc-200 dark:text-zinc-800 text-[10px] font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} AMIRON AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
