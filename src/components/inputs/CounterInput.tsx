import { Minus, Plus } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CounterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

/** Compteur incrémental (hydratation, §3.3.14). */
export function CounterInput({ label, value, onChange, unit, min = 0, max = 30, disabled }: CounterInputProps) {
  const btn =
    'tap-target inline-flex items-center justify-center rounded-full border border-muted/30 text-ink hover:border-primary/50 disabled:opacity-30';
  return (
    <div className="flex items-center gap-3" role="group" aria-label={label}>
      <button type="button" aria-label={`− ${label}`} className={btn} disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <output className={cn('min-w-[4rem] text-center text-lg font-semibold tabular-nums')} aria-live="polite">
        {value}
        {unit && <span className="ml-1 text-xs font-normal text-muted">{unit}</span>}
      </output>
      <button type="button" aria-label={`+ ${label}`} className={btn} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
