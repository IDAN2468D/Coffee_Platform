/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#050404',
        roastDark: '#0c0a09',
        roastCard: 'rgba(28, 25, 23, 0.65)',
        amberGold: '#f59e0b',
        amberGlow: '#fbbf24',
        emeraldNeon: '#10b981',
        cyanGlow: '#06b6d4',
      },
      backgroundImage: {
        'liquid-glass-gradient': 'linear-gradient(135deg, rgba(28, 25, 23, 0.65) 0%, rgba(15, 23, 42, 0.45) 100%)',
        'gold-glow': 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
        'crema-pulse': 'crema-pulse 3s ease-in-out infinite',
        'heatwave': 'heatwave 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'border-beam': {
          '100%': {
            offsetDistance: '100%',
          },
        },
        'crema-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        'heatwave': {
          '0%, 100%': { transform: 'translateY(0px) skewX(0deg)' },
          '50%': { transform: 'translateY(-6px) skewX(1.5deg)' },
        },
      }
    },
  },
  plugins: [],
};
