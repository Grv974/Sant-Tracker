import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Egg, Sparkle } from 'lucide-react';
import type { CalendarEvent, ISODate } from '@/types/models';
import { useDerived } from '@/hooks/useDerived';
import { useAppStore } from '@/store/appStore';
import { useToday } from '@/hooks/useToday';
import { useI18n } from '@/i18n';
import { addDays, eachDay, isBetween, todayISO } from '@/domain/dates';
import { flowRank, findCycleForDate, dayOfCycle } from '@/domain/cycle';
import { uuid } from '@/utils/uuid';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Sheet } from '@/components/ui/Sheet';
import { Switch } from '@/components/ui/Switch';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Field, Select } from '@/components/ui/misc';
import { ConfidenceBadge } from '@/components/badges';
import { CycleView } from './CycleView';

interface DayInfo {
  date: ISODate;
  inMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
  flow: number;
  predictedPeriod: number | null; // horizon 1..3 (estompage)
  fertile: number | null;
  ovulationEstimated: boolean;
  ovulationConfirmed: boolean;
  phase: string | null;
  hasNote: boolean;
  symptomCount: number;
  hasEvent: boolean;
}

export default function CalendarPage() {
  const { t, fdate } = useI18n();
  const state = useDerived();
  const today = useToday();
  const navigate = useNavigate();
  const store = useAppStore();
  const [monthAnchor, setMonthAnchor] = useState<ISODate>(() => `${todayISO().slice(0, 7)}-01`);
  const [selected, setSelected] = useState<ISODate | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [eventDraft, setEventDraft] = useState<{ date: ISODate } | null>(null);
  const [view, setView] = useState<'month' | 'cycle'>('month');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const showPredictions = state?.data.settings.showPredictions ?? true;

  const days = useMemo<DayInfo[]>(() => {
    if (!state) return [];
    const { data, derived } = state;
    const [y, m] = monthAnchor.split('-').map(Number) as [number, number];
    const firstOfMonth = monthAnchor;
    const daysInMonth = new Date(y, m, 0).getDate();
    const lastOfMonth = `${monthAnchor.slice(0, 8)}${String(daysInMonth).padStart(2, '0')}`;
    // Semaine commençant lundi
    const firstWeekday = (new Date(`${firstOfMonth}T12:00:00`).getDay() + 6) % 7;
    const gridStart = addDays(firstOfMonth, -firstWeekday);
    const gridEnd = addDays(lastOfMonth, (7 - ((firstWeekday + daysInMonth) % 7)) % 7);

    const noteDates = new Set(Object.values(data.dailyEntries).filter((e) => e.notes).map((e) => e.date));
    const eventDates = new Set(data.events.map((e) => e.date));

    return eachDay(gridStart, gridEnd).map((date) => {
      const entry = data.dailyEntries[date];
      const cycle = findCycleForDate(derived.cycles, date);
      let phase: string | null = null;
      if (cycle && state.derived.behavior.phaseDisplay && date <= today) {
        const periodLen = cycle.periodLength ?? (Math.round(derived.stats.meanPeriod) || data.profile.typicalPeriodLength);
        const day = dayOfCycle(cycle, date);
        const ovu = cycle.ovulationConfirmed ?? cycle.ovulationEstimated ?? (cycle.endDate ? addDays(cycle.endDate, -(derived.stats.luteal - 1)) : null);
        if (day <= periodLen) phase = 'menstrual';
        else if (ovu) {
          const delta = new Date(date).getTime() - new Date(ovu).getTime();
          const deltaDays = Math.round(delta / 86_400_000);
          phase = deltaDays < -1 ? 'follicular' : deltaDays <= 1 ? 'ovulatory' : 'luteal';
        } else phase = 'follicular';
      }

      let predictedPeriod: number | null = null;
      let fertile: number | null = null;
      let ovulationEstimated = false;
      if (showPredictions && date > today) {
        for (const f of derived.forecasts) {
          if (isBetween(date, f.periodStart, f.periodEnd)) predictedPeriod = f.horizon;
          if (f.fertileStart && f.fertileEnd && isBetween(date, f.fertileStart, f.fertileEnd)) fertile = f.horizon;
          if (f.ovulation === date) ovulationEstimated = true;
        }
      }
      const confirmedOvulation = derived.cycles.some((c) => c.ovulationConfirmed === date);

      const symptomCount =
        (entry?.pain?.intensity !== undefined && entry.pain.intensity > 0 ? 1 : 0) +
        (entry?.mood?.states?.length ? 1 : 0) +
        (entry?.energy !== undefined ? 1 : 0) +
        (entry?.bbt !== undefined ? 1 : 0) +
        Object.keys(entry?.customValues ?? {}).length;

      return {
        date,
        inMonth: date >= firstOfMonth && date <= lastOfMonth,
        isToday: date === today,
        isFuture: date > today,
        flow: flowRank(entry?.flow),
        predictedPeriod,
        fertile,
        ovulationEstimated,
        ovulationConfirmed: confirmedOvulation,
        phase,
        hasNote: noteDates.has(date),
        symptomCount,
        hasEvent: eventDates.has(date),
      };
    });
  }, [state, monthAnchor, today, showPredictions]);

  if (!state) return null;
  const { data, derived } = state;
  const selectedEvents = selected ? data.events.filter((e) => e.date === selected) : [];
  const weekdays = state.data.settings.locale === 'fr' ? ['L', 'M', 'M', 'J', 'V', 'S', 'D'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">{t('calendar.title')}</h1>
        <div className="flex items-center gap-1">
          <Button variant="icon" aria-label={t('common.back')} onClick={() => setMonthAnchor(shiftMonth(monthAnchor, -1))}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <span className="min-w-[8.5rem] text-center font-display text-sm font-semibold capitalize">{fdate(monthAnchor, 'MMMM yyyy')}</span>
          <Button variant="icon" aria-label={t('common.continue')} onClick={() => setMonthAnchor(shiftMonth(monthAnchor, 1))}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Button>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMonthAnchor(`${today.slice(0, 7)}-01`)}>
          {t('common.today')}
        </Button>
      </div>

      <div className="w-full max-w-[14rem]">
        <SegmentedControl
          label={t('calendar.title')}
          value={view}
          onChange={setView}
          options={[
            { value: 'month', label: t('calendar.monthView') },
            { value: 'cycle', label: t('calendar.cycleView') },
          ]}
        />
      </div>

      {view === 'cycle' && <CycleView />}

      <div className={cn('flex items-center justify-between gap-3', view !== 'month' && 'hidden')}>
        <div className="flex items-center gap-2 text-sm text-muted">
          {t('calendar.showPredictions')}
          <Switch
            label={t('calendar.showPredictions')}
            checked={showPredictions}
            onChange={(v) => store.updateSettings({ showPredictions: v })}
          />
        </div>
        <button type="button" onClick={() => setLegendOpen((o) => !o)} className="flex min-h-[44px] items-center gap-1 text-sm text-primary-strong underline dark:text-primary">
          {t('calendar.legend')} <ChevronDown className={cn('h-4 w-4 transition-transform', legendOpen && 'rotate-180')} aria-hidden />
        </button>
      </div>
      {legendOpen && view === 'month' && <Legend />}

      <Card
        className={cn('p-2 sm:p-4', view !== 'month' && 'hidden')}
        onTouchStart={(e) => setTouchStartX(e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          // Balayage horizontal : changement de mois (§7.4)
          const endX = e.changedTouches[0]?.clientX;
          if (touchStartX !== null && endX !== undefined && Math.abs(endX - touchStartX) > 60) {
            setMonthAnchor(shiftMonth(monthAnchor, endX < touchStartX ? 1 : -1));
          }
          setTouchStartX(null);
        }}
      >
        <div role="grid" aria-label={fdate(monthAnchor, 'MMMM yyyy')}>
          <div role="row" className="grid grid-cols-7">
            {weekdays.map((d, i) => (
              <div key={i} role="columnheader" className="pb-1 text-center text-xs font-medium text-muted">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {days.map((day) => (
              <DayCell
                key={day.date}
                day={day}
                selected={selected === day.date}
                onSelect={() => setSelected(day.date)}
                onLongPress={() => {
                  if (!day.isFuture) store.markPeriodStart(day.date);
                }}
              />
            ))}
          </div>
        </div>
      </Card>
      {showPredictions && view === 'month' && <p className="text-xs text-muted">{t('calendar.forecastFading')}</p>}

      {/* Fiche du jour sélectionné (§7.4) */}
      {selected && (
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold">{t('calendar.selectedDay', { date: fdate(selected) })}</h2>
            {(() => {
              const cycle = findCycleForDate(derived.cycles, selected);
              return cycle && selected >= cycle.startDate ? (
                <span className="text-xs text-muted">{t('calendar.cycleDayN', { day: dayOfCycle(cycle, selected) })}</span>
              ) : null;
            })()}
          </div>
          {selected <= today ? (
            <>
              <DaySummary date={selected} />
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => navigate(`/log/${selected}`)}>
                  {t('calendar.openJournal')}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => store.markPeriodStart(selected)}>
                  {t('calendar.markPeriodStart')}
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setEventDraft({ date: selected })}>
                  {t('calendar.addEvent')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <FutureDaySummary date={selected} />
              <div className="mt-3">
                <Button size="sm" variant="secondary" onClick={() => setEventDraft({ date: selected })}>
                  {t('calendar.addEvent')}
                </Button>
              </div>
            </>
          )}
          {selectedEvents.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {selectedEvents.map((event) => (
                <li key={event.id} className="flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2 text-sm">
                  <span className="font-medium">{t(`calendar.eventTypes.${event.type}`)}</span> — {event.title}
                  <button type="button" onClick={() => store.removeEvent(event.id)} className="ml-auto min-h-[44px] text-xs text-muted underline">
                    {t('common.delete')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {eventDraft && (
        <EventSheet
          date={eventDraft.date}
          onClose={() => setEventDraft(null)}
          onSave={(event) => {
            store.addEvent(event);
            setEventDraft(null);
          }}
        />
      )}
    </div>
  );
}

function shiftMonth(anchor: ISODate, delta: number): ISODate {
  const [y, m] = anchor.split('-').map(Number) as [number, number];
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const PHASE_BG: Record<string, string> = {
  menstrual: 'bg-phase-menstrual/60',
  follicular: 'bg-phase-follicular/60',
  ovulatory: 'bg-phase-ovulatory/60',
  luteal: 'bg-phase-luteal/60',
};

function DayCell({ day, selected, onSelect, onLongPress }: { day: DayInfo; selected: boolean; onSelect: () => void; onLongPress: () => void }) {
  const { t, fdate } = useI18n();
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const parts: string[] = [fdate(day.date, 'EEEE d MMMM')];
  if (day.flow >= 2) parts.push(t('calendar.legendItems.periodReal'));
  if (day.predictedPeriod) parts.push(t('calendar.legendItems.periodPredicted'));
  if (day.fertile) parts.push(t('calendar.legendItems.fertile'));
  if (day.ovulationEstimated) parts.push(t('calendar.legendItems.ovulationEstimated'));
  if (day.ovulationConfirmed) parts.push(t('calendar.legendItems.ovulationConfirmed'));
  if (day.hasNote) parts.push(t('calendar.legendItems.note'));

  const fade = day.predictedPeriod ? Math.max(0.85 - (day.predictedPeriod - 1) * 0.25, 0.3) : 0;

  return (
    <button
      type="button"
      role="gridcell"
      aria-label={parts.join(', ')}
      aria-selected={selected}
      onClick={onSelect}
      onPointerDown={() => setPressTimer(setTimeout(onLongPress, 550))}
      onPointerUp={() => pressTimer && clearTimeout(pressTimer)}
      onPointerLeave={() => pressTimer && clearTimeout(pressTimer)}
      className={cn(
        'relative mx-auto flex h-12 w-full max-w-[3.25rem] flex-col items-center justify-start rounded-md pt-1 text-sm transition-colors',
        day.phase && !day.isFuture && PHASE_BG[day.phase],
        !day.inMonth && 'opacity-35',
        selected && 'ring-2 ring-primary',
        day.isToday && 'outline outline-2 outline-primary-strong',
        day.fertile && 'border border-fertile/70',
      )}
    >
      <span className={cn('leading-none', day.isToday && 'font-bold')}>{Number(day.date.slice(8, 10))}</span>

      {/* Règles réelles : pastille pleine ; prévues : hachures (double codage, §7.3) */}
      {day.flow >= 2 && (
        <span aria-hidden className="mt-0.5 h-2 w-2 rounded-full bg-period" style={{ opacity: 0.5 + day.flow * 0.1 }} />
      )}
      {day.flow === 1 && <span aria-hidden className="mt-0.5 h-1.5 w-1.5 rounded-full border border-period bg-transparent" />}
      {day.predictedPeriod !== null && day.flow < 2 && (
        <span aria-hidden className="hatched-period mt-0.5 h-2 w-3.5 rounded-sm" style={{ opacity: fade }} />
      )}
      {day.ovulationEstimated && !day.ovulationConfirmed && (
        <Sparkle aria-hidden className="absolute right-0.5 top-0.5 h-3 w-3 text-fertile" />
      )}
      {day.ovulationConfirmed && <Egg aria-hidden className="absolute right-0.5 top-0.5 h-3 w-3 fill-fertile text-fertile" />}
      {day.hasNote && <span aria-hidden className="absolute left-1 top-1 h-1.5 w-1.5 rounded-sm bg-secondary" />}

      <span aria-hidden className="absolute bottom-0.5 flex gap-0.5">
        {Array.from({ length: Math.min(day.symptomCount, 3) }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-accent" />
        ))}
        {day.symptomCount > 3 && <span className="text-[0.5rem] leading-none text-muted">+</span>}
        {day.hasEvent && <span className="h-1 w-1 rounded-full bg-info" />}
      </span>
    </button>
  );
}

function Legend() {
  const { t } = useI18n();
  const items: { key: string; swatch: React.ReactNode }[] = [
    { key: 'periodReal', swatch: <span className="h-3 w-3 rounded-full bg-period" /> },
    { key: 'periodPredicted', swatch: <span className="hatched-period h-3 w-5 rounded-sm" /> },
    { key: 'fertile', swatch: <span className="h-3 w-3 rounded-md border-2 border-fertile" /> },
    { key: 'ovulationEstimated', swatch: <Sparkle className="h-3.5 w-3.5 text-fertile" /> },
    { key: 'ovulationConfirmed', swatch: <Egg className="h-3.5 w-3.5 fill-fertile text-fertile" /> },
    { key: 'today', swatch: <span className="h-3 w-3 rounded-md outline outline-2 outline-primary-strong" /> },
    { key: 'note', swatch: <span className="h-2 w-2 rounded-sm bg-secondary" /> },
    { key: 'symptoms', swatch: <span className="h-2 w-2 rounded-full bg-accent" /> },
    { key: 'event', swatch: <span className="h-2 w-2 rounded-full bg-info" /> },
  ];
  return (
    <Card className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-2 text-xs text-muted">
          <span aria-hidden className="flex w-6 justify-center">{item.swatch}</span>
          {t(`calendar.legendItems.${item.key}`)}
        </div>
      ))}
    </Card>
  );
}

function DaySummary({ date }: { date: ISODate }) {
  const { t } = useI18n();
  const data = useAppStore((s) => s.data);
  const entry = data?.dailyEntries[date];
  if (!entry || Object.keys(entry).length <= 3) return <p className="text-sm text-muted">{t('calendar.noData')}</p>;
  return (
    <div className="flex flex-wrap gap-1.5 text-xs">
      {entry.flow && entry.flow !== 'none' && (
        <span className="rounded-full bg-period/15 px-2.5 py-1 text-period">{t('journal.flow')} : {t(`journal.flowLevels.${entry.flow}`)}</span>
      )}
      {entry.pain?.intensity !== undefined && (
        <span className="rounded-full bg-surface-2 px-2.5 py-1">{t('journal.pain')} {entry.pain.intensity}/10</span>
      )}
      {entry.energy !== undefined && <span className="rounded-full bg-surface-2 px-2.5 py-1">{t('journal.energy')} {entry.energy}/5</span>}
      {entry.bbt && <span className="rounded-full bg-surface-2 px-2.5 py-1">BBT {entry.bbt.celsius.toFixed(2)} °C</span>}
      {entry.mood?.states?.map((mood) => {
        const key = `journal.moodStates.${mood}`;
        const label = t(key);
        return (
          <span key={mood} className="rounded-full bg-surface-2 px-2.5 py-1">
            {label === key ? mood : label}
          </span>
        );
      })}
      {entry.notes && <span className="rounded-full bg-secondary/15 px-2.5 py-1 text-secondary">📝</span>}
    </div>
  );
}

/** Jour futur : prévision en lecture seule (§7.4). */
function FutureDaySummary({ date }: { date: ISODate }) {
  const { t } = useI18n();
  const state = useDerived();
  if (!state) return null;
  const { derived } = state;
  const forecast = derived.forecasts.find((f) => isBetween(date, f.periodStart, f.periodEnd));
  const fertile = derived.forecasts.find((f) => f.fertileStart && f.fertileEnd && isBetween(date, f.fertileStart, f.fertileEnd));
  return (
    <div className="flex flex-col gap-2 text-sm text-muted">
      {forecast && derived.prediction && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="hatched-period inline-block h-3 w-5 rounded-sm" aria-hidden />
          {t('calendar.predictedPeriod', { confidence: t(`confidence.${derived.prediction.confidence.label}`) })}
          {forecast.horizon === 1 && <ConfidenceBadge confidence={derived.prediction.confidence} />}
        </div>
      )}
      {fertile && (
        <div>
          {t('calendar.fertileDay')}
          <p className="mt-1 rounded-lg bg-warning/10 px-2.5 py-1.5 text-xs font-medium text-warning">{t('disclaimer.notContraception')}</p>
        </div>
      )}
      {!forecast && !fertile && <p>{t('calendar.predicted')} : —</p>}
    </div>
  );
}

function EventSheet({ date, onClose, onSave }: { date: ISODate; onClose: () => void; onSave: (event: CalendarEvent) => void }) {
  const { t, fdate } = useI18n();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CalendarEvent['type']>('custom');
  return (
    <Sheet open onClose={onClose} title={`${t('calendar.addEvent')} — ${fdate(date, 'd MMM')}`}>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) onSave({ id: uuid(), date, type, title: title.trim() });
        }}
      >
        <Field label={t('calendar.eventTitle')} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        <Select label={t('settings.trackingSection.symptomType')} value={type} onChange={(e) => setType(e.target.value as CalendarEvent['type'])}>
          {(['medical', 'travel', 'medication', 'custom'] as const).map((eventType) => (
            <option key={eventType} value={eventType}>
              {t(`calendar.eventTypes.${eventType}`)}
            </option>
          ))}
        </Select>
        <Button type="submit" disabled={!title.trim()}>
          {t('common.save')}
        </Button>
      </form>
    </Sheet>
  );
}
