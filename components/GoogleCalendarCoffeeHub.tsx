'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Sparkles,
  Coffee,
  Zap,
  Flame,
  Wrench,
  CheckCircle2,
  ExternalLink,
  Download,
  Share2,
  Users,
  Bell,
  Layers,
  ArrowRight,
  Info,
  CalendarCheck,
  CalendarPlus,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { CoffeeCalendarEventInput, CalendarEventType } from '@/lib/schemas/calendarSchema';
import { scheduleCoffeeCalendarEventAction } from '@/app/actions/calendarActions';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

interface EventPreset {
  id: string;
  title: string;
  category: CalendarEventType;
  durationMinutes: number;
  timeOffsetHours: number; // relative to now
  description: string;
  location: string;
  isGoogleMeet: boolean;
  tag: string;
  color: string;
  metadata?: Record<string, any>;
}

const EVENT_PRESETS: EventPreset[] = [
  {
    id: 'cupping-masterclass',
    title: 'מעבדת קאפינג SCA 100-Point & טעימת מיקרו-לוטים',
    category: 'cupping_workshop',
    durationMinutes: 60,
    timeOffsetHours: 24,
    description: 'מפגש טעימות וירטואלי חי של זני Heirloom מאתיופיה וקולומביה אנאירובית. ננתח ארומה, חמיצות, מתיקות ואיזון לפי תקן SCA עם טופס דיגיטלי משותף.',
    location: 'Google Meet Virtual Cupping Room',
    isGoogleMeet: true,
    tag: 'סדנה חיה 🏆',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300',
    metadata: { cuppingScore: 92.5, beanOrigin: 'Ethiopia Yirgacheffe & Colombia Geisha' },
  },
  {
    id: 'v60-gold-cup',
    title: 'סדנת חליטה V60 Pour-Over & שליטה ב-Extraction Yield',
    category: 'cupping_workshop',
    durationMinutes: 45,
    timeOffsetHours: 48,
    description: 'התאמת יחס חליטה 1:16, טכניקת מזיגת ספירלה, שליטה בשלב ה-Bloom וכיול טחינה אקוסטית לקבלת TDS אידיאלי (1.35%).',
    location: 'Google Meet Barista Lab',
    isGoogleMeet: true,
    tag: 'הדרכת חליטה ☕',
    color: 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30 text-yellow-300',
    metadata: { cuppingScore: 89 },
  },
  {
    id: 'circadian-morning-dip',
    title: '⚡ חלון קפאין בוקר - עליה מתונה במיקוד (Circadian Dip)',
    category: 'circadian_caffeine',
    durationMinutes: 30,
    timeOffsetHours: 15,
    description: 'חלון צריכת קפאין אופטימלי 90 דקות לאחר היקיצה. הקורטיזול הטבעי מתאזן, והקפאין פועל בחסימת קולטני אדנוזין ללא תופעת התרסקות אנרגיה (Crash).',
    location: 'The Digital Roast Bio-Clock',
    isGoogleMeet: false,
    tag: 'שעון ביולוגי ⚡',
    color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300',
    metadata: { targetAdenosineHour: '09:30 - 10:00' },
  },
  {
    id: 'circadian-cutoff-warn',
    title: '🌙 גבול צריכת קפאין יומי (Adenosine Sleep Protection)',
    category: 'circadian_caffeine',
    durationMinutes: 15,
    timeOffsetHours: 21,
    description: 'זמן חסימת קפאין לקראת שינה עמוקה. זמן מחצית חיים של קפאין הינו כ-6 שעות. מומלץ לעבור לתה צמחים או קפה נטול קפאין (Swiss Water Decaf).',
    location: 'Personal Bio-Tracker',
    isGoogleMeet: false,
    tag: 'הגנת שינה 💤',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300',
    metadata: { targetAdenosineHour: '14:00 Cutoff' },
  },
  {
    id: 'roast-peak-flavor',
    title: '🔥 פתיחת חלון שיא טעם (Peak Extraction: ימים 7-21)',
    category: 'roast_degassing',
    durationMinutes: 20,
    timeOffsetHours: 168, // 7 days
    description: 'פולי הקפה סיימו את שלב הדיגזינג העיקרי! רמות ה-CO2 התייצבו והפולים נמצאים בשיא העושר הארומטי למיצוי אספרסו ופילטר.',
    location: 'Coffee Tasting Counter',
    isGoogleMeet: false,
    tag: 'שיא טעם 🔥',
    color: 'from-rose-500/20 to-amber-500/20 border-rose-500/30 text-rose-300',
    metadata: { beanOrigin: 'Colombia Pink Bourbon', roastDate: 'היום' },
  },
  {
    id: 'maintenance-descale',
    title: '🛠️ טיפול תקופתי למכונת אספרסו והחלפת מסנן מים',
    category: 'machine_maintenance',
    durationMinutes: 40,
    timeOffsetHours: 720, // 30 days
    description: 'שטיפת ראש חליטה עם חומר Backflush, ניקוי שסתום 3-Way, הסרת שומני קפה מהסלסילות ובדיקת יוני סידן ומגנזיום (TDS) במים.',
    location: 'Espresso Bar Station',
    isGoogleMeet: false,
    tag: 'תחזוקת ציוד 🔧',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300',
  },
  {
    id: 'subscription-dispatch',
    title: '📦 אספקת מנוי חודשי: מארז פולי קפה גורמה טריים',
    category: 'subscription_delivery',
    durationMinutes: 15,
    timeOffsetHours: 336, // 14 days
    description: 'משלוח מחזורי מבית הקלייה של The Digital Roast - פולים בקלייה טרייה (עד 48 שעות מהתנור) ישירות לפתח הבית.',
    location: 'משלוח עד הבית',
    isGoogleMeet: false,
    tag: 'מנוי חודשי 📦',
    color: 'from-amber-500/20 to-emerald-500/20 border-amber-500/30 text-amber-300',
    metadata: { subscriptionId: 'SUB-ROAST-VIP' },
  },
];

export const GoogleCalendarCoffeeHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CalendarEventType | 'all'>('all');
  const [activePreset, setActivePreset] = useState<EventPreset>(EVENT_PRESETS[0]);

  // Form State
  const [eventTitle, setEventTitle] = useState(EVENT_PRESETS[0].title);
  const [eventDescription, setEventDescription] = useState(EVENT_PRESETS[0].description);
  const [eventLocation, setEventLocation] = useState(EVENT_PRESETS[0].location);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [isGoogleMeet, setIsGoogleMeet] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(30);

  // Status & Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean;
    message: string;
    calendarUrl: string;
    icsContent?: string;
    meetUrl?: string;
  } | null>(null);

  const [scheduledHistory, setScheduledHistory] = useState<
    Array<{
      id: string;
      title: string;
      date: string;
      time: string;
      category: CalendarEventType;
      url: string;
      meetUrl?: string;
    }>
  >([]);

  const [autoOpenInCalendar, setAutoOpenInCalendar] = useState(true);

  // Filtered Presets
  const filteredPresets = useMemo(() => {
    if (selectedCategory === 'all') return EVENT_PRESETS;
    return EVENT_PRESETS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleSelectPreset = (preset: EventPreset) => {
    coffeeSound.playBaristaClick();
    setActivePreset(preset);
    setEventTitle(preset.title);
    setEventDescription(preset.description);
    setEventLocation(preset.location);
    setDurationMinutes(preset.durationMinutes);
    setIsGoogleMeet(preset.isGoogleMeet);

    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + preset.timeOffsetHours);
    setStartDate(targetDate.toISOString().split('T')[0]);
    const hours = String(targetDate.getHours()).padStart(2, '0');
    setStartTime(`${hours}:00`);
  };

  const handleInstantAutoSync = async (e: React.MouseEvent, preset: EventPreset) => {
    e.stopPropagation();
    setIsSyncing(true);
    coffeeSound.playBaristaClick();

    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + preset.timeOffsetHours);
    const dateStr = targetDate.toISOString().split('T')[0];
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const timeStr = `${hours}:00`;

    const payload: CoffeeCalendarEventInput = {
      title: preset.title,
      description: preset.description,
      location: preset.location,
      startDate: dateStr,
      startTime: timeStr,
      durationMinutes: preset.durationMinutes,
      eventType: preset.category,
      isGoogleMeet: preset.isGoogleMeet,
      reminderMinutes: 30,
      metadata: preset.metadata,
    };

    try {
      const result = await scheduleCoffeeCalendarEventAction(payload);
      setLastSyncResult(result);

      if (result.success) {
        coffeeSound.playPourSound();
        setScheduledHistory((prev) => [
          {
            id: `sch_${Date.now()}`,
            title: preset.title,
            date: dateStr,
            time: timeStr,
            category: preset.category,
            url: result.calendarUrl,
            meetUrl: result.meetUrl,
          },
          ...prev,
        ]);

        // Automatically launch Google Calendar
        if (result.calendarUrl) {
          window.open(result.calendarUrl, '_blank');
        }
      }
    } catch (err: any) {
      setLastSyncResult({
        success: false,
        message: err.message || 'שגיאה בסנכרון האירוע',
        calendarUrl: '',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScheduleEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    coffeeSound.playBaristaClick();

    const payload: CoffeeCalendarEventInput = {
      title: eventTitle,
      description: eventDescription,
      location: eventLocation,
      startDate,
      startTime,
      durationMinutes,
      eventType: activePreset.category,
      attendeeEmail: attendeeEmail.trim() || undefined,
      isGoogleMeet,
      reminderMinutes,
      metadata: activePreset.metadata,
    };

    try {
      const result = await scheduleCoffeeCalendarEventAction(payload);
      setLastSyncResult(result);

      if (result.success) {
        coffeeSound.playPourSound();
        setScheduledHistory((prev) => [
          {
            id: `sch_${Date.now()}`,
            title: eventTitle,
            date: startDate,
            time: startTime,
            category: activePreset.category,
            url: result.calendarUrl,
            meetUrl: result.meetUrl,
          },
          ...prev,
        ]);

        // Auto open if enabled
        if (autoOpenInCalendar && result.calendarUrl) {
          window.open(result.calendarUrl, '_blank');
        }
      }
    } catch (err: any) {
      setLastSyncResult({
        success: false,
        message: err.message || 'שגיאה בסנכרון האירוע',
        calendarUrl: '',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadICS = () => {
    if (!lastSyncResult?.icsContent) return;
    coffeeSound.playBaristaClick();
    const blob = new Blob([lastSyncResult.icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `coffee_event_${startDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 text-stone-100 font-sans" dir="rtl">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-900/80 border border-amber-500/20 backdrop-blur-2xl p-6 sm:p-10 mb-10 shadow-2xl shadow-black/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider mb-4 shadow-sm">
              <CalendarCheck className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>GOOGLE CALENDAR AI COFFEE ENGINE v8.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-stone-100 to-amber-400 tracking-tight leading-tight mb-3">
              יומן הקפה החכם & סנכרון Google Calendar
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              סנכרון רב-ממדי של סדנאות בריסטה בלייב (Google Meet), חלונות קפאין ביולוגיים (Circadian Focus), תזמוני שיא טעם ודיגזינג של פולים טריים ותזכורות מנויים ישירות ליומן Google האישי שלך.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-800/80 border border-white/10 text-xs text-stone-300 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Google API Live Sync Ready</span>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="relative z-10 flex flex-wrap gap-2 pt-8 border-t border-white/5 mt-8">
          {[
            { id: 'all', label: 'כל האירועים', icon: Layers },
            { id: 'cupping_workshop', label: 'סדנאות וקאפינג בלייב', icon: Coffee },
            { id: 'circadian_caffeine', label: 'שעון קפאין צירקדי', icon: Zap },
            { id: 'roast_degassing', label: 'שיא טעם ודיגזינג פולים', icon: Flame },
            { id: 'subscription_delivery', label: 'מנויים ואספקה', icon: CalendarPlus },
            { id: 'machine_maintenance', label: 'תחזוקת ציוד', icon: Wrench },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  coffeeSound.playBaristaClick();
                  setSelectedCategory(tab.id as any);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-stone-800/60 hover:bg-stone-700/60 text-stone-300 border border-white/5 hover:border-amber-500/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Presets & Form Scheduler */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left Column: Preset Templates */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>תבניות אירועים מוכנות מראש</span>
            </h2>
            <span className="text-xs text-stone-400">בחר תבנית לסנכרון מהיר</span>
          </div>

          <div className="space-y-3">
            {filteredPresets.map((preset) => {
              const isSelected = activePreset.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border backdrop-blur-xl ${
                    isSelected
                      ? 'bg-stone-800/90 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30 -translate-y-0.5'
                      : 'bg-stone-900/60 hover:bg-stone-800/60 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${preset.color}`}>
                      {preset.tag}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{preset.durationMinutes} דקות</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-stone-100 mb-1.5 leading-snug">{preset.title}</h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed mb-3">{preset.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-stone-400">
                    <span className="flex items-center gap-1">
                      {preset.isGoogleMeet ? (
                        <>
                          <Video className="w-3 h-3 text-cyan-400" />
                          <span className="text-cyan-300">Google Meet</span>
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="w-3 h-3 text-amber-400" />
                          <span>יומן אישי</span>
                        </>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleInstantAutoSync(e, preset)}
                        className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        title="יצירה ופתיחה אוטומטית מיידית ב-Google Calendar"
                      >
                        <Zap className="w-3 h-3" />
                        <span>סנכרן ופתח אוטומטית</span>
                      </button>
                      <span className="text-amber-400/80 font-medium">ערוך בטופס ←</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Schedule Customizer */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-stone-900/80 border border-amber-500/20 backdrop-blur-2xl p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <CalendarPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-100">הגדרת אירוע וסנכרון ל-Google Calendar</h2>
                  <p className="text-xs text-stone-400">התאם אישית את פרטי המפגש, התאריך והמשתתפים</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-stone-800 border border-white/10 text-amber-300">
                1-Click Direct Sync
              </span>
            </div>

            <form onSubmit={handleScheduleEvent} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">כותרת האירוע ביומן</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm placeholder-stone-500 transition-colors"
                  placeholder="לדוגמה: סדנת קאפינג SCA עם The Digital Roast"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5">תיאור והערות (SCA Guidelines / Bio-Notes)</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm placeholder-stone-500 transition-colors resize-none"
                  placeholder="פרטי האירוע, סוגי פולים, הנחיות הכנה..."
                />
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>תאריך</span>
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>שעה (24h)</span>
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm font-mono transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5">משך זמן</label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm transition-colors"
                  >
                    <option value={15}>15 דקות (תזכורת מהירה)</option>
                    <option value={30}>30 דקות (חלון קפאין)</option>
                    <option value={45}>45 דקות (הדרכת V60)</option>
                    <option value={60}>60 דקות (סדנת קאפינג מלאה)</option>
                    <option value={90}>90 דקות (מאסטר קלאס)</option>
                    <option value={120}>שעתיים (אירוע קלייה מקיף)</option>
                  </select>
                </div>
              </div>

              {/* Location & Attendee Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>אימייל משתתף / מוזמן (אופציונלי)</span>
                  </label>
                  <input
                    type="email"
                    value={attendeeEmail}
                    onChange={(e) => setAttendeeEmail(e.target.value)}
                    placeholder="barista@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm placeholder-stone-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>התראת תזכורת מקדימה</span>
                  </label>
                  <select
                    value={reminderMinutes}
                    onChange={(e) => setReminderMinutes(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-800/80 border border-white/10 focus:border-amber-500 focus:outline-none text-stone-100 text-sm transition-colors"
                  >
                    <option value={10}>10 דקות לפני</option>
                    <option value={30}>30 דקות לפני (מומלץ)</option>
                    <option value={60}>שעה לפני</option>
                    <option value={1440}>יום לפני (24 שעות)</option>
                  </select>
                </div>
              </div>

              {/* Google Meet Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-800/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-200">יצירת חדר וידאו חי ב-Google Meet</div>
                    <div className="text-[11px] text-stone-400">מצרף קישור וידאו ישיר להדרכה בתוך אירוע היומן</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGoogleMeet}
                    onChange={(e) => {
                      coffeeSound.playBaristaClick();
                      setIsGoogleMeet(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              {/* Auto Open Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-stone-200">פתח את יומן Google אוטומטית בחלון חדש לאחר הסנכרון</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoOpenInCalendar}
                    onChange={(e) => {
                      coffeeSound.playBaristaClick();
                      setAutoOpenInCalendar(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              {/* Submit Sync Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSyncing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-extrabold text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 flex items-center justify-center gap-3 transform active:scale-[0.99] disabled:opacity-50"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>מסנכרן עם Google Calendar API...</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-5 h-5" />
                      <span>סנכרן אירוע ל-Google Calendar עכשיו</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Sync Result Modal / Card */}
            {lastSyncResult && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-900/80 to-stone-900/90 border border-amber-500/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-300">{lastSyncResult.message}</h4>
                      <p className="text-xs text-stone-300 mt-0.5">האירוע מוכן לסנכרון מיידי ביומן Google או ייצוא לקובץ</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10">
                  <a
                    href={lastSyncResult.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => coffeeSound.playBaristaClick()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>פתח ב-Google Calendar Web</span>
                  </a>

                  {lastSyncResult.meetUrl && (
                    <a
                      href={lastSyncResult.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600/80 text-white font-bold text-xs hover:bg-cyan-500 transition-colors border border-cyan-400/30"
                    >
                      <Video className="w-4 h-4" />
                      <span>הצטרף ל-Google Meet</span>
                    </a>
                  )}

                  {lastSyncResult.icsContent && (
                    <button
                      onClick={handleDownloadICS}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition-colors border border-white/10"
                    >
                      <Download className="w-4 h-4 text-amber-400" />
                      <span>הורד קובץ יומן (.ics)</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scheduled History & Live Sync Dashboard */}
      {scheduledHistory.length > 0 && (
        <div className="rounded-3xl bg-stone-900/80 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <h3 className="text-lg font-bold text-stone-100 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-amber-400" />
              <span>אירועים שסונכרנו בסשן הנוכחי</span>
            </h3>
            <span className="text-xs text-stone-400 font-mono">{scheduledHistory.length} אירועים פעילים</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-800/60 border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="font-mono text-amber-300">{item.date} | {item.time}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-stone-100 leading-snug mb-3">{item.title}</h4>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1"
                  >
                    <span>הצג ב-Google Calendar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
