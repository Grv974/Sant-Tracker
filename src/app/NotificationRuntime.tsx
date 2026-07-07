import { useEffect, useMemo, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { useDerived } from '@/hooks/useDerived';
import { useI18n } from '@/i18n';
import {
  acknowledgeReminder,
  computeUpcomingNotifications,
  pendingInAppReminders,
  scheduleSessionNotifications,
} from '@/notifications/scheduler';
import type { ScheduledNotification } from '@/types/models';

/**
 * Runtime des notifications (annexe D) : à chaque ouverture / recalcul,
 * replanifie les échéances des 72 h et affiche les bannières in-app en filet.
 */
export function NotificationRuntime() {
  const state = useDerived();
  const i18n = useI18n();
  const [banners, setBanners] = useState<ScheduledNotification[]>([]);
  // Dépendances par référence stable (data / derived sont mémoïsés) — jamais l'objet wrapper.
  const data = state?.data ?? null;
  const derived = state?.derived ?? null;

  const upcoming = useMemo(
    () => (data && derived ? computeUpcomingNotifications(data, derived, i18n) : []),
    [data, derived, i18n],
  );

  useEffect(() => {
    scheduleSessionNotifications(upcoming);
    setBanners((prev) => {
      const next = pendingInAppReminders(upcoming);
      return prev.length === next.length && prev.every((p, i) => p.id === next[i]?.id) ? prev : next;
    });
  }, [upcoming]);

  if (banners.length === 0) return null;
  return (
    <div className="mx-auto flex max-w-content flex-col gap-2 px-4 pt-4">
      {banners.map((banner) => (
        <div key={banner.id} role="status" className="flex items-center gap-3 rounded-lg bg-secondary/10 px-4 py-2.5 text-sm">
          <BellRing className="h-4 w-4 shrink-0 text-secondary" aria-hidden />
          <div className="min-w-0">
            <span className="font-medium">{banner.title}</span>
            <span className="text-muted"> — {banner.body}</span>
          </div>
          <button
            type="button"
            aria-label={i18n.t('common.close')}
            className="tap-target ml-auto shrink-0 rounded-full text-muted hover:text-ink"
            onClick={() => {
              acknowledgeReminder(banner.id);
              setBanners((prev) => prev.filter((b) => b.id !== banner.id));
            }}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
