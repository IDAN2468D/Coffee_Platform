'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Mic,
  MicOff,
  Sparkles,
  Compass,
  ArrowLeft,
  Volume2,
  X,
  ChevronUp,
  ChevronDown,
  Search,
  Zap,
  Coffee,
  CheckCircle2,
  Radio,
  Layers,
} from 'lucide-react';
import { useVoiceAssistantStore } from '@/lib/store/useVoiceAssistantStore';
import { matchVoiceNavigationCommand, VOICE_NAV_ROUTES, VoiceRouteTarget } from '@/lib/voice/voiceNavigationMatcher';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const GlobalVoiceNavigator: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<VoiceRouteTarget | null>(null);

  const {
    isListening,
    transcript,
    statusMessage,
    matchedRoute,
    startListening,
    stopListening,
    setTranscript,
    setMatchedRoute,
    setStatusMessage,
    openSearchModal,
  } = useVoiceAssistantStore();

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize SpeechRecognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition API is not supported in this browser environment.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'he-IL';

      recognition.onstart = () => {
        setRecognitionActive(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }

        if (currentTranscript.trim()) {
          setTranscript(currentTranscript);
          const matched = matchVoiceNavigationCommand(currentTranscript);

          if (matched) {
            setNavigatingTo(matched);
            setMatchedRoute(matched);
            coffeeSound.playBaristaClick();
            coffeeSound.speakHebrew(matched.spokenConfirmation);

            // Execute Navigation after brief voice acknowledgement
            setTimeout(() => {
              router.push(matched.path);
              setIsExpanded(false);
              stopListening();
              setNavigatingTo(null);
            }, 900);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setStatusMessage('אנא אשר גישה למיקרופון בדפדפן');
        }
        setRecognitionActive(false);
        stopListening();
      };

      recognition.onend = () => {
        setRecognitionActive(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Could not initialize SpeechRecognition:', err);
    }
  }, [router, setTranscript, setMatchedRoute, setStatusMessage, stopListening]);

  // Handle start/stop listening based on global store state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.start();
        setIsExpanded(true);
      } catch {
        // Already started or active
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
    }
  }, [isListening]);

  // Keyboard shortcut listener (Alt+V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V' || e.key === 'ה')) {
        e.preventDefault();
        coffeeSound.playBaristaClick();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening, startListening, stopListening]);

  const handleToggleMic = () => {
    coffeeSound.playBaristaClick();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleQuickCommandClick = (route: VoiceRouteTarget) => {
    coffeeSound.playBaristaClick();
    coffeeSound.speakHebrew(route.spokenConfirmation);
    router.push(route.path);
    setIsExpanded(false);
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 start-6 z-[9999] font-sans selection:bg-amber-500/30" dir="rtl">
      {/* Floating HUD Container */}
      <div className="relative">
        {/* Expanded Voice Command Center */}
        {isExpanded && (
          <div className="mb-3 w-[340px] sm:w-[380px] rounded-3xl bg-stone-950/90 border border-amber-500/30 backdrop-blur-2xl p-5 shadow-[0_10px_50px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-black shadow-md shadow-amber-500/20">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-300">עוזר קולי לניווט רב-עמודי</h4>
                  <span className="text-[10px] text-stone-400 font-mono">Voice Navigation Co-Pilot</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    openSearchModal();
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
                  title="פתח חיפוש קולי מורחב"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    coffeeSound.playBaristaClick();
                    setIsExpanded(false);
                  }}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Visualizer & Transcript Display */}
            <div className="p-3.5 rounded-2xl bg-stone-900/90 border border-white/10 mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1.5">
                  <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-rose-400 animate-pulse' : 'text-stone-500'}`} />
                  <span>{isListening ? 'מקשיב לקולך...' : 'לחץ על המיקרופון להאזנה'}</span>
                </span>
                {isListening && (
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                  </div>
                )}
              </div>

              {/* Transcript Text */}
              <div className="min-h-[44px] flex items-center">
                {transcript ? (
                  <p className="text-sm font-bold text-stone-100 leading-snug">"{transcript}"</p>
                ) : (
                  <p className="text-xs text-stone-400 italic">
                    {statusMessage}
                  </p>
                )}
              </div>

              {/* Matched Route Feedback Banner */}
              {navigatingTo && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{navigatingTo.spokenConfirmation}...</span>
                </div>
              )}
            </div>

            {/* Quick Command Suggestions */}
            <div>
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                פקודות קוליות נפוצות:
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {[
                  { label: 'תפריט פולים', path: '/catalog' },
                  { label: 'מעבדת מים', path: '/israel-water-radar' },
                  { label: 'שעון קפאין', path: '/circadian-clock' },
                  { label: 'יומן Google', path: '/calendar-hub' },
                  { label: 'סטודיו עיצוב', path: '/stitch-studio' },
                  { label: 'טחינה אקוסטית', path: '/acoustic-tuner' },
                  { label: 'קאפינג חי & Meet', path: '/live-cupping-room' },
                  { label: 'חזור לבית', path: '/home' },
                ].map((item, idx) => {
                  const target = VOICE_NAV_ROUTES.find((r) => r.path === item.path);
                  return (
                    <button
                      key={idx}
                      onClick={() => target && handleQuickCommandClick(target)}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-900/80 hover:bg-amber-500/20 text-stone-300 hover:text-amber-300 border border-white/5 hover:border-amber-500/30 text-[11px] font-medium text-right truncate transition-all flex items-center justify-between"
                    >
                      <span>"{item.label}"</span>
                      <ArrowLeft className="w-3 h-3 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer Hint */}
            <div className="pt-3 border-t border-white/5 mt-3 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>קיצור דרך: Alt + V</span>
              <span className="text-amber-400">80+ עמודים נתמכים</span>
            </div>
          </div>
        )}

        {/* Main Floating Voice Mic Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMic}
            className={`relative group w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-stone-950 scale-110 shadow-rose-500/40 ring-4 ring-rose-500/30 animate-pulse'
                : 'bg-gradient-to-tr from-amber-500 via-stone-900 to-stone-900 text-amber-300 border border-amber-500/40 hover:border-amber-400 shadow-amber-500/20 hover:scale-105'
            }`}
            title="עוזר קולי לניווט רב-עמודי (Alt+V)"
          >
            {isListening ? (
              <Mic className="w-6 h-6 animate-pulse" />
            ) : (
              <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
            )}

            {/* Glowing Ring Ripple when listening */}
            {isListening && (
              <span className="absolute -inset-1 rounded-2xl bg-rose-500/30 blur-md animate-ping pointer-events-none" />
            )}
          </button>

          {/* Quick Expand / Contract Toggle Button */}
          <button
            onClick={() => {
              coffeeSound.playBaristaClick();
              setIsExpanded(!isExpanded);
            }}
            className="w-8 h-8 rounded-xl bg-stone-900/90 border border-white/10 hover:border-amber-500/30 text-stone-300 hover:text-amber-300 flex items-center justify-center text-xs backdrop-blur-md shadow-lg transition-colors"
            title={isExpanded ? 'צמצם לוח פקודות' : 'הרחב לוח פקודות קוליות'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
