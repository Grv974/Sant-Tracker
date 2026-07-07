import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'icon';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-gradient-to-br from-primary to-primary-strong text-white shadow-soft hover:brightness-105 disabled:from-primary/40 disabled:to-primary/40',
  secondary:
    'bg-surface text-ink border border-primary/25 hover:border-primary/50 hover:bg-surface-2 disabled:opacity-50',
  ghost: 'bg-transparent text-primary-strong dark:text-primary hover:bg-primary/10 disabled:opacity-50',
  destructive: 'bg-period text-white hover:brightness-110 disabled:opacity-50',
  icon: 'bg-transparent text-muted hover:bg-primary/10 hover:text-ink disabled:opacity-50 rounded-full',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-2 rounded-md',
  md: 'text-sm px-4 py-2.5 rounded-lg',
  lg: 'text-base px-6 py-3 rounded-lg',
};

/** Bouton du Design System (§9.4) : cible ≥ 44 px, micro-animation d'appui, focus visible. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'tap-target inline-flex items-center justify-center gap-2 font-medium transition-all duration-150',
        'active:scale-[0.97] disabled:cursor-not-allowed motion-reduce:active:scale-100',
        variantClasses[variant],
        variant === 'icon' ? 'p-2.5' : sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
});
