import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { fr, type Dictionary } from './fr';
import { en } from './en';
import { format, parseISO } from 'date-fns';
import { fr as dfFr, enGB as dfEn } from 'date-fns/locale';
import type { ISODate } from '@/types/models';

export type Locale = 'fr' | 'en';

const dictionaries: Record<Locale, Dictionary> = { fr, en };

type Interpolations = Record<string, string | number>;

export interface I18n {
  locale: Locale;
  /** Traduit une clé en chemin pointé (« dashboard.nextPeriod ») avec interpolation {var}. */
  t: (key: string, vars?: Interpolations) => string;
  /** Accès brut au dictionnaire (listes, objets). */
  dict: Dictionary;
  /** Formate une date civile pour l'affichage (« 14 mai », « 14 mai 2025 »…). */
  fdate: (date: ISODate, pattern?: string) => string;
}

const I18nContext = createContext<I18n | null>(null);

function resolve(dict: Dictionary, key: string): unknown {
  let node: unknown = dict;
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

export function interpolate(template: string, vars?: Interpolations): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = dictionaries[locale];
  const t = useCallback(
    (key: string, vars?: Interpolations): string => {
      const value = resolve(dict, key) ?? resolve(fr, key);
      if (typeof value !== 'string') {
        if (import.meta.env.DEV) console.warn(`i18n: clé manquante « ${key} »`);
        return key;
      }
      return interpolate(value, vars);
    },
    [dict],
  );
  const fdate = useCallback(
    (date: ISODate, pattern = 'd MMMM yyyy'): string =>
      format(parseISO(date), pattern, { locale: locale === 'fr' ? dfFr : dfEn }),
    [locale],
  );
  const value = useMemo<I18n>(() => ({ locale, t, dict, fdate }), [locale, t, dict, fdate]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé sous I18nProvider');
  return ctx;
}
