import type { Scale5 } from '@/types/models';
import { useI18n } from '@/i18n';
import { MultiChip } from '@/components/ui/MultiChip';
import { ScaleInput } from './ScaleInput';

const DEFAULT_STATES = [
  'calm',
  'happy',
  'irritable',
  'anxious',
  'sad',
  'sensitive',
  'motivated',
  'overwhelmed',
  'serene',
  'tired',
] as const;

export interface MoodPickerProps {
  states: string[];
  score: Scale5 | undefined;
  customStates: string[];
  onChangeStates: (states: string[]) => void;
  onChangeScore: (score: Scale5) => void;
  onClearScore?: () => void;
  onAddCustomState: (state: string) => void;
  disabled?: boolean;
}

/**
 * MoodPicker (annexe A.3) : multi-sélection d'états extensible + score global 1–5.
 * Purement descriptif — aucune interprétation clinique.
 */
export function MoodPicker({
  states,
  score,
  customStates,
  onChangeStates,
  onChangeScore,
  onClearScore,
  onAddCustomState,
  disabled,
}: MoodPickerProps) {
  const { t } = useI18n();
  const options = [
    ...DEFAULT_STATES.map((s) => ({ value: s, label: t(`journal.moodStates.${s}`) })),
    ...customStates.map((s) => ({ value: s, label: s })),
  ];

  return (
    <div className="flex flex-col gap-3">
      <MultiChip
        label={t('journal.mood')}
        options={options}
        selected={states}
        onChange={onChangeStates}
        onAddOption={onAddCustomState}
        addLabel={t('common.add')}
        disabled={disabled}
      />
      <div>
        <div className="mb-1 text-xs font-medium text-muted">{t('journal.moodScore')}</div>
        <ScaleInput
          label={t('journal.moodScore')}
          value={score}
          onChange={onChangeScore}
          onClear={onClearScore}
          appearance="dots"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
