import { describe, expect, it } from 'vitest';
import {
  addDays,
  diffDays,
  eachDay,
  fromEpochDay,
  isBetween,
  isValidISODate,
  toEpochDay,
  todayISO,
} from '../dates';

describe('dates civiles', () => {
  it('valide les dates ISO', () => {
    expect(isValidISODate('2025-05-14')).toBe(true);
    expect(isValidISODate('2025-02-29')).toBe(false); // 2025 non bissextile
    expect(isValidISODate('2024-02-29')).toBe(true);
    expect(isValidISODate('2025-13-01')).toBe(false);
    expect(isValidISODate('14/05/2025')).toBe(false);
    expect(isValidISODate('')).toBe(false);
  });

  it('convertit aller-retour epochDay', () => {
    for (const d of ['1970-01-01', '2000-02-29', '2025-12-31']) {
      expect(fromEpochDay(toEpochDay(d))).toBe(d);
    }
  });

  it('addDays traverse mois et années', () => {
    expect(addDays('2025-01-31', 1)).toBe('2025-02-01');
    expect(addDays('2024-12-31', 1)).toBe('2025-01-01');
    expect(addDays('2025-03-01', -1)).toBe('2025-02-28');
    expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
  });

  it('diffDays est signé', () => {
    expect(diffDays('2025-05-15', '2025-05-14')).toBe(1);
    expect(diffDays('2025-05-14', '2025-05-15')).toBe(-1);
    expect(diffDays('2025-06-11', '2025-05-14')).toBe(28);
  });

  it('eachDay est inclusif', () => {
    expect(eachDay('2025-01-30', '2025-02-02')).toEqual(['2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02']);
  });

  it('isBetween est inclusif', () => {
    expect(isBetween('2025-05-14', '2025-05-14', '2025-05-20')).toBe(true);
    expect(isBetween('2025-05-21', '2025-05-14', '2025-05-20')).toBe(false);
  });

  it('todayISO reflète la date locale', () => {
    expect(todayISO(new Date(2025, 4, 14, 23, 59))).toBe('2025-05-14');
    expect(todayISO(new Date(2025, 0, 1, 0, 0))).toBe('2025-01-01');
  });
});
