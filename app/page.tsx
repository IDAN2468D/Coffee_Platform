'use client';

import React, { useEffect, useState } from 'react';
import { AuthContent } from '@/components/AuthContent';
import HomePage from '@/app/home/page';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { Coffee, Loader2 } from 'lucide-react';

export default function RootPage() {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-obsidian flex flex-col items-center justify-center text-stone-100 dir-rtl">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black mb-4 animate-bounce">
          <Coffee className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>טוען את מנוע הקפה ב-AI...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContent />;
  }

  return <HomePage />;
}
