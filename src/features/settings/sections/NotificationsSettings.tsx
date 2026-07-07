import { useState } from 'react';
import type { NotificationSettings as NotifSettings } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Switch';
import { Field } from '@/components/ui/misc';
import { requestNotificationPermission } from '@/notifications/scheduler';

export function NotificationsSettings() {
  const { t } = useI18n();
  const data = useAppStore((s) => s.data);
  const store = useAppStore();
  const [permissionDenied, setPermissionDenied] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'denied',
  );
  if (!data) return null;
  const n = data.settings.notifications;
  const set = (patch: Partial<NotifSettings>) => store.updateSettings({ notifications: { ...n, ...patch } });

  /** Permission demandée au moment d'activer un premier rappel, jamais avant (§8.1). */
  const enable = async (on: boolean) => {
    if (on) {
      const permission = await requestNotificationPermission();
      setPermissionDenied(permission === 'denied');
    }
    set({ enabled: on });
  };

  const isPill = data.profile.contraception === 'combined_pill' || data.profile.contraception === 'progestin_pill';

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2">
        <div className="flex min-h-[48px] items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">{t('settings.notificationsSection.enable')}</div>
            <div className="text-xs text-muted">{t('settings.notificationsSection.permissionNote')}</div>
          </div>
          <Switch label={t('settings.notificationsSection.enable')} checked={n.enabled} onChange={(v) => void enable(v)} />
        </div>
        {permissionDenied && n.enabled && (
          <p role="alert" className="rounded-lg bg-warning/10 p-3 text-sm text-warning">
            {t('settings.notificationsSection.permissionDenied')}
          </p>
        )}
        <p className="text-xs text-muted">{t('settings.notificationsSection.inAppNote')}</p>
      </Card>

      <Card className="flex flex-col gap-1">
        <ToggleRow
          label={t('settings.notificationsSection.periodUpcoming')}
          checked={n.periodUpcoming.on}
          onChange={(on) => set({ periodUpcoming: { ...n.periodUpcoming, on } })}
          detail={
            n.periodUpcoming.on && (
              <Field
                label={t('settings.notificationsSection.daysBefore')}
                type="number"
                min={0}
                max={7}
                value={n.periodUpcoming.daysBefore}
                onChange={(e) => set({ periodUpcoming: { ...n.periodUpcoming, daysBefore: Number(e.target.value) } })}
                className="w-32"
              />
            )
          }
        />
        <ToggleRow
          label={t('settings.notificationsSection.periodToday')}
          checked={n.periodToday.on}
          onChange={(on) => set({ periodToday: { on } })}
        />
        <ToggleRow
          label={t('settings.notificationsSection.periodLate')}
          checked={n.periodLate.on}
          onChange={(on) => set({ periodLate: { ...n.periodLate, on } })}
          detail={
            n.periodLate.on && (
              <Field
                label={t('settings.notificationsSection.daysAfter')}
                type="number"
                min={1}
                max={14}
                value={n.periodLate.daysAfter}
                onChange={(e) => set({ periodLate: { ...n.periodLate, daysAfter: Number(e.target.value) } })}
                className="w-32"
              />
            )
          }
        />
        {data.profile.primaryGoal === 'conceive' && (
          <ToggleRow
            label={t('settings.notificationsSection.fertileWindow')}
            checked={n.fertileWindow.on}
            onChange={(on) => set({ fertileWindow: { on } })}
          />
        )}
        {isPill && (
          <ToggleRow
            label={t('settings.notificationsSection.pill')}
            checked={n.pill.on}
            onChange={(on) => set({ pill: { ...n.pill, on, time: n.pill.time ?? '20:00' } })}
            detail={
              n.pill.on && (
                <Field
                  label={t('settings.notificationsSection.time')}
                  type="time"
                  value={n.pill.time ?? '20:00'}
                  onChange={(e) => set({ pill: { ...n.pill, time: e.target.value } })}
                  className="w-32"
                />
              )
            }
          />
        )}
        <ToggleRow
          label={t('settings.notificationsSection.journal')}
          checked={n.journal.on}
          onChange={(on) => set({ journal: { ...n.journal, on, time: n.journal.time ?? '20:00' } })}
          detail={
            n.journal.on && (
              <Field
                label={t('settings.notificationsSection.time')}
                type="time"
                value={n.journal.time ?? '20:00'}
                onChange={(e) => set({ journal: { ...n.journal, time: e.target.value } })}
                className="w-32"
              />
            )
          }
        />
        <ToggleRow
          label={t('settings.notificationsSection.bbtReminder')}
          checked={n.bbt.on}
          onChange={(on) => set({ bbt: { ...n.bbt, on, time: n.bbt.time ?? '07:00' } })}
          detail={
            n.bbt.on && (
              <Field
                label={t('settings.notificationsSection.time')}
                type="time"
                value={n.bbt.time ?? '07:00'}
                onChange={(e) => set({ bbt: { ...n.bbt, time: e.target.value } })}
                className="w-32"
              />
            )
          }
        />
        <ToggleRow
          label={t('settings.notificationsSection.hydration')}
          checked={n.hydration.on}
          onChange={(on) => set({ hydration: { ...n.hydration, on, times: n.hydration.times ?? ['10:00', '15:00'] } })}
          detail={
            n.hydration.on && (
              <Field
                label={`${t('settings.notificationsSection.time')} (10:00, 15:00…)`}
                value={(n.hydration.times ?? []).join(', ')}
                onChange={(e) =>
                  set({ hydration: { ...n.hydration, times: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) } })
                }
              />
            )
          }
        />
        <ToggleRow
          label={t('settings.notificationsSection.sport')}
          checked={n.sport.on}
          onChange={(on) => set({ sport: { ...n.sport, on, time: n.sport.time ?? '18:00' } })}
          detail={
            n.sport.on && (
              <Field
                label={t('settings.notificationsSection.time')}
                type="time"
                value={n.sport.time ?? '18:00'}
                onChange={(e) => set({ sport: { ...n.sport, time: e.target.value } })}
                className="w-32"
              />
            )
          }
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <div className="text-sm font-medium">{t('settings.notificationsSection.quietHours')}</div>
        <div className="flex gap-3">
          <Field
            label={t('settings.notificationsSection.quietStart')}
            type="time"
            value={n.quietHours?.start ?? '22:00'}
            onChange={(e) => set({ quietHours: { start: e.target.value, end: n.quietHours?.end ?? '07:00' } })}
            className="flex-1"
          />
          <Field
            label={t('settings.notificationsSection.quietEnd')}
            type="time"
            value={n.quietHours?.end ?? '07:00'}
            onChange={(e) => set({ quietHours: { start: n.quietHours?.start ?? '22:00', end: e.target.value } })}
            className="flex-1"
          />
        </div>
      </Card>
    </div>
  );
}

function ToggleRow({ label, checked, onChange, detail }: { label: string; checked: boolean; onChange: (v: boolean) => void; detail?: React.ReactNode }) {
  return (
    <div className="flex flex-col border-b border-surface-2 py-1 last:border-0">
      <div className="flex min-h-[48px] items-center justify-between gap-3">
        <span className="text-sm">{label}</span>
        <Switch label={label} checked={checked} onChange={onChange} />
      </div>
      {detail && <div className="pb-2">{detail}</div>}
    </div>
  );
}
