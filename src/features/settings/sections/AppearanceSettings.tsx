import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Switch } from '@/components/ui/Switch';

export function AppearanceSettings() {
  const { t } = useI18n();
  const data = useAppStore((s) => s.data);
  const store = useAppStore();
  if (!data) return null;
  const { settings } = data;
  const setUnits = (patch: Partial<typeof settings.units>) => store.updateSettings({ units: { ...settings.units, ...patch } });

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <div className="text-sm font-medium">{t('settings.appearanceSection.theme')}</div>
        <SegmentedControl
          label={t('settings.appearanceSection.theme')}
          value={settings.theme}
          onChange={(theme) => store.updateSettings({ theme })}
          options={(['light', 'dark', 'system'] as const).map((theme) => ({
            value: theme,
            label: t(`settings.appearanceSection.themes.${theme}`),
          }))}
        />
      </Card>
      <Card className="flex flex-col gap-3">
        <div className="text-sm font-medium">{t('settings.appearanceSection.language')}</div>
        <SegmentedControl
          label={t('settings.appearanceSection.language')}
          value={settings.locale}
          onChange={(locale) => store.updateSettings({ locale })}
          options={[
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' },
          ]}
        />
      </Card>
      <Card className="flex flex-col gap-4">
        <div className="text-sm font-medium">{t('settings.appearanceSection.units')}</div>
        <div>
          <div className="mb-1 text-xs text-muted">{t('settings.appearanceSection.temperature')}</div>
          <SegmentedControl
            label={t('settings.appearanceSection.temperature')}
            value={settings.units.temperature}
            onChange={(temperature) => setUnits({ temperature })}
            options={[
              { value: 'C', label: '°C' },
              { value: 'F', label: '°F' },
            ]}
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted">{t('settings.appearanceSection.weightUnit')}</div>
          <SegmentedControl
            label={t('settings.appearanceSection.weightUnit')}
            value={settings.units.weight}
            onChange={(weight) => setUnits({ weight })}
            options={[
              { value: 'kg', label: 'kg' },
              { value: 'lb', label: 'lb' },
            ]}
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted">{t('settings.appearanceSection.heightUnit')}</div>
          <SegmentedControl
            label={t('settings.appearanceSection.heightUnit')}
            value={settings.units.height}
            onChange={(height) => setUnits({ height })}
            options={[
              { value: 'cm', label: 'cm' },
              { value: 'in', label: 'in' },
            ]}
          />
        </div>
      </Card>
      <Card className="flex flex-col gap-1">
        <div className="flex min-h-[48px] items-center justify-between gap-3">
          <span className="text-sm">{t('settings.appearanceSection.reducedMotion')}</span>
          <Switch
            label={t('settings.appearanceSection.reducedMotion')}
            checked={settings.reducedMotion ?? false}
            onChange={(reducedMotion) => store.updateSettings({ reducedMotion })}
          />
        </div>
        <div className="flex min-h-[48px] items-center justify-between gap-3">
          <span className="text-sm">{t('settings.appearanceSection.showPredictions')}</span>
          <Switch
            label={t('settings.appearanceSection.showPredictions')}
            checked={settings.showPredictions}
            onChange={(showPredictions) => store.updateSettings({ showPredictions })}
          />
        </div>
      </Card>
    </div>
  );
}
