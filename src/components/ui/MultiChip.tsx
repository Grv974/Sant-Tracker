import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface MultiChipProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label: string;
  /** Ajout d'options personnalisées (annexe A.4). */
  onAddOption?: (label: string) => void;
  addLabel?: string;
  disabled?: boolean;
}

/** Chips multi-sélection à bascule, avec bouton « + » optionnel. */
export function MultiChip({ options, selected, onChange, label, onAddOption, addLabel, disabled }: MultiChipProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const commitDraft = () => {
    const name = draft.trim();
    if (name && onAddOption) onAddOption(name);
    setDraft('');
    setAdding(false);
  };

  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => toggle(option.value)}
            className={cn(
              'min-h-[44px] rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-150',
              isSelected
                ? 'border-primary bg-primary/15 font-medium text-primary-strong dark:text-primary'
                : 'border-muted/30 bg-surface text-muted hover:border-primary/40 hover:text-ink',
              'disabled:opacity-40',
            )}
          >
            {option.label}
          </button>
        );
      })}
      {onAddOption &&
        (adding ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDraft();
              if (e.key === 'Escape') setAdding(false);
            }}
            aria-label={addLabel ?? '+'}
            className="min-h-[44px] w-32 rounded-full border border-primary/40 bg-surface px-3 text-sm outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            aria-label={addLabel ?? '+'}
            className="tap-target inline-flex items-center justify-center rounded-full border border-dashed border-muted/40 px-3 text-muted hover:border-primary/60 hover:text-primary-strong"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        ))}
    </div>
  );
}
