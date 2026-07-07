import { describe, expect, it } from 'vitest';
import { migrateAppData, MigrationError } from '../migrations';
import { makeAppData } from '@/tests/fixtures';
import { SCHEMA_VERSION } from '@/constants/app';
import { validateAppData } from '../schemas';

/** Jeu de données v1 représentatif (avant customMoodStates/dismissedSignals). */
function makeV1Data(): Record<string, unknown> {
  const v2 = makeAppData();
  const settings = { ...v2.settings } as Record<string, unknown>;
  delete settings.customMoodStates;
  delete settings.dismissedSignals;
  settings.dashboardWidgets = [];
  const profile = { ...v2.profile } as Record<string, unknown>;
  delete profile.countSpottingAsPeriodStart;
  return { ...v2, schemaVersion: 1, settings, profile };
}

describe('migrations de schéma (§12.5)', () => {
  it('migre v1 → version courante sans perte', () => {
    const v1 = makeV1Data();
    const { data, applied } = migrateAppData(v1);
    expect(applied).toEqual([1]);
    expect(data.schemaVersion).toBe(SCHEMA_VERSION);
    expect(data.settings.customMoodStates).toEqual([]);
    expect(data.settings.dismissedSignals).toEqual([]);
    expect(data.settings.dashboardWidgets.length).toBeGreaterThan(0);
    expect(data.profile.countSpottingAsPeriodStart).toBe(false);
    // le résultat migré est valide au sens du schéma courant
    expect(validateAppData(data).ok).toBe(true);
  });

  it('est idempotente : relancer ne modifie plus rien (§17.J)', () => {
    const once = migrateAppData(makeV1Data()).data;
    const twice = migrateAppData(structuredClone(once));
    expect(twice.applied).toEqual([]);
    expect(twice.data).toEqual(once);
  });

  it('préserve les données existantes (entrées, profil)', () => {
    const v1 = makeV1Data();
    (v1.dailyEntries as Record<string, unknown>)['2025-01-01'] = {
      date: '2025-01-01',
      flow: 'medium',
      createdAt: '2025-01-01T08:00:00.000Z',
      updatedAt: '2025-01-01T08:00:00.000Z',
    };
    const { data } = migrateAppData(v1);
    expect(data.dailyEntries['2025-01-01']?.flow).toBe('medium');
  });

  it('rejette une version future', () => {
    const future = { ...makeAppData(), schemaVersion: SCHEMA_VERSION + 1 };
    expect(() => migrateAppData(future)).toThrow(MigrationError);
  });
});
