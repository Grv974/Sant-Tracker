import { useMemo, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Baby, Eye, EyeOff, Moon as MoonIcon, Sun, SunMoon } from 'lucide-react';
import { useDerived } from '@/hooks/useDerived';
import { useAppStore } from '@/store/appStore';
import { useToday } from '@/hooks/useToday';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useI18n } from '@/i18n';
import { getAppMode, gestationalWeeks } from '@/domain/modes';
import type { DashboardWidgetSetting } from '@/types/models';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle } from '@/components/ui/Card';
import { EmptyState, Field } from '@/components/ui/misc';
import { todayISO } from '@/domain/dates';
import {
  AttentionSignalsWidget,
  BBTMiniWidget,
  CurrentPhaseWidget,
  CycleRingWidget,
  CycleTrendWidget,
  DailyRecommendationWidget,
  FertileWindowWidget,
  KeyStatsWidget,
  NextPeriodWidget,
  QuickLogWidget,
  RecentSymptomsWidget,
  TodayRemindersWidget,
  type WidgetProps,
} from './widgets';

const WIDGETS: Record<string, ComponentType<WidgetProps>> = {
  cycleRing: CycleRingWidget,
  nextPeriod: NextPeriodWidget,
  currentPhase: CurrentPhaseWidget,
  fertileWindow: FertileWindowWidget,
  quickLog: QuickLogWidget,
  recentSymptoms: RecentSymptomsWidget,
  bbtMini: BBTMiniWidget,
  cycleTrend: CycleTrendWidget,
  attentionSignals: AttentionSignalsWidget,
  dailyRecommendation: DailyRecommendationWidget,
  todayReminders: TodayRemindersWidget,
  keyStats: KeyStatsWidget,
};

export default function DashboardPage() {
  const state = useDerived();
  const { t } = useI18n();
  const store = useAppStore();
  const reduced = useReducedMotion();
  const [editMode, setEditMode] = useState(false);
  const widgets = useMemo(
    () => [...(state?.data.settings.dashboardWidgets ?? [])].sort((a, b) => a.order - b.order),
    [state?.data.settings.dashboardWidgets],
  );
  if (!state) return null;
  const { data, derived } = state;
  const mode = getAppMode(data.profile, derived.hasPostpartumCycle);

  const setWidgets = (next: DashboardWidgetSetting[]) => store.updateSettings({ dashboardWidgets: next });
  const toggleWidget = (id: string) =>
    setWidgets(widgets.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)));
  const moveWidget = (id: string, dir: -1 | 1) => {
    const index = widgets.findIndex((w) => w.id === id);
    const target = index + dir;
    if (target < 0 || target >= widgets.length) return;
    const next = [...widgets];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item as DashboardWidgetSetting);
    setWidgets(next.map((w, i) => ({ ...w, order: i })));
  };

  const hour = new Date().getHours();
  const GreetingIcon = hour < 7 || hour >= 21 ? MoonIcon : hour < 18 ? Sun : SunMoon;

  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-xl font-bold">
            <GreetingIcon className="h-5 w-5 text-accent" aria-hidden /> {t('dashboard.greeting')} 🌸
          </h1>
          {derived.phase && (
            <p className="text-sm text-muted">
              {t('dashboard.cycleDay', { day: derived.phase.dayOfCycle, phase: t(`phases.${derived.phase.phase}`).toLowerCase() })}
            </p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setEditMode((e) => !e)}>
          {editMode ? t('dashboard.doneEditing') : t('dashboard.editWidgets')}
        </Button>
      </header>

      {mode === 'pregnancy' && <PregnancyCard data={data} />}
      {mode === 'postpartum' && (
        <Card>
          <CardTitle>
            <span className="inline-flex items-center gap-1.5">
              <Baby className="h-4 w-4 text-accent" aria-hidden /> {t('dashboard.postpartumTitle')}
            </span>
          </CardTitle>
          <p className="text-sm leading-relaxed text-muted">{t('dashboard.postpartumNote')}</p>
        </Card>
      )}
      {mode === 'continuous_contraception' && (
        <Card>
          <CardTitle>{t('dashboard.continuousTitle')}</CardTitle>
          <p className="text-sm leading-relaxed text-muted">{t('dashboard.continuousNote')}</p>
        </Card>
      )}

      {derived.cycles.length === 0 && mode === 'standard' && <FirstPeriodEmptyState />}

      {derived.cycles.length > 0 && derived.stats.n < 2 && mode === 'standard' && (
        <p className="rounded-lg bg-info/10 px-3 py-2 text-sm text-info">{t('dashboard.progressive', { n: 2 - derived.stats.n })}</p>
      )}

      <div className="flex flex-col gap-4">
        {widgets.map((widget, index) => {
          const Widget = WIDGETS[widget.id];
          if (!Widget) return null;
          if (editMode) {
            return (
              <div key={widget.id} className="card flex items-center justify-between gap-3 py-3">
                <span className="text-sm font-medium">{t(`dashboard.widgetNames.${widget.id}`, {})}</span>
                <div className="flex items-center gap-1">
                  <Button variant="icon" aria-label={t('settings.trackingSection.moveUp')} onClick={() => moveWidget(widget.id, -1)}>
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button variant="icon" aria-label={t('settings.trackingSection.moveDown')} onClick={() => moveWidget(widget.id, 1)}>
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button variant="icon" aria-label={widget.visible ? t('common.hide') : t('common.show')} onClick={() => toggleWidget(widget.id)}>
                    {widget.visible ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                  </Button>
                </div>
              </div>
            );
          }
          if (!widget.visible) return null;
          return (
            <motion.div
              key={widget.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3), ease: 'easeOut' }}
            >
              <Widget data={data} derived={derived} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** État vide engageant (§6.6) : demander la date des dernières règles. */
function FirstPeriodEmptyState() {
  const { t } = useI18n();
  const store = useAppStore();
  const [date, setDate] = useState('');
  return (
    <EmptyState
      title={t('dashboard.emptyTitle')}
      body={t('dashboard.emptyBody')}
      action={
        <form
          className="flex w-full max-w-xs flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (date) store.markPeriodStart(date);
          }}
        >
          <Field label={t('onboarding.o6.lastPeriod')} type="date" max={todayISO()} value={date} onChange={(e) => setDate(e.target.value)} />
          <Button type="submit" disabled={!date}>
            {t('dashboard.emptyCta')}
          </Button>
        </form>
      }
    />
  );
}

function PregnancyCard({ data }: { data: WidgetProps['data'] }) {
  const { t } = useI18n();
  const today = useToday();
  const start = data.profile.pregnancyStart;
  return (
    <Card>
      <CardTitle>
        <span className="inline-flex items-center gap-1.5">
          <Baby className="h-4 w-4 text-accent" aria-hidden /> {t('dashboard.pregnancyTitle')}
        </span>
      </CardTitle>
      {start && (
        <div className="font-display text-xl font-bold">
          {t('dashboard.pregnancyWeeks', gestationalWeeks(start, today))}
        </div>
      )}
      <p className="mt-1 text-sm leading-relaxed text-muted">{t('dashboard.pregnancyNote')}</p>
    </Card>
  );
}
