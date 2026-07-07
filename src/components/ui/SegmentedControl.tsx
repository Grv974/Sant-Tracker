import { cn } from '@/utils/cn';

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  value: T | undefined;
  onChange: (value: T) => void;
  options: SegmentedOption<T>[];
  label: string;
  disabled?: boolean;
}

/** Boutons segmentés exclusifs (annexe A.4) — radiogroup navigable aux flèches. */
export function SegmentedControl<T extends string>({ value, onChange, options, label, disabled }: SegmentedControlProps<T>) {
  const selectedIndex = options.findIndex((o) => o.value === value);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = ((selectedIndex < 0 ? 0 : selectedIndex) + dir + options.length) % options.length;
    onChange((options[next] as SegmentedOption<T>).value);
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="flex w-full flex-wrap gap-1 rounded-lg bg-surface-2 p-1"
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (selectedIndex < 0 && i === 0) ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-[44px] flex-1 whitespace-nowrap rounded-md px-2 py-2 text-sm transition-colors duration-150',
              selected ? 'bg-surface font-semibold text-ink shadow-soft' : 'text-muted hover:text-ink',
              'disabled:opacity-40',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
