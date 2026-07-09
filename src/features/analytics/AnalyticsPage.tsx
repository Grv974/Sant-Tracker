import { useMemo, useState } from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CyclePhase } from '@/types/models';
import { useDerived } from '@/hooks/useDerived';
import { useI18n } from '@/i18n';
import { useToday } from '@/hooks/useToday';
import { addDays, diffDays } from '@/domain/dates';
import { dayOfCycle, findCycleForDate } from '@/domain/cycle';
import { extractBBTSeries } from '@/domain/bbt';
import { dayNutrition } from '@/domain/nutrition';
import { foodsById } from '@/features/nutrition/useNutrition';
import { Card, CardTitle } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { EmptyState } from '@/components/ui/misc';

type Range = '3' | '6' | '12' | 'all';

export default function AnalyticsPage() {
  const { t } = useI18n();
  const state = useDerived();
  const [range, setRange] = useState<Range>('6');
  if (!state) return null;
  const { data, derived } = state;
  const closed = derived.cycles.filter((c) => c.isClosed && c.length !== undefined);
  const windowed = range === 'all' ? closed : closed.slice(-Number(range));

  if (closed.length < 2) {
    return (
      <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
        <h1 className="font-display text-xl font-bold">{t('analytics.title')}</h1>
        <EmptyState title={t('analytics.title')} body={t('analytics.notEnoughData')} />
        <BBTSection />
        <NutritionByPhaseSection />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold">{t('analytics.title')}</h1>
        <div className="w-full max-w-xs">
          <SegmentedControl
            label={t('analytics.title')}
            value={range}
            onChange={setRange}
            options={[
              { value: '3', label: t('analytics.range3') },
              { value: '6', label: t('analytics.range6') },
              { value: '12', label: t('analytics.range12') },
              { value: 'all', label: t('analytics.all') },
            ]}
          />
        </div>
      </div>

      <CycleLengthSection cycles={windowed} />
      <BBTSection />
      <SymptomsByPhaseSection />
      <NutritionByPhaseSection />
      <AccuracySection />
      {data.profile.trackWeight && <WeightSection />}
    </div>
  );
}

/** Nutrition par phase (spec V2 §N.3) : score inflammatoire moyen des journées consignées. */
function NutritionByPhaseSection() {
  const { t } = useI18n();
  const state = useDerived();
  const stats = useMemo(() => {
    if (!state) return null;
    const { data, derived } = state;
    const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    const buckets: Record<CyclePhase, number[]> = { menstrual: [], follicular: [], ovulatory: [], luteal: [] };
    for (const entry of Object.values(data.dailyEntries)) {
      if (!entry.nutrition?.foods.length) continue;
      const cycle = findCycleForDate(derived.cycles, entry.date);
      if (!cycle) continue;
      const day = dayNutrition(entry.nutrition, foodsById);
      if (day.score === null) continue;
      const periodLen = cycle.periodLength ?? 5;
      const dayN = dayOfCycle(cycle, entry.date);
      const end = cycle.endDate ?? entry.date;
      const ovu = cycle.ovulationConfirmed ?? addDays(end, -(derived.stats.luteal - 1));
      const delta = diffDays(entry.date, ovu);
      const phase: CyclePhase = dayN <= periodLen ? 'menstrual' : delta < -1 ? 'follicular' : delta <= 1 ? 'ovulatory' : 'luteal';
      buckets[phase].push(day.score);
    }
    const total = phases.reduce((acc, p) => acc + buckets[p].length, 0);
    return total >= 5 ? phases.map((p) => ({ phase: p, n: buckets[p].length, avg: buckets[p].length ? buckets[p].reduce((a, b) => a + b, 0) / buckets[p].length : null })) : null;
  }, [state]);

  if (!state) return null;
  return (
    <Card>
      <CardTitle>{t('nutrition.analyticsTitle')}</CardTitle>
      {!stats ? (
        <p className="text-sm text-muted">{t('nutrition.analyticsEmpty')}</p>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            {stats.map(({ phase, n, avg }) => (
              <div key={phase} className="flex items-center gap-2 text-xs">
                <span className="w-24 shrink-0 font-medium">{t(`phases.${phase}`)}</span>
                <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-surface-2" aria-hidden>
                  <span className="absolute inset-y-0 left-1/2 w-px bg-muted/40" />
                  {avg !== null && (
                    <span
                      className={`absolute inset-y-0 rounded-full ${avg <= 0 ? 'bg-fertile' : 'bg-warning'}`}
                      style={{
                        left: avg <= 0 ? `${50 - Math.min(-avg, 5) * 10}%` : '50%',
                        width: `${Math.min(Math.abs(avg), 5) * 10}%`,
                      }}
                    />
                  )}
                </div>
                <span className="w-20 shrink-0 text-right tabular-nums text-muted">
                  {avg === null ? '—' : `${avg > 0 ? '+' : ''}${avg.toFixed(1)} (${n} j)`}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">{t('nutrition.analyticsHint')}</p>
        </>
      )}
    </Card>
  );
}

const chartText = 'rgb(var(--c-text-muted))';
const gridStroke = 'rgb(var(--c-text-muted) / 0.15)';

function ChartTooltipContent({ active, payload, label, unit }: { active?: boolean; payload?: { name?: string; value?: number | string }[]; label?: string | number; unit?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-surface px-3 py-2 text-xs shadow-lifted">
      <div className="font-medium">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-muted">
          {p.value}
          {unit}
        </div>
      ))}
    </div>
  );
}

function CycleLengthSection({ cycles }: { cycles: { startDate: string; length?: number; periodLength?: number }[] }) {
  const { t, fdate } = useI18n();
  const state = useDerived();
  const [showTable, setShowTable] = useState(false);
  if (!state) return null;
  const { stats } = state.derived;
  const chartData = cycles.map((c) => ({
    name: fdate(c.startDate, 'd MMM'),
    length: c.length,
    period: c.periodLength,
    p10: stats.p10,
    band: stats.p90 - stats.p10,
  }));

  return (
    <Card>
      <CardTitle>{t('analytics.cycleLength')}</CardTitle>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartText }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: chartText }} tickLine={false} axisLine={false} domain={['dataMin - 3', 'dataMax + 3']} allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent unit=" j" />} />
            {/* Bande p10–p90 (§6.3) */}
            <Area dataKey="p10" stackId="band" stroke="none" fill="transparent" isAnimationActive={false} />
            <Area dataKey="band" stackId="band" stroke="none" fill="rgb(var(--c-secondary) / 0.14)" isAnimationActive={false} name={t('analytics.band')} />
            <ReferenceLine y={stats.mean} stroke="rgb(var(--c-secondary))" strokeDasharray="4 4" />
            <Line dataKey="length" stroke="rgb(var(--c-primary-strong))" strokeWidth={2} dot={{ r: 3 }} name={t('analytics.cycleLength')} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-muted">
        {t('analytics.cycleLengthStats', { mean: stats.mean.toFixed(1), median: stats.median.toFixed(0), sd: stats.sd.toFixed(1) })} · {t('analytics.band')}
      </p>
      <button type="button" className="mt-1 min-h-[44px] text-xs text-primary-strong underline dark:text-primary" onClick={() => setShowTable((s) => !s)}>
        {t('analytics.dataTable')}
      </button>
      {showTable && (
        <div className="overflow-x-auto">
          <table className="mt-2 w-full text-left text-xs">
            <thead>
              <tr className="text-muted">
                <th className="py-1 pr-3 font-medium">{t('common.today')}</th>
                <th className="py-1 pr-3 font-medium">{t('analytics.cycleLength')}</th>
                <th className="py-1 font-medium">{t('analytics.periodLength')}</th>
              </tr>
            </thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c.startDate} className="border-t border-surface-2">
                  <td className="py-1 pr-3">{fdate(c.startDate, 'd MMM yyyy')}</td>
                  <td className="py-1 pr-3">{c.length} j</td>
                  <td className="py-1">{c.periodLength ?? '—'} j</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function BBTSection() {
  const { t, fdate } = useI18n();
  const state = useDerived();
  const today = useToday();
  const series = useMemo(
    () => (state ? extractBBTSeries(state.data.dailyEntries).filter((p) => diffDays(today, p.date) <= 60) : []),
    [state, today],
  );
  if (!state) return null;
  if (series.length < 3) {
    return (
      <Card>
        <CardTitle>{t('analytics.bbtTitle')}</CardTitle>
        <p className="text-sm text-muted">{t('analytics.noBbt')}</p>
      </Card>
    );
  }
  const shift = [...state.derived.thermalShifts.values()].at(-1);
  const chartData = series.map((p) => ({
    name: fdate(p.date, 'd/M'),
    date: p.date,
    bbt: p.celsius,
    unreliable: !p.reliable ? p.celsius : undefined,
  }));

  return (
    <Card>
      <CardTitle>{t('analytics.bbtTitle')}</CardTitle>
      <div className="h-56 w-full">
        <ResponsiveContainer>
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartText }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: chartText }} tickLine={false} axisLine={false} domain={['dataMin - 0.1', 'dataMax + 0.1']} tickFormatter={(v: number) => v.toFixed(1)} />
            <Tooltip content={<ChartTooltipContent unit=" °C" />} />
            {shift && <ReferenceLine y={shift.baseline} stroke="rgb(var(--c-info))" strokeDasharray="4 4" />}
            <Line dataKey="bbt" stroke="rgb(var(--c-accent))" strokeWidth={2} dot={{ r: 2.5 }} connectNulls name="BBT" />
            <Scatter dataKey="unreliable" fill="rgb(var(--c-warning))" name="!" />
            {shift && (
              <ReferenceDot
                x={chartData.find((d) => d.date === shift.ovulationEstimated)?.name}
                y={shift.baseline}
                r={6}
                fill="rgb(var(--c-fertile))"
                stroke="white"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {shift && <p className="mt-2 text-xs text-fertile">{t('analytics.bbtOvulation')}</p>}
    </Card>
  );
}

/** Fréquence des symptômes par phase (§10.5) : descriptif, sans jugement. */
function SymptomsByPhaseSection() {
  const { t } = useI18n();
  const state = useDerived();
  const frequencies = useMemo(() => {
    if (!state) return null;
    const { data, derived } = state;
    const phases: CyclePhase[] = ['menstrual', 'follicular', 'ovulatory', 'luteal'];
    const counts: Record<CyclePhase, { days: number; pain: number; lowEnergy: number; moods: Map<string, number> }> = {
      menstrual: { days: 0, pain: 0, lowEnergy: 0, moods: new Map() },
      follicular: { days: 0, pain: 0, lowEnergy: 0, moods: new Map() },
      ovulatory: { days: 0, pain: 0, lowEnergy: 0, moods: new Map() },
      luteal: { days: 0, pain: 0, lowEnergy: 0, moods: new Map() },
    };
    for (const entry of Object.values(data.dailyEntries)) {
      const cycle = findCycleForDate(derived.cycles, entry.date);
      if (!cycle || !cycle.isClosed || !cycle.endDate) continue;
      const periodLen = cycle.periodLength ?? 5;
      const ovu = cycle.ovulationConfirmed ?? addDays(cycle.endDate, -(derived.stats.luteal - 1));
      const day = dayOfCycle(cycle, entry.date);
      const delta = diffDays(entry.date, ovu);
      const phase: CyclePhase = day <= periodLen ? 'menstrual' : delta < -1 ? 'follicular' : delta <= 1 ? 'ovulatory' : 'luteal';
      const bucket = counts[phase];
      bucket.days += 1;
      if ((entry.pain?.intensity ?? 0) >= 4) bucket.pain += 1;
      if (entry.energy !== undefined && entry.energy <= 2) bucket.lowEnergy += 1;
      for (const mood of entry.mood?.states ?? []) bucket.moods.set(mood, (bucket.moods.get(mood) ?? 0) + 1);
    }
    const total = phases.reduce((acc, p) => acc + counts[p].days, 0);
    return total >= 10 ? { phases, counts } : null;
  }, [state]);

  if (!state) return null;
  return (
    <Card>
      <CardTitle>{t('analytics.symptomsByPhase')}</CardTitle>
      {!frequencies ? (
        <p className="text-sm text-muted">{t('analytics.noSymptoms')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-muted">
                <th className="py-1.5 pr-3 font-medium" />
                {frequencies.phases.map((p) => (
                  <th key={p} className="py-1.5 pr-3 font-medium">
                    {t(`phases.${p}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <FrequencyRow
                label={t('journal.pain')}
                values={frequencies.phases.map((p) => {
                  const b = frequencies.counts[p];
                  return b.days > 0 ? b.pain / b.days : 0;
                })}
              />
              <FrequencyRow
                label={t('journal.energy')}
                values={frequencies.phases.map((p) => {
                  const b = frequencies.counts[p];
                  return b.days > 0 ? b.lowEnergy / b.days : 0;
                })}
              />
              <tr className="border-t border-surface-2">
                <td className="py-1.5 pr-3 font-medium">{t('journal.mood')}</td>
                {frequencies.phases.map((p) => {
                  const top = [...frequencies.counts[p].moods.entries()].sort((a, b) => b[1] - a[1])[0];
                  const moodKey = top ? `journal.moodStates.${top[0]}` : null;
                  const label = moodKey ? t(moodKey) : '—';
                  return (
                    <td key={p} className="py-1.5 pr-3 text-muted">
                      {moodKey && label === moodKey ? top![0] : label}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function FrequencyRow({ label, values }: { label: string; values: number[] }) {
  return (
    <tr className="border-t border-surface-2">
      <td className="py-1.5 pr-3 font-medium">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="py-1.5 pr-3">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-2">
              <span className="block h-full rounded-full bg-accent" style={{ width: `${Math.round(v * 100)}%` }} />
            </span>
            <span className="tabular-nums text-muted">{Math.round(v * 100)} %</span>
          </div>
        </td>
      ))}
    </tr>
  );
}

function AccuracySection() {
  const { t } = useI18n();
  const state = useDerived();
  if (!state) return null;
  const accuracy = state.derived.accuracy;
  return (
    <Card>
      <CardTitle>{t('analytics.accuracyTitle')}</CardTitle>
      {accuracy ? (
        <p className="text-sm leading-relaxed">
          {t('analytics.accuracyBody', { n: accuracy.n, value: accuracy.meanAbsErrorDays })}
        </p>
      ) : (
        <p className="text-sm text-muted">{t('analytics.accuracyEmpty')}</p>
      )}
    </Card>
  );
}

function WeightSection() {
  const { t, fdate } = useI18n();
  const state = useDerived();
  const points = useMemo(() => {
    if (!state) return [];
    return Object.values(state.data.dailyEntries)
      .filter((e) => e.weightKg !== undefined)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(-60)
      .map((e) => ({ name: fdate(e.date, 'd/M'), weight: e.weightKg }));
  }, [state, fdate]);
  if (!state || points.length < 2) return null;
  return (
    <Card>
      <CardTitle>{t('analytics.weightTitle')}</CardTitle>
      <div className="h-40 w-full">
        <ResponsiveContainer>
          <ComposedChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: chartText }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: chartText }} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip content={<ChartTooltipContent unit=" kg" />} />
            <Line dataKey="weight" stroke="rgb(var(--c-secondary))" strokeWidth={2} dot={{ r: 2.5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
