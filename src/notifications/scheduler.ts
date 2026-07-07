import type { AppData, ISODate, ScheduledNotification } from '@/types/models';
import type { DerivedState } from '@/store/derived';
import { addDays, diffDays, todayISO } from '@/domain/dates';
import type { I18n } from '@/i18n';

/**
 * Moteur de notifications locales (§8, annexe D) :
 * - calcule les échéances des 72 prochaines heures (pur, testable) ;
 * - ids déterministes type+date (idempotence) ;
 * - respecte quietHours ;
 * - programmation par setTimeout (limitée à la session) + bannières in-app en filet.
 */

const HORIZON_HOURS = 72;
const FIRED_KEY = 'lunative:notified';

function atTime(date: ISODate, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const [y, mo, d] = date.split('-').map(Number);
  return new Date(y as number, (mo as number) - 1, d as number, h ?? 9, m ?? 0);
}

function inQuietHours(fireAt: Date, quiet?: { start: string; end: string }): boolean {
  if (!quiet) return false;
  const minutes = fireAt.getHours() * 60 + fireAt.getMinutes();
  const [sh, sm] = quiet.start.split(':').map(Number);
  const [eh, em] = quiet.end.split(':').map(Number);
  const start = (sh ?? 22) * 60 + (sm ?? 0);
  const end = (eh ?? 7) * 60 + (em ?? 0);
  // plage chevauchant minuit (ex. 22:00 → 07:00)
  return start > end ? minutes >= start || minutes < end : minutes >= start && minutes < end;
}

/** Calcule les notifications des 72 h à venir (pur ; `now` injecté pour les tests). */
export function computeUpcomingNotifications(
  data: AppData,
  derived: DerivedState,
  i18n: Pick<I18n, 't'>,
  now: Date = new Date(),
): ScheduledNotification[] {
  const settings = data.settings.notifications;
  if (!settings.enabled) return [];
  const out: ScheduledNotification[] = [];
  const horizon = new Date(now.getTime() + HORIZON_HOURS * 3_600_000);
  const today = todayISO(now);

  const push = (type: string, date: ISODate, time: string, title: string, body: string) => {
    const fireAt = atTime(date, time);
    if (fireAt <= now || fireAt > horizon) return;
    if (inQuietHours(fireAt, settings.quietHours)) return;
    out.push({ id: `${type}:${date}`, type, fireAt: fireAt.toISOString(), title, body });
  };

  const p = derived.prediction;
  if (p) {
    if (settings.periodUpcoming.on) {
      const target = addDays(p.expectedStartDate, -settings.periodUpcoming.daysBefore);
      push(
        'periodUpcoming',
        target,
        '09:00',
        i18n.t('notifications.periodUpcoming.title'),
        i18n.t('notifications.periodUpcoming.body', { days: settings.periodUpcoming.daysBefore }),
      );
    }
    if (settings.periodToday.on) {
      push('periodToday', p.expectedStartDate, '09:00', i18n.t('notifications.periodToday.title'), i18n.t('notifications.periodToday.body'));
    }
    if (settings.periodLate.on) {
      const lateDate = addDays(p.rangeEnd, settings.periodLate.daysAfter);
      const lastStart = derived.cycles.at(-1)?.startDate;
      // uniquement si les règles n'ont pas déjà commencé depuis la prévision
      if (lastStart && diffDays(lateDate, lastStart) > 0 && lateDate >= today) {
        push('periodLate', lateDate, '10:00', i18n.t('notifications.periodLate.title'), i18n.t('notifications.periodLate.body'));
      }
    }
  }
  if (settings.fertileWindow.on && derived.ovulation) {
    push(
      'fertileWindow',
      derived.ovulation.fertileWindowStart,
      '09:00',
      i18n.t('notifications.fertileWindow.title'),
      i18n.t('notifications.fertileWindow.body'),
    );
  }

  // Rappels quotidiens sur l'horizon de 72 h
  for (let i = 0; i < 3; i++) {
    const date = addDays(today, i);
    if (settings.pill.on && settings.pill.time) {
      push('pill', date, settings.pill.time, i18n.t('notifications.pill.title'), i18n.t('notifications.pill.body'));
    }
    if (settings.bbt.on && settings.bbt.time) {
      push('bbt', date, settings.bbt.time, i18n.t('notifications.bbt.title'), i18n.t('notifications.bbt.body'));
    }
    if (settings.journal.on && settings.journal.time) {
      // seulement si rien n'est saisi ce jour-là (§8.2)
      if (!data.dailyEntries[date] || date > today) {
        push('journal', date, settings.journal.time, i18n.t('notifications.journal.title'), i18n.t('notifications.journal.body'));
      }
    }
    if (settings.hydration.on) {
      for (const time of settings.hydration.times ?? []) {
        push(`hydration@${time}`, date, time, i18n.t('notifications.hydration.title'), i18n.t('notifications.hydration.body'));
      }
    }
    if (settings.sport.on && settings.sport.time) {
      const weekday = atTime(date, '12:00').toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
      const days = settings.sport.days ?? [];
      if (days.length === 0 || days.includes(weekday)) {
        push('sport', date, settings.sport.time, i18n.t('notifications.sport.title'), i18n.t('notifications.sport.body'));
      }
    }
  }

  return out.sort((a, b) => a.fireAt.localeCompare(b.fireAt));
}

/* ---------- Partie runtime (effets navigateur) ---------- */

function firedSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(FIRED_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

function markFired(id: string): void {
  try {
    const set = firedSet();
    set.add(id);
    const arr = [...set].slice(-200); // borne mémoire
    localStorage.setItem(FIRED_KEY, JSON.stringify(arr));
  } catch {
    /* stockage indisponible */
  }
}

export function hasFired(id: string): boolean {
  return firedSet().has(id);
}

/** Demande la permission uniquement sur action utilisateur (§8.1). */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

let timers: ReturnType<typeof setTimeout>[] = [];

/** (Re)programme les notifications de la session ; annule les précédentes (pas de doublons). */
export function scheduleSessionNotifications(notifications: ScheduledNotification[]): void {
  timers.forEach(clearTimeout);
  timers = [];
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const now = Date.now();
  for (const n of notifications) {
    if (hasFired(n.id)) continue;
    const delay = new Date(n.fireAt).getTime() - now;
    if (delay <= 0) continue;
    timers.push(
      setTimeout(() => {
        try {
          new Notification(n.title, { body: n.body, tag: n.id, icon: `${import.meta.env.BASE_URL}icons/icon-192.png` });
          markFired(n.id);
        } catch {
          /* la bannière in-app reste le filet de sécurité */
        }
      }, delay),
    );
  }
}

/** Bannières in-app (filet de sécurité, §8.4) : échéances passées non déclenchées. */
export function pendingInAppReminders(
  notifications: ScheduledNotification[],
  now: Date = new Date(),
): ScheduledNotification[] {
  return notifications.filter((n) => new Date(n.fireAt) <= now && !hasFired(n.id));
}

export function acknowledgeReminder(id: string): void {
  markFired(id);
}
