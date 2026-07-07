import { useI18n } from '@/i18n';
import { SOURCES } from '@/content/sources';
import { Card } from '@/components/ui/Card';

export function SourcesSettings() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">{t('settings.sourcesSection.intro')}</p>
      <Card className="flex flex-col divide-y divide-surface-2">
        {SOURCES.map((source) => (
          <div key={source.id} className="py-3 first:pt-0 last:pb-0">
            <div className="text-sm font-semibold">{source.org}</div>
            <div className="text-sm text-muted">{source.label}</div>
            {/* Lien affiché mais jamais préchargé : aucune requête réseau applicative (§15). */}
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-strong underline dark:text-primary"
            >
              {source.url}
            </a>
          </div>
        ))}
      </Card>
    </div>
  );
}
