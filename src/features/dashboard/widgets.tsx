import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, Sparkles } from 'lucide-react';
import type { AppData, ConfidenceScore } from '@/types/models';
import type { DerivedState } from '@/store/derived';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { useToday } from '@/hooks/useToday';
import { addDays, diffDays } from '@/domain/dates';
import { dailyHighlight } from '@/domain/recommendations';
import { RECOMMENDATIONS } from '@/content/recommendations';
import { getPhaseEducation } from '@/content/phaseEducation';
import { extractBBTSeries } from '@/domain/bbt';
import { PhaseRing, type PhaseSegment } from '@/components/PhaseRing';
import { ConfidenceBadge } from '@/components/badges';
import { RecommendationCard, AttentionCard } from '@/components/cards';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { computeUpcomingNotifications } from '@/notifications/scheduler';
import { useI18n as useI18nCtx } from '@/i18n';

export interface WidgetProps {
  data: AppData;
  derived: DerivedState;
}

/* ---------- Anneau de cycle ---------- */
export function CycleRingWidget({ data, derived }: WidgetProps) {
  const { t } = useI18n();
  const today = useToday();
  const [showEducation, setShowEducation] = useState(false);
  const { currentCycle, stats, prediction, phase } = derived;
  if (!currentCycle || !phase || !prediction) return null;

  const totalDays = Math.max(Math.round(prediction.estimatedLength), phase.dayOfCycle);
  const periodLen = currentCycle.periodLength ?? (Math.round(stats.meanPeriod) || data.profile.typicalPeriodLength);
  const ovuOffset = totalDays - stats.luteal; // jour d'ovulation estimé (1-indexé)
  const segments: PhaseSegment[] = [
    { phase: 'menstrual', days: Math.min(periodLen, totalDays) },
    { phase: 'follicular', days: Math.max(ovuOffset - 1 - periodLen - 1, 1) },
    { phase: 'ovulatory', days: 3 },
    { phase: 'luteal', days: Math.max(totalDays - ovuOffset - 2, 1) },
  ];
  const dayOfCycle = diffDays(today, currentCycle.startDate) + 1;
  const phaseLabel = t(`phases.${phase.phase}`);
  const education = getPhaseEducation(phase.phase);

  return (
    <Card className="flex flex-col items-center">
      <button type="button" onClick={() => setShowEducation(true)} className="rounded-xl" aria-label={`${phaseLabel} — ${t('common.learnMore')}`}>
        <PhaseRing segments={segments} dayOfCycle={dayOfCycle} totalDays={totalDays} phaseLabel={`${phaseLabel} (${t('common.estimated')})`} />
      </button>
      <PhaseEducationSheet open={showEducation} onClose={() => setShowEducation(false)} education={education} confidence={phase.confidence} />
    </Card>
  );
}

export function PhaseEducationSheet({
  open,
  onClose,
  education,
  confidence,
}: {
  open: boolean;
  onClose: () => void;
  education: ReturnType<typeof getPhaseEducation>;
  confidence: ConfidenceScore;
}) {
  const { t, locale } = useI18n();
  return (
    <Sheet open={open} onClose={onClose} title={education.title[locale]}>
      <div className="flex flex-col gap-3 text-sm leading-relaxed">
        <ConfidenceBadge confidence={confidence} className="self-start" />
        <p>{education.body[locale]}</p>
        <p className="rounded-lg bg-surface-2 p-3 text-muted">{education.hormones[locale]}</p>
        <p className="text-xs italic text-muted">{t('phases.estimatedNote')}</p>
        <p className="text-xs italic text-muted">{t('disclaimer.short')}</p>
      </div>
    </Sheet>
  );
}

/* ---------- Prochaines règles ---------- */
export function NextPeriodWidget({ data, derived }: WidgetProps) {
  const { t, fdate } = useI18n();
  const [explain, setExplain] = useState(false);
  const { prediction, behavior } = derived;
  if (!prediction) return null;
  const late = prediction.daysUntil < 0;
  const title = behavior.withdrawalBleedVocabulary ? t('dashboard.nextBleed') : t('dashboard.nextPeriod');

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <button type="button" onClick={() => setExplain(true)} className="w-full text-left" aria-label={`${title} — ${t('dashboard.predictionExplain')}`}>
        <div className="font-display text-2xl font-bold">
          {late
            ? t('dashboard.late', { days: -prediction.daysUntil })
            : prediction.daysUntil === 0
              ? t('dashboard.dueToday')
              : t('dashboard.inDays', { days: prediction.daysUntil })}
        </div>
        <div className="mt-1 text-sm text-muted">
          {t('dashboard.range', { start: fdate(prediction.rangeStart, 'd MMM'), end: fdate(prediction.rangeEnd, 'd MMM') })}
        </div>
        <ConfidenceBadge confidence={prediction.confidence} className="mt-2" />
      </button>
      <Sheet open={explain} onClose={() => setExplain(false)} title={t('confidence.explainTitle')}>
        <div className="flex flex-col gap-3 text-sm leading-relaxed">
          <p>{t('confidence.explainBody')}</p>
          <ConfidenceBadge confidence={prediction.confidence} className="self-start" />
          <ul className="flex flex-col gap-1.5">
            {prediction.confidence.factors.map((f) => (
              <li key={f.key} className="flex items-center gap-2 text-muted">
                <span aria-hidden className={f.impact === 'up' ? 'text-success' : 'text-warning'}>
                  {f.impact === 'up' ? '↑' : '↓'}
                </span>
                {t(`confidence.factors.${f.key}`)}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            {t('dashboard.range', { start: fdate(prediction.wideRangeStart, 'd MMM'), end: fdate(prediction.wideRangeEnd, 'd MMM') })} (~90 %)
          </p>
          {data.profile.conditions.pcos || derived.stats.regularity === 'irregular' ? (
            <p className="rounded-lg bg-info/10 p-3 text-info">{t('disclaimer.predictions')}</p>
          ) : (
            <p className="text-xs italic text-muted">{t('disclaimer.predictions')}</p>
          )}
        </div>
      </Sheet>
    </Card>
  );
}

/* ---------- Phase actuelle ---------- */
export function CurrentPhaseWidget({ derived }: WidgetProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const { phase } = derived;
  if (!phase) return null;
  const education = getPhaseEducation(phase.phase);
  return (
    <Card>
      <CardTitle>{t('dashboard.currentPhase')}</CardTitle>
      <button type="button" className="w-full text-left" onClick={() => setOpen(true)}>
        <div className="font-display text-xl font-bold">
          {t(`phases.${phase.phase}`)} <span className="text-sm font-normal text-muted">({t('common.estimated')})</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{education.body[locale]}</p>
        <ConfidenceBadge confidence={phase.confidence} className="mt-2" />
      </button>
      <PhaseEducationSheet open={open} onClose={() => setOpen(false)} education={education} confidence={phase.confidence} />
    </Card>
  );
}

/* ---------- Fenêtre fertile ---------- */
export function FertileWindowWidget({ derived }: WidgetProps) {
  const { t, fdate } = useI18n();
  const { ovulation, behavior } = derived;
  if (!behavior.fertileWindow || !ovulation) return null;
  return (
    <Card>
      <CardTitle>{t('dashboard.fertileWindow')}</CardTitle>
      <div className="font-display text-lg font-semibold text-fertile">
        {fdate(ovulation.fertileWindowStart, 'd MMM')} – {fdate(ovulation.fertileWindowEnd, 'd MMM')}
      </div>
      <ConfidenceBadge confidence={ovulation.confidence} className="mt-2" />
      <p className="mt-2 rounded-lg bg-warning/10 p-2.5 text-xs font-medium text-warning">{t('disclaimer.notContraception')}</p>
    </Card>
  );
}

/* ---------- Saisie rapide ---------- */
export function QuickLogWidget({ data, derived }: WidgetProps) {
  const { t } = useI18n();
  const today = useToday();
  const navigate = useNavigate();
  const store = useAppStore();
  const todayEntry = data.dailyEntries[today];
  const startedToday = todayEntry?.menstruation?.isStart === true;
  const label = derived.behavior.withdrawalBleedVocabulary ? t('journal.bleedSection') : t('dashboard.periodStarted');

  return (
    <Card>
      <CardTitle>{t('dashboard.quickLog')}</CardTitle>
      <div className="flex flex-wrap items-center gap-2">
        {startedToday ? (
          <Button variant="secondary" onClick={() => store.undoPeriodStart(today)}>
            <Droplets className="h-4 w-4 text-period" aria-hidden /> {t('dashboard.periodStartedUndo')}
          </Button>
        ) : (
          <Button onClick={() => store.markPeriodStart(today)}>
            <Droplets className="h-4 w-4" aria-hidden /> {label}
          </Button>
        )}
        <Button variant="secondary" onClick={() => navigate(`/log/${today}`)}>
          {t('nav.quickLog')}
        </Button>
      </div>
    </Card>
  );
}

/* ---------- Symptômes récents ---------- */
export function RecentSymptomsWidget({ data }: WidgetProps) {
  const { t } = useI18n();
  const today = useToday();
  const navigate = useNavigate();
  const items = useMemo(() => {
    const out: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, -i);
      const entry = data.dailyEntries[date];
      if (!entry) continue;
      if (entry.pain?.intensity !== undefined && entry.pain.intensity > 0) out.push(`${t('journal.pain')} ${entry.pain.intensity}/10`);
      for (const mood of entry.mood?.states ?? []) {
        const key = `journal.moodStates.${mood}`;
        const label = t(key);
        out.push(label === key ? mood : label);
      }
      if (entry.flow && entry.flow !== 'none') out.push(t(`journal.flowLevels.${entry.flow}`));
    }
    return [...new Set(out)].slice(0, 8);
  }, [data.dailyEntries, today, t]);

  return (
    <Card>
      <CardTitle>{t('dashboard.recentSymptoms')}</CardTitle>
      {items.length === 0 ? (
        <p className="text-sm text-muted">{t('dashboard.noRecentSymptoms')}</p>
      ) : (
        <button type="button" onClick={() => navigate('/log')} className="flex w-full flex-wrap gap-1.5 text-left">
          {items.map((item) => (
            <span key={item} className="rounded-full bg-surface-2 px-2.5 py-1 text-xs">
              {item}
            </span>
          ))}
        </button>
      )}
    </Card>
  );
}

/* ---------- Sparkline tendance de cycle ---------- */
export function CycleTrendWidget({ derived }: WidgetProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const lengths = derived.cycles.filter((c) => c.isClosed && c.length !== undefined).slice(-12).map((c) => c.length as number);
  if (lengths.length < 2) return null;
  const min = Math.min(...lengths);
  const max = Math.max(...lengths);
  const w = 160;
  const h = 36;
  const points = lengths
    .map((len, i) => {
      const x = (i / (lengths.length - 1)) * w;
      const y = max === min ? h / 2 : h - ((len - min) / (max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <Card>
      <CardTitle>{t('dashboard.cycleTrend')}</CardTitle>
      <button type="button" onClick={() => navigate('/analytics')} className="flex w-full items-center gap-4" aria-label={`${t('dashboard.cycleTrend')} — ${t('nav.analytics')}`}>
        <svg width={w} height={h} aria-hidden className="shrink-0 overflow-visible">
          <polyline points={points} fill="none" stroke="rgb(var(--c-secondary))" strokeWidth={2} strokeLinecap="round" />
        </svg>
        <span className="text-sm text-muted">{t('dashboard.avgLength', { value: derived.stats.mean.toFixed(1) })}</span>
      </button>
    </Card>
  );
}

/* ---------- Mini BBT ---------- */
export function BBTMiniWidget({ data, derived }: WidgetProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const today = useToday();
  const series = useMemo(
    () => extractBBTSeries(data.dailyEntries).filter((p) => diffDays(today, p.date) <= 30),
    [data.dailyEntries, today],
  );
  if (series.length < 3) return null;
  const temps = series.map((p) => p.celsius);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const w = 200;
  const h = 40;
  const shift = [...derived.thermalShifts.values()].at(-1);

  return (
    <Card>
      <CardTitle>{t('dashboard.bbtMini')}</CardTitle>
      <button type="button" onClick={() => navigate('/analytics')} className="w-full" aria-label={`${t('dashboard.bbtMini')} — ${t('nav.analytics')}`}>
        <svg width={w} height={h} aria-hidden className="overflow-visible">
          {series.map((p, i) => {
            const x = (i / Math.max(series.length - 1, 1)) * w;
            const y = max === min ? h / 2 : h - ((p.celsius - min) / (max - min)) * h;
            const isShift = shift && p.date >= shift.shiftStart;
            return <circle key={p.date} cx={x} cy={y} r={2.5} fill={isShift ? 'rgb(var(--c-fertile))' : 'rgb(var(--c-accent))'} />;
          })}
        </svg>
        {shift && <p className="mt-1 text-xs text-fertile">{t('analytics.bbtOvulation')}</p>}
      </button>
    </Card>
  );
}

/* ---------- Signaux d'attention ---------- */
export function AttentionSignalsWidget({ derived }: WidgetProps) {
  const dismiss = useAppStore((s) => s.dismissSignal);
  if (derived.signals.length === 0) return null;
  return (
    <div className="flex flex-col gap-3">
      {derived.signals.map((signal) => (
        <AttentionCard key={signal.id} signal={signal} onDismiss={dismiss} />
      ))}
    </div>
  );
}

/* ---------- Reco du jour ---------- */
export function DailyRecommendationWidget({ data, derived }: WidgetProps) {
  const { t } = useI18n();
  const today = useToday();
  const reco = useMemo(
    () =>
      dailyHighlight(RECOMMENDATIONS, {
        phase: derived.phase?.phase ?? null,
        profile: data.profile,
        todayEntry: data.dailyEntries[today],
      }),
    [derived.phase, data.profile, data.dailyEntries, today],
  );
  if (!reco) return null;
  return (
    <Card>
      <CardTitle>
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden /> {t('dashboard.dailyReco')}
        </span>
      </CardTitle>
      <RecommendationCard recommendation={reco} />
    </Card>
  );
}

/* ---------- Rappels du jour ---------- */
export function TodayRemindersWidget({ data, derived }: WidgetProps) {
  const i18n = useI18nCtx();
  const { t } = i18n;
  const today = useToday();
  const reminders = useMemo(
    () => computeUpcomingNotifications(data, derived, i18n).filter((n) => n.fireAt.startsWith(today)),
    [data, derived, i18n, today],
  );
  if (reminders.length === 0) return null;
  return (
    <Card>
      <CardTitle>{t('dashboard.todayReminders')}</CardTitle>
      <ul className="flex flex-col gap-1.5">
        {reminders.map((r) => (
          <li key={r.id} className="flex items-center gap-2 text-sm text-muted">
            <span className="font-medium tabular-nums text-ink">{new Date(r.fireAt).toTimeString().slice(0, 5)}</span> {r.title}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ---------- Statistiques clés ---------- */
export function KeyStatsWidget({ derived }: WidgetProps) {
  const { t } = useI18n();
  const { stats, accuracy } = derived;
  if (stats.n === 0) return null;
  const cells: { label: string; value: string }[] = [
    { label: t('dashboard.avgCycle'), value: `${stats.mean.toFixed(1)} ${t('common.days').slice(0, 1)}` },
    { label: t('dashboard.regularity'), value: t(`dashboard.${stats.regularity}`) },
    { label: t('dashboard.avgPeriod'), value: `${stats.meanPeriod.toFixed(1)} ${t('common.days').slice(0, 1)}` },
  ];
  if (accuracy) {
    cells.push({ label: t('dashboard.accuracy'), value: t('dashboard.accuracyValue', { value: accuracy.meanAbsErrorDays, n: accuracy.n }) });
  }
  return (
    <Card>
      <CardTitle>{t('dashboard.keyStats')}</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        {cells.map((cell) => (
          <div key={cell.label} className="rounded-lg bg-surface-2/70 p-3">
            <div className="text-xs text-muted">{cell.label}</div>
            <div className="font-display text-lg font-bold">{cell.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
