import type { PrimaryGoal } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Field, Select } from '@/components/ui/misc';
import { Switch } from '@/components/ui/Switch';
import { todayISO } from '@/domain/dates';

const GOALS: PrimaryGoal[] = ['understand', 'predict', 'conceive', 'condition', 'perimenopause', 'postpartum'];

export function GoalSettings() {
  const { t } = useI18n();
  const data = useAppStore((s) => s.data);
  const store = useAppStore();
  if (!data) return null;
  const { profile } = data;
  const c = profile.conditions;
  const setCondition = (patch: Partial<typeof c>) => store.updateProfile({ conditions: { ...c, ...patch } });

  const rows: { key: keyof typeof c; label: string }[] = [
    { key: 'pregnant', label: t('settings.goalSection.pregnant') },
    { key: 'postpartum', label: t('settings.goalSection.postpartum') },
    { key: 'breastfeeding', label: t('settings.goalSection.breastfeeding') },
    { key: 'pcos', label: t('settings.goalSection.pcos') },
    { key: 'endometriosis', label: t('settings.goalSection.endometriosis') },
    { key: 'perimenopause', label: t('settings.goalSection.perimenopause') },
    { key: 'earlyMenopause', label: t('settings.goalSection.earlyMenopause') },
    { key: 'menopauseConfirmed', label: t('settings.goalSection.menopauseConfirmed') },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Select
          label={t('settings.goalSection.primaryGoal')}
          value={profile.primaryGoal}
          onChange={(e) => store.updateProfile({ primaryGoal: e.target.value as PrimaryGoal })}
        >
          {GOALS.map((goal) => (
            <option key={goal} value={goal}>
              {t(`onboarding.o3.${goal}`)}
            </option>
          ))}
        </Select>
      </Card>
      <Card className="flex flex-col gap-1">
        <div className="mb-1 text-sm font-semibold">{t('settings.goalSection.conditions')}</div>
        {rows.map((row) => (
          <div key={row.key} className="flex min-h-[48px] items-center justify-between gap-3">
            <span className="text-sm">{row.label}</span>
            <Switch label={row.label} checked={c[row.key] === true} onChange={(v) => setCondition({ [row.key]: v })} />
          </div>
        ))}
        {c.pregnant && (
          <Field
            label={t('settings.goalSection.pregnancyStart')}
            type="date"
            max={todayISO()}
            value={profile.pregnancyStart ?? ''}
            onChange={(e) => store.updateProfile({ pregnancyStart: e.target.value || undefined })}
          />
        )}
        {c.postpartum && (
          <Field
            label={t('settings.goalSection.deliveryDate')}
            type="date"
            max={todayISO()}
            value={profile.deliveryDate ?? ''}
            onChange={(e) => store.updateProfile({ deliveryDate: e.target.value || undefined })}
          />
        )}
      </Card>
      <p className="px-1 text-xs italic text-muted">{t('disclaimer.short')}</p>
    </div>
  );
}
