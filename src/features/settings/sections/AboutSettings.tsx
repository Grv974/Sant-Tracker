import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { APP_VERSION } from '@/constants/app';
import { Card, CardTitle } from '@/components/ui/Card';

export function AboutSettings() {
  const { t, dict } = useI18n();
  const consent = useAppStore((s) => s.data?.consent);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>{t('settings.aboutSection.title')}</CardTitle>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
          {dict.settings.aboutSection.limits.map((limit, i) => (
            <li key={i}>{limit}</li>
          ))}
        </ul>
      </Card>
      <Card className="text-sm text-muted">
        <p>{t('settings.aboutSection.version', { version: APP_VERSION })}</p>
        {consent?.acceptedAt && (
          <p>{t('settings.aboutSection.consentGiven', { date: new Date(consent.acceptedAt).toLocaleDateString() })}</p>
        )}
        <p className="mt-2 font-medium text-ink">{t('disclaimer.short')}</p>
      </Card>
    </div>
  );
}
