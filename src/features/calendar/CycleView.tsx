import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Cycle } from '@/types/models';
import { useDerived } from '@/hooks/useDerived';
import { useI18n } from '@/i18n';
import { addDays, diffDays, eachDay, todayISO } from '@/domain/dates';
import { flowRank } from '@/domain/cycle';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

const PHASE_COLORS: Record<string, string> = {
  menstrual: 'rgb(var(--c-phase-menstrual-strong))',
  follicular: 'rgb(var(--c-phase-follicular-strong))',
  ovulatory: 'rgb(var(--c-phase-ovulatory-strong))',
  luteal: 'rgb(var(--c-phase-luteal-strong))',
};

/** Vue cycle (§7.2) : barre linéaire segmentée par phase avec superposition des symptômes. */
export function CycleView() {
  const { t, fdate } = useI18n();
  const state = useDerived();
  const [index, setIndex] = useState(-1); // -1 = cycle courant (dernier)

  const cycles = state?.derived.cycles ?? [];
  const cycle: Cycle | undefined = cycles.at(index);

  const days = useMemo(() => {
    if (!state || !cycle) return [];
    const { data, derived } = state;
    const end = cycle.endDate ?? todayISO();
    const periodLen = cycle.periodLength ?? (Math.round(derived.stats.meanPeriod) || data.profile.typicalPeriodLength);
    const ovu =
      cycle.ovulationConfirmed ??
      cycle.ovulationEstimated ??
      (cycle.endDate ? addDays(cycle.endDate, -(derived.stats.luteal - 1)) : derived.ovulation?.estimatedDate ?? null);
    return eachDay(cycle.startDate, end).map((date) => {
      const entry = data.dailyEntries[date];
      const day = diffDays(date, cycle.startDate) + 1;
      let phase = 'follicular';
      if (day <= periodLen) phase = 'menstrual';
      else if (ovu) {
        const delta = diffDays(date, ovu);
        phase = delta < -1 ? 'follicular' : delta <= 1 ? 'ovulatory' : 'luteal';
      }
      return {
        date,
        day,
        phase,
        flow: flowRank(entry?.flow),
        pain: (entry?.pain?.intensity ?? 0) >= 4,
        hasSymptom:
          (entry?.mood?.states?.length ?? 0) > 0 || entry?.energy !== undefined || Object.keys(entry?.customValues ?? {}).length > 0,
      };
    });
  }, [state, cycle]);

  if (!state || !cycle) return null;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Button variant="icon" aria-label={t('common.back')} disabled={cycles.length + index <= 0} onClick={() => setIndex((i) => i - 1)}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>
        <span className="text-sm font-medium">
          {fdate(cycle.startDate, 'd MMM')} — {cycle.endDate ? fdate(cycle.endDate, 'd MMM yyyy') : t('common.today')}
          {cycle.length !== undefined && <span className="ml-2 text-xs text-muted">({cycle.length} {t('common.days')})</span>}
        </span>
        <Button variant="icon" aria-label={t('common.continue')} disabled={index >= -1} onClick={() => setIndex((i) => i + 1)}>
          <ChevronRight className="h-5 w-5" aria-hidden />
        </Button>
      </div>
      <div className="flex h-16 items-end gap-px overflow-x-auto pb-1" role="img" aria-label={`${t('calendar.cycleView')} — ${fdate(cycle.startDate)}`}>
        {days.map((d) => (
          <div key={d.date} className="flex min-w-[10px] flex-1 flex-col items-center gap-0.5" title={`${fdate(d.date, 'd MMM')} — ${t(`phases.${d.phase}`)}`}>
            <span className="flex h-4 flex-col items-center justify-end">
              {d.pain && <span className="h-1.5 w-1.5 rounded-full bg-warning" aria-hidden />}
              {d.hasSymptom && <span className="mt-0.5 h-1 w-1 rounded-full bg-accent" aria-hidden />}
            </span>
            <span
              aria-hidden
              className={cn('w-full rounded-sm', d.flow > 0 && 'ring-1 ring-period')}
              style={{ backgroundColor: PHASE_COLORS[d.phase], height: `${14 + d.flow * 5}px`, opacity: 0.85 }}
            />
            <span className="text-[0.55rem] text-muted">{d.day}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[0.65rem] text-muted">
        {(['menstrual', 'follicular', 'ovulatory', 'luteal'] as const).map((phase) => (
          <span key={phase} className="inline-flex items-center gap-1">
            <span aria-hidden className="h-2 w-2 rounded-sm" style={{ backgroundColor: PHASE_COLORS[phase] }} />
            {t(`phases.${phase}`)}
          </span>
        ))}
      </div>
    </Card>
  );
}
