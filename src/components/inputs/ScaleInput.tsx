import type { Scale5 } from '@/types/models';
import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

export interface ScaleInputProps {
  label: string;
  value: Scale5 | undefined;
  onChange: (value: Scale5) => void;
  /** Libellés par niveau (aria + title), index 0 → niveau 1. */
  levelLabels?: string[];
  onClear?: () => void;
  disabled?: boolean;
  /** Rendu : barres croissantes (énergie) ou points. */
  appearance?: 'bars' | 'dots';
}

/** Échelle 1–5 générique (EnergyScale & co, annexe A.4) : radiogroup, flèches, double codage. */
export function ScaleInput({ label, value, onChange, levelLabels, onClear, disabled, appearance = 'bars' }: ScaleInputProps) {
  const { t } = useI18n();
  const levels: Scale5[] = [1, 2, 3, 4, 5];

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const current = value ?? 0;
    const next = Math.min(Math.max(current + (e.key === 'ArrowRight' ? 1 : -1), 1), 5) as Scale5;
    onChange(next);
  };

  return (
    <div className="flex items-center gap-2">
      <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className="flex items-end gap-1.5">
        {levels.map((level) => {
          const selected = value === level;
          const active = value !== undefined && level <= value;
          const levelLabel = levelLabels?.[level - 1] ?? `${level}/5`;
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${levelLabel} (${level}/5)`}
              title={levelLabel}
              tabIndex={selected || (value === undefined && level === 1) ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(level)}
              className={cn(
                'tap-target flex items-end justify-center rounded-md px-1 transition-colors',
                selected && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
                'disabled:opacity-40',
              )}
            >
              {appearance === 'bars' ? (
                <span
                  aria-hidden
                  className={cn('w-3 rounded-sm transition-colors', active ? 'bg-primary' : 'bg-muted/25')}
                  style={{ height: `${8 + level * 5}px` }}
                />
              ) : (
                <span
                  aria-hidden
                  className={cn('h-4 w-4 rounded-full transition-colors', active ? 'bg-primary' : 'bg-muted/25')}
                />
              )}
            </button>
          );
        })}
      </div>
      {value !== undefined && levelLabels && (
        <span className="text-xs text-muted">{levelLabels[value - 1]}</span>
      )}
      {onClear && value !== undefined && (
        <button type="button" onClick={onClear} disabled={disabled} className="min-h-[44px] text-xs text-muted underline hover:text-ink">
          {t('common.clear')}
        </button>
      )}
    </div>
  );
}
