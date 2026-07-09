import { useNavigate } from 'react-router-dom';
import { Salad } from 'lucide-react';
import { useI18n } from '@/i18n';
import { getHormonalNarrative } from '@/content/nutrition/phaseFocus';
import { useNutrition } from './useNutrition';
import { BandChip } from './BandChip';
import { AdviceCard } from './AdviceCard';
import { Card, CardTitle } from '@/components/ui/Card';
import type { WidgetProps } from '@/features/dashboard/widgets';

/** Widget « profil hormonal » (§S.2) : récit de phase, œstrogènes/progestérone. */
export function HormonalProfileWidget({ derived }: WidgetProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const phase = derived.phase?.phase;
  if (!phase) return null;
  const narrative = getHormonalNarrative(phase);
  return (
    <Card>
      <CardTitle>{t('nutrition.hormonalTitle')}</CardTitle>
      <button type="button" className="w-full text-left" onClick={() => navigate('/nutrition')} aria-label={`${t('nutrition.hormonalTitle')} — ${t('nutrition.openPage')}`}>
        <div className="mb-2 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-accent/15 px-2.5 py-1 text-primary-strong dark:text-primary">
            {t('nutrition.hormones.estrogen')} : {t(`nutrition.hormones.${narrative.estrogen}`)}
          </span>
          <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-secondary">
            {t('nutrition.hormones.progesterone')} : {t(`nutrition.hormones.${narrative.progesterone}`)}
          </span>
        </div>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{narrative.summary}</p>
      </button>
    </Card>
  );
}

/** Widget « nutrition du jour » : bande + conseil phare, lien vers la page Nutrition. */
export function NutritionTodayWidget(_props: WidgetProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const nutrition = useNutrition(1);
  if (!nutrition) return null;
  const top = nutrition.advice[0];
  return (
    <Card>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <CardTitle className="mb-0">
          <span className="inline-flex items-center gap-1.5">
            <Salad className="h-3.5 w-3.5 text-fertile" aria-hidden /> {t('nutrition.title')}
          </span>
        </CardTitle>
        <BandChip band={nutrition.dayNutrition.band} score={nutrition.dayNutrition.score} />
      </div>
      {top ? <AdviceCard advice={top} compact /> : <p className="text-sm text-muted">{t('nutrition.adviceEmpty')}</p>}
      <button type="button" onClick={() => navigate('/nutrition')} className="mt-2 min-h-[44px] text-xs font-medium text-primary-strong underline dark:text-primary">
        {t('nutrition.openPage')}
      </button>
    </Card>
  );
}
