'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Coffee, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { loginUserAction } from '@/app/actions/authActions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        setSuccessMsg(`שלום ${res.user?.fullName}! התחברת בהצלחה.`);
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
    <div className="min-h-screen bg-obsidian text-stone-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full filter blur-[100px] pointer-events-none animate-pulse-slow" />

      <div className="w-full max-w-md liquid-glass rounded-3xl p-8 border border-amber-500/30 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/home" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-950 font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gold-gradient">THE DIGITAL ROAST</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-stone-100 pt-2">התחברות לחשבון</h2>
          <p className="text-xs text-stone-400">הזן את פרטי החשבון הרשום שלך ב-MongoDB</p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-semibold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-semibold">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1.5">כתובת אימייל</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              <span>התחבר כעת</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-stone-800 text-xs text-stone-400">
          <span>עדיין אין לך חשבון? </span>
          <Link href="/register" className="text-amber-400 font-bold hover:underline">
            הרשם כאן
          </Link>
        </div>
      </div>
    </div>
  );
}
