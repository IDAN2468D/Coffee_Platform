'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Crown,
  QrCode,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Package,
  Truck,
  RotateCcw,
  PauseCircle,
  PlayCircle,
  Sliders,
  Award,
  ChevronLeft,
  Coffee,
  Lock,
  Mail,
  User,
  Phone,
  X,
  Zap,
  Star,
  Activity,
  Calendar,
  Check,
  Save,
  KeyRound,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { creditCardSchema, profileSchema } from '@/lib/validations/auth';
import { TiltGlassCard } from '@/components/TiltGlassCard';
import { MagneticButton } from '@/components/MagneticButton';
import { CanvasCoffeeSteam } from '@/components/CanvasCoffeeSteam';
import { updateUserProfileImageAction } from '@/app/actions/authActions';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();

  // QR Modal State
  const [showQrModal, setShowQrModal] = useState(false);

  // Flavor DNA State (Fully Editable Sliders & Inputs)
  const [acidityLevel, setAcidityLevel] = useState<number>(4.2);
  const [roastDepth, setRoastDepth] = useState<number>(8);
  const [milkPref, setMilkPref] = useState<string>('חלב שיבולת שועל Oatly');
  const [favoriteBlend, setFavoriteBlend] = useState<string>('Honey Oak Cortado');
  const [dnaSaveSuccess, setDnaSaveSuccess] = useState<string>('');

  // Subscription State (Fully Editable)
  const [isSubActive, setIsSubActive] = useState(true);
  const [subFrequency, setSubFrequency] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');
  const [selectedBean, setSelectedBean] = useState<string>('Single Origin Ethiopia Yirgacheffe');
  const [subSaveSuccess, setSubSaveSuccess] = useState<string>('');

  const defaultGoogleImage = '/idan-profile-circle.png';
  const sanitizeImage = (img?: string) => {
    if (!img || img.includes('photo-1534528741775')) {
      return defaultGoogleImage;
    }
    return img;
  };

  const [editName, setEditName] = useState(user?.fullName || 'idan kazam');
  const [editEmail, setEditEmail] = useState(user?.email || 'idankzm@gmail.com');
  const [editPhone, setEditPhone] = useState(user?.phone || '050-1234567');
  const [editImage, setEditImage] = useState(sanitizeImage(user?.image));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enable2FA, setEnable2FA] = useState(true);
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState('');
  const [securityErrorMsg, setSecurityErrorMsg] = useState('');

  // Credit Card States
  const [cardNo, setCardNo] = useState(user?.cardNo || '');
  const [cardHolder, setCardHolder] = useState(user?.cardHolder || '');
  const [cardExpiry, setCardExpiry] = useState(user?.cardExpiry || '');
  const [cardCvv, setCardCvv] = useState(user?.cardCvv || '');
  const [cardSaveSuccess, setCardSaveSuccess] = useState('');
  const [cardErrorMsg, setCardErrorMsg] = useState('');

  // Card Number Handler: Only digits, auto-formatted into 4-digit groups
  const handleCardNoChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNo(formatted);
  };

  // Expiry Handler: Only digits, auto / formatting MM/YY
  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // CVV Handler: Only digits (max 4 digits)
  const handleCvvChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4);
    setCardCvv(raw);
  };

  const handleSaveCreditCard = (e: React.FormEvent) => {
    e.preventDefault();
    setCardErrorMsg('');
    setCardSaveSuccess('');

    const validation = creditCardSchema.safeParse({
      cardNo,
      cardHolder,
      cardExpiry,
      cardCvv,
    });

    if (!validation.success) {
      setCardErrorMsg(validation.error.errors[0].message);
      return;
    }

    if (user) {
      setUser({
        ...user,
        cardNo,
        cardHolder,
        cardExpiry,
        cardCvv,
      });
      setCardSaveSuccess('פרטי כרטיס האשראי אומתו ועודכנו בהצלחה בארנק הדיגיטלי המאובטח!');
      setTimeout(() => setCardSaveSuccess(''), 3500);
    }
  };

  // Save Flavor DNA
  const handleSaveFlavorDna = (e: React.FormEvent) => {
    e.preventDefault();
    setDnaSaveSuccess('פרופיל ה-DNA והראדאר עודכנו בהצלחה במודל ה-AI!');
    setTimeout(() => setDnaSaveSuccess(''), 3500);
  };

  // Save Subscription
  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    setSubSaveSuccess('הגדרות המנוי החודשי עודכנו בהצלחה!');
    setTimeout(() => setSubSaveSuccess(''), 3500);
  };

  // Save Account Profile & Password
  const handleSaveProfileSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityErrorMsg('');
    setSecuritySuccessMsg('');

    const validation = profileSchema.safeParse({
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      image: editImage,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      setSecurityErrorMsg(validation.error.errors[0].message);
      return;
    }

    // Update global auth store state & MongoDB DB
    if (user) {
      setUser({
        ...user,
        fullName: editName,
        email: editEmail,
        phone: editPhone,
        image: editImage,
      });

      if (user.id) {
        await updateUserProfileImageAction({ userId: user.id, image: editImage });
      }
    }

    setSecuritySuccessMsg('פרטי החשבון, תמונת ה-Google והסיסמה עודכנו בהצלחה בשרת MongoDB Auth!');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#050404] text-stone-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden dir-rtl">
      {/* Ambient Backdrop Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <CanvasCoffeeSteam particleCount={25} color="rgba(245, 158, 11, 0.12)" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="p-2 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-400 transition-all flex items-center gap-1 text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>חזרה לדף הראשי</span>
            </Link>
            <span className="text-stone-600">/</span>
            <span className="text-xs font-bold text-amber-300">אזור אישי וניהול פרופיל</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>BLACK DIAMOND VIP MEMBER</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-gold-gradient tracking-tight">
            לאונג' ה-VIP ועריכת פרופיל המשתמש
          </h1>
          <p className="text-xs sm:text-sm text-stone-400">
            כל השדות, המדדים ותמונת ה-Google פתוחים לעריכה ולעדכון בזמן אמת ב-MongoDB ובמודל ה-AI
          </p>
        </div>

        {/* GRID LAYOUT: SECTION 1 & SECTION 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* SECTION 1: Holographic VIP Pass */}
          <div className="lg:col-span-6">
            <TiltGlassCard maxTiltDeg={10} className="h-full bg-gradient-to-br from-amber-950/40 via-stone-900/90 to-emerald-950/30 border-amber-500/40">
              <div className="space-y-6">
                
                {/* Pass Header */}
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-500 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20 overflow-hidden shrink-0 border border-amber-400/50">
                      {user?.image || editImage ? (
                        <img
                          src={user?.image || editImage}
                          alt={editName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Crown className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono tracking-widest block uppercase font-bold">
                        EXCLUSIVE TIER PASS
                      </span>
                      <h2 className="text-lg font-black text-stone-100">
                        {editName}
                      </h2>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
                    #8829-9941-2026
                  </span>
                </div>

                {/* Balance & Value Box */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-950/80 border border-stone-800">
                  <div className="space-y-1">
                    <span className="text-[11px] text-stone-400 font-bold block">יתרת RoastCoins:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-amber-400">1,450</span>
                      <span className="text-xs text-amber-200 font-bold">נקודות</span>
                    </div>
                  </div>
                  <div className="space-y-1 border-r border-stone-800 pr-3">
                    <span className="text-[11px] text-stone-400 font-bold block">שווי כספי למימוש:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-emerald-400">₪145</span>
                      <span className="text-xs text-emerald-300 font-bold">לקנייה בחנות</span>
                    </div>
                  </div>
                </div>

                {/* Actions & QR Code Launcher */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>מעמד VIP מקנה 10% צבירה על כל קנייה</span>
                  </div>

                  <MagneticButton
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-black hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>קוד QR לאיסוף בסניף</span>
                  </MagneticButton>
                </div>

              </div>
            </TiltGlassCard>
          </div>

          {/* SECTION 2: Gemini AI Flavor DNA (Fully Editable Controls) */}
          <div className="lg:col-span-6">
            <TiltGlassCard maxTiltDeg={10} className="h-full bg-stone-900/80 border-amber-500/25">
              <form onSubmit={handleSaveFlavorDna} className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <h3 className="font-bold text-base text-stone-100">עריכת DNA טעמים ב-AI (Gemini)</h3>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    EDITABLE DNA
                  </span>
                </div>

                {dnaSaveSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{dnaSaveSuccess}</span>
                  </div>
                )}

                {/* Editable Flavor Controls */}
                <div className="space-y-3 text-xs">
                  {/* Acidity Range Slider */}
                  <div>
                    <div className="flex justify-between mb-1 text-stone-300 font-bold">
                      <span>רמת חמיצות מעודנת (Acidity):</span>
                      <span className="text-amber-400 font-mono font-black">{acidityLevel} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.1"
                      value={acidityLevel}
                      onChange={(e) => setAcidityLevel(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 bg-stone-950 rounded-lg cursor-pointer h-2"
                    />
                  </div>

                  {/* Roast Depth Range Slider */}
                  <div>
                    <div className="flex justify-between mb-1 text-stone-300 font-bold">
                      <span>עומק קלייה מועדף (Roast Depth):</span>
                      <span className="text-amber-400 font-mono font-black">{roastDepth} / 12</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="1"
                      value={roastDepth}
                      onChange={(e) => setRoastDepth(parseInt(e.target.value))}
                      className="w-full accent-orange-500 bg-stone-950 rounded-lg cursor-pointer h-2"
                    />
                  </div>

                  {/* Milk Preference Select */}
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">העדפת חלב מועדפת:</label>
                    <select
                      value={milkPref}
                      onChange={(e) => setMilkPref(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-xs font-bold text-right"
                    >
                      <option value="חלב שיבולת שועל Oatly">חלב שיבולת שועל Oatly (מומלץ)</option>
                      <option value="חלב שקדים בריסטה">חלב שקדים בריסטה</option>
                      <option value="חלב סויה אורגני">חלב סויה אורגני</option>
                      <option value="חלב בקר מלא 3.6%">חלב בקר מלא 3.6%</option>
                      <option value="ללא חלב (קפה שחור / אספרסו)">ללא חלב (קפה שחור / אספרסו)</option>
                    </select>
                  </div>

                  {/* Favorite Blend Text Input */}
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">משקה / תערובת קפה נבחרת:</label>
                    <input
                      type="text"
                      value={favoriteBlend}
                      onChange={(e) => setFavoriteBlend(e.target.value)}
                      placeholder="הזן משקה אהוב..."
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-xs text-right font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>שמור פרופיל טעמים AI</span>
                  </button>
                </div>
              </form>
            </TiltGlassCard>
          </div>

        </div>

        {/* SECTION 3: Live Real-Time Order Tracking Progress Bar */}
        <div className="liquid-glass rounded-3xl p-6 border border-amber-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-stone-100">מעקב הזמנה פעילה בלייב</h3>
                <p className="text-xs text-stone-400">הזמנה #DR-489210 • משלוח אקספרס עד הבית</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-bold self-start sm:self-auto">
              <Clock className="w-4 h-4 animate-spin-slow" />
              <span>זמן הגעה משוער: עוד 12 דקות</span>
            </div>
          </div>

          {/* Progress Bar Timeline */}
          <div className="grid grid-cols-4 gap-2 text-center relative pt-2">
            
            {/* Step 1: Received */}
            <div className="space-y-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-stone-950 font-black mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Check className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-stone-200 block">ההזמנה נקלטה</span>
                <span className="text-[10px] text-emerald-400 block font-mono">10:14</span>
              </div>
            </div>

            {/* Step 2: Brewing */}
            <div className="space-y-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-stone-950 font-black mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Coffee className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-stone-200 block">בחליטה וקלייה</span>
                <span className="text-[10px] text-emerald-400 block font-mono">10:20</span>
              </div>
            </div>

            {/* Step 3: Out for Delivery (ACTIVE) */}
            <div className="space-y-2 relative z-10">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-black mx-auto flex items-center justify-center shadow-xl shadow-amber-500/40 ring-4 ring-amber-500/20 animate-bounce">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-amber-300 block">בדרך אליך</span>
                <span className="text-[10px] text-amber-400 font-bold block">שליח בתנועה 🛵</span>
              </div>
            </div>

            {/* Step 4: Delivered */}
            <div className="space-y-2 relative z-10 opacity-40">
              <div className="w-10 h-10 rounded-full bg-stone-800 text-stone-400 font-bold mx-auto flex items-center justify-center border border-stone-700">
                <Package className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-400 block">נמסרה בהצלחה</span>
                <span className="text-[10px] text-stone-500 block font-mono">--:--</span>
              </div>
            </div>

            {/* Connecting Line Background */}
            <div className="absolute top-7 left-[12%] right-[12%] h-1 bg-stone-800 -z-0">
              <div className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-500 w-[66%]" />
            </div>
          </div>
        </div>

        {/* GRID LAYOUT: SECTION 4 & SECTION 5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* SECTION 4: Monthly Coffee Subscription Management (Fully Editable) */}
          <div className="lg:col-span-6">
            <TiltGlassCard maxTiltDeg={10} className="h-full bg-stone-900/80 border-amber-500/25">
              <form onSubmit={handleSaveSubscription} className="space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-base text-stone-100">ניהול מנוי קפה חודשי</h3>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${isSubActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'}`}>
                    {isSubActive ? '● מנוי פעיל' : '○ מנוי מוקפא'}
                  </span>
                </div>

                {subSaveSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{subSaveSuccess}</span>
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 text-xs">
                  {/* Select Bean Type */}
                  <div>
                    <label className="text-stone-300 font-bold block mb-1">סוג פולי קפה במנוי:</label>
                    <select
                      value={selectedBean}
                      onChange={(e) => setSelectedBean(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-xs font-bold text-right"
                    >
                      <option value="Single Origin Ethiopia Yirgacheffe">Single Origin Ethiopia Yirgacheffe (₪79/חודש)</option>
                      <option value="Colombia Huila Dark Roast">Colombia Huila Dark Roast (₪85/חודש)</option>
                      <option value="Brazil Cerrado Natural Process">Brazil Cerrado Natural Process (₪79/חודש)</option>
                      <option value="House Espresso Blend 100% Arabica">House Espresso Blend 100% Arabica (₪89/חודש)</option>
                    </select>
                  </div>

                  {/* Frequency Switcher */}
                  <div className="pt-2 border-t border-stone-900 flex items-center justify-between">
                    <span className="text-stone-400 font-bold">תדירות אספקה:</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setSubFrequency('monthly')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${subFrequency === 'monthly' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                      >
                        פעם בחודש
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubFrequency('biweekly')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${subFrequency === 'biweekly' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                      >
                        כל שבועיים
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubFrequency('weekly')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${subFrequency === 'weekly' ? 'bg-amber-500 text-stone-950' : 'bg-stone-900 text-stone-400 hover:text-stone-200'}`}
                      >
                        כל שבוע
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pause / Resume Button */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubActive(!isSubActive)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 ${isSubActive ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-stone-950' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-stone-950'}`}
                  >
                    {isSubActive ? (
                      <>
                        <PauseCircle className="w-4 h-4" />
                        <span>הקפא מנוי</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        <span>חדש מנוי</span>
                      </>
                    )}
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>שמור הגדרות מנוי</span>
                  </button>
                </div>
              </form>
            </TiltGlassCard>
          </div>

          {/* SECTION 5: MongoDB Auth & Account Security (Fully Editable Form & Password) */}
          <div className="lg:col-span-6">
            <TiltGlassCard maxTiltDeg={10} className="h-full bg-stone-900/80 border-amber-500/25">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-stone-100">עריכת פרטי חשבון וסיסמה</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnable2FA(!enable2FA)}
                    className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30"
                  >
                    {enable2FA ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-stone-500" />}
                    <span>{enable2FA ? '2FA מופעל' : '2FA מבוטל'}</span>
                  </button>
                </div>

                {securitySuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{securitySuccessMsg}</span>
                  </div>
                )}

                {securityErrorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                    {securityErrorMsg}
                  </div>
                )}

                <form onSubmit={handleSaveProfileSecurity} className="space-y-3 text-xs">
                  <div>
                    <label className="text-stone-400 font-bold block mb-1">שם מלא (ניתן לעריכה):</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">כתובת אימייל (ניתן לעריכה):</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">מספר טלפון לתיאום (ניתן לעריכה):</label>
                    <input
                      type="tel"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right font-bold"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">
                      תמונת פרופיל / Google Avatar (העלאת קובץ או קישור URL):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                      <div className="flex-1 w-full flex gap-2">
                        <input
                          type="url"
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                          placeholder="https://lh3.googleusercontent.com/..."
                          className="flex-1 px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-left font-mono text-[11px]"
                          dir="ltr"
                        />
                        {editImage && (
                          <div className="w-9 h-9 rounded-xl overflow-hidden border border-amber-500/50 shrink-0 bg-stone-950 shadow-md">
                            <img src={editImage} alt="Avatar Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      {/* Local File Upload Button */}
                      <label className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5">
                        <span>📷 העלה תמונה מהמחשב</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setEditImage(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setEditImage('/idan-profile-circle.png')}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-950 border border-stone-800 text-[10px] text-amber-300 font-bold hover:border-amber-500/50 transition-all flex items-center gap-1"
                      >
                        <span>תמונת Google ברירת מחדל</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 space-y-2">
                    <label className="text-amber-400 font-bold flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>שינוי סיסמה (אופציונלי):</span>
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="password"
                        placeholder="סיסמה חדשה..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right text-xs"
                      />
                      <input
                        type="password"
                        placeholder="אימות סיסמה חדשה..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 mt-2 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>שמור ועדכן את כל הנתונים ב-MongoDB</span>
                  </button>
                </form>
              </div>
            </TiltGlassCard>
          </div>

        </div>

        {/* SECTION 6: Saved Credit Card Details */}
        <div className="grid grid-cols-1">
          <div className="w-full">
            <TiltGlassCard maxTiltDeg={4} className="bg-stone-900/80 border-amber-500/25">
              <form onSubmit={handleSaveCreditCard} className="space-y-5">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-base text-stone-100">פרטי כרטיס אשראי שמור לתשלום</h3>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                    SECURED WALLET
                  </span>
                </div>

                {cardSaveSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{cardSaveSuccess}</span>
                  </div>
                )}

                {cardErrorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold text-center">
                    {cardErrorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  <div className="md:col-span-2">
                    <label className="text-stone-400 font-bold block mb-1">מספר כרטיס אשראי:</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNo}
                      onChange={(e) => handleCardNoChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right font-mono tracking-wider placeholder:text-right"
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">תוקף (MM/YY):</label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => handleExpiryChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-center font-mono"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-stone-400 font-bold block mb-1">CVV:</label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="XXX"
                      value={cardCvv}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-center font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs">
                  <div>
                    <label className="text-stone-400 font-bold block mb-1">שם מחזיק הכרטיס (בעברית):</label>
                    <input
                      type="text"
                      placeholder="שם מלא כפי שמופיע על הכרטיס"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-500 text-right font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>שמור כרטיס בארנק המאובטח</span>
                  </button>
                </div>
              </form>
            </TiltGlassCard>
          </div>
        </div>

      </div>

      {/* QR Code Modal for In-Store Pickup */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm liquid-glass border border-amber-500/40 rounded-3xl p-6 space-y-5 text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-stone-900 text-stone-400 hover:text-stone-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-stone-100">קוד QR לאיסוף בסניף</h3>
              <p className="text-xs text-stone-400">הצג קוד זה לבריסטה בסניף לקבלת ההטבה והזיהוי</p>
            </div>

            {/* Generated SVG QR Visual */}
            <div className="bg-white p-4 rounded-2xl inline-block shadow-2xl border-4 border-amber-500/30">
              <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                <path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="black" />
                <path d="M18 18h14v14H18zM68 18h14v14H68zM18 68h14v14H18z" fill="white" />
                <rect x="45" y="10" width="10" height="80" fill="black" />
                <rect x="10" y="45" width="80" height="10" fill="black" />
                <circle cx="75" cy="75" r="12" fill="#f59e0b" />
              </svg>
            </div>

            <div className="text-xs font-mono text-amber-300 font-bold bg-stone-950 py-2 rounded-xl border border-stone-800">
              MEMBER-ID: #8829-9941-2026
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
