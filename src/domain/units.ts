/**
 * Conversions d'unités (annexe G). Stockage canonique : °C, kg, cm.
 * Aucune donnée n'est jamais stockée dans une unité non canonique.
 */

export function celsiusToFahrenheit(c: number): number {
  return c * (9 / 5) + 32;
}

export function fahrenheitToCelsius(f: number): number {
  return (f - 32) * (5 / 9);
}

export function kgToLb(kg: number): number {
  return kg * 2.20462;
}

export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

export function cmToIn(cm: number): number {
  return cm / 2.54;
}

export function inToCm(inches: number): number {
  return inches * 2.54;
}

/** Arrondi d'affichage : BBT 2 décimales, poids 1 décimale (annexe G). */
export function roundTo(value: number, decimals: number): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

export function formatTemperature(celsius: number, unit: 'C' | 'F'): string {
  const v = unit === 'C' ? celsius : celsiusToFahrenheit(celsius);
  return `${roundTo(v, 2).toFixed(2)} °${unit}`;
}

export function formatWeight(kg: number, unit: 'kg' | 'lb'): string {
  const v = unit === 'kg' ? kg : kgToLb(kg);
  return `${roundTo(v, 1).toFixed(1)} ${unit}`;
}

export function formatHeight(cm: number, unit: 'cm' | 'in'): string {
  const v = unit === 'cm' ? cm : cmToIn(cm);
  return `${roundTo(v, unit === 'cm' ? 0 : 1)} ${unit}`;
}
