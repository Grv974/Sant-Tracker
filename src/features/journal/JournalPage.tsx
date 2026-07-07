import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DailyEntry, Scale5 } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useDerived } from '@/hooks/useDerived';
import { useToday } from '@/hooks/useToday';
import { useI18n } from '@/i18n';
import { addDays, isValidISODate } from '@/domain/dates';
import { TRACKING_CATEGORIES, type TrackingCategory } from '@/data/defaults';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Slider } from '@/components/ui/misc';
import { Switch } from '@/components/ui/Switch';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { MultiChip } from '@/components/ui/MultiChip';
import { FlowSelector } from '@/components/inputs/FlowSelector';
import { PainInput } from '@/components/inputs/PainInput';
import { MoodPicker } from '@/components/inputs/MoodPicker';
import { ScaleInput } from '@/components/inputs/ScaleInput';
import { BBTInput } from '@/components/inputs/BBTInput';
import { CounterInput } from '@/components/inputs/CounterInput';
import { AutosaveIndicator } from '@/components/cards';
import { formatWeight, kgToLb, lbToKg, roundTo } from '@/domain/units';

export default function JournalPage() {
  const { date: dateParam } = useParams();
  const today = useToday();
  const navigate = useNavigate();
  const { t, fdate, dict } = useI18n();
  const state = useDerived();
  const store = useAppStore();
  const saveState = useAppStore((s) => s.saveState);
  const [extraOpen, setExtraOpen] = useState<TrackingCategory[]>([]);

  const date = dateParam && isValidISODate(dateParam) ? dateParam : today;
  const isFuture = date > today;

  const activeCategories = useMemo(() => {
    if (!state) return [];
    const tracked = state.data.settings.trackedCategories;
    return TRACKING_CATEGORIES.filter((cat) => tracked[cat]?.active !== false || extraOpen.includes(cat)).sort(
      (a, b) => (tracked[a]?.order ?? 0) - (tracked[b]?.order ?? 0),
    ).filter((cat) => tracked[cat]?.active || extraOpen.includes(cat));
  }, [state, extraOpen]);

  if (!state) return null;
  const { data, derived } = state;
  const entry: DailyEntry | undefined = data.dailyEntries[date];
  const inactive = TRACKING_CATEGORIES.filter(
    (cat) => !activeCategories.includes(cat) && (cat !== 'weight' || data.profile.trackWeight),
  );
  const bleedLabel = derived.behavior.withdrawalBleedVocabulary ? t('journal.bleedSection') : t('journal.periodSection');

  const set = (patch: Partial<DailyEntry>) => store.updateEntry(date, patch);
  const clear = (field: keyof DailyEntry) => store.clearEntryField(date, field);

  if (isFuture) {
    return (
      <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
        <DateNav date={date} today={today} onNavigate={(d) => navigate(`/log/${d}`)} />
        <Card>
          <p className="text-sm text-muted">{t('journal.futureDate')}</p>
        </Card>
      </div>
    );
  }

  const isStarted = entry?.menstruation?.isStart === true;
  const suggestUnreliable = (entry?.stress ?? 0) >= 4 || (entry?.sleep?.hours !== undefined && entry.sleep.hours < 3);

  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <DateNav date={date} today={today} onNavigate={(d) => navigate(`/log/${d}`)} />
        <AutosaveIndicator state={saveState} />
      </div>
      <p className="sr-only" aria-live="polite">
        {fdate(date)}
      </p>

      {/* Règles / saignements (§3.3.2, §3.3.3) */}
      <Card>
        <CardTitle>{bleedLabel}</CardTitle>
        <div className="flex flex-col gap-3">
          <SegmentedControl
            label={bleedLabel}
            value={isStarted ? 'start' : entry?.flow && entry.flow !== 'none' ? 'ongoing' : 'none'}
            onChange={(v) => {
              if (v === 'start') store.markPeriodStart(date);
              else if (v === 'none') store.undoPeriodStart(date);
              else set({ flow: entry?.flow && entry.flow !== 'none' ? entry.flow : 'medium' });
            }}
            options={[
              { value: 'none', label: t('journal.noPeriod') },
              { value: 'start', label: t('dashboard.periodStarted') },
              { value: 'ongoing', label: t('journal.inProgress') },
            ]}
          />
          <div>
            <div className="mb-1.5 text-xs font-medium text-muted">{t('journal.flow')}</div>
            <FlowSelector value={entry?.flow} onChange={(flow) => set({ flow })} onClear={() => clear('flow')} />
          </div>
          {(entry?.flow ?? 'none') !== 'none' && !entry?.menstruation?.isEnd && (
            <Button variant="secondary" size="sm" className="self-start" onClick={() => store.markPeriodEnd(date)}>
              {t('journal.periodEnded')}
            </Button>
          )}
        </div>
      </Card>

      {activeCategories.includes('pain') && (
        <Card>
          <CardTitle>{t('journal.pain')}</CardTitle>
          <PainInput value={entry?.pain} onChange={(pain) => set({ pain })} />
        </Card>
      )}

      {activeCategories.includes('mood') && (
        <Card>
          <CardTitle>{t('journal.mood')}</CardTitle>
          <MoodPicker
            states={entry?.mood?.states ?? []}
            score={entry?.mood?.score}
            customStates={data.settings.customMoodStates ?? []}
            onChangeStates={(states) => set({ mood: { ...entry?.mood, states } })}
            onChangeScore={(score) => set({ mood: { ...entry?.mood, score } })}
            onClearScore={() => set({ mood: { states: entry?.mood?.states } })}
            onAddCustomState={(mood) =>
              store.updateSettings({ customMoodStates: [...(data.settings.customMoodStates ?? []), mood] })
            }
          />
        </Card>
      )}

      {activeCategories.includes('energy') && (
        <Card>
          <CardTitle>{t('journal.energy')}</CardTitle>
          <ScaleInput
            label={t('journal.energy')}
            value={entry?.energy}
            onChange={(energy) => set({ energy })}
            onClear={() => clear('energy')}
            levelLabels={dict.journal.energyLevels}
          />
        </Card>
      )}

      {activeCategories.includes('libido') && (
        <Card>
          <CardTitle>{t('journal.libido')}</CardTitle>
          <ScaleInput label={t('journal.libido')} value={entry?.libido} onChange={(libido) => set({ libido })} onClear={() => clear('libido')} appearance="dots" />
        </Card>
      )}

      {activeCategories.includes('bbt') && (
        <Card>
          <CardTitle>{t('journal.bbt')}</CardTitle>
          <BBTInput
            value={entry?.bbt}
            onChange={(bbt) => set({ bbt })}
            unit={data.settings.units.temperature}
            suggestUnreliable={suggestUnreliable}
          />
        </Card>
      )}

      {activeCategories.includes('cervicalMucus') && (
        <Card>
          <CardTitle>{t('journal.mucus')}</CardTitle>
          <SegmentedControl
            label={t('journal.mucus')}
            value={entry?.cervicalMucus}
            onChange={(cervicalMucus) => set({ cervicalMucus })}
            options={(['dry', 'sticky', 'creamy', 'watery', 'eggwhite'] as const).map((m) => ({
              value: m,
              label: t(`journal.mucusTypes.${m}`),
            }))}
          />
          <p className="mt-2 text-xs text-muted">{t('journal.mucusHint')}</p>
        </Card>
      )}

      {activeCategories.includes('ovulationTest') && (
        <Card>
          <CardTitle>{t('journal.ovulationTest')}</CardTitle>
          <SegmentedControl
            label={t('journal.ovulationTest')}
            value={entry?.ovulationTest}
            onChange={(ovulationTest) => set({ ovulationTest })}
            options={[
              { value: 'negative', label: t('journal.ovulationNegative') },
              { value: 'positive', label: t('journal.ovulationPositive') },
            ]}
          />
        </Card>
      )}

      {activeCategories.includes('activity') && <ActivityCard entry={entry} onChange={set} />}

      {activeCategories.includes('sleep') && (
        <Card>
          <CardTitle>{t('journal.sleep')}</CardTitle>
          <div className="flex flex-col gap-3">
            <Field
              label={t('journal.sleepHours')}
              type="number"
              inputMode="decimal"
              min={0}
              max={24}
              step="0.5"
              value={entry?.sleep?.hours ?? ''}
              onChange={(e) => set({ sleep: { ...entry?.sleep, hours: e.target.value ? Number(e.target.value) : undefined } })}
            />
            <div>
              <div className="mb-1 text-xs font-medium text-muted">{t('journal.sleepQuality')}</div>
              <ScaleInput
                label={t('journal.sleepQuality')}
                value={entry?.sleep?.quality}
                onChange={(quality) => set({ sleep: { ...entry?.sleep, quality } })}
                appearance="dots"
              />
            </div>
            <Field
              label={t('journal.sleepAwakenings')}
              type="number"
              inputMode="numeric"
              min={0}
              max={20}
              value={entry?.sleep?.awakenings ?? ''}
              onChange={(e) => set({ sleep: { ...entry?.sleep, awakenings: e.target.value ? Number(e.target.value) : undefined } })}
            />
          </div>
        </Card>
      )}

      {activeCategories.includes('stress') && (
        <Card>
          <CardTitle>{t('journal.stress')}</CardTitle>
          <ScaleInput label={t('journal.stress')} value={entry?.stress} onChange={(stress) => set({ stress })} onClear={() => clear('stress')} />
          <p className="mt-2 text-xs text-muted">{t('journal.stressHint')}</p>
        </Card>
      )}

      {activeCategories.includes('hydration') && (
        <Card>
          <CardTitle>{t('journal.hydration')}</CardTitle>
          <CounterInput
            label={t('journal.hydration')}
            value={entry?.hydration ?? 0}
            onChange={(hydration) => set({ hydration })}
            unit={t('journal.hydrationUnit')}
          />
        </Card>
      )}

      {activeCategories.includes('weight') && data.profile.trackWeight && (
        <Card>
          <CardTitle>{t('journal.weight')}</CardTitle>
          <Field
            label={`${t('journal.weight')} (${data.settings.units.weight})`}
            type="number"
            inputMode="decimal"
            step="0.1"
            value={
              entry?.weightKg !== undefined
                ? roundTo(data.settings.units.weight === 'kg' ? entry.weightKg : kgToLb(entry.weightKg), 1)
                : ''
            }
            onChange={(e) => {
              if (!e.target.value) return clear('weightKg');
              const raw = Number(e.target.value);
              set({ weightKg: roundTo(data.settings.units.weight === 'kg' ? raw : lbToKg(raw), 1) });
            }}
            hint={entry?.weightKg !== undefined ? formatWeight(entry.weightKg, data.settings.units.weight) : undefined}
          />
        </Card>
      )}

      {(data.profile.contraception === 'combined_pill' || data.profile.contraception === 'progestin_pill') && (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="mb-0">{t('journal.pill')}</CardTitle>
            <Switch label={t('journal.pill')} checked={entry?.pillTaken === true} onChange={(pillTaken) => set({ pillTaken })} />
          </div>
        </Card>
      )}

      {/* Symptômes personnalisés (§3.3.16) */}
      {data.customSymptoms.filter((s) => s.active).length > 0 && (
        <Card>
          <CardTitle>{t('journal.custom')}</CardTitle>
          <div className="flex flex-col gap-4">
            {data.customSymptoms
              .filter((s) => s.active)
              .sort((a, b) => a.order - b.order)
              .map((symptom) => {
                const value = entry?.customValues?.[symptom.id];
                const setCustom = (v: boolean | number | string | string[]) =>
                  set({ customValues: { ...entry?.customValues, [symptom.id]: v } });
                return (
                  <div key={symptom.id} className="flex flex-col gap-1.5">
                    <div className="text-sm font-medium">
                      {symptom.icon && <span aria-hidden className="mr-1">{symptom.icon}</span>}
                      {symptom.name}
                    </div>
                    {symptom.inputType === 'boolean' && (
                      <Switch label={symptom.name} checked={value === true} onChange={(v) => setCustom(v)} />
                    )}
                    {symptom.inputType === 'scale' && (
                      <ScaleInput
                        label={symptom.name}
                        value={typeof value === 'number' ? (value as Scale5) : undefined}
                        onChange={(v) => setCustom(v)}
                      />
                    )}
                    {symptom.inputType === 'multi' && (
                      <MultiChip
                        label={symptom.name}
                        options={(symptom.options ?? []).map((o) => ({ value: o, label: o }))}
                        selected={Array.isArray(value) ? value : []}
                        onChange={(v) => setCustom(v)}
                      />
                    )}
                    {symptom.inputType === 'text' && (
                      <input
                        aria-label={symptom.name}
                        value={typeof value === 'string' ? value : ''}
                        onChange={(e) => setCustom(e.target.value)}
                        className="min-h-[44px] rounded-md border border-muted/30 bg-surface px-3 text-sm outline-none focus:border-primary"
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Catégories additionnelles repliées (§3.3.18) */}
      {inactive.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {t('journal.addCategory')}
          {inactive.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setExtraOpen((prev) => [...prev, cat])}
              className="min-h-[44px] rounded-full border border-dashed border-muted/40 px-3 text-xs hover:border-primary/50 hover:text-ink"
            >
              {t(`settings.trackingSection.categories.${cat}`)}
            </button>
          ))}
        </div>
      )}

      {activeCategories.includes('notes') && (
        <Card>
          <CardTitle>{t('journal.notes')}</CardTitle>
          <textarea
            aria-label={t('journal.notes')}
            placeholder={t('journal.notesPlaceholder')}
            value={entry?.notes ?? ''}
            onChange={(e) => set({ notes: e.target.value })}
            rows={3}
            className="w-full rounded-md border border-muted/30 bg-surface p-3 text-sm outline-none focus:border-primary"
          />
        </Card>
      )}
    </div>
  );
}

function DateNav({ date, today, onNavigate }: { date: string; today: string; onNavigate: (d: string) => void }) {
  const { t, fdate } = useI18n();
  return (
    <div className="flex items-center gap-1">
      <Button variant="icon" aria-label={t('common.back')} onClick={() => onNavigate(addDays(date, -1))}>
        <ChevronLeft className="h-5 w-5" aria-hidden />
      </Button>
      <h1 className="min-w-[9rem] text-center font-display text-base font-semibold">{fdate(date, 'd MMM yyyy')}</h1>
      <Button variant="icon" aria-label={t('common.continue')} disabled={date >= today} onClick={() => onNavigate(addDays(date, 1))}>
        <ChevronRight className="h-5 w-5" aria-hidden />
      </Button>
      {date !== today && (
        <Button variant="ghost" size="sm" onClick={() => onNavigate(today)}>
          {t('common.today')}
        </Button>
      )}
    </div>
  );
}

function ActivityCard({ entry, onChange }: { entry: DailyEntry | undefined; onChange: (patch: Partial<DailyEntry>) => void }) {
  const { t } = useI18n();
  const types = ['walking', 'running', 'strength', 'yoga', 'swimming', 'cycling', 'other'] as const;
  const activities = entry?.activity ?? [];
  const selected = activities.map((a) => a.type);
  const first = activities[0];

  return (
    <Card>
      <CardTitle>{t('journal.activity')}</CardTitle>
      <div className="flex flex-col gap-3">
        <MultiChip
          label={t('journal.activity')}
          options={types.map((ty) => ({ value: ty, label: t(`journal.activityTypes.${ty}`) }))}
          selected={selected}
          onChange={(next) => {
            onChange({
              activity: next.map((type) => activities.find((a) => a.type === type) ?? { type }),
            });
          }}
        />
        {activities.length > 0 && (
          <>
            <Field
              label={t('journal.activityMinutes')}
              type="number"
              inputMode="numeric"
              min={0}
              max={1440}
              value={first?.minutes ?? ''}
              onChange={(e) =>
                onChange({
                  activity: activities.map((a, i) => (i === 0 ? { ...a, minutes: e.target.value ? Number(e.target.value) : undefined } : a)),
                })
              }
            />
            <div>
              <div className="mb-1 text-xs font-medium text-muted">{t('journal.activityRpe')}</div>
              <Slider
                label={t('journal.activityRpe')}
                min={1}
                max={10}
                value={first?.rpe ?? 5}
                onChange={(rpe) => onChange({ activity: activities.map((a, i) => (i === 0 ? { ...a, rpe } : a)) })}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
