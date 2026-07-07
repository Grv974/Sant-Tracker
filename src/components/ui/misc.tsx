import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

/** Barre de progression (onboarding, §10.7). */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={1}
      aria-valuemax={max}
      aria-label={label}
      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );
}

/** État vide engageant (§6.6). */
export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-10 text-center">
      {icon && <div className="text-primary/70">{icon}</div>}
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {body && <p className="max-w-sm text-sm text-muted">{body}</p>}
      {action}
    </div>
  );
}

/** Ligne de réglage cliquable (§10.6). */
export function SettingsRow({ icon, label, hint, onClick, trailing }: { icon?: ReactNode; label: string; hint?: string; onClick?: () => void; trailing?: ReactNode }) {
  const content = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        {icon && <span className="text-primary" aria-hidden>{icon}</span>}
        <div className="min-w-0 text-left">
          <div className="truncate text-sm font-medium">{label}</div>
          {hint && <div className="text-xs text-muted">{hint}</div>}
        </div>
      </div>
      {trailing ?? (onClick && <ChevronRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />)}
    </>
  );
  const base = 'flex w-full min-h-[52px] items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors';
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(base, 'hover:bg-surface-2')}>
        {content}
      </button>
    );
  }
  return <div className={base}>{content}</div>;
}

/** Champ texte/nombre du DS. */
export function Field({ label, hint, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const id = props.id ?? `field-${label.replace(/\W/g, '-')}`;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(
          'min-h-[44px] rounded-md border bg-surface px-3 text-sm outline-none transition-colors',
          error ? 'border-period' : 'border-muted/30 focus:border-primary',
        )}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-period">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({ label, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const id = props.id ?? `select-${label.replace(/\W/g, '-')}`;
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        className="min-h-[44px] rounded-md border border-muted/30 bg-surface px-3 text-sm outline-none focus:border-primary"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/** Curseur numérique accessible (annexe A.4) basé sur input range natif. */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  valueText,
  className,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  valueText?: string;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <input
        type="range"
        aria-label={label}
        aria-valuetext={valueText}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-11 w-full accent-[rgb(var(--c-primary))]"
      />
      <output aria-hidden className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums">
        {value}
      </output>
    </div>
  );
}
