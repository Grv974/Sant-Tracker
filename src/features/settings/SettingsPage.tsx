import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  BookOpenText,
  Database,
  Info,
  Bell,
  Palette,
  ShieldCheck,
  Target,
  User,
  ListChecks,
  ChevronLeft,
} from 'lucide-react';
import { useI18n } from '@/i18n';
import { SettingsRow } from '@/components/ui/misc';
import { Button } from '@/components/ui/Button';
import { ProfileSettings } from './sections/ProfileSettings';
import { GoalSettings } from './sections/GoalSettings';
import { TrackingSettings } from './sections/TrackingSettings';
import { NotificationsSettings } from './sections/NotificationsSettings';
import { AppearanceSettings } from './sections/AppearanceSettings';
import { DataSettings } from './sections/DataSettings';
import { PrivacySettings } from './sections/PrivacySettings';
import { SourcesSettings } from './sections/SourcesSettings';
import { AboutSettings } from './sections/AboutSettings';

const SECTIONS = [
  { path: 'profile', icon: User, key: 'settings.profile', element: <ProfileSettings /> },
  { path: 'goal', icon: Target, key: 'settings.goal', element: <GoalSettings /> },
  { path: 'tracking', icon: ListChecks, key: 'settings.tracking', element: <TrackingSettings /> },
  { path: 'notifications', icon: Bell, key: 'settings.notifications', element: <NotificationsSettings /> },
  { path: 'appearance', icon: Palette, key: 'settings.appearance', element: <AppearanceSettings /> },
  { path: 'data', icon: Database, key: 'settings.data', element: <DataSettings /> },
  { path: 'privacy', icon: ShieldCheck, key: 'settings.privacy', element: <PrivacySettings /> },
  { path: 'sources', icon: BookOpenText, key: 'settings.sources', element: <SourcesSettings /> },
  { path: 'about', icon: Info, key: 'settings.about', element: <AboutSettings /> },
] as const;

export default function SettingsPage() {
  return (
    <Routes>
      <Route index element={<SettingsMenu />} />
      {SECTIONS.map((section) => (
        <Route
          key={section.path}
          path={section.path}
          element={<SectionShell titleKey={section.key}>{section.element}</SectionShell>}
        />
      ))}
    </Routes>
  );
}

function SettingsMenu() {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-2 p-4">
      <h1 className="mb-2 font-display text-xl font-bold">{t('settings.title')}</h1>
      <div className="card flex flex-col divide-y divide-surface-2 p-1.5">
        {SECTIONS.map((section) => (
          <SettingsRow
            key={section.path}
            icon={<section.icon className="h-5 w-5" aria-hidden />}
            label={t(section.key)}
            onClick={() => navigate(section.path)}
          />
        ))}
      </div>
    </div>
  );
}

export function SectionShell({ titleKey, children }: { titleKey: string; children: React.ReactNode }) {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Button variant="icon" aria-label={t('common.back')} onClick={() => navigate('/settings')}>
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </Button>
        <h1 className="font-display text-xl font-bold">{t(titleKey)}</h1>
      </div>
      {children}
    </div>
  );
}
