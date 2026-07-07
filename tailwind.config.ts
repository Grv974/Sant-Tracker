import type { Config } from 'tailwindcss';

/**
 * Design tokens Lunative — palette imposée par le cahier des charges (§9.2).
 * Les couleurs sont exposées en variables CSS (thème clair/sombre dans styles/index.css)
 * et référencées ici pour que Tailwind génère les utilitaires.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        primary: 'rgb(var(--c-primary) / <alpha-value>)',
        'primary-strong': 'rgb(var(--c-primary-strong) / <alpha-value>)',
        secondary: 'rgb(var(--c-secondary) / <alpha-value>)',
        accent: 'rgb(var(--c-accent) / <alpha-value>)',
        fertile: 'rgb(var(--c-fertile) / <alpha-value>)',
        period: 'rgb(var(--c-period) / <alpha-value>)',
        ink: 'rgb(var(--c-text) / <alpha-value>)',
        muted: 'rgb(var(--c-text-muted) / <alpha-value>)',
        success: 'rgb(var(--c-success) / <alpha-value>)',
        warning: 'rgb(var(--c-warning) / <alpha-value>)',
        info: 'rgb(var(--c-info) / <alpha-value>)',
        'phase-menstrual': 'rgb(var(--c-phase-menstrual) / <alpha-value>)',
        'phase-follicular': 'rgb(var(--c-phase-follicular) / <alpha-value>)',
        'phase-ovulatory': 'rgb(var(--c-phase-ovulatory) / <alpha-value>)',
        'phase-luteal': 'rgb(var(--c-phase-luteal) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgb(var(--c-primary) / 0.10), 0 1px 3px rgb(var(--c-primary) / 0.06)',
        lifted: '0 8px 30px -6px rgb(var(--c-primary) / 0.18), 0 2px 8px rgb(var(--c-primary) / 0.08)',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      maxWidth: {
        content: '52rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
