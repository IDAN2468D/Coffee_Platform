'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, Mail, User, Phone, Eye, EyeOff, Loader2, Sparkles, ShieldCheck, CheckCircle2, Check, X } from 'lucide-react';
import { loginUserAction, registerUserAction, googleLoginAction } from '@/app/actions/authActions';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { CoffeeSpillCanvas } from '@/components/CoffeeSpillCanvas';

export function AuthContent() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-stone-800', width: 'w-0', text: '', hasLength: false, hasNumber: false, hasLetter: false };

    const hasLength = pass.length >= 6;
    const hasNumber = /[0-9]/.test(pass);
    const hasLetter = /[a-zA-Z\u0590-\u05FF]/.test(pass);

    let score = 0;
    if (pass.length > 0) score = 1;
    if (hasLength) score++;
    if (hasNumber) score++;
    if (hasLetter) score++;

    if (!hasLength) {
      return { score: 1, label: 'חלשה (קצרה מדי)', color: 'bg-rose-500', width: 'w-1/4', text: 'text-rose-400', hasLength, hasNumber, hasLetter };
    } else if (score === 2) {
      return { score: 2, label: 'חלשה', color: 'bg-orange-500', width: 'w-2/4', text: 'text-orange-400', hasLength, hasNumber, hasLetter };
    } else if (score === 3) {
      return { score: 3, label: 'בינונית', color: 'bg-amber-500', width: 'w-3/4', text: 'text-amber-400', hasLength, hasNumber, hasLetter };
    } else {
      return { score: 4, label: 'חזקה ומאובטחת', color: 'bg-emerald-500', width: 'w-full', text: 'text-emerald-400', hasLength, hasNumber, hasLetter };
    }
  };

  const strength = getPasswordStrength(regPassword);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const mockGoogleUser = {
        email: 'idankzm@gmail.com',
        fullName: 'idan kazam',
        googleId: 'google_oauth_1092837465',
        image: '/idan-profile-circle.png',
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
    setErrorMsg('');
    setSuccessMsg('');

    const validation = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

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
    setErrorMsg('');
    setSuccessMsg('');

    const validation = registerSchema.safeParse({
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });

    if (!validation.success) {
      setErrorMsg(validation.error.errors[0].message);
      return;
    }

    setLoading(true);

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
    <div className="min-h-screen bg-[#050404] text-stone-100 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Interactive Falling Coffee Beans & Spilling Liquid Canvas Background */}
      <CoffeeSpillCanvas beanCount={38} enableSpill={true} />

      {/* Background Ambient Glows */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/15 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/15 rounded-full filter blur-[120px] pointer-events-none animate-float z-0" />

      {/* Main Container */}
      <div className="w-full max-w-lg liquid-glass rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.18)] space-y-6 relative z-10 my-8 backdrop-blur-3xl bg-stone-950/60">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>THE DIGITAL ROAST AI PLATFORM</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 text-stone-950 font-bold">
              <Coffee className="w-6 h-6 animate-pulse-slow" />
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
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>התחברות לחשבון</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>הרשמת משתמש</span>
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-in fade-in">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
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
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">כתובת אימייל</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-stone-300">סיסמה</label>
                <button
                  type="button"
                  onClick={() => alert('לשחזור סיסמה אנא צור קשר עם תמיכת הקפה ב-WhatsApp')}
                  className="text-amber-400/80 hover:text-amber-300 transition-colors font-medium text-[11px]"
                >
                  שכחת סיסמה?
                </button>
              </div>
              <div className="relative group">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="rtl"
                  className="w-full pr-11 pl-11 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  title={showLoginPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors p-1 rounded-lg focus:outline-none hover:bg-stone-900/60"
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>מתחבר למערכת...</span>
                </>
              ) : (
                <>
                  <span>התחבר כעת למערכת</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 2: REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">שם מלא</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <User className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">כתובת אימייל</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">מספר טלפון</label>
              <div className="relative group">
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="050-1234567"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Phone className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">סיסמה מאובטחת</label>
              <div className="relative group">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="rtl"
                  className="w-full pr-11 pl-11 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  aria-label={showRegPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  title={showRegPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors p-1 rounded-lg focus:outline-none hover:bg-stone-900/60"
                >
                  {showRegPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {regPassword && (
                <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-400">חוזק סיסמה:</span>
                    <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                    <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                  </div>

                  {/* Requirements Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1 text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                      strength.hasLength 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                        : 'bg-stone-900/80 border-stone-800 text-stone-500'
                    }`}>
                      {strength.hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                      לפחות 6 תווים
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                      strength.hasLetter 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                        : 'bg-stone-900/80 border-stone-800 text-stone-500'
                    }`}>
                      {strength.hasLetter ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                      אותיות
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border flex items-center gap-1 transition-all ${
                      strength.hasNumber 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold' 
                        : 'bg-stone-900/80 border-stone-800 text-stone-500'
                    }`}>
                      {strength.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 opacity-40" />}
                      ספרות
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>יוצר חשבון ב-MongoDB...</span>
                </>
              ) : (
                <>
                  <span>צור חשבון חדש כעת</span>
                  <Sparkles className="w-4 h-4" />
                </>
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
