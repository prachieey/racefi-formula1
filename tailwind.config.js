/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Foundation
        'motorsport': {
          'charcoal': '#2a2a2a',
          'charcoal-light': '#3d3d3d',
          'charcoal-dark': '#1a1a1a',
          'jet': '#0f0f0f',
          'white': '#ffffff',
          'white-off': '#f5f5f5',
          // Accent Colors - Speed & Energy
          'red': '#dc2626',
          'red-bright': '#ef4444',
          'red-dark': '#991b1b',
          'yellow': '#fbbf24',
          'yellow-bright': '#fcd34d',
          'yellow-dark': '#d97706',
          'orange': '#ea580c',
          'orange-bright': '#f97316',
          'orange-dark': '#c2410c',
          // Highlights - Premium Details
          'silver': '#e5e7eb',
          'silver-light': '#f3f4f6',
          'silver-dark': '#d1d5db',
        },
      },
      backgroundColor: {
        'race-dark': '#0f0f0f',
        'race-charcoal': '#2a2a2a',
        'race-light': '#f5f5f5',
      },
      textColor: {
        'race-primary': '#ffffff',
        'race-accent': '#dc2626',
        'race-secondary': '#fbbf24',
      },
      borderColor: {
        'race-accent': '#dc2626',
        'race-secondary': '#fbbf24',
      },
      boxShadow: {
        'race-glow': '0 0 20px rgba(220, 38, 38, 0.5)',
        'race-glow-strong': '0 0 40px rgba(220, 38, 38, 0.8)',
        'race-glow-yellow': '0 0 20px rgba(251, 191, 36, 0.5)',
        'race-glow-orange': '0 0 20px rgba(234, 88, 12, 0.5)',
      },
      animation: {
        'pulse-race': 'pulseRace 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 3s ease-in-out infinite',
        'engine-rev': 'engineRev 0.5s ease-in-out',
      },
      keyframes: {
        pulseRace: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
        },
        engineRev: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
