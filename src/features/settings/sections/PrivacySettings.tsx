import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/misc';
import { hashPin, makeSalt } from '@/features/lock/AppLock';

export function PrivacySettings() {
  const { t } = useI18n();
  const data = useAppStore((s) => s.data);
  const store = useAppStore();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  if (!data) return null;
  const lockEnabled = data.settings.security.appLock;

  const setPinCode = async () => {
    if (pin.length < 4 || pin !== confirm) {
      setError(t('settings.privacySection.pinMismatch'));
      return;
    }
    const salt = makeSalt();
    const hash = await hashPin(pin, salt);
    store.updateSettings({ security: { appLock: true, pinHash: hash, pinSalt: salt } });
    setPin('');
    setConfirm('');
    setError(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-2">
        <CardTitle>{t('settings.privacySection.title')}</CardTitle>
        <p className="text-sm leading-relaxed">{t('settings.privacySection.body1')}</p>
        <p className="text-sm leading-relaxed text-muted">{t('settings.privacySection.body2')}</p>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>{t('settings.privacySection.appLock')}</CardTitle>
        <p className="text-xs text-muted">{t('settings.privacySection.appLockHint')}</p>
        {lockEnabled ? (
          <Button
            variant="secondary"
            className="self-start"
            onClick={() => store.updateSettings({ security: { appLock: false } })}
          >
            {t('settings.privacySection.pinRemove')}
          </Button>
        ) : (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              void setPinCode();
            }}
          >
            <Field
              label={t('settings.privacySection.pinSet')}
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoComplete="new-password"
            />
            <Field
              label={t('settings.privacySection.pinConfirm')}
              type="password"
              inputMode="numeric"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={error ?? undefined}
              autoComplete="new-password"
            />
            <Button type="submit" className="self-start" disabled={pin.length < 4}>
              {t('settings.privacySection.pinSet')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
