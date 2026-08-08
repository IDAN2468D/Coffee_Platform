'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Droplets,
  Snowflake,
  Flame,
  Layers,
  ShoppingBag,
  Volume2,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ArrowDown,
  Info,
  Clock,
  Compass,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export interface ReelStageInfo {
  id: number;
  stageName: string;
  hebrewName: string;
  subTitle: string;
  temperature: string;
  metricLabel: string;
  metricValue: string;
  description: string;
  flavorTone: string;
  accentColor: string;
}

const REEL_STAGES: ReelStageInfo[] = [
  {
    id: 1,
    stageName: 'Steam Moves',
    hebrewName: '1. אדים חמים עולים (Steam Moves)',
    subTitle: 'אדי חליטה תרמיים • קלייה בהירה טרייה 93°C',
    temperature: '93.5°C',
    metricLabel: 'צפיפות אדים תרמית',
    metricValue: '850 hPa • 93°C',
    description: 'אדים חמים ועדינים עולים מספל החרס החם עוד לפני שהתחלת לשתות, ומשחררים טרפנים וארומת יסמין ופרחי הדרים.',
    flavorTone: 'ארומה פרחונית ופירותית עשירה',
    accentColor: '#f59e0b',
  },
  {
    id: 2,
    stageName: 'Milk Flows In',
    hebrewName: '2. חלב מוקצף נשפך פנימה (Milk Flows)',
    subTitle: 'מזיגת מיקרו-פואם משי 65°C • פיסול רוזטה',
    temperature: '65.0°C',
    metricLabel: 'קצב זרימת חלב',
    metricValue: '3.4 ml/s • Silk',
    description: 'זרם חלב מוקצף במרקם משי חודר לתוך הקרמה המוזהבת ויוצר פטרן לאטה ארט סימטרי בהרמוניה מושלמת.',
    flavorTone: 'מתיקות חלבית וקרם קטיפתי',
    accentColor: '#fbbf24',
  },
  {
    id: 3,
    stageName: 'Ice Cubes Drop',
    hebrewName: '3. קוביות קרח נופלות (Ice Cubes Drop)',
    subTitle: 'קרח קריסטלי שקוף 3D • מעבר ל-Iced Brew 4°C',
    temperature: '4.2°C',
    metricLabel: 'התקררות מיידית',
    metricValue: 'ΔT -60°C • 3D Ice',
    description: 'קוביות קרח שקופות תלת-ממדיות צונחות לתוך המשקה בפיזיקת פגיעה מדויקת, ומצננות את האספרסו לחוויית Iced Specialty מרעננת.',
    flavorTone: 'רעננות קרה עם בהירות טעמים',
    accentColor: '#38bdf8',
  },
  {
    id: 4,
    stageName: 'Sugar Dissolves',
    hebrewName: '4. סוכר חום מתמוסס (Sugar Dissolves)',
    subTitle: 'גבישי סוכר דמררה טבעי • Brix 12°Bx',
    temperature: '48.0°C',
    metricLabel: 'רמת מתיקות Brix',
    metricValue: '12.4°Bx • Demerara',
    description: 'גבישי סוכר זהובים נושרים ומתמוססים בהדרגה לתוך הקפה, מעמיקים את הקרמליזציה ומעניקים סיומת מתוקה ומנחמת.',
    flavorTone: 'קרמל עמוק, סוכר חום ודבש',
    accentColor: '#d97706',
  },
  {
    id: 5,
    stageName: 'Coffee Beans Float',
    hebrewName: '5. פולי קפה צפים ב-Parallax (Beans Float)',
    subTitle: 'פולי ירגשף היירלום 2,100 מטר • תלת-ממד רב-שכבתי',
    temperature: 'Room Temp',
    metricLabel: 'קלייה ספציאליטי',
    metricValue: 'Agtron #88 • 2,100m',
    description: 'פולי קפה קלויים מרחפים בשכבות עומק פראלקסיות סביב הספל, מסתובבים בזמן גלילה ומזמינים אותך להזמין מארז טרי עד הבית.',
    flavorTone: 'פרופיל שלם: יסמין, שוקולד וברגמוט',
    accentColor: '#eab308',
  },
];

export const ScrollParallaxCoffeeShowcase: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0); // 0.0 - 4.0
  const [activeStage, setActiveStage] = useState<number>(0);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Auto demo simulation loop
  useEffect(() => {
    if (!isPlayingDemo) return;

    const interval = setInterval(() => {
      setScrollProgress((prev) => {
        const next = prev + 0.04;
        if (next >= 4.0) {
          setIsPlayingDemo(false);
          coffeeSound.playSuccessChime();
          return 4.0;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlayingDemo]);

  // Sync active stage index based on progress
  useEffect(() => {
    const stageIdx = Math.min(4, Math.max(0, Math.floor(scrollProgress + 0.3)));
    setActiveStage(stageIdx);
  }, [scrollProgress]);

  // Window scroll event to drive progress smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (isPlayingDemo) return;
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;
      if (totalScrollable <= 0) return;

      const current = -rect.top;
      const fraction = Math.max(0, Math.min(1, current / totalScrollable));
      setScrollProgress(fraction * 4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlayingDemo]);

  // Master Canvas Visualizer Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    // Simulation particle pools
    interface SteamPuff {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      alpha: number;
      wobble: number;
    }
    const steamPool: SteamPuff[] = Array.from({ length: 40 }, () => ({
      x: 0,
      y: 0,
      radius: Math.random() * 20 + 8,
      speedY: -(Math.random() * 0.8 + 0.4),
      alpha: Math.random() * 0.25,
      wobble: Math.random() * Math.PI * 2,
    }));

    interface SugarGrain {
      x: number;
      y: number;
      size: number;
      speedY: number;
      rotation: number;
      alpha: number;
    }
    const sugarPool: SugarGrain[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * 80 - 40,
      y: -Math.random() * 120,
      size: Math.random() * 3 + 1.5,
      speedY: Math.random() * 2 + 1,
      rotation: Math.random() * Math.PI * 2,
      alpha: 1,
    }));

    interface ParallaxBean {
      x: number;
      y: number;
      size: number;
      rot: number;
      rotSpeed: number;
      layer: number; // 1, 2, 3
      speedX: number;
      speedY: number;
    }
    const beanPool: ParallaxBean[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * 450 - 225,
      y: Math.random() * 450 - 225,
      size: Math.random() * 14 + 10,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      layer: Math.random() > 0.6 ? 3 : Math.random() > 0.3 ? 2 : 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
    }));

    const render = () => {
      frame++;
      const w = (canvas.width = canvas.parentElement?.clientWidth || 500);
      const h = (canvas.height = canvas.parentElement?.clientHeight || 500);
      const cx = w / 2;
      const cy = h / 2 + 20;

      ctx.clearRect(0, 0, w, h);

      // 1. Warm Pendant Light Ambient Bokeh Background
      const bokehGrad = ctx.createRadialGradient(cx, cy - 40, 10, cx, cy, 260);
      bokehGrad.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
      bokehGrad.addColorStop(0.4, 'rgba(217, 119, 6, 0.08)');
      bokehGrad.addColorStop(0.8, 'rgba(43, 23, 14, 0.04)');
      bokehGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bokehGrad;
      ctx.fillRect(0, 0, w, h);

      // Bokeh light orbs in background
      for (let i = 0; i < 6; i++) {
        const bx = cx + Math.sin(frame * 0.01 + i * 1.5) * 160;
        const by = cy - 100 + Math.cos(frame * 0.015 + i) * 80;
        const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 60);
        bGrad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
        bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Stage 5: Floating Coffee Beans Parallax Layer (Background layer)
      const stage5Weight = Math.max(0, Math.min(1, (scrollProgress - 3.0) / 1.0));
      if (stage5Weight > 0.05) {
        beanPool.forEach((b) => {
          if (b.layer === 1) {
            ctx.save();
            ctx.translate(cx + b.x, cy + b.y + Math.sin(frame * 0.02 + b.size) * 10);
            ctx.rotate(b.rot + frame * b.rotSpeed);
            ctx.globalAlpha = stage5Weight * 0.6;
            ctx.fillStyle = '#2b170e';
            ctx.beginPath();
            ctx.ellipse(0, 0, b.size, b.size * 0.65, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        });
      }

      // 3. Central Artisan Ceramic Coffee Mug & Saucer
      // Saucer
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 95, 140, 32, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1c130f';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 15;
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Mug Outer Body with Warm Ceramic Gradient
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - 85, cy - 20);
      ctx.bezierCurveTo(cx - 90, cy + 60, cx - 65, cy + 90, cx, cy + 92);
      ctx.bezierCurveTo(cx + 65, cy + 90, cx + 90, cy + 60, cx + 85, cy - 20);
      ctx.closePath();

      const mugGrad = ctx.createLinearGradient(cx - 90, 0, cx + 90, 0);
      mugGrad.addColorStop(0, '#2d1810');
      mugGrad.addColorStop(0.3, '#3e2216');
      mugGrad.addColorStop(0.7, '#24120a');
      mugGrad.addColorStop(1, '#170b06');
      ctx.fillStyle = mugGrad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Mug Handle
      ctx.beginPath();
      ctx.moveTo(cx + 82, cy - 5);
      ctx.bezierCurveTo(cx + 125, cy - 5, cx + 125, cy + 60, cx + 72, cy + 65);
      ctx.strokeStyle = '#2d1810';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Mug Inner Rim & Coffee Liquid Surface
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 85, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#170b06';
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Rich Espresso Liquid Base & Crema Layer
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 80, 27, 0, 0, Math.PI * 2);
      const cremaGrad = ctx.createRadialGradient(cx - 15, cy - 22, 5, cx, cy - 20, 80);
      cremaGrad.addColorStop(0, '#b45309'); // Golden crema center
      cremaGrad.addColorStop(0.6, '#78350f'); // Rich mocha
      cremaGrad.addColorStop(1, '#3b1d0e'); // Deep espresso edge
      ctx.fillStyle = cremaGrad;
      ctx.fill();
      ctx.restore();

      // 4. Stage 2: Milk Pour Stream & Swirling Rosette Latte Art
      const stage2Weight = Math.max(0, Math.min(1, (scrollProgress - 0.7) / 1.0));
      if (stage2Weight > 0.02) {
        ctx.save();

        // Pouring Stream from above
        if (stage2Weight < 0.95) {
          ctx.beginPath();
          ctx.moveTo(cx + 15, -20);
          ctx.bezierCurveTo(cx + 12, cy - 80, cx + 2, cy - 40, cx, cy - 20);
          ctx.strokeStyle = 'rgba(255, 250, 240, 0.92)';
          ctx.lineWidth = 6 * (1 - stage2Weight * 0.3);
          ctx.lineCap = 'round';
          ctx.shadowColor = '#fffaf0';
          ctx.shadowBlur = 8;
          ctx.stroke();
        }

        // Swirling Rosette Pattern Blooming on Surface
        const rosetteAlpha = stage2Weight;
        ctx.beginPath();
        ctx.ellipse(cx, cy - 20, 60 * rosetteAlpha, 20 * rosetteAlpha, 0, 0, Math.PI * 2);
        const milkGrad = ctx.createRadialGradient(cx, cy - 20, 2, cx, cy - 20, 60 * rosetteAlpha);
        milkGrad.addColorStop(0, `rgba(255, 253, 245, ${rosetteAlpha * 0.95})`);
        milkGrad.addColorStop(0.5, `rgba(245, 235, 220, ${rosetteAlpha * 0.7})`);
        milkGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
        ctx.fillStyle = milkGrad;
        ctx.fill();

        // Rosette Leaf Vectors
        for (let l = 0; l < 5; l++) {
          const leafY = cy - 28 + l * 4;
          const leafW = (25 - l * 3) * rosetteAlpha;
          ctx.beginPath();
          ctx.ellipse(cx, leafY, leafW, 5 * rosetteAlpha, 0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${rosetteAlpha * 0.85})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // 5. Stage 3: Transparent 3D Falling Ice Cubes with Splash
      const stage3Weight = Math.max(0, Math.min(1, (scrollProgress - 1.7) / 1.0));
      if (stage3Weight > 0.05) {
        ctx.save();
        const iceY = cy - 120 + stage3Weight * 100;

        // Ice Cube 1 (Center Left)
        const drawIceCube = (ix: number, iy: number, size: number, rot: number) => {
          ctx.save();
          ctx.translate(ix, iy);
          ctx.rotate(rot);
          ctx.beginPath();
          ctx.rect(-size / 2, -size / 2, size, size);
          ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.stroke();

          // Internal crystal refraction line
          ctx.beginPath();
          ctx.moveTo(-size / 2, 0);
          ctx.lineTo(size / 2, 0);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.stroke();
          ctx.restore();
        };

        drawIceCube(cx - 28, iceY, 26, 0.2);
        drawIceCube(cx + 25, iceY - 20, 22, -0.3);

        // Splash Droplets when ice enters cup
        if (stage3Weight > 0.6) {
          ctx.fillStyle = 'rgba(251, 191, 36, 0.8)';
          for (let d = 0; d < 8; d++) {
            const dx = cx + Math.sin(d + frame * 0.1) * (35 + d * 4);
            const dy = cy - 25 - Math.cos(d * 0.8) * 18;
            ctx.beginPath();
            ctx.arc(dx, dy, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 6. Stage 4: Cascading & Dissolving Demerara Sugar Crystals
      const stage4Weight = Math.max(0, Math.min(1, (scrollProgress - 2.6) / 1.0));
      if (stage4Weight > 0.05) {
        ctx.save();
        sugarPool.forEach((g, i) => {
          g.y += g.speedY * (1 + stage4Weight);
          if (g.y > cy - 10) {
            g.y = -Math.random() * 80;
            g.x = Math.random() * 70 - 35;
          }

          ctx.save();
          ctx.translate(cx + g.x, cy - 60 + g.y);
          ctx.rotate(g.rotation + frame * 0.05);
          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 4;
          ctx.fillRect(-g.size / 2, -g.size / 2, g.size, g.size);
          ctx.restore();
        });
        ctx.restore();
      }

      // 7. Stage 1: Ambient Steam Plumes Rising (Active throughout, intensifies on Stage 1)
      const steamOpacity = Math.max(0.4, 1.0 - scrollProgress * 0.2);
      ctx.save();
      steamPool.forEach((p, idx) => {
        if (p.y === 0) {
          p.y = cy - 25 - Math.random() * 10;
          p.x = cx + (Math.random() * 60 - 30);
        }

        p.y += p.speedY;
        p.x += Math.sin(frame * 0.03 + p.wobble) * 0.35;

        if (p.y < cy - 180) {
          p.y = cy - 25;
          p.x = cx + (Math.random() * 60 - 30);
        }

        const steamGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        steamGrad.addColorStop(0, `rgba(255, 250, 240, ${p.alpha * steamOpacity})`);
        steamGrad.addColorStop(0.6, `rgba(245, 158, 11, ${p.alpha * 0.4 * steamOpacity})`);
        steamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = steamGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 8. Stage 5: Floating Roasted Beans in Foreground
      if (stage5Weight > 0.05) {
        beanPool.forEach((b) => {
          if (b.layer >= 2) {
            ctx.save();
            ctx.translate(cx + b.x, cy + b.y + Math.sin(frame * 0.03 + b.size) * 12);
            ctx.rotate(b.rot + frame * b.rotSpeed);
            ctx.globalAlpha = stage5Weight;

            // Bean body
            ctx.beginPath();
            ctx.ellipse(0, 0, b.size, b.size * 0.65, 0, 0, Math.PI * 2);
            ctx.fillStyle = b.layer === 3 ? '#5c2c12' : '#3d1c0b';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = b.layer === 3 ? 14 : 6;
            ctx.shadowOffsetY = 6;
            ctx.fill();

            // Center Crease
            ctx.beginPath();
            ctx.moveTo(-b.size * 0.8, 0);
            ctx.bezierCurveTo(-b.size * 0.2, -b.size * 0.3, b.size * 0.2, b.size * 0.3, b.size * 0.8, 0);
            ctx.strokeStyle = '#1a0b04';
            ctx.lineWidth = Math.max(1.5, b.size * 0.12);
            ctx.stroke();

            // Specular amber sheen
            if (b.layer === 3) {
              ctx.beginPath();
              ctx.ellipse(-b.size * 0.3, -b.size * 0.2, b.size * 0.4, b.size * 0.2, 0, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
              ctx.fill();
            }
            ctx.restore();
          }
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [scrollProgress]);

  // Quick Add Order Handler
  const handleQuickAddOrder = () => {
    coffeeSound.playBaristaClick();
    coffeeSound.playSuccessChime();
    addItem({
      coffeeItemId: 'instagram-reel-specialty-yirgacheffe',
      name: 'Ethiopia Yirgacheffe Instagram Reel Reserve',
      hebrewName: 'אתיופיה ירגשף • מארז קונספט פראלקס (Reserve)',
      price: 68,
      shots: 2,
      milkType: 'חלב שיבולת שועל Oatly',
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const currentInfo = REEL_STAGES[activeStage];

  return (
    <div
      ref={containerRef}
      id="instagram-reel-parallax"
      className="relative min-h-[350vh] w-full dir-rtl"
    >
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-20 h-[88vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6">
        
        {/* Top Concept Header Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-[#18110e]/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl relative z-20">
          <div className="space-y-1 text-center sm:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>INSTAGRAM REEL 1-TO-1 CONCEPT • POLANAEEM.TECH</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-100 tracking-tight">
              &quot;A coffee website that feels warm before you even visit&quot;
            </h2>
          </div>

          {/* Simulation Controls & Auto Play Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                coffeeSound.playBaristaClick();
                setIsPlayingDemo(!isPlayingDemo);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg ${
                isPlayingDemo
                  ? 'bg-rose-500 text-white shadow-rose-500/30 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 hover:brightness-110 shadow-amber-500/20'
              }`}
            >
              {isPlayingDemo ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>עצור הדמיה</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>הפעל סרטון Reel אוטומטי</span>
                </>
              )}
            </button>

            <span className="text-xs font-mono font-bold text-amber-400 bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
              STAGE {activeStage + 1}/5
            </span>
          </div>
        </div>

        {/* Center Stage: Interactive 3D Canvas + Glassmorphic Telemetry Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center flex-1 my-4 relative z-10">
          
          {/* Right Column: Active Stage Description Card (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#140e0b]/85 border-2 border-amber-500/30 backdrop-blur-2xl space-y-4 shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs font-mono font-bold text-amber-400">
                {currentInfo.stageName.toUpperCase()}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-[10px] font-mono text-emerald-400 border border-stone-800">
                {currentInfo.temperature}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-stone-100">{currentInfo.hebrewName}</h3>
              <p className="text-[11px] text-amber-300 font-mono">{currentInfo.subTitle}</p>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">{currentInfo.description}</p>

            <div className="p-3 rounded-2xl bg-stone-950/90 border border-stone-800 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-stone-400">{currentInfo.metricLabel}</span>
                <span className="text-amber-400 font-bold font-mono">{currentInfo.metricValue}</span>
              </div>
              <div className="text-[10px] text-stone-400">
                טון טעם: <span className="text-amber-200 font-bold">{currentInfo.flavorTone}</span>
              </div>
            </div>

            {/* Quick Order Button */}
            <button
              onClick={handleQuickAddOrder}
              className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl ${
                isAdded
                  ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 hover:brightness-110 shadow-amber-500/25'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>נוסף לעגלה בהצלחה!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-black" />
                  <span>הזמן מארז פולים זה (68 ₪)</span>
                </>
              )}
            </button>
          </div>

          {/* Center Column: Master Canvas Mug & Physics Simulator (8 cols) */}
          <div className="lg:col-span-8 relative h-[52vh] sm:h-[58vh] rounded-3xl bg-[#0c0806]/90 border border-amber-500/25 overflow-hidden flex items-center justify-center shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
            <canvas ref={canvasRef} className="w-full h-full block" />

            {/* Stage Scrubber Overlay Bottom */}
            <div className="absolute bottom-4 inset-x-6 flex items-center justify-between p-3 rounded-2xl bg-stone-950/80 backdrop-blur-md border border-stone-800 text-xs">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-stone-300 font-bold hidden sm:inline">ציר זמן פרלקס (Scroll Scrubber):</span>
              </div>

              {/* 5 Stage Interactive Step Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {REEL_STAGES.map((s, idx) => {
                  const isCurrent = activeStage === idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        coffeeSound.playBaristaClick();
                        setScrollProgress(idx);
                        setIsPlayingDemo(false);
                      }}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/30'
                          : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      {s.stageName.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Prompt Indicator */}
        <div className="text-center py-2 text-[11px] text-stone-400 font-mono flex items-center justify-center gap-2 select-none relative z-20">
          <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>גלול מטה במסך כדי לחוות את כל 5 השלבים ברצף אינטראקטיבי</span>
        </div>
      </div>
    </div>
  );
};
