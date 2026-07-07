import type { ConfidenceScore, EvidenceLevel } from '@/types/models';
import { useI18n } from '@/i18n';
import { cn } from '@/utils/cn';

/**
 * ConfidenceBadge (§4.8) : aucune prédiction sans score. Double codage couleur + texte
 * (jamais la couleur seule, §9.9).
 */
export function ConfidenceBadge({ confidence, className }: { confidence: ConfidenceScore; className?: string }) {
  const { t } = useI18n();
  const label = t(`confidence.${confidence.label}`);
  return (
    <span
      aria-label={t('a11y.confidenceBadge', { label, percent: confidence.percent })}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        confidence.label === 'high' && 'bg-success/15 text-success',
        confidence.label === 'moderate' && 'bg-warning/15 text-warning',
        confidence.label === 'low' && 'bg-muted/15 text-muted',
        className,
      )}
    >
      <span aria-hidden className="text-[0.6rem]">
        {confidence.label === 'high' ? '●' : confidence.label === 'moderate' ? '◐' : '○'}
      </span>
      {t('confidence.label', { label, percent: confidence.percent })}
    </span>
  );
}

/** EvidenceBadge (§5.1) : niveau de preuve A/B/C/D, forme + lettre (double codage). */
export function EvidenceBadge({ level, className }: { level: EvidenceLevel; className?: string }) {
  const { t } = useI18n();
  return (
    <span
      aria-label={t('evidence.badge', { level })}
      title={t(`evidence.${level}`)}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold',
        level === 'A' && 'border-success/40 bg-success/10 text-success',
        level === 'B' && 'border-info/40 bg-info/10 text-info',
        level === 'C' && 'border-warning/40 bg-warning/10 text-warning',
        level === 'D' && 'border-muted/40 bg-muted/10 text-muted',
        className,
      )}
    >
      {level}
      <span className="font-normal">· {t(`evidence.${level}`)}</span>
    </span>
  );
}
