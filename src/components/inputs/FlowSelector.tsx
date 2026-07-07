import { Droplet, Ban } from 'lucide-react';
import type { FlowLevel } from '@/types/models';
import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

const LEVELS: FlowLevel[] = ['none', 'spotting', 'light', 'medium', 'heavy', 'flooding'];

export interface FlowSelectorProps {
  value: FlowLevel | undefined;
  onChange: (value: FlowLevel) => void;
  onClear?: () => void;
  disabled?: boolean;
}

/**
 * FlowSelector (annexe A.1) : six pastilles-gouttes, remplissage cumulatif,
 * « none » barré distinct, radiogroup aux flèches. Un appui sur la valeur
 * sélectionnée ne désélectionne pas (bouton « effacer » explicite).
 */
export function FlowSelector({ value, onChange, onClear, disabled }: FlowSelectorProps) {
  const { t } = useI18n();
  const selectedIndex = value ? LEVELS.indexOf(value) : -1;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = Math.min(Math.max(selectedIndex + dir, 0), LEVELS.length - 1);
    onChange(LEVELS[next] as FlowLevel);
  };

  return (
    <div className="flex items-center gap-1.5">
      <div role="radiogroup" aria-label={t('journal.flow')} onKeyDown={onKeyDown} className="flex gap-1.5">
        {LEVELS.map((level, i) => {
          const selected = value === level;
          const filled = selectedIndex >= 1 && i >= 1 && i <= selectedIndex;
          const label = t(`journal.flowLevels.${level}`);
          return (
            <button
              key={level}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={label}
              title={label}
              tabIndex={selected || (selectedIndex < 0 && i === 0) ? 0 : -1}
              disabled={disabled}
              onClick={() => onChange(level)}
              className={cn(
                'tap-target flex items-center justify-center rounded-full transition-all duration-100',
                selected && 'ring-2 ring-primary ring-offset-2 ring-offset-surface',
                'disabled:opacity-40',
              )}
            >
              {level === 'none' ? (
                <Ban
                  aria-hidden
                  className={cn('h-6 w-6', value === 'none' ? 'text-muted' : 'text-muted/40')}
                />
              ) : (
                <Droplet
                  aria-hidden
                  className={cn(
                    'h-6 w-6 transition-colors duration-100',
                    filled ? 'text-period' : 'text-muted/30',
                  )}
                  fill={filled ? 'currentColor' : 'none'}
                />
              )}
            </button>
          );
        })}
      </div>
      {onClear && value !== undefined && (
        <button type="button" onClick={onClear} disabled={disabled} className="ml-1 min-h-[44px] text-xs text-muted underline hover:text-ink">
          {t('common.clear')}
        </button>
      )}
    </div>
  );
}
