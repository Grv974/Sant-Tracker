import { useState } from 'react';
import type { DailyEntry } from '@/types/models';
import { PREDICTION_CONFIG as CFG } from '@/constants/prediction.config';
import { celsiusToFahrenheit, fahrenheitToCelsius, roundTo } from '@/domain/units';
import { useI18n } from '@/i18n';
import { Field, Select } from '@/components/ui/misc';
import { Switch } from '@/components/ui/Switch';

type BBTValue = NonNullable<DailyEntry['bbt']>;

export interface BBTInputProps {
  value: BBTValue | undefined;
  onChange: (value: BBTValue) => void;
  unit: 'C' | 'F';
  /** Champs annexes proposés dépliés si maladie/alcool/sommeil court signalés (annexe A.5). */
  suggestUnreliable?: boolean;
  disabled?: boolean;
}

/**
 * BBTInput (annexe A.5) : saisie 2 décimales, °C/°F à l'affichage, stockage canonique °C,
 * validation stricte 34–42 °C avec message clair (§11.4).
 */
export function BBTInput({ value, onChange, unit, suggestUnreliable, disabled }: BBTInputProps) {
  const { t } = useI18n();
  const [details, setDetails] = useState(suggestUnreliable ?? false);
  const [error, setError] = useState<string | null>(null);
  const displayed =
    value !== undefined ? String(roundTo(unit === 'C' ? value.celsius : celsiusToFahrenheit(value.celsius), 2)) : '';
  const [draft, setDraft] = useState(displayed);

  const commit = (raw: string) => {
    setDraft(raw);
    if (raw.trim() === '') {
      setError(null);
      return;
    }
    const num = Number(raw.replace(',', '.'));
    if (Number.isNaN(num)) {
      setError(t('journal.bbtInvalid', { min: CFG.VALIDATION.BBT_MIN, max: CFG.VALIDATION.BBT_MAX }));
      return;
    }
    const celsius = roundTo(unit === 'C' ? num : fahrenheitToCelsius(num), 2);
    if (celsius < CFG.VALIDATION.BBT_MIN || celsius > CFG.VALIDATION.BBT_MAX) {
      setError(t('journal.bbtInvalid', { min: CFG.VALIDATION.BBT_MIN, max: CFG.VALIDATION.BBT_MAX }));
      return;
    }
    setError(null);
    onChange({ ...value, celsius });
  };

  return (
    <div className="flex flex-col gap-3">
      <Field
        label={`${t('journal.bbt')} (°${unit})`}
        hint={t('journal.bbtHint')}
        error={error ?? undefined}
        type="number"
        inputMode="decimal"
        step="0.01"
        value={draft}
        onChange={(e) => commit(e.target.value)}
        disabled={disabled}
      />
      <button type="button" onClick={() => setDetails((d) => !d)} className="self-start text-xs text-primary-strong underline dark:text-primary">
        {details ? t('common.hide') : t('common.show')} — {t('journal.bbtTime')}, {t('journal.bbtMethod')}
      </button>
      {details && (
        <div className="flex flex-col gap-3">
          <Field
            label={t('journal.bbtTime')}
            type="time"
            value={value?.time ?? ''}
            onChange={(e) => value && onChange({ ...value, time: e.target.value })}
            disabled={disabled || value === undefined}
          />
          <Select
            label={t('journal.bbtMethod')}
            value={value?.method ?? ''}
            onChange={(e) => value && onChange({ ...value, method: (e.target.value || undefined) as BBTValue['method'] })}
            disabled={disabled || value === undefined}
          >
            <option value="">—</option>
            {(['oral', 'vaginal', 'rectal'] as const).map((m) => (
              <option key={m} value={m}>
                {t(`journal.bbtMethods.${m}`)}
              </option>
            ))}
          </Select>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm">{t('journal.bbtUnreliable')}</span>
            <Switch
              label={t('journal.bbtUnreliable')}
              checked={value?.reliable === false}
              onChange={(unreliable) => value && onChange({ ...value, reliable: !unreliable })}
              disabled={disabled || value === undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}
