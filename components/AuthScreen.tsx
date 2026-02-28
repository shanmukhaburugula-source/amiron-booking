
import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

interface AuthScreenProps {
  onLoginSuccess: (user: any) => void;
}

enum InternalAuthView {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
  VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
  PASSWORD_RESET_SENT = 'PASSWORD_RESET_SENT'
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [view, setView] = useState<InternalAuthView>(InternalAuthView.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setView(InternalAuthView.PASSWORD_RESET_SENT);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (view === InternalAuthView.LOGIN) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
          await signOut(auth);
          setView(InternalAuthView.VERIFICATION_REQUIRED);
          setLoading(false);
          return;
        }
      } else if (view === InternalAuthView.SIGNUP) {
        if (password !== repeatPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (name) {
            await updateProfile(userCredential.user, { displayName: name });
          }
          await sendEmailVerification(userCredential.user);
          await signOut(auth);
          setView(InternalAuthView.VERIFICATION_REQUIRED);
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
            setError('User already exists. Sign in?');
          } else {
            setError(err.message);
          }
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Password or Email Incorrect');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  );

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );

  const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223m0 0a10.455 10.455 0 0 0-1.944 3.46 1.012 1.012 0 0 0 0 .639C3.423 16.49 7.36 19.5 12 19.5c1.258 0 2.464-.22 3.585-.618m4.435-4.656a10.453 10.453 0 0 0 1.944-3.46 1.012 1.012 0 0 0 0-.639C20.577 7.51 16.64 4.5 12 4.5c-1.258 0-2.464.22-3.585.618m11.17 11.17L3 3m0 0 18 18" />
    </svg>
  );

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">
      {/* Left Animated Hero Panel */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-[#050505] items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse duration-[8s]"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse duration-[12s] delay-700"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse duration-[10s] delay-1500"></div>
        </div>
        <div className="relative z-10 w-full max-w-2xl px-8">
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">
              AI Agents That <br />
              Deliver <br />
              <span className="italic opacity-90 text-zinc-100">
                Human-Like Experiences
              </span>
            </h2>
            <div className="flex items-center gap-6 pt-6">
              <div className="h-[1px] w-12 bg-white/20"></div>
              <p className="text-lg lg:text-xl text-zinc-400 font-medium tracking-wide">
                Next-generation autonomous intelligence.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-purple-900/10 to-transparent"></div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md relative z-10 flex flex-col items-center">
          
          {/* Centered Header Section */}
          <div className="w-full text-center mb-10">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-purple-500/30 animate-in zoom-in duration-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                Amiron <span className="text-purple-500 font-light">Booking</span>
              </h1>
            </div>
            <h2 className="text-4xl font-black text-zinc-900 tracking-tight">
              {view === InternalAuthView.LOGIN ? 'Welcome back 💻' : 'Join the Elite 📅'}
            </h2>
            <p className="text-base text-zinc-500 mt-3 font-medium tracking-wide">
              {view === InternalAuthView.LOGIN ? 'Sign in to access your dashboard' : 'Create an account to begin your journey'}
            </p>
          </div>

          <div className="w-full space-y-8">
            {error && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm font-bold text-center animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={view === InternalAuthView.FORGOT_PASSWORD ? handleForgotPassword : handleSubmit} className="space-y-6">
              {view === InternalAuthView.SIGNUP && (
                <div className="group">
                  <label className="block text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-1">FULL NAME</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-[#fcfcfc] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white focus:border-purple-300 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              
              <div className="group">
                <label className="block text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-1">EMAIL ADDRESS</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-[#fcfcfc] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white focus:border-purple-300 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {view !== InternalAuthView.FORGOT_PASSWORD && (
                <div className="group">
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-[11px] font-black text-zinc-600 uppercase tracking-widest">PASSWORD</label>
                    {view === InternalAuthView.LOGIN && (
                      <button 
                        type="button"
                        onClick={() => setView(InternalAuthView.FORGOT_PASSWORD)}
                        className="text-[11px] font-black text-purple-500 hover:text-purple-700 transition-colors uppercase tracking-widest"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full px-5 py-4 pr-12 bg-[#fcfcfc] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white focus:border-purple-300 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              )}

              {view === InternalAuthView.SIGNUP && (
                <div className="group">
                  <label className="block text-[11px] font-black text-zinc-600 uppercase tracking-widest mb-2 ml-1">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      className="w-full px-5 py-4 pr-12 bg-[#fcfcfc] border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white focus:border-purple-300 transition-all text-sm font-medium text-zinc-900 placeholder-zinc-400"
                      placeholder="Repeat your password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                      aria-label={showRepeatPassword ? "Hide password" : "Show password"}
                    >
                      {showRepeatPassword ? <EyeSlashIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-zinc-900 hover:bg-black disabled:opacity-50 text-white font-black rounded-xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center text-xs tracking-widest uppercase mt-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  view === InternalAuthView.LOGIN ? 'SIGN IN' : 
                  view === InternalAuthView.SIGNUP ? 'CREATE ACCOUNT' : 
                  'SEND RESET LINK'
                )}
              </button>
            </form>

            <div className="space-y-8">
              <div className="relative flex items-center justify-center">
                <div className="w-full h-px bg-zinc-200"></div>
                <span className="absolute px-4 bg-white text-[11px] font-black text-zinc-400 uppercase tracking-widest">OR</span>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                className="w-full py-4 px-6 rounded-xl border border-zinc-200 flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all active:scale-[0.98] group"
              >
                <GoogleIcon />
                <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">
                  {view === InternalAuthView.SIGNUP ? 'Sign up with Google' : 'Sign in with Google'}
                </span>
              </button>

              <div className="text-center pt-2">
                {view === InternalAuthView.LOGIN ? (
                  <p className="text-sm text-zinc-500 font-medium tracking-tight">
                    New here?{' '}
                    <button 
                      onClick={() => setView(InternalAuthView.SIGNUP)} 
                      className="text-purple-600 font-black hover:underline ml-1 uppercase text-[11px] tracking-widest"
                    >
                      CREATE AN ACCOUNT
                    </button>
                  </p>
                ) : (
                  <button 
                    onClick={() => setView(InternalAuthView.LOGIN)} 
                    className="text-[11px] text-purple-600 font-black hover:underline uppercase tracking-widest"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
