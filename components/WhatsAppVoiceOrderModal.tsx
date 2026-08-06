'use client';

import React, { useState } from 'react';
import type { WhatsAppVoiceOrderResult } from '@/app/api/gemini/whatsapp-voice/route';

interface WhatsAppVoiceOrderModalProps {
  onClose?: () => void;
}

export default function WhatsAppVoiceOrderModal({ onClose }: WhatsAppVoiceOrderModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('שלישיית שקיות אתיופיה קלייה בהירה לתל אביב');
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<WhatsAppVoiceOrderResult | null>(null);

  const handleProcessVoice = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini/whatsapp-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voiceText }),
      });
      const json = await res.json().catch(() => ({ success: false }));
      if (json && json.success) {
        setOrderResult(json.data);
      }
    } catch (err) {
      console.error('Voice order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setVoiceText('אני רוצה להזמין 2 שקיות קולומביה הואילה טחון לאספרסו לרמת גן');
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <section className="relative w-full p-6 md:p-8 rounded-3xl bg-[#080606]/80 border border-amber-500/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] text-white dir-rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 bg-amber-950/60 rounded-full border border-amber-500/30 mb-2">
            🎙️ AI WhatsApp Voice Orders
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            הזמנה קולית ב-WhatsApp
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mt-1">
            דבר בעברית חופשית או הקלט הודעה - ה-AI יבנה עבורך שובר הזמנה מוכן לשליחה
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
          📲
        </div>
      </div>

      {/* Voice Recorder Control */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 mb-6 text-center">
        <button
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold transition-all duration-300 mb-3 ${
            isRecording
              ? 'bg-rose-600 text-white animate-ping shadow-[0_0_40px_rgba(225,29,72,0.6)]'
              : 'bg-gradient-to-br from-amber-500 to-orange-600 text-black hover:scale-110 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
          }`}
        >
          🎙️
        </button>
        <span className="text-xs text-neutral-300 font-bold">
          {isRecording ? 'מקליט הודעה קולית בעברית... (דבר עכשיו)' : 'לחץ להקלטה קולית'}
        </span>
      </div>

      {/* Manual Input Fallback */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={voiceText}
          onChange={(e) => setVoiceText(e.target.value)}
          placeholder="או הקלד תמליל הודעה קולית בעברית..."
          className="flex-1 px-4 py-3 text-xs md:text-sm rounded-xl bg-black/60 border border-amber-500/20 text-amber-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
        />
        <button
          onClick={handleProcessVoice}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs md:text-sm shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? 'מפענח...' : 'בנה הזמנה ✨'}
        </button>
      </div>

      {/* Parsed Order Card */}
      {orderResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-neutral-900/90 to-black border border-emerald-500/30">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-emerald-500/20">
            <div>
              <span className="text-xs text-emerald-400 font-bold">הזמנה פוענחה בהצלחה!</span>
              <p className="text-xs text-neutral-400 mt-0.5">עיר למשלוח: {orderResult.customerCity}</p>
            </div>
            <span className="text-xl font-extrabold text-emerald-300">{orderResult.totalILS} ₪</span>
          </div>

          <div className="space-y-2 mb-4">
            {orderResult.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs text-neutral-200">
                <span>{item.quantity}x {item.name} ({item.grindType})</span>
                <span className="font-bold">{item.unitPriceILS * item.quantity} ₪</span>
              </div>
            ))}
          </div>

          <a
            href={orderResult.whatsAppDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs text-center shadow-lg transition-all"
          >
            שגר הזמנה ישר ל-WhatsApp 🚀
          </a>
        </div>
      )}
    </section>
  );
}
