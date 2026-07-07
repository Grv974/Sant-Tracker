import { useReducer, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import type { ContraceptionType, ISODate, PrimaryGoal, Profile } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { onboardingReducer, stepNumber, type OnboardingState } from './machine';
import { Button } from '@/components/ui/Button';
import { ProgressBar, Field, Select, Slider } from '@/components/ui/misc';
import { Switch } from '@/components/ui/Switch';
import { parseBackup } from '@/data/backup';
import { applyTrackingPreset } from '@/data/defaults';
import { isContinuousHormonal } from '@/domain/modes';
import { todayISO } from '@/domain/dates';
import { DISCLAIMER_VERSION } from '@/constants/app';
import { useToast } from '@/components/ui/Toast';
import { requestNotificationPermission } from '@/notifications/scheduler';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Draft {
  primaryGoal: PrimaryGoal;
  birthYear?: number;
  heightCm?: number;
  weightKg?: number;
  trackWeight: boolean;
  contraception: ContraceptionType;
  pregnant: boolean;
  postpartum: boolean;
  breastfeeding: boolean;
  pcos: boolean;
  endometriosis: boolean;
  perimenopause: boolean;
  typicalCycleLength: number;
  typicalPeriodLength: number;
  lastPeriod?: ISODate;
  enableReminders: boolean;
}

const GOALS: PrimaryGoal[] = ['understand', 'predict', 'conceive', 'condition', 'perimenopause', 'postpartum'];
const CONTRACEPTIONS: ContraceptionType[] = [
  'none',
  'combined_pill',
  'progestin_pill',
  'hormonal_iud',
  'copper_iud',
  'implant',
  'injection',
  'patch',
  'ring',
  'condom',
  'fertility_awareness',
  'other',
];

export default function OnboardingPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const toast = useToast();
  const reduced = useReducedMotion();
  const store = useAppStore();
  const [consent, setConsent] = useState(false);
  const [state, dispatch] = useReducer(
    (s: OnboardingState, e: Parameters<typeof onboardingReducer>[1]) => onboardingReducer(s, e, { consent }),
    'O1',
  );
  const [draft, setDraft] = useState<Draft>({
    primaryGoal: 'understand',
    trackWeight: true,
    contraception: 'none',
    pregnant: false,
    postpartum: false,
    breastfeeding: false,
    pcos: false,
    endometriosis: false,
    perimenopause: false,
    typicalCycleLength: 28,
    typicalPeriodLength: 5,
    enableReminders: false,
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const patch = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));

  /** Import d'une sauvegarde depuis O1 (restauration nouvel appareil, §3.1.2). */
  const importBackup = async (file: File) => {
    const text = await file.text();
    let result = await parseBackup(text);
    if (!result.ok && result.error.kind === 'encrypted_needs_passphrase') {
      const passphrase = window.prompt(t('settings.dataSection.passphrase'));
      if (!passphrase) return;
      result = await parseBackup(text, passphrase);
    }
    if (!result.ok) {
      const key = `settings.dataSection.importErrors.${result.error.kind}`;
      toast(t(key, { v: 'fromVersion' in result.error ? result.error.fromVersion : '', issues: '' }), 'warning');
      return;
    }
    await store.replaceAll(result.preview.data);
    dispatch({ type: 'IMPORT_SUCCESS' });
    navigate('/', { replace: true });
  };

  /** Effets de bord à completed (annexe B). */
  const complete = async () => {
    const conditions: Profile['conditions'] = {
      pcos: draft.pcos,
      endometriosis: draft.endometriosis,
      perimenopause: draft.perimenopause,
      earlyMenopause: false,
      menopauseConfirmed: false,
      pregnant: draft.pregnant,
      postpartum: draft.postpartum,
      breastfeeding: draft.breastfeeding,
    };
    const profile: Partial<Profile> = {
      primaryGoal: draft.primaryGoal,
      birthYear: draft.birthYear,
      heightCm: draft.heightCm ?? null,
      weightKg: draft.trackWeight ? (draft.weightKg ?? null) : null,
      trackWeight: draft.trackWeight,
      contraception: draft.contraception,
      conditions,
      typicalCycleLength: draft.typicalCycleLength,
      typicalPeriodLength: draft.typicalPeriodLength,
      historicalPeriodStarts: draft.lastPeriod ? [draft.lastPeriod] : [],
      ...(draft.pregnant && draft.lastPeriod ? { pregnancyStart: draft.lastPeriod } : {}),
    };
    store.completeOnboarding(profile, new Date().toISOString(), DISCLAIMER_VERSION);
    // Adaptation du suivi au profil (§3.1.3, §3.3.20)
    const data = useAppStore.getState().data;
    if (data) {
      const preset =
        draft.primaryGoal === 'conceive'
          ? 'conceive'
          : draft.pcos
            ? 'pcos'
            : draft.endometriosis
              ? 'endometriosis'
              : draft.perimenopause
                ? 'perimenopause'
                : draft.postpartum
                  ? 'postpartum'
                  : null;
      if (preset) {
        store.updateSettings({ trackedCategories: applyTrackingPreset(data.settings.trackedCategories, preset) });
      }
      if (draft.enableReminders) {
        const permission = await requestNotificationPermission();
        store.updateSettings({
          notifications: { ...data.settings.notifications, enabled: permission === 'granted' || permission === 'default' },
        });
      }
    }
    await store.flushNow();
    navigate('/', { replace: true });
  };

  const total = draft.primaryGoal === 'conceive' ? 8 : 7;
  const showConceiveExtra = draft.primaryGoal === 'conceive' && state === 'O7';

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 p-6">
      <ProgressBar value={stepNumber(state)} max={total} label={t('onboarding.progress', { current: stepNumber(state), total })} />
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-5"
        >
          {state === 'O1' && (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" className="h-24 w-24 drop-shadow" />
              <h1 className="font-display text-2xl font-bold">{t('onboarding.o1.title')}</h1>
              <p className="text-muted">{t('onboarding.o1.promise')}</p>
              <Button size="lg" className="w-full" onClick={() => dispatch({ type: 'NEXT' })}>
                {t('onboarding.o1.start')}
              </Button>
              <button type="button" onClick={() => fileRef.current?.click()} className="min-h-[44px] text-sm text-muted underline hover:text-ink">
                {t('onboarding.o1.haveBackup')}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void importBackup(file);
                }}
              />
            </div>
          )}

          {state === 'O2' && (
            <>
              <h1 className="font-display text-xl font-bold">{t('onboarding.o2.title')}</h1>
              <ul className="flex flex-col gap-3">
                {(['point1', 'point2', 'point3'] as const).map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Moon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {t(`onboarding.o2.${p}`)}
                  </li>
                ))}
              </ul>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-surface-2 p-4 text-sm">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-[rgb(var(--c-primary))]"
                />
                {t('onboarding.o2.consentLabel')}
              </label>
              <Button disabled={!consent} onClick={() => dispatch({ type: 'NEXT' })}>
                {t('onboarding.o2.accept')}
              </Button>
            </>
          )}

          {state === 'O3' && (
            <>
              <h1 className="font-display text-xl font-bold">{t('onboarding.o3.title')}</h1>
              <div role="radiogroup" aria-label={t('onboarding.o3.title')} className="flex flex-col gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    role="radio"
                    aria-checked={draft.primaryGoal === goal}
                    onClick={() => patch({ primaryGoal: goal, ...(goal === 'postpartum' ? { postpartum: true } : {}), ...(goal === 'perimenopause' ? { perimenopause: true } : {}) })}
                    className={`min-h-[52px] rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                      draft.primaryGoal === goal
                        ? 'border-primary bg-primary/10 font-semibold'
                        : 'border-muted/25 bg-surface hover:border-primary/40'
                    }`}
                  >
                    {t(`onboarding.o3.${goal}`)}
                  </button>
                ))}
              </div>
            </>
          )}

          {state === 'O4' && (
            <>
              <h1 className="font-display text-xl font-bold">{t('onboarding.o4.title')}</h1>
              <p className="text-sm text-muted">{t('onboarding.o4.explain')}</p>
              <Field
                label={`${t('onboarding.o4.birthYear')} (${t('common.optional')})`}
                type="number"
                inputMode="numeric"
                min={1930}
                max={new Date().getFullYear()}
                value={draft.birthYear ?? ''}
                onChange={(e) => patch({ birthYear: e.target.value ? Number(e.target.value) : undefined })}
              />
              <Field
                label={`${t('onboarding.o4.height')} (cm, ${t('common.optional')})`}
                type="number"
                inputMode="numeric"
                min={80}
                max={260}
                value={draft.heightCm ?? ''}
                onChange={(e) => patch({ heightCm: e.target.value ? Number(e.target.value) : undefined })}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm">{t('onboarding.o4.noWeightTracking')}</span>
                <Switch label={t('onboarding.o4.noWeightTracking')} checked={!draft.trackWeight} onChange={(v) => patch({ trackWeight: !v })} />
              </div>
              {draft.trackWeight && (
                <Field
                  label={`${t('onboarding.o4.weight')} (kg, ${t('common.optional')})`}
                  type="number"
                  inputMode="decimal"
                  min={20}
                  max={400}
                  value={draft.weightKg ?? ''}
                  onChange={(e) => patch({ weightKg: e.target.value ? Number(e.target.value) : undefined })}
                />
              )}
            </>
          )}

          {state === 'O5' && (
            <>
              <h1 className="font-display text-xl font-bold">{t('onboarding.o5.title')}</h1>
              <Select
                label={t('onboarding.o5.contraception')}
                value={draft.contraception}
                onChange={(e) => patch({ contraception: e.target.value as ContraceptionType })}
              >
                {CONTRACEPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {t(`settings.profileSection.contraceptionTypes.${c}`)}
                  </option>
                ))}
              </Select>
              {isContinuousHormonal(draft.contraception) && (
                <p role="note" className="rounded-lg bg-info/10 p-3 text-sm text-info">
                  {t('onboarding.o5.continuousWarning')}
                </p>
              )}
              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-1 text-sm font-medium">{t('onboarding.o5.situations')}</legend>
                {(
                  [
                    ['pregnant', 'pregnant'],
                    ['postpartum', 'postpartum'],
                    ['breastfeeding', 'breastfeeding'],
                    ['pcos', 'pcos'],
                    ['endometriosis', 'endometriosis'],
                    ['perimenopause', 'perimenopause'],
                  ] as const
                ).map(([key, labelKey]) => (
                  <label key={key} className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={draft[key]}
                      onChange={(e) => patch({ [key]: e.target.checked } as Partial<Draft>)}
                      className="h-5 w-5 accent-[rgb(var(--c-primary))]"
                    />
                    {t(`onboarding.o5.${labelKey}`)}
                  </label>
                ))}
              </fieldset>
              {draft.pregnant && (
                <p role="note" className="rounded-lg bg-info/10 p-3 text-sm text-info">
                  {t('onboarding.o5.pregnantWarning')}
                </p>
              )}
            </>
          )}

          {state === 'O6' && (
            <>
              <h1 className="font-display text-xl font-bold">{t('onboarding.o6.title')}</h1>
              <div>
                <div className="mb-1 text-sm font-medium">{t('onboarding.o6.cycleLength')}</div>
                <Slider
                  label={t('onboarding.o6.cycleLength')}
                  min={21}
                  max={45}
                  value={draft.typicalCycleLength}
                  onChange={(v) => patch({ typicalCycleLength: v })}
                  valueText={`${draft.typicalCycleLength} ${t('common.days')}`}
                />
              </div>
              <div>
                <div className="mb-1 text-sm font-medium">{t('onboarding.o6.periodLength')}</div>
                <Slider
                  label={t('onboarding.o6.periodLength')}
                  min={2}
                  max={10}
                  value={draft.typicalPeriodLength}
                  onChange={(v) => patch({ typicalPeriodLength: v })}
                  valueText={`${draft.typicalPeriodLength} ${t('common.days')}`}
                />
              </div>
              <Field
                label={`${t('onboarding.o6.lastPeriod')} (${t('common.optional')})`}
                hint={t('onboarding.o6.lastPeriodHint')}
                type="date"
                max={todayISO()}
                value={draft.lastPeriod ?? ''}
                onChange={(e) => patch({ lastPeriod: e.target.value || undefined })}
              />
              <p className="text-xs text-muted">{t('onboarding.o6.refineNote')}</p>
            </>
          )}

          {state === 'O7' && (
            <>
              <h1 className="font-display text-xl font-bold">
                {showConceiveExtra ? t('onboarding.conceiveExtra.title') : t('onboarding.o7.title')}
              </h1>
              {showConceiveExtra && <p className="text-sm leading-relaxed text-muted">{t('onboarding.conceiveExtra.body')}</p>}
              <div className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 p-4">
                <div>
                  <div className="text-sm font-medium">{t('onboarding.o7.enableReminders')}</div>
                  <div className="text-xs text-muted">{t('onboarding.o7.remindersHint')}</div>
                </div>
                <Switch label={t('onboarding.o7.enableReminders')} checked={draft.enableReminders} onChange={(v) => patch({ enableReminders: v })} />
              </div>
              <div className="rounded-lg bg-surface-2 p-4 text-sm">
                <div className="mb-1 font-semibold">{t('onboarding.o7.summary')}</div>
                <div className="text-muted">
                  {t('onboarding.o7.goal')} : {t(`onboarding.o3.${draft.primaryGoal}`)} · {draft.typicalCycleLength} {t('common.days')}
                </div>
              </div>
              <Button size="lg" onClick={() => void complete()}>
                {t('onboarding.o7.enter')}
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {state !== 'O1' && state !== 'O7' && (
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => dispatch({ type: 'BACK' })}>
            {t('common.back')}
          </Button>
          <div className="flex gap-2">
            {state !== 'O2' && (
              <Button variant="ghost" onClick={() => dispatch({ type: 'SKIP' })}>
                {t('common.skip')}
              </Button>
            )}
            {state !== 'O2' && (
              <Button onClick={() => dispatch({ type: 'NEXT' })}>{t('common.continue')}</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
