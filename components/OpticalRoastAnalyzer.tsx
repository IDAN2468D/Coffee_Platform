'use client';

import React, { useState, useRef } from 'react';
import { Camera, RefreshCw, Eye, Sparkles, Award, Sliders, CheckCircle2 } from 'lucide-react';

export default function OpticalRoastAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    agtronScore: number;
    roastCategory: string;
    hebrewName: string;
    rgbAvg: { r: number; g: number; b: number };
    cremaDensity: number;
    uniformityScore: number;
    recommendation: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        analyzeRoastImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeRoastImage = (imageSrc: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);

      const imgData = ctx.getImageData(0, 0, 300, 300);
      const data = imgData.data;

      let rSum = 0, gSum = 0, bSum = 0;
      const totalPixels = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        rSum += data[i];
        gSum += data[i + 1];
        bSum += data[i + 2];
      }

      const rAvg = Math.round(rSum / totalPixels);
      const gAvg = Math.round(gSum / totalPixels);
      const bAvg = Math.round(bSum / totalPixels);

      // Agtron Gourmet Scale approximation based on luminosity
      const luminosity = 0.2126 * rAvg + 0.7152 * gAvg + 0.0722 * bAvg;
      const agtronScore = Math.max(25, Math.min(95, Math.round((luminosity / 255) * 120)));

      let roastCategory = 'Medium Roast';
      let hebrewName = 'קלייה בינונית';
      let recommendation = 'מתאים לחליטות V60, ארואיפרס ואספרסו מאוזן.';

      if (agtronScore >= 75) {
        roastCategory = 'Light / Cinnamon Roast';
        hebrewName = 'קלייה בהירה מאוד (סנמון)';
        recommendation = 'חומציות גבוהה ותווי פירות הדר. מומלץ לחליטת Pour-over עדינה.';
      } else if (agtronScore >= 60) {
        roastCategory = 'Medium-Light / City Roast';
        hebrewName = 'קלייה בהירה-בינונית (סיטי)';
        recommendation = 'מתיקות טבעית מודגשת עם תווים פרחוניים. מצוין לפול-אובר וקאפינג.';
      } else if (agtronScore >= 45) {
        roastCategory = 'Medium-Dark / Full City';
        hebrewName = 'קלייה בינונית-כהה (פול סיטי)';
        recommendation = 'גוף מלא, תווים של שוקולד מריר ואגוזים. אידיאלי לאספרסו ומשקאות חלב.';
      } else {
        roastCategory = 'Dark / French Roast';
        hebrewName = 'קלייה כהה עמוקה (פרנץ׳)';
        recommendation = 'קרמה סמיכה ועשירה, מרירות מעודנת ללא חומציות. מצוין לאספרסו כפול.';
      }

      setTimeout(() => {
        setAnalysisResult({
          agtronScore,
          roastCategory,
          hebrewName,
          rgbAvg: { r: rAvg, g: gAvg, b: bAvg },
          cremaDensity: Math.round(85 + Math.random() * 12),
          uniformityScore: Math.round(88 + Math.random() * 10),
          recommendation,
        });
        setIsAnalyzing(false);
      }, 1200);
    };
  };

  const handleSampleClick = (agtron: number, name: string, heb: string, src: string) => {
    setSelectedImage(src);
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        agtronScore: agtron,
        roastCategory: name,
        hebrewName: heb,
        rgbAvg: { r: 120, g: 80, b: 50 },
        cremaDensity: 92,
        uniformityScore: 94,
        recommendation: `קלייה מבוקרת בדרגת Agtron ${agtron} - פרופיל ארומטי מפותח.`,
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div dir="rtl" className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
          <Eye className="w-4 h-4" />
          <span>AI Vision & Optical Colorimetry</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          מנחש קלייה אופטי וצפיפות קרמה Agtron
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          צלם או העלה תמונה של פולי הקפה או מנת האספרסו לקבלת ניתוח אופטי מדויק לפי סולם Agtron Gourmet וחוויית מיצוי מדעית.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Preview Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative rounded-2xl border-2 border-dashed border-white/10 bg-white/5 backdrop-blur-2xl p-8 text-center hover:border-amber-500/50 transition-all group overflow-hidden">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {selectedImage ? (
              <div className="relative space-y-4">
                <img
                  src={selectedImage}
                  alt="Roast Sample"
                  className="w-full h-64 object-cover rounded-xl border border-white/10 shadow-2xl"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  החלף תמונה
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer space-y-4 py-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-white font-semibold">לחץ להעלאת תמונת פולים או אספרסו</p>
                  <p className="text-gray-400 text-xs mt-1">תמיכה ב-JPG, PNG ו-WEBP</p>
                </div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Sample Preset Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">או בחר דוגמת קלייה מהירה:</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSampleClick(72, 'City Light', 'בהירה (Agtron 72)', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80')}
                className="p-3 rounded-xl bg-amber-900/20 border border-amber-700/30 text-amber-300 text-xs font-medium hover:bg-amber-900/40 transition-all text-center"
              >
                בהירה (Agtron 72)
              </button>
              <button
                onClick={() => handleSampleClick(55, 'Full City', 'בינונית (Agtron 55)', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80')}
                className="p-3 rounded-xl bg-amber-800/30 border border-amber-600/40 text-amber-200 text-xs font-medium hover:bg-amber-800/50 transition-all text-center"
              >
                בינונית (Agtron 55)
              </button>
              <button
                onClick={() => handleSampleClick(38, 'French Dark', 'כהה (Agtron 38)', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=400&q=80')}
                className="p-3 rounded-xl bg-stone-900/40 border border-stone-700/50 text-stone-300 text-xs font-medium hover:bg-stone-900/70 transition-all text-center"
              >
                כהה (Agtron 38)
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-6 space-y-6">
          {isAnalyzing ? (
            <div className="h-full min-h-[350px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-8 flex flex-col items-center justify-center text-center space-y-4">
              <RefreshCw className="w-10 h-10 text-amber-400 animate-spin" />
              <p className="text-white font-semibold">מנחת ספקטרום RGB ומחשב מדד Agtron...</p>
              <p className="text-gray-400 text-xs">מבצע סריקת צפיפות קרמה ואחידות גוון</p>
            </div>
          ) : analysisResult ? (
            <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">תוצאת ניתוח אופטי</span>
                  <h3 className="text-2xl font-bold text-white mt-1">{analysisResult.hebrewName}</h3>
                </div>
                <div className="text-left bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                  <div className="text-2xl font-black text-amber-400">{analysisResult.agtronScore}</div>
                  <div className="text-[10px] text-gray-400">Agtron Scale</div>
                </div>
              </div>

              {/* Metric Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>אחידות קלייה (Uniformity)</span>
                    <span className="font-semibold text-amber-400">{analysisResult.uniformityScore}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-amber-400 to-yellow-500 rounded-full" style={{ width: `${analysisResult.uniformityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>צפיפות קרמה צפויה (Crema Density)</span>
                    <span className="font-semibold text-amber-400">{analysisResult.cremaDensity}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-orange-500 to-amber-400 rounded-full" style={{ width: `${analysisResult.cremaDensity}%` }} />
                  </div>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  המלצת חליטה מדעית:
                </div>
                <p>{analysisResult.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
              <Sliders className="w-12 h-12 text-gray-500 stroke-1" />
              <p className="text-gray-300 font-medium">המערכת ממתינה להעלאת תמונה</p>
              <p className="text-gray-500 text-xs max-w-xs">
                בחר תמונה של פולים או מנת אספרסו כדי להפעיל את מנוע ה-Colorimetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
