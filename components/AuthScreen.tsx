
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
  const [lastUsedEmail, setLastUsedEmail] = useState('');

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
      setLastUsedEmail(email);
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
          setLastUsedEmail(email);
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
          setLastUsedEmail(email);
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

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      {/* Left Aesthetic Panel - Visible on Desktop */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-gradient-to-br from-[#f5f3ff] via-white to-[#e9d5ff] items-center justify-center p-16 relative">
        <div className="absolute top-[-15%] right-[-10%] w-[30rem] h-[30rem] bg-purple-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-15%] left-[-10%] w-[30rem] h-[30rem] bg-purple-50/40 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 max-w-xl text-center">
          <div className="inline-block p-6 bg-white/60 backdrop-blur-md border border-white rounded-[2rem] mb-10 shadow-2xl shadow-purple-100/50">
            <span className="text-6xl">✨</span>
          </div>
          <h2 className="text-6xl font-black text-zinc-900 tracking-tight mb-8 leading-[1.1]">
            Elevate your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Business Flow</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-md mx-auto">
            Experience the future of intelligent session management. Seamless, secure, and purely professional.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="w-full md:w-1/2 lg:w-[500px] flex items-center justify-center p-6 md:p-12 bg-white md:bg-transparent relative">
        {/* Mobile Background Accents */}
        <div className="md:hidden absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-100/30 rounded-full blur-3xl"></div>
        
        <div className="w-full max-w-sm relative z-10">
          {/* Top Branding Section */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4">
              Amiron <span className="text-[#d8b4fe] font-light">Booking</span>
            </h1>
            <h2 className="text-2xl font-black text-zinc-800">
              {view === InternalAuthView.LOGIN && 'Welcome back 💻'}
              {view === InternalAuthView.SIGNUP && 'Join the Elite 📅'}
              {view === InternalAuthView.FORGOT_PASSWORD && 'Account Recovery 🔒'}
            </h2>
            <p className="text-sm text-zinc-400 mt-2 font-medium">
              {view === InternalAuthView.LOGIN ? 'Sign in to access your dashboard' : 'Create an account to begin your journey'}
            </p>
          </div>

          {/* Form Actions */}
          <div className="space-y-8">
            {error && (
              <div className={`p-4 rounded-2xl border text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-300 ${error.includes('exists') ? 'bg-purple-50 border-purple-100 text-purple-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                {error}
                {error.includes('exists') && (
                  <button onClick={() => setView(InternalAuthView.LOGIN)} className="ml-2 underline">Sign In</button>
                )}
              </div>
            )}

            <form onSubmit={view === InternalAuthView.FORGOT_PASSWORD ? handleForgotPassword : handleSubmit} className="space-y-5">
              {view === InternalAuthView.SIGNUP && (
                <div className="group">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-400">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="group">
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-400">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all text-sm font-medium"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {view !== InternalAuthView.FORGOT_PASSWORD && (
                <div className="group">
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest transition-colors group-focus-within:text-purple-400">Password</label>
                    {view === InternalAuthView.LOGIN && (
                      <button 
                        type="button"
                        onClick={() => setView(InternalAuthView.FORGOT_PASSWORD)}
                        className="text-[10px] font-black text-purple-400 hover:text-purple-600 transition-colors"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
              {view === InternalAuthView.SIGNUP && (
                <div className="group">
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 ml-1 transition-colors group-focus-within:text-purple-400">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all text-sm font-medium"
                    placeholder="••••••••"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-zinc-900 hover:bg-black disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-zinc-100 transition-all active:scale-[0.98] flex items-center justify-center text-sm tracking-tight"
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

            {/* Bottom Section: Google + Switch View */}
            <div className="space-y-8">
              <div className="relative flex items-center justify-center">
                <div className="w-full h-px bg-zinc-100"></div>
                <span className="absolute px-4 bg-white text-[10px] font-black text-zinc-300 uppercase tracking-widest">or</span>
              </div>

              <button 
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-6 rounded-xl border border-zinc-200 flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all active:scale-[0.98] group"
              >
                <GoogleIcon />
                <span className="text-sm font-bold text-zinc-700 group-hover:text-zinc-900 transition-colors">
                  {view === InternalAuthView.SIGNUP ? 'Sign up with Google' : 'Sign in with Google'}
                </span>
              </button>

              <div className="text-center">
                {view === InternalAuthView.LOGIN ? (
                  <p className="text-sm text-zinc-400 font-medium">
                    New here?{' '}
                    <button 
                      onClick={() => setView(InternalAuthView.SIGNUP)} 
                      className="text-purple-500 font-black hover:underline ml-1"
                    >
                      Create an account
                    </button>
                  </p>
                ) : (
                  <button 
                    onClick={() => setView(InternalAuthView.LOGIN)} 
                    className="text-sm text-purple-500 font-black hover:underline"
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
