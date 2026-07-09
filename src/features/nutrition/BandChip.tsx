import type { Band } from '@/content/nutrition/types';
import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

/** Bande inflammatoire du jour — double codage forme + texte, jamais culpabilisant. */
export function BandChip({ band, score, className }: { band: Band; score?: number | null; className?: string }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        band === 'anti' && 'bg-fertile/15 text-fertile',
        band === 'neutral' && 'bg-muted/15 text-muted',
        band === 'pro' && 'bg-warning/15 text-warning',
        band === 'unknown' && 'bg-surface-2 text-muted',
        className,
      )}
    >
      <span aria-hidden>{band === 'anti' ? '▼' : band === 'pro' ? '▲' : band === 'neutral' ? '◆' : '·'}</span>
      {t(`nutrition.bands.${band}`)}
      {score !== null && score !== undefined && <span className="tabular-nums opacity-70">({score > 0 ? '+' : ''}{score})</span>}
    </span>
  );
}
