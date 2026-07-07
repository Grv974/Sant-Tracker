import { describe, expect, it } from 'vitest';
import {
  celsiusToFahrenheit,
  cmToIn,
  fahrenheitToCelsius,
  formatHeight,
  formatTemperature,
  formatWeight,
  inToCm,
  kgToLb,
  lbToKg,
  roundTo,
} from '../units';

describe('unités (annexe G)', () => {
  it('conversions température aller-retour', () => {
    expect(celsiusToFahrenheit(36.7)).toBeCloseTo(98.06, 2);
    expect(fahrenheitToCelsius(celsiusToFahrenheit(36.72))).toBeCloseTo(36.72, 5);
  });

  it('conversions poids/taille aller-retour', () => {
    expect(kgToLb(62)).toBeCloseTo(136.69, 1);
    expect(lbToKg(kgToLb(62))).toBeCloseTo(62, 5);
    expect(cmToIn(165)).toBeCloseTo(64.96, 2);
    expect(inToCm(cmToIn(165))).toBeCloseTo(165, 5);
  });

  it('la valeur stockée n’est pas altérée par l’affichage °F (§17.9 J)', () => {
    const stored = 36.72;
    expect(formatTemperature(stored, 'F')).toBe('98.10 °F');
    expect(formatTemperature(stored, 'C')).toBe('36.72 °C');
    expect(stored).toBe(36.72);
  });

  it('arrondis d’affichage : BBT 2 décimales, poids 1 décimale', () => {
    expect(roundTo(36.725, 2)).toBeCloseTo(36.73, 5);
    expect(formatWeight(62.34, 'kg')).toBe('62.3 kg');
    expect(formatWeight(62.34, 'lb')).toBe('137.4 lb');
    expect(formatHeight(165, 'in')).toBe('65 in');
  });
});
