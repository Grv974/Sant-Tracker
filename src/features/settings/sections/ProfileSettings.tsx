import { useState } from 'react';
import type { ContraceptionType, ISODate } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Field, Select, Slider } from '@/components/ui/misc';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { isContinuousHormonal } from '@/domain/modes';
import { todayISO } from '@/domain/dates';
import { cmToIn, inToCm, kgToLb, lbToKg, roundTo } from '@/domain/units';

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

export function ProfileSettings() {
  const { t, fdate } = useI18n();
  const data = useAppStore((s) => s.data);
  const store = useAppStore();
  const [historicalDraft, setHistoricalDraft] = useState('');
  if (!data) return null;
  const { profile, settings } = data;
  const heightUnit = settings.units.height;
  const weightUnit = settings.units.weight;

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-4">
        <Field
          label={t('settings.profileSection.birthYear')}
          type="number"
          inputMode="numeric"
          min={1930}
          max={new Date().getFullYear()}
          value={profile.birthYear ?? ''}
          onChange={(e) => store.updateProfile({ birthYear: e.target.value ? Number(e.target.value) : undefined })}
        />
        <Field
          label={`${t('settings.profileSection.height')} (${heightUnit})`}
          type="number"
          inputMode="decimal"
          value={profile.heightCm != null ? roundTo(heightUnit === 'cm' ? profile.heightCm : cmToIn(profile.heightCm), 1) : ''}
          onChange={(e) => {
            const raw = e.target.value ? Number(e.target.value) : null;
            store.updateProfile({ heightCm: raw == null ? null : Math.round(heightUnit === 'cm' ? raw : inToCm(raw)) });
          }}
        />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">{t('settings.profileSection.trackWeight')}</div>
            <div className="text-xs text-muted">{t('settings.profileSection.trackWeightHint')}</div>
          </div>
          <Switch label={t('settings.profileSection.trackWeight')} checked={profile.trackWeight} onChange={(trackWeight) => store.updateProfile({ trackWeight })} />
        </div>
        {profile.trackWeight && (
          <Field
            label={`${t('settings.profileSection.weight')} (${weightUnit})`}
            type="number"
            inputMode="decimal"
            step="0.1"
            value={profile.weightKg != null ? roundTo(weightUnit === 'kg' ? profile.weightKg : kgToLb(profile.weightKg), 1) : ''}
            onChange={(e) => {
              const raw = e.target.value ? Number(e.target.value) : null;
              store.updateProfile({ weightKg: raw == null ? null : roundTo(weightUnit === 'kg' ? raw : lbToKg(raw), 1) });
            }}
          />
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <Select
          label={t('settings.profileSection.contraception')}
          value={profile.contraception}
          onChange={(e) => store.updateProfile({ contraception: e.target.value as ContraceptionType })}
        >
          {CONTRACEPTIONS.map((c) => (
            <option key={c} value={c}>
              {t(`settings.profileSection.contraceptionTypes.${c}`)}
            </option>
          ))}
        </Select>
        {isContinuousHormonal(profile.contraception) && (
          <p role="note" className="rounded-lg bg-info/10 p-3 text-sm text-info">
            {t('onboarding.o5.continuousWarning')}
          </p>
        )}
        <div>
          <div className="mb-1 text-sm font-medium">
            {t('settings.profileSection.typicalCycle')} : {profile.typicalCycleLength} {t('common.days')}
          </div>
          <Slider
            label={t('settings.profileSection.typicalCycle')}
            min={21}
            max={45}
            value={profile.typicalCycleLength}
            onChange={(typicalCycleLength) => store.updateProfile({ typicalCycleLength })}
          />
        </div>
        <div>
          <div className="mb-1 text-sm font-medium">
            {t('settings.profileSection.typicalPeriod')} : {profile.typicalPeriodLength} {t('common.days')}
          </div>
          <Slider
            label={t('settings.profileSection.typicalPeriod')}
            min={2}
            max={10}
            value={profile.typicalPeriodLength}
            onChange={(typicalPeriodLength) => store.updateProfile({ typicalPeriodLength })}
          />
        </div>
        <Field
          label={t('settings.profileSection.luteal')}
          hint={t('settings.profileSection.lutealHint')}
          type="number"
          inputMode="numeric"
          min={5}
          max={25}
          value={profile.lutealLengthOverride ?? ''}
          onChange={(e) => store.updateProfile({ lutealLengthOverride: e.target.value ? Number(e.target.value) : undefined })}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">{t('settings.profileSection.spottingAsStart')}</span>
          <Switch
            label={t('settings.profileSection.spottingAsStart')}
            checked={profile.countSpottingAsPeriodStart ?? false}
            onChange={(countSpottingAsPeriodStart) => store.updateProfile({ countSpottingAsPeriodStart })}
          />
        </div>
      </Card>

      {/* Historique rétrospectif (§3.2.11) */}
      <Card className="flex flex-col gap-3">
        <div>
          <div className="text-sm font-medium">{t('settings.profileSection.historicalStarts')}</div>
          <div className="text-xs text-muted">{t('settings.profileSection.historicalHint')}</div>
        </div>
        {(profile.historicalPeriodStarts ?? []).length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {[...(profile.historicalPeriodStarts ?? [])].sort().map((date) => (
              <li key={date} className="flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-xs">
                {fdate(date, 'd MMM yyyy')}
                <button
                  type="button"
                  aria-label={`${t('common.delete')} ${fdate(date)}`}
                  className="min-h-[24px] text-muted hover:text-period"
                  onClick={() =>
                    store.updateProfile({
                      historicalPeriodStarts: (profile.historicalPeriodStarts ?? []).filter((d) => d !== date),
                    })
                  }
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!historicalDraft) return;
            const set = new Set([...(profile.historicalPeriodStarts ?? []), historicalDraft as ISODate]);
            store.updateProfile({ historicalPeriodStarts: [...set].sort() });
            setHistoricalDraft('');
          }}
        >
          <Field
            label={t('settings.profileSection.addHistorical')}
            type="date"
            max={todayISO()}
            value={historicalDraft}
            onChange={(e) => setHistoricalDraft(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" disabled={!historicalDraft}>
            {t('common.add')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
