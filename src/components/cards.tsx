import { useState } from 'react';
import { HeartPulse, Info } from 'lucide-react';
import type { AttentionSignal, Recommendation } from '@/types/models';
import { useI18n } from '@/i18n';
import { getSource } from '@/content/sources';
import { EvidenceBadge } from './badges';
import { Sheet } from './ui/Sheet';
import { Button } from './ui/Button';

/** RecommendationCard (§5.3) : titre, corps, badge de preuve, fiche « Pourquoi ? » avec sources. */
export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const { t, locale } = useI18n();
  const [showWhy, setShowWhy] = useState(false);
  return (
    <div className="rounded-lg bg-surface-2/70 p-3.5">
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{recommendation.title[locale]}</h3>
        <EvidenceBadge level={recommendation.evidenceLevel} />
      </div>
      <p className="text-sm leading-relaxed text-muted">{recommendation.body[locale]}</p>
      {(recommendation.evidenceLevel === 'C' || recommendation.evidenceLevel === 'D') && (
        <p className="mt-1.5 text-xs italic text-muted/80">{t('evidence.disclaimerCD')}</p>
      )}
      <button type="button" onClick={() => setShowWhy(true)} className="mt-2 min-h-[44px] text-xs font-medium text-primary-strong underline dark:text-primary">
        {t('common.why')}
      </button>
      <Sheet open={showWhy} onClose={() => setShowWhy(false)} title={recommendation.title[locale]}>
        <div className="flex flex-col gap-3">
          <EvidenceBadge level={recommendation.evidenceLevel} />
          <p className="text-sm leading-relaxed">{recommendation.body[locale]}</p>
          <h4 className="mt-2 text-sm font-semibold">{t('common.sources')}</h4>
          <ul className="flex flex-col gap-1.5">
            {recommendation.sourceRefs.map((ref) => {
              const source = getSource(ref);
              if (!source) return null;
              return (
                <li key={ref} className="text-sm text-muted">
                  <span className="font-medium text-ink">{source.org}</span> — {source.label}
                </li>
              );
            })}
          </ul>
          <p className="text-xs italic text-muted">{t('disclaimer.short')}</p>
        </div>
      </Sheet>
    </div>
  );
}

/** AttentionCard (§4.9) : ton mesuré, jamais un diagnostic, masquage ponctuel. */
export function AttentionCard({ signal, onDismiss }: { signal: AttentionSignal; onDismiss: (id: string) => void }) {
  const { t } = useI18n();
  return (
    <div
      role="status"
      className="card flex flex-col gap-2 border border-warning/30 bg-warning/5"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        {signal.severity === 'attention' ? (
          <HeartPulse className="h-4 w-4 text-warning" aria-hidden />
        ) : (
          <Info className="h-4 w-4 text-info" aria-hidden />
        )}
        {t('signals.title')}
        <span className="ml-auto rounded-full bg-surface-2 px-2 py-0.5 text-[0.65rem] font-normal text-muted">
          {t('signals.notDiagnosis')}
        </span>
      </div>
      <p className="text-sm leading-relaxed">{t(signal.messageKey)}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-primary-strong dark:text-primary">{t('signals.seeDoctor')}</span>
        <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => onDismiss(signal.id)}>
          {t('signals.dismiss')}
        </Button>
      </div>
    </div>
  );
}

/** Indicateur discret « Enregistré » en aria-live (§3.3.18, §10.3). */
export function AutosaveIndicator({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  const { t } = useI18n();
  return (
    <span aria-live="polite" className="text-xs text-muted">
      {state === 'saved' && `✓ ${t('common.saved')}`}
      {state === 'saving' && '…'}
      {state === 'error' && <span className="text-period">{t('common.error')}</span>}
    </span>
  );
}
