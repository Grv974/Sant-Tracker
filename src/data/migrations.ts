import type { AppData } from '@/types/models';
import { SCHEMA_VERSION } from '@/constants/app';
import { defaultDashboardWidgets } from './defaults';

/**
 * Registre de migrations (§12.5) : chaque migration est pure et transforme
 * la version N vers N+1. Elles s'appliquent séquentiellement à l'ouverture et à l'import.
 * Jamais de perte silencieuse : les champs inconnus sont conservés tels quels.
 */

type Migration = (data: Record<string, unknown>) => Record<string, unknown>;

export const migrations: Record<number, Migration> = {
  /**
   * v1 → v2 : ajoute les préférences introduites après la première version —
   * états d'humeur personnalisés, signaux masqués, widgets de dashboard normalisés,
   * et le réglage countSpottingAsPeriodStart.
   */
  1: (data) => {
    const settings = (data.settings ?? {}) as Record<string, unknown>;
    const profile = (data.profile ?? {}) as Record<string, unknown>;
    return {
      ...data,
      schemaVersion: 2,
      profile: {
        ...profile,
        countSpottingAsPeriodStart: profile.countSpottingAsPeriodStart ?? false,
      },
      settings: {
        ...settings,
        customMoodStates: settings.customMoodStates ?? [],
        dismissedSignals: settings.dismissedSignals ?? [],
        dashboardWidgets:
          Array.isArray(settings.dashboardWidgets) && settings.dashboardWidgets.length > 0
            ? settings.dashboardWidgets
            : defaultDashboardWidgets(),
      },
    };
  },
};

export class MigrationError extends Error {
  constructor(
    public fromVersion: number,
    cause: unknown,
  ) {
    super(`Échec de migration depuis la version ${fromVersion}`);
    this.cause = cause;
  }
}

export interface MigrationResult {
  data: AppData;
  applied: number[];
}

/** Applique séquentiellement les migrations jusqu'à SCHEMA_VERSION. Idempotent. */
export function migrateAppData(raw: unknown): MigrationResult {
  let data = raw as Record<string, unknown>;
  const applied: number[] = [];
  let version = typeof data.schemaVersion === 'number' ? data.schemaVersion : 1;
  if (version > SCHEMA_VERSION) {
    throw new MigrationError(version, new Error('Version de schéma plus récente que l’application'));
  }
  while (version < SCHEMA_VERSION) {
    const migration = migrations[version];
    if (!migration) throw new MigrationError(version, new Error('Migration manquante'));
    try {
      data = migration(data);
    } catch (cause) {
      throw new MigrationError(version, cause);
    }
    applied.push(version);
    version = data.schemaVersion as number;
  }
  return { data: data as unknown as AppData, applied };
}
