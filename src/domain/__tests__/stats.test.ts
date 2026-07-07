import { describe, expect, it } from 'vitest';
import { clamp, ewma, linearTrendSlope, mean, median, percentile, std } from '../stats';

describe('statistiques', () => {
  it('mean/median', () => {
    expect(mean([28, 30, 26])).toBe(28);
    expect(mean([])).toBe(0);
    expect(median([28, 30, 26])).toBe(28);
    expect(median([28, 30, 26, 32])).toBe(29);
    expect(median([])).toBe(0);
  });

  it('std échantillon', () => {
    expect(std([28, 28, 28])).toBe(0);
    expect(std([27])).toBe(0);
    expect(std([26, 28, 30])).toBeCloseTo(2, 5);
  });

  it('percentile interpolé', () => {
    const xs = [20, 25, 28, 30, 45];
    expect(percentile(xs, 0)).toBe(20);
    expect(percentile(xs, 100)).toBe(45);
    expect(percentile(xs, 50)).toBe(28);
    expect(percentile([], 50)).toBe(0);
  });

  it('ewma pondère le récent', () => {
    expect(ewma([28], 0.3)).toBe(28);
    // série stable puis saut : l'EWMA suit partiellement
    const v = ewma([28, 28, 28, 35], 0.3);
    expect(v).toBeGreaterThan(28);
    expect(v).toBeLessThan(35);
    expect(v).toBeCloseTo(0.3 * 35 + 0.7 * 28, 5);
  });

  it('tendance linéaire', () => {
    expect(linearTrendSlope([28, 27, 26, 25])).toBeCloseTo(-1, 5);
    expect(linearTrendSlope([28, 28, 28])).toBe(0);
    expect(linearTrendSlope([28, 30])).toBe(0); // < 3 points → pas de tendance
  });

  it('clamp', () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });
});
