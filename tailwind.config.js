/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Titillium Web', ...defaultTheme.fontFamily.sans],
        display: ['Orbitron', 'sans-serif'],
        digital: ['Audiowide', 'monospace'],
      },
      colors: {
        // Formula 1 Inspired Colors
        'f1': {
          'black': '#0D0D0D',        // Charcoal Black - main background
          'carbon': '#1F1F1F',       // Carbon Gray - secondary panels
          'red': '#E10600',          // Racing Red - primary accent
          'yellow': '#FFD700',       // Sunburst Yellow - highlight
          'white': '#F5F5F5',        // Glacier White - text
          'orange': '#FF6B00',       // Burnt Orange - secondary accent
          'red-glow': 'rgba(225, 6, 0, 0.2)',
          'orange-glow': 'rgba(255, 107, 0, 0.2)',
        },
      },
      backgroundColor: {
        'f1-primary': '#0D0D0D',
        'f1-secondary': '#1F1F1F',
        'f1-accent': '#E10600',
        'f1-highlight': '#FFD700',
      },
      textColor: {
        'f1-primary': '#F5F5F5',
        'f1-accent': '#E10600',
        'f1-highlight': '#FFD700',
        'f1-orange': '#FF6B00',
      },
      borderColor: {
        'f1-accent': '#E10600',
        'f1-highlight': '#FFD700',
        'f1-orange': '#FF6B00',
      },
      boxShadow: {
        'f1-glow-strong': '0 0 30px rgba(225, 6, 0, 0.8)',
        'f1-glow-yellow': '0 0 15px rgba(255, 215, 0, 0.6)',
        'f1-glow-orange': '0 0 15px rgba(255, 107, 0, 0.6)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'speed-line': 'speedLine 15s linear infinite',
        'speed-line-reverse': 'speedLine 20s linear infinite reverse',
        'pulse-race': 'pulseRace 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        speedLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseRace: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 0 0 rgba(225, 6, 0, 0.7)' },
          '70%': { opacity: 0.7, boxShadow: '0 0 0 10px rgba(225, 6, 0, 0)' },
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
