import { cn } from '@/utils/cn';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  id?: string;
}

/** Interrupteur accessible (role switch natif via bouton, cible 44 px). */
export function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'tap-target relative inline-flex h-11 w-14 shrink-0 items-center transition-colors',
        'disabled:opacity-40',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-2.5 left-0 right-0 mx-0 rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-muted/30',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'relative ml-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
          checked && 'translate-x-6',
        )}
      />
    </button>
  );
}
