import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Salad } from 'lucide-react';
import { useDerived } from '@/hooks/useDerived';
import { useI18n } from '@/i18n';
import { PHASE_FOCUS, getHormonalNarrative } from '@/content/nutrition/phaseFocus';
import { PRINCIPLE_CARDS } from '@/content/nutrition/principles';
import { getNutritionSource } from '@/content/nutrition/sources';
import { useNutrition, foodsById } from './useNutrition';
import { BandChip } from './BandChip';
import { AdviceCard } from './AdviceCard';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EvidenceBadge } from '@/components/badges';
import { cn } from '@/utils/cn';

export default function NutritionPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const state = useDerived();
  const nutrition = useNutrition(3);
  if (!state || !nutrition) return null;
  const phase = state.derived.phase?.phase ?? null;
  const focusItems = phase ? PHASE_FOCUS.filter((f) => f.phase === phase) : [];
  const narrative = phase ? getHormonalNarrative(phase) : null;
  const lowsLabel = nutrition.lowMicronutrients.map((m) => t(`nutrition.micronutrients.${m}`)).join(', ');

  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Button variant="icon" aria-label={t('common.back')} onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>
        <h1 className="flex items-center gap-2 font-display text-xl font-bold">
          <Salad className="h-5 w-5 text-fertile" aria-hidden /> {t('nutrition.title')}
        </h1>
        <BandChip band={nutrition.dayNutrition.band} score={nutrition.dayNutrition.score} className="ml-auto" />
      </div>

      <p className="rounded-lg bg-surface-2/70 p-3 text-xs leading-relaxed text-muted">{t('nutrition.disclaimer')}</p>

      {nutrition.lowMicronutrients.length > 0 && (
        <p className="rounded-lg bg-info/10 p-3 text-sm text-info">{t('nutrition.lowHint', { nutrients: lowsLabel })}</p>
      )}

      {/* Conseils du moment (§N.4) */}
      <Card>
        <CardTitle>{t('nutrition.adviceTitle')}</CardTitle>
        {nutrition.advice.length === 0 ? (
          <p className="text-sm text-muted">{t('nutrition.adviceEmpty')}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {nutrition.advice.map((advice) => (
              <AdviceCard key={advice.id} advice={advice} />
            ))}
          </div>
        )}
      </Card>

      {/* Profil hormonal (§S.2) */}
      {narrative && (
        <Card>
          <CardTitle>{t('nutrition.hormonalTitle')}</CardTitle>
          <div className="mb-2 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded-full bg-accent/15 px-2.5 py-1 text-primary-strong dark:text-primary">
              {t('nutrition.hormones.estrogen')} : {t(`nutrition.hormones.${narrative.estrogen}`)}
            </span>
            <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-secondary">
              {t('nutrition.hormones.progesterone')} : {t(`nutrition.hormones.${narrative.progesterone}`)}
            </span>
            {narrative.lhFsh && (
              <span className="rounded-full bg-fertile/15 px-2.5 py-1 text-fertile">
                {t('nutrition.hormones.lhFsh')} : {t(`nutrition.hormones.${narrative.lhFsh}`)}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed">{narrative.summary}</p>
          {narrative.uncertaintyNote && <p className="mt-1.5 text-xs italic text-muted">{narrative.uncertaintyNote}</p>}
        </Card>
      )}

      {/* Focus de phase (§N.3.1) */}
      {focusItems.length > 0 && (
        <Card>
          <CardTitle>{t('nutrition.phaseFocusTitle')}</CardTitle>
          <div className="flex flex-col gap-3">
            {focusItems.map((item) => (
              <FocusBlock key={item.id} item={item} />
            ))}
          </div>
        </Card>
      )}

      {/* Fiches-principes (§N.5.4) */}
      <Card>
        <CardTitle>{t('nutrition.principlesTitle')}</CardTitle>
        <div className="flex flex-col divide-y divide-surface-2">
          {PRINCIPLE_CARDS.map((card) => (
            <PrincipleBlock key={card.id} card={card} />
          ))}
        </div>
      </Card>

      <p className="text-xs text-muted">{t('nutrition.ciqualCredit')}</p>
    </div>
  );
}

function SuggestedFoods({ ids }: { ids: string[] }) {
  const { t } = useI18n();
  if (ids.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="sr-only">{t('nutrition.suggestedFoods')}</span>
      {ids.map((id) => {
        const food = foodsById.get(id);
        if (!food) return null;
        return (
          <span key={id} className="rounded-full bg-fertile/10 px-2.5 py-1 text-xs text-fertile">
            {food.name.split(',')[0]}
          </span>
        );
      })}
    </div>
  );
}

function Sources({ refs }: { refs: string[] }) {
  return (
    <p className="mt-1.5 text-[0.65rem] text-muted/80">
      {refs
        .map((r) => getNutritionSource(r)?.org)
        .filter(Boolean)
        .join(' · ')}
    </p>
  );
}

function FocusBlock({ item }: { item: (typeof PHASE_FOCUS)[number] }) {
  return (
    <div className="rounded-lg bg-surface-2/60 p-3.5">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{item.title}</h3>
        <EvidenceBadge level={item.evidenceLevel} />
      </div>
      <p className="text-sm leading-relaxed text-muted">{item.body}</p>
      {item.uncertaintyNote && <p className="mt-1.5 text-xs italic text-muted/80">{item.uncertaintyNote}</p>}
      <SuggestedFoods ids={item.suggestedFoodIds} />
      <Sources refs={item.sourceRefs} />
    </div>
  );
}

function PrincipleBlock({ card }: { card: (typeof PRINCIPLE_CARDS)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left"
      >
        <span className="text-sm font-semibold">{card.title}</span>
        <span className="flex items-center gap-2">
          <EvidenceBadge level={card.evidenceLevel} />
          <ChevronDown className={cn('h-4 w-4 text-muted transition-transform', open && 'rotate-180')} aria-hidden />
        </span>
      </button>
      {open && (
        <div className="pb-2">
          <p className="text-sm leading-relaxed text-muted">{card.body}</p>
          {card.bullets && (
            <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm text-muted">
              {card.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
          {card.uncertaintyNote && <p className="mt-1.5 text-xs italic text-muted/80">{card.uncertaintyNote}</p>}
          <SuggestedFoods ids={card.suggestedFoodIds} />
          <Sources refs={card.sourceRefs} />
        </div>
      )}
    </div>
  );
}
