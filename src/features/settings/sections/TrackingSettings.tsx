import { useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CustomSymptom } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card, CardTitle } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Field, Select } from '@/components/ui/misc';
import { applyTrackingPreset, TRACKING_CATEGORIES, TRACKING_PRESETS } from '@/data/defaults';
import { uuid } from '@/utils/uuid';

export function TrackingSettings() {
  const { t } = useI18n();
  const data = useAppStore((s) => s.data);
  const store = useAppStore();
  const [draft, setDraft] = useState<{ name: string; inputType: CustomSymptom['inputType']; options: string; icon: string }>({
    name: '',
    inputType: 'boolean',
    options: '',
    icon: '',
  });
  if (!data) return null;
  const tracked = data.settings.trackedCategories;
  const ordered = [...TRACKING_CATEGORIES].sort((a, b) => (tracked[a]?.order ?? 0) - (tracked[b]?.order ?? 0));

  const setCategory = (cat: string, patch: Partial<{ active: boolean; order: number }>) =>
    store.updateSettings({ trackedCategories: { ...tracked, [cat]: { active: true, order: 0, ...tracked[cat], ...patch } } });

  const move = (cat: string, dir: -1 | 1) => {
    const index = ordered.indexOf(cat as (typeof ordered)[number]);
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target] as string, next[index] as string] as [
      (typeof ordered)[number],
      (typeof ordered)[number],
    ];
    const updated = { ...tracked };
    next.forEach((c, i) => {
      updated[c] = { active: tracked[c]?.active ?? false, order: i };
    });
    store.updateSettings({ trackedCategories: updated });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">{t('settings.trackingSection.hint')}</p>

      <Card>
        <CardTitle>{t('settings.trackingSection.presets')}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TRACKING_PRESETS).map((preset) => (
            <Button
              key={preset}
              variant="secondary"
              size="sm"
              onClick={() => store.updateSettings({ trackedCategories: applyTrackingPreset(tracked, preset) })}
            >
              {t(`settings.trackingSection.presetNames.${preset}`)}
            </Button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col">
        {ordered.map((cat) => {
          const label = t(`settings.trackingSection.categories.${cat}`);
          return (
            <div key={cat} className="flex min-h-[52px] items-center justify-between gap-2 border-b border-surface-2 py-1 last:border-0">
              <span className="text-sm">{label}</span>
              <div className="flex items-center gap-0.5">
                <Button variant="icon" aria-label={`${t('settings.trackingSection.moveUp')} ${label}`} onClick={() => move(cat, -1)}>
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </Button>
                <Button variant="icon" aria-label={`${t('settings.trackingSection.moveDown')} ${label}`} onClick={() => move(cat, 1)}>
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </Button>
                <Switch label={label} checked={tracked[cat]?.active ?? false} onChange={(active) => setCategory(cat, { active })} />
              </div>
            </div>
          );
        })}
      </Card>

      {/* Symptômes personnalisés (§3.3.16) */}
      <Card className="flex flex-col gap-3">
        <CardTitle>{t('settings.trackingSection.customSymptoms')}</CardTitle>
        {data.customSymptoms
          .sort((a, b) => a.order - b.order)
          .map((symptom) => (
            <div key={symptom.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface-2/60 px-3 py-2">
              <span className="text-sm">
                {symptom.icon && <span aria-hidden className="mr-1">{symptom.icon}</span>}
                {symptom.name}
                <span className="ml-2 text-xs text-muted">{t(`settings.trackingSection.symptomTypes.${symptom.inputType}`)}</span>
              </span>
              <div className="flex items-center gap-1">
                <Switch label={symptom.name} checked={symptom.active} onChange={(active) => store.updateCustomSymptom(symptom.id, { active })} />
                <Button variant="icon" aria-label={`${t('common.delete')} ${symptom.name}`} onClick={() => store.removeCustomSymptom(symptom.id)}>
                  ✕
                </Button>
              </div>
            </div>
          ))}
        <form
          className="flex flex-col gap-3 rounded-lg border border-dashed border-muted/30 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) return;
            store.addCustomSymptom({
              id: uuid(),
              name: draft.name.trim(),
              inputType: draft.inputType,
              options: draft.inputType === 'multi' ? draft.options.split(',').map((o) => o.trim()).filter(Boolean) : undefined,
              icon: draft.icon || undefined,
              active: true,
              order: data.customSymptoms.length,
            });
            setDraft({ name: '', inputType: 'boolean', options: '', icon: '' });
          }}
        >
          <div className="text-sm font-medium">{t('settings.trackingSection.newSymptom')}</div>
          <div className="flex gap-2">
            <Field
              label={t('settings.trackingSection.symptomName')}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="flex-1"
            />
            <Field label="Emoji" value={draft.icon} maxLength={4} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} className="w-20" />
          </div>
          <Select
            label={t('settings.trackingSection.symptomType')}
            value={draft.inputType}
            onChange={(e) => setDraft({ ...draft, inputType: e.target.value as CustomSymptom['inputType'] })}
          >
            {(['boolean', 'scale', 'multi', 'text'] as const).map((type) => (
              <option key={type} value={type}>
                {t(`settings.trackingSection.symptomTypes.${type}`)}
              </option>
            ))}
          </Select>
          {draft.inputType === 'multi' && (
            <Field
              label={t('settings.trackingSection.symptomOptions')}
              value={draft.options}
              onChange={(e) => setDraft({ ...draft, options: e.target.value })}
            />
          )}
          <Button type="submit" disabled={!draft.name.trim()}>
            {t('common.add')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
