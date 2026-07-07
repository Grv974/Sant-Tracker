import type { FunctionalImpact, PainData } from '@/types/models';
import { useI18n } from '@/i18n';
import { MultiChip } from '@/components/ui/MultiChip';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Slider } from '@/components/ui/misc';

const ZONES = ['abdomen', 'back', 'breasts', 'head', 'legs', 'digestive', 'other'] as const;
const TYPES = ['cramps', 'tension', 'burning', 'stabbing'] as const;
const IMPACTS: FunctionalImpact[] = ['none', 'mild', 'limited', 'impossible'];

/** Smiley indicatif doublant l'échelle numérique (annexe A.2). */
function painEmoji(intensity: number): string {
  if (intensity <= 2) return '😌';
  if (intensity <= 4) return '🙂';
  if (intensity <= 6) return '😐';
  if (intensity <= 8) return '😣';
  return '😖';
}

export interface PainInputProps {
  value: PainData | undefined;
  onChange: (value: PainData) => void;
  disabled?: boolean;
}

/**
 * PainInput (annexe A.2) : intensité 0–10 (slider + smiley), zones multi-chips,
 * impact fonctionnel segmenté. Toutes les sous-valeurs sont indépendantes et optionnelles.
 */
export function PainInput({ value, onChange, disabled }: PainInputProps) {
  const { t } = useI18n();
  const pain = value ?? {};

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span aria-hidden className="text-2xl">
          {painEmoji(pain.intensity ?? 0)}
        </span>
        <Slider
          label={t('journal.pain')}
          value={pain.intensity ?? 0}
          onChange={(intensity) => onChange({ ...pain, intensity })}
          min={0}
          max={10}
          valueText={t('journal.painIntensity', { value: pain.intensity ?? 0 })}
          className="flex-1"
        />
      </div>
      <div>
        <div className="mb-1.5 text-xs font-medium text-muted">{t('journal.painZones')}</div>
        <MultiChip
          label={t('journal.painZones')}
          options={ZONES.map((z) => ({ value: z, label: t(`journal.painZonesList.${z}`) }))}
          selected={pain.locations ?? []}
          onChange={(locations) => onChange({ ...pain, locations })}
          disabled={disabled}
        />
      </div>
      <div>
        <div className="mb-1.5 text-xs font-medium text-muted">{t('journal.painTypes')}</div>
        <MultiChip
          label={t('journal.painTypes')}
          options={TYPES.map((ty) => ({ value: ty, label: t(`journal.painTypesList.${ty}`) }))}
          selected={pain.types ?? []}
          onChange={(types) => onChange({ ...pain, types })}
          disabled={disabled}
        />
      </div>
      <div>
        <div className="mb-1.5 text-xs font-medium text-muted">{t('journal.painImpact')}</div>
        <SegmentedControl
          label={t('journal.painImpact')}
          value={pain.functionalImpact}
          onChange={(functionalImpact) => onChange({ ...pain, functionalImpact })}
          options={IMPACTS.map((impact) => ({ value: impact, label: t(`journal.painImpactLevels.${impact}`) }))}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
