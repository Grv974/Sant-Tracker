import type { NutritionAdvice } from '@/content/nutrition/types';
import { useI18n } from '@/i18n';
import { EvidenceBadge } from '@/components/badges';
import { getNutritionSource } from '@/content/nutrition/sources';
import { foodsById } from './useNutrition';

/** Conseil nutrition (§N.4) : preuve, incertitude C/D, renvoi professionnel, aliments suggérés. */
export function AdviceCard({ advice, compact = false }: { advice: NutritionAdvice; compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg bg-surface-2/60 p-3.5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{advice.title}</h3>
        <EvidenceBadge level={advice.evidenceLevel} />
      </div>
      <p className="text-sm leading-relaxed text-muted">{advice.body}</p>
      {advice.uncertaintyNote && <p className="mt-1.5 text-xs italic text-muted/80">{advice.uncertaintyNote}</p>}
      {advice.professionalReferral && (
        <p className="mt-1.5 text-xs font-medium text-info">{t('nutrition.professionalReferral')}</p>
      )}
      {!compact && (
        <>
          {(advice.suggestedFoodIds ?? []).length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(advice.suggestedFoodIds ?? []).map((id) => {
                const food = foodsById.get(id);
                return food ? (
                  <span key={id} className="rounded-full bg-fertile/10 px-2.5 py-1 text-xs text-fertile">
                    {food.name.split(',')[0]}
                  </span>
                ) : null;
              })}
            </div>
          )}
          <p className="mt-1.5 text-[0.65rem] text-muted/80">
            {advice.sourceRefs.map((r) => getNutritionSource(r)?.org).filter(Boolean).join(' · ')}
          </p>
        </>
      )}
    </div>
  );
}
