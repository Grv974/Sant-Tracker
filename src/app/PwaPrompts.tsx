import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/Button';

/** Flux de mise à jour PWA (§13.5) : proposer, jamais imposer ; skipWaiting sur action. */
export function PwaUpdatePrompt() {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;
  return (
    <div role="status" className="fixed inset-x-4 top-4 z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-lg bg-surface p-3 shadow-lifted">
      <span className="text-sm">{t('pwa.updateAvailable')}</span>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => setNeedRefresh(false)}>
          {t('common.close')}
        </Button>
        <Button size="sm" onClick={() => void updateServiceWorker(true)}>
          {t('pwa.update')}
        </Button>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

/** Invitation d'installation discrète, jamais intrusive (§13.5). */
export function PwaInstallHint() {
  const { t } = useI18n();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('lunative:install-dismissed') === '1');

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferred || dismissed) return null;
  return (
    <div className="card mx-auto mb-4 flex max-w-content items-center justify-between gap-3">
      <p className="text-sm text-muted">{t('pwa.installHint')}</p>
      <div className="flex shrink-0 gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setDismissed(true);
            sessionStorage.setItem('lunative:install-dismissed', '1');
          }}
        >
          {t('common.close')}
        </Button>
        <Button size="sm" onClick={() => void deferred.prompt()}>
          {t('pwa.install')}
        </Button>
      </div>
    </div>
  );
}
