'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, User, Mail, Phone, Lock, Eye, EyeOff, Loader2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, Check, X } from 'lucide-react';
import { registerUserAction } from '@/app/actions/authActions';
import { CoffeeSpillCanvas } from '@/components/CoffeeSpillCanvas';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Enhanced password strength calculation
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

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerUserAction({ fullName, email, phone, password });
      if (res.success) {
        setSuccessMsg('נרשמת בהצלחה! מעביר אותך להתחברות...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
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
    <div className="min-h-screen bg-[#050404] text-stone-100 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Interactive Falling Coffee Beans & Spilling Liquid Canvas Background */}
      <CoffeeSpillCanvas beanCount={38} enableSpill={true} />

      {/* Ambient background glowing orbs */}
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-amber-500/15 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full filter blur-[120px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-700/5 rounded-full filter blur-[150px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10 my-6">
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
            <span>הצפנת 256-bit</span>
          </div>
        </div>

        {/* Card Container */}
        <div className="liquid-glass rounded-3xl p-8 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.15)] space-y-6 backdrop-blur-3xl bg-stone-950/60 transition-all hover:border-amber-500/50">
          {/* Top Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-stone-900/80 rounded-2xl border border-stone-800/80 text-xs font-bold text-center">
            <Link
              href="/login"
              className="py-2.5 rounded-xl text-stone-400 hover:text-stone-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>התחברות</span>
            </Link>
            <button
              type="button"
              className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md transition-all font-extrabold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>הרשמה</span>
            </button>
          </div>

          {/* Brand & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Coffee className="w-7 h-7 animate-pulse-slow" />
            </div>
            <h1 className="text-2xl font-black text-stone-100 tracking-wide">
              הצטרף ל-<span className="text-gold-gradient">DIGITAL ROAST</span>
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              צור חשבון אישי לשמירת פרופיל הניחוחות, מעקב הזמנות והמלצות AI
            </p>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center font-medium animate-in fade-in slide-in-from-top-2">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">שם מלא</label>
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ישראל ישראלי"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <User className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

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

            {/* Phone Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">מספר טלפון</label>
              <div className="relative group">
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="050-1234567"
                  dir="rtl"
                  className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-stone-950/80 border border-stone-800 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 transition-all text-right group-hover:border-stone-700"
                />
                <Phone className="w-4 h-4 text-stone-500 absolute right-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-amber-400 transition-colors" />
              </div>
            </div>

            {/* Password Field with Eye Icon Toggle */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 block text-right">סיסמה מאובטחת</label>
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

              {/* Password Strength Indicator */}
              {password && (
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

            {/* Submit Button */}
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
                  <span>צור חשבון כעת</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t border-stone-800/80 text-xs text-stone-400">
            <span>כבר רשום במערכת? </span>
            <Link href="/login" className="text-amber-400 font-extrabold hover:underline transition-all">
              התחבר לחשבון
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
