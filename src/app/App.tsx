import { Suspense, lazy, useEffect, useMemo } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { I18nProvider } from '@/i18n';
import { useTheme } from '@/hooks/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { AppLockGate } from '@/features/lock/AppLock';
import { BottomNav, SideNav } from '@/components/Nav';
import { PwaInstallHint, PwaUpdatePrompt } from './PwaPrompts';
import { NotificationRuntime } from './NotificationRuntime';

const Dashboard = lazy(() => import('@/features/dashboard/DashboardPage'));
const Journal = lazy(() => import('@/features/journal/JournalPage'));
const Calendar = lazy(() => import('@/features/calendar/CalendarPage'));
const Analytics = lazy(() => import('@/features/analytics/AnalyticsPage'));
const Settings = lazy(() => import('@/features/settings/SettingsPage'));
const Onboarding = lazy(() => import('@/features/onboarding/OnboardingPage'));

function PageFallback() {
  return (
    <div className="mx-auto flex max-w-content flex-col gap-4 p-4" aria-busy="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card h-32 animate-pulse bg-surface-2/60" />
      ))}
    </div>
  );
}

function Shell() {
  const consented = useAppStore((s) => s.data?.consent.acceptedDisclaimer ?? false);
  const location = useLocation();

  if (!consented && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  if (consented && location.pathname === '/onboarding') {
    return <Navigate to="/" replace />;
  }

  const isOnboarding = location.pathname === '/onboarding';
  return (
    <div className="flex min-h-dvh">
      {!isOnboarding && <SideNav />}
      <main className={isOnboarding ? 'w-full' : 'w-full pb-24 lg:pb-6'}>
        {!isOnboarding && (
          <div className="mx-auto max-w-content px-4 pt-4">
            <PwaInstallHint />
          </div>
        )}
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/log/:date?" element={<Journal />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings/*" element={<Settings />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      {!isOnboarding && <BottomNav />}
    </div>
  );
}

function Providers() {
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);
  const flushNow = useAppStore((s) => s.flushNow);
  const locale = useAppStore((s) => s.data?.settings.locale ?? 'fr');
  useTheme();
  const reduced = useReducedMotion();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Filet de sécurité : flush de l'autosave quand l'app passe en arrière-plan.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') void flushNow();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [flushNow]);

  const basename = useMemo(() => import.meta.env.BASE_URL.replace(/\/$/, ''), []);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg" aria-busy="true">
        <div className="h-10 w-10 animate-pulse rounded-full bg-primary/40" />
      </div>
    );
  }

  return (
    <I18nProvider locale={locale}>
      <MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
        <ToastProvider>
          <AppLockGate>
            <BrowserRouter basename={basename}>
              <PwaUpdatePrompt />
              <NotificationRuntime />
              <Shell />
            </BrowserRouter>
          </AppLockGate>
        </ToastProvider>
      </MotionConfig>
    </I18nProvider>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Providers />
    </ErrorBoundary>
  );
}
