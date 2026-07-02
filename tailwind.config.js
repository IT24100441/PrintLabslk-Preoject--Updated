/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Legacy cosmic tokens (preserved) ──
        cosmic: {
          dark: '#050A14',
          darker: '#0A0F1E',
          blue: '#00D4FF',
          violet: '#7B2FFF',
          gold: '#FFB800',
        },
        // ── New Upscayl / Obsidian tokens ──
        obs: {
          base:    '#0B0F19',
          surface: '#111827',
          card:    '#0F1420',
          border:  'rgba(255,255,255,0.07)',
        },
        up: {
          violet:  '#8B5CF6',
          indigo:  '#6366F1',
          cyan:    '#06B6D4',
          slate:   '#94A3B8',
          crimson: '#EF4444',
          'crimson-dark': '#DC2626',
          white:   '#FFFFFF',
          'muted':  '#64748B',
        },
      },
      fontFamily: {
        // Legacy
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter:    ['Inter', 'sans-serif'],
        // New
        jakarta:  ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'hero':    ['clamp(2.8rem,7vw,4.5rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display': ['clamp(2rem,4.5vw,3rem)',   { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'heading': ['clamp(1.5rem,3vw,2rem)',    { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
      },
      borderRadius: {
        'card': '14px',
        'pill': '9999px',
      },
      backdropBlur: {
        xs: '2px',
        nav: '12px',
        modal: '20px',
      },
      boxShadow: {
        // Legacy
        'glow':    '0 0 20px rgba(0, 212, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.8)',
        'neon-violet': '0 0 30px rgba(123, 47, 255, 0.6)',
        // New
        'up-card':     '0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'up-card-hover': '0 8px 32px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.45)',
        'up-btn':      '0 0 20px rgba(139,92,246,0.35)',
        'up-btn-lg':   '0 0 40px rgba(139,92,246,0.5)',
        'up-glow-cyan':'0 0 24px rgba(6,182,212,0.35)',
        'up-input':    '0 0 0 2px rgba(139,92,246,0.5)',
      },
      animation: {
        // Legacy
        'glow-pulse':  'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer':     'shimmer 2s infinite',
        'tilt':        'tilt 0.3s ease-out',
        // New
        'aurora-1':   'aurora1 12s ease-in-out infinite alternate',
        'aurora-2':   'aurora2 15s ease-in-out infinite alternate',
        'aurora-3':   'aurora3 18s ease-in-out infinite alternate',
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'badge-glow': 'badgeGlow 3s ease-in-out infinite',
      },
      keyframes: {
        // Legacy
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'tilt': {
          '0%': { transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)' },
          '100%': { transform: 'perspective(1200px) rotateX(5deg) rotateY(5deg)' },
        },
        // New
        'aurora1': {
          '0%':   { transform: 'translate(0%,0%) scale(1)',    opacity: '0.055' },
          '50%':  { transform: 'translate(15%,-10%) scale(1.2)', opacity: '0.08' },
          '100%': { transform: 'translate(-5%,5%) scale(0.9)', opacity: '0.04' },
        },
        'aurora2': {
          '0%':   { transform: 'translate(0%,0%) scale(1)',    opacity: '0.04' },
          '50%':  { transform: 'translate(-12%,8%) scale(1.15)', opacity: '0.07' },
          '100%': { transform: 'translate(8%,-6%) scale(0.95)', opacity: '0.05' },
        },
        'aurora3': {
          '0%':   { transform: 'translate(0%,0%) scale(1)',    opacity: '0.035' },
          '50%':  { transform: 'translate(10%,12%) scale(1.1)', opacity: '0.06' },
          '100%': { transform: 'translate(-8%,-5%) scale(1)', opacity: '0.04' },
        },
        'fadeUp': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'badgeGlow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139,92,246,0.4)' },
          '50%':       { boxShadow: '0 0 18px rgba(139,92,246,0.75)' },
        },
      },
    },
  },
  plugins: [],
}
