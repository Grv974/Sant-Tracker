import { useSyncExternalStore } from 'react';
import { useAppStore } from '@/store/appStore';

const media = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

function subscribe(cb: () => void) {
  media?.addEventListener('change', cb);
  return () => media?.removeEventListener('change', cb);
}

/** prefers-reduced-motion OU override manuel des réglages (§9.7). */
export function useReducedMotion(): boolean {
  const system = useSyncExternalStore(subscribe, () => media?.matches ?? false);
  const manual = useAppStore((s) => s.data?.settings.reducedMotion ?? false);
  return system || manual;
}
