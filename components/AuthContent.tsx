'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, Mail, User, Phone, Loader2, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { loginUserAction, registerUserAction, googleLoginAction } from '@/app/actions/authActions';
import { useAuthStore } from '@/lib/store/useAuthStore';

export function AuthContent() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Prepared Google OAuth simulation / payload payload
      const mockGoogleUser = {
        email: 'user.google@gmail.com',
        fullName: 'משתמש Google גורמה',
        googleId: 'google_oauth_1092837465',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };

      const res = await googleLoginAction(mockGoogleUser);
      if (res.success && res.user) {
        setUser({
          id: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role as 'CUSTOMER' | 'BARISTA' | 'ADMIN',
          image: res.user.image,
        });
        setSuccessMsg(`שלום ${res.user.fullName}! התחברת בהצלחה עם Google.`);
        setTimeout(() => {
          router.push('/home');
        }, 800);
      } else {
        setErrorMsg(res.error || 'שגיאה בהתחברות עם Google');
      }
    } catch (err: any) {
      setErrorMsg('אירעה שגיאה בעיבוד התחברות Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await loginUserAction({ email: loginEmail, password: loginPassword });
      if (res.success && res.user) {
        setUser({
          id: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role as 'CUSTOMER' | 'BARISTA' | 'ADMIN',
          image: res.user.image,
        });
        setSuccessMsg(`שלום ${res.user.fullName}! התחברת בהצלחה. מעביר למערכת...`);
        setTimeout(() => {
          router.push('/home');
        }, 800);
      } else {
        setErrorMsg(res.error || 'שגיאה בהתחברות למערכת');
      }
    } catch (err: any) {
      setErrorMsg('אירעה שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerUserAction({
        fullName: regFullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      if (res.success && res.user) {
        setUser({
          id: res.user.id,
          fullName: res.user.fullName,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role as 'CUSTOMER' | 'BARISTA' | 'ADMIN',
          image: res.user.image,
        });
        setSuccessMsg('נרשמת בהצלחה! מעביר את החשבון למסך הבית...');
        setTimeout(() => {
          router.push('/home');
        }, 1000);
      } else {
        setErrorMsg(res.error || 'שגיאה בהרשמה למערכת');
      }
    } catch (err: any) {
      setErrorMsg('אירעה שגיאה בעיבוד הנתונים');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-stone-100 flex flex-col items-center justify-center p-4 relative overflow-hidden dir-rtl">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-[120px] pointer-events-none animate-float" />

      {/* Main Container */}
      <div className="w-full max-w-lg liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl space-y-6 relative z-10 my-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            THE DIGITAL ROAST AI PLATFORM
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Coffee className="w-6 h-6 text-stone-950" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gold-gradient tracking-tight">
              פורטל הכניסה
            </h1>
          </div>
          <p className="text-xs text-stone-400 max-w-xs mx-auto">
            אנא התחבר או הרשם למערכת על מנת לגשת לניתוח AI, התאמות ביולוגיות ותפריטי הגורמה
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-stone-950/80 border border-stone-800">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            התחברות לחשבון
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            הרשמת משתמש
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-semibold animate-fadeIn">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-semibold animate-fadeIn">
            {successMsg}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-stone-900/90 border border-stone-700/80 hover:border-amber-500/60 text-stone-100 font-bold text-xs hover:bg-stone-800 transition-all flex items-center justify-center gap-2.5 shadow-md group"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>התחבר מהר באמצעות Google</span>
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-[1px] bg-stone-800" />
          <span className="text-[11px] text-stone-500 font-semibold">או באמצעות אימייל</span>
          <div className="flex-1 h-[1px] bg-stone-800" />
        </div>

        {/* Tab 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">כתובת אימייל</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">סיסמה</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>מתחבר למערכת...</span>
                </>
              ) : (
                <span>התחבר כעת למערכת</span>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">שם מלא</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">כתובת אימייל</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">מספר טלפון</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="050-1234567"
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 text-right"
                  dir="rtl"
                />
                <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-300 block mb-1.5">סיסמה מאובטחת</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-extrabold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>יוצר חשבון ב-MongoDB...</span>
                </>
              ) : (
                <span>צור חשבון חדש כעת</span>
              )}
            </button>
          </form>
        )}

        {/* SSL Security Badge */}
        <div className="pt-4 border-t border-stone-800/80 flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>אבטחת אימות MongoDB SSL & JWT</span>
        </div>
      </div>
    </div>
  );
}
