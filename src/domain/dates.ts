import type { ISODate } from '@/types/models';

/**
 * Helpers de dates civiles (§11.1) : les jours de cycle sont des chaînes YYYY-MM-DD
 * manipulées en arithmétique UTC pure — aucun décalage de fuseau possible.
 */

const DAY_MS = 86_400_000;

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

export function toEpochDay(date: ISODate): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

export function fromEpochDay(epochDay: number): ISODate {
  const t = new Date(epochDay * DAY_MS);
  const y = t.getUTCFullYear();
  const m = String(t.getUTCMonth() + 1).padStart(2, '0');
  const d = String(t.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Nombre de jours de `a` vers `b` (positif si b > a). */
export function diffDays(b: ISODate, a: ISODate): number {
  return toEpochDay(b) - toEpochDay(a);
}

export function addDays(date: ISODate, days: number): ISODate {
  return fromEpochDay(toEpochDay(date) + days);
}

export function compareISODates(a: ISODate, b: ISODate): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function maxISODate(a: ISODate, b: ISODate): ISODate {
  return a >= b ? a : b;
}

export function minISODate(a: ISODate, b: ISODate): ISODate {
  return a <= b ? a : b;
}

export function isBetween(date: ISODate, start: ISODate, end: ISODate): boolean {
  return date >= start && date <= end;
}

/** Date civile locale du jour (l'unique endroit où l'heure locale intervient). */
export function todayISO(now: Date = new Date()): ISODate {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Date locale d'un Date arbitraire, au format civil. */
export function toISODateLocal(d: Date): ISODate {
  return todayISO(d);
}

/** Toutes les dates civiles de start à end inclus. */
export function eachDay(start: ISODate, end: ISODate): ISODate[] {
  const from = toEpochDay(start);
  const to = toEpochDay(end);
  const days: ISODate[] = [];
  for (let e = from; e <= to; e++) days.push(fromEpochDay(e));
  return days;
}
