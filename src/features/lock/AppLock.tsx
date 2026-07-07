import { useState, type ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { Button } from '@/components/ui/Button';

/** Hachage PIN : SHA-256(salt + pin) — protège l'ouverture, ne chiffre pas IndexedDB (§15.2). */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function makeSalt(): string {
  return [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Verrouillage optionnel (§15.2) : PIN requis avant tout affichage de données (§17.J). */
export function AppLockGate({ children }: { children: ReactNode }) {
  const security = useAppStore((s) => s.data?.settings.security);
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const { t } = useI18n();

  if (!security?.appLock || !security.pinHash || !security.pinSalt || unlocked) {
    return <>{children}</>;
  }

  const tryUnlock = async () => {
    const hash = await hashPin(pin, security.pinSalt as string);
    if (hash === security.pinHash) {
      setUnlocked(true);
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-bg p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Lock className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="font-display text-xl font-bold">{t('lock.title')}</h1>
      <form
        className="flex w-full max-w-xs flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void tryUnlock();
        }}
      >
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          aria-label={t('settings.privacySection.pinEnter')}
          aria-invalid={error || undefined}
          className="min-h-[48px] rounded-lg border border-muted/30 bg-surface px-4 text-center text-lg tracking-[0.4em] outline-none focus:border-primary"
        />
        {error && (
          <p role="alert" className="text-center text-sm font-medium text-period">
            {t('settings.privacySection.pinWrong')}
          </p>
        )}
        <Button type="submit" disabled={pin.length < 4}>
          {t('lock.unlock')}
        </Button>
      </form>
    </div>
  );
}
