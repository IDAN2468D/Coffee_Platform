'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, Mail, Eye, EyeOff, Loader2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginUserAction } from '@/app/actions/authActions';
import { CoffeeSpillCanvas } from '@/components/CoffeeSpillCanvas';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await loginUserAction({ email, password });
      if (res.success) {
        setSuccessMsg(`שלום ${res.user?.fullName}! התחברת בהצלחה ל-The Digital Roast.`);
        setTimeout(() => {
          router.push('/home');
        }, 1200);
      } else {
        setErrorMsg(res.error || 'שגיאה בהתחברות למערכת');
      }
    } catch (err: any) {
      setErrorMsg('אירעה שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050404] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Interactive Falling Coffee Beans & Spilling Liquid Canvas Background */}
      <CoffeeSpillCanvas beanCount={38} enableSpill={true} />

      {/* Ambient background glowing orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-orange-600/15 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-700/5 rounded-full filter blur-[150px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 my-8">
        {/* Navigation back to main site */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors bg-stone-900/50 backdrop-blur-md px-3.5 py-2 rounded-full border border-stone-800/80"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לעמוד הבית</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-amber-500/80 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>חיבור מאובטח SSL</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="liquid-glass rounded-3xl p-8 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15)] space-y-6 backdrop-blur-3xl bg-stone-950/60 transition-all hover:border-amber-500/50">
          {/* Top Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-900/80 rounded-2xl border border-stone-800/80 text-xs font-bold text-center">
            <button
              type="button"
              className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md transition-all font-extrabold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>התחברות</span>
            </button>
            <Link
              href="/register"
              className="py-2.5 rounded-xl text-stone-400 hover:text-stone-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>הרשמה</span>
            </Link>
          </div>

          {/* Brand & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Coffee className="w-7 h-7 animate-pulse-slow" />
            </div>
            <h1 className="text-2xl font-black text-stone-100 tracking-wide">
              ברוכים השבים ל-<span className="text-gold-gradient">DIGITAL ROAST</span>
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              הזן את פרטי החשבון שלך כדי לגשת לבר הקפה הדיגיטלי ולחוויות הטעימה
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">כתובת אימייל</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            {/* Password Field with Eye Icon Toggle */}
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="rtl"
                  className="w-full pr-11 pl-11 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  title={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-400 transition-colors p-1 rounded-lg focus:outline-none hover:bg-stone-900/60"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-400 hover:text-stone-300 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-stone-800 bg-stone-950 text-amber-500 focus:ring-amber-500/40 focus:ring-offset-0 transition-all cursor-pointer accent-amber-500"
                />
                <span>זכור אותי במכשיר זה</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.3)] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                  <span>מתחבר לבר הקפה הדיגיטלי...</span>
                </>
              ) : (
                <>
                  <span>התחבר כעת</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t border-stone-800/80 text-xs text-stone-400">
            <span>עדיין אין לך חשבון קפה? </span>
            <Link href="/register" className="text-amber-400 font-extrabold hover:underline transition-all">
              צור חשבון חדש בלחיצה
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
