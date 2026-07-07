import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { LS_THEME_KEY } from '@/constants/app';

/** Applique le thème (clair/sombre/système) au document et le persiste pour l'anti-FOUC (§9.8). */
export function useTheme(): void {
  const theme = useAppStore((s) => s.data?.settings.theme ?? 'system');
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    apply();
    try {
      localStorage.setItem(LS_THEME_KEY, theme);
    } catch {
      /* stockage indisponible */
    }
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);
}
