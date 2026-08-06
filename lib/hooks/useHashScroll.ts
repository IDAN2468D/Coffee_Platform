'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        // Small timeout to allow DOM components to render completely
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      }
    };

    handleScroll();

    window.addEventListener('hashchange', handleScroll);
    return () => window.removeEventListener('hashchange', handleScroll);
  }, [pathname]);
}
