'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, ShoppingBag, Sparkles, User, ShoppingCart, Clock } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { coffeeSound } from '@/lib/audio/coffeeSounds';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  // Hide on dedicated auth routes to prevent distraction
  if (pathname === '/auth' || pathname === '/login' || pathname === '/register') {
    return null;
  }

  const navItems = [
    { href: '/home', label: 'ראשי', icon: Coffee },
    { href: '/shop', label: 'חנות', icon: ShoppingBag },
    { href: '/orders', label: 'הזמנות', icon: Clock },
    { href: '/ai-barista', label: 'בריסטה AI', icon: Sparkles, highlight: true },
    { href: '/profile', label: isAuthenticated ? 'פרופיל' : 'התחבר', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-1 pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto rounded-3xl bg-[#090707]/92 backdrop-blur-2xl border border-amber-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.95)] p-1.5 flex items-center justify-around dir-rtl transition-all">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => coffeeSound.playBaristaClick()}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-3 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] scale-105'
                  : 'text-stone-400 hover:text-amber-300 hover:bg-stone-900/60'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
                {item.highlight && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <span className="text-[10px] font-black tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Floating Cart Launcher Button */}
        <button
          onClick={() => {
            coffeeSound.playBaristaClick();
            toggleCart();
          }}
          className="relative flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-3 rounded-2xl text-amber-400 hover:bg-stone-900/60 transition-all active:scale-95 select-none"
          title="עגלת קניות"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 h-4.5 w-4.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-black text-[9px] flex items-center justify-center border border-stone-950 shadow-md animate-bounce">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black tracking-tight text-amber-300 mt-0.5">עגלה</span>
        </button>
      </nav>
    </div>
  );
};
