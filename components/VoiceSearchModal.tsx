'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Mic,
  MicOff,
  X,
  Sparkles,
  ArrowLeft,
  Coffee,
  Layers,
  FlaskConical,
  Flame,
  Globe,
  Radio,
  Clock,
  Compass,
} from 'lucide-react';
import { useVoiceAssistantStore } from '@/lib/store/useVoiceAssistantStore';
import { VOICE_NAV_ROUTES, VoiceRouteTarget } from '@/lib/voice/voiceNavigationMatcher';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const VoiceSearchModal: React.FC = () => {
  const router = useRouter();
  const { isSearchModalOpen, closeSearchModal } = useVoiceAssistantStore();

  const [query, setQuery] = useState('');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize SpeechRecognition for Search Modal
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'he-IL';

      recognition.onstart = () => {
        setIsVoiceListening(true);
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text.trim()) {
          setQuery(text.trim());
        }
      };

      recognition.onerror = () => {
        setIsVoiceListening(false);
      };

      recognition.onend = () => {
        setIsVoiceListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      // Ignored
    }
  }, []);

  // Handle Modal Open / Close and Focus
  useEffect(() => {
    if (isSearchModalOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
        // Start voice listening automatically upon opening search modal if supported
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            // Already active
          }
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Already stopped
        }
      }
      setIsVoiceListening(false);
      setQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchModalOpen]);

  // Keyboard shortcut (Escape to close, Ctrl+Shift+V to open)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchModalOpen) {
        closeSearchModal();
      }
      if (e.ctrlKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        coffeeSound.playBaristaClick();
        if (isSearchModalOpen) {
          closeSearchModal();
        } else {
          useVoiceAssistantStore.getState().openSearchModal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, closeSearchModal]);

  const handleToggleVoiceMic = () => {
    coffeeSound.playBaristaClick();
    if (!recognitionRef.current) return;

    if (isVoiceListening) {
      recognitionRef.current.stop();
      setIsVoiceListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch {
        // Handled
      }
    }
  };

  // Filter routes based on voice search query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return VOICE_NAV_ROUTES.slice(0, 12);

    const q = query.toLowerCase().trim();
    return VOICE_NAV_ROUTES.filter((item) => {
      return (
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const handleSelectResult = (target: VoiceRouteTarget) => {
    coffeeSound.playBaristaClick();
    coffeeSound.speakHebrew(target.spokenConfirmation);
    closeSearchModal();
    router.push(target.path);
  };

  if (!isSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-start justify-center pt-16 sm:pt-24 px-4 font-sans selection:bg-amber-500/30" dir="rtl">
      {/* Backdrop */}
      <div
        onClick={() => {
          coffeeSound.playBaristaClick();
          closeSearchModal();
        }}
        className="fixed inset-0 bg-black/80 backdrop-blur-2xl transition-opacity animate-in fade-in duration-200"
      />

      {/* Search Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-stone-950/95 border border-amber-500/30 shadow-[0_20px_80px_rgba(0,0,0,0.95)] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-white/10 bg-stone-900/60">
          <Search className="w-5 h-5 text-stone-400 shrink-0 ms-1" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='חפש בקול או בטקסט: "קטלוג", "שעון קפאין", "מעבדת מים", "יומן גוגל"...'
            className="w-full bg-transparent border-0 px-3 py-1 text-sm sm:text-base font-semibold text-stone-100 placeholder-stone-500 focus:outline-none"
          />

          {/* Voice Mic Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleVoiceMic}
              className={`p-2.5 rounded-xl transition-all ${
                isVoiceListening
                  ? 'bg-rose-500 text-stone-950 shadow-lg shadow-rose-500/30 animate-pulse'
                  : 'bg-stone-800 hover:bg-stone-700 text-amber-400 border border-white/10'
              }`}
              title={isVoiceListening ? 'הפסק הקשבה' : 'הפעל חיפוש קולי'}
            >
              {isVoiceListening ? <Mic className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                closeSearchModal();
              }}
              className="p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Listening Indicator */}
        {isVoiceListening && (
          <div className="px-5 py-2 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between text-xs text-rose-300 font-bold">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse text-rose-400" />
              <span>מקשיב לקולך... אמור פקודה או שם של עמוד</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-4 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1 divide-y divide-white/5">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectResult(item)}
                className="pt-1.5 first:pt-0"
              >
                <div className="group cursor-pointer rounded-2xl p-3 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-stone-900 border border-white/10 group-hover:border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 transition-colors">
                      {item.category === 'shop' && <Coffee className="w-4 h-4" />}
                      {item.category === 'ai' && <Sparkles className="w-4 h-4" />}
                      {item.category === 'lab' && <FlaskConical className="w-4 h-4" />}
                      {item.category === 'roast' && <Flame className="w-4 h-4" />}
                      {item.category === 'b2b' && <Globe className="w-4 h-4" />}
                      {item.category === 'calendar' && <Clock className="w-4 h-4" />}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-xs text-stone-400 leading-tight mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone-500 group-hover:text-amber-400/80 transition-colors">
                      {item.path}
                    </span>
                    <ArrowLeft className="w-4 h-4 text-stone-500 group-hover:text-amber-300 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-stone-400 text-sm">
              <Compass className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p>לא נמצאו תוצאות עבור "{query}"</p>
              <span className="text-xs text-stone-500">נסה לומר: "קטלוג", "שעון קפאין", או "מעבדת מים"</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/10 bg-stone-900/40 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <span>ניווט קולי: אמור פקודה בעברית</span>
            <span className="text-stone-600">•</span>
            <span>סגירה: ESC</span>
          </div>
          <span className="font-mono text-amber-400/80">Ctrl + K</span>
        </div>
      </div>
    </div>
  );
};
