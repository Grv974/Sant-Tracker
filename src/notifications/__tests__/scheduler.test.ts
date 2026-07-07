import { describe, expect, it } from 'vitest';
import { computeUpcomingNotifications, pendingInAppReminders } from '../scheduler';
import { makeAppData, makePeriodEntries, regularStarts } from '@/tests/fixtures';
import { computeDerived } from '@/store/derived';
import { interpolate } from '@/i18n';
import type { AppData } from '@/types/models';

const i18n = { t: (key: string, vars?: Record<string, string | number>) => interpolate(key, vars) };

function setup(overrides?: (d: AppData) => void) {
  // cycles réguliers de 28 j depuis le 01/01, dernier début le 20/05 → prochaines règles ~17/06
  const starts = [...regularStarts('2025-01-01', 28, 5), '2025-05-21'];
  const data = makeAppData({ dailyEntries: makePeriodEntries(starts) });
  data.settings.notifications.enabled = true;
  data.settings.notifications.quietHours = { start: '22:00', end: '07:00' };
  overrides?.(data);
  const now = new Date(2025, 5, 15, 8, 0); // 15/06 08:00 → prévu 18/06, J-2 ≈ 16/06
  const derived = computeDerived(data, '2025-06-15');
  return { data, derived, now };
}

describe('ordonnanceur de notifications (§8, annexe D)', () => {
  it('désactivé → aucune notification', () => {
    const { data, derived, now } = setup((d) => {
      d.settings.notifications.enabled = false;
    });
    expect(computeUpcomingNotifications(data, derived, i18n, now)).toEqual([]);
  });

  it('règles imminentes : J−2 à 09:00, id déterministe (idempotence)', () => {
    const { data, derived, now } = setup();
    const a = computeUpcomingNotifications(data, derived, i18n, now);
    const b = computeUpcomingNotifications(data, derived, i18n, now);
    const upcoming = a.find((n) => n.type === 'periodUpcoming');
    expect(upcoming).toBeDefined();
    expect(upcoming!.id).toMatch(/^periodUpcoming:\d{4}-\d{2}-\d{2}$/);
    expect(a.map((n) => n.id)).toEqual(b.map((n) => n.id));
  });

  it('respecte quietHours : rien entre 22:00 et 07:00 (§17.J)', () => {
    const { data, derived, now } = setup((d) => {
      d.settings.notifications.pill = { on: true, time: '23:00' };
      d.settings.notifications.bbt = { on: true, time: '06:30' };
      d.settings.notifications.journal = { on: true, time: '20:30' };
    });
    const out = computeUpcomingNotifications(data, derived, i18n, now);
    expect(out.some((n) => n.type === 'pill')).toBe(false);
    expect(out.some((n) => n.type === 'bbt')).toBe(false);
    expect(out.some((n) => n.type === 'journal')).toBe(true);
  });

  it('horizon 72 h : pas d’échéance au-delà', () => {
    const { data, derived, now } = setup((d) => {
      d.settings.notifications.journal = { on: true, time: '20:00' };
    });
    const out = computeUpcomingNotifications(data, derived, i18n, now);
    const horizon = now.getTime() + 72 * 3_600_000;
    expect(out.every((n) => new Date(n.fireAt).getTime() <= horizon)).toBe(true);
    expect(out.every((n) => new Date(n.fireAt).getTime() > now.getTime())).toBe(true);
  });

  it('rappel journal : seulement si rien n’est saisi ce jour-là', () => {
    const { data, derived, now } = setup((d) => {
      d.settings.notifications.journal = { on: true, time: '20:00' };
      d.dailyEntries['2025-06-15'] = {
        date: '2025-06-15',
        energy: 3,
        createdAt: '2025-06-15T08:00:00.000Z',
        updatedAt: '2025-06-15T08:00:00.000Z',
      };
    });
    const out = computeUpcomingNotifications(data, derived, i18n, now);
    expect(out.some((n) => n.id === 'journal:2025-06-15')).toBe(false);
    expect(out.some((n) => n.id === 'journal:2025-06-16')).toBe(true);
  });

  it('bannières in-app : échéances passées non déclenchées', () => {
    const list = [
      { id: 'a:2025-06-15', type: 'a', fireAt: new Date(2025, 5, 15, 7, 0).toISOString(), title: 't', body: 'b' },
      { id: 'b:2025-06-15', type: 'b', fireAt: new Date(2025, 5, 15, 9, 0).toISOString(), title: 't', body: 'b' },
    ];
    const pending = pendingInAppReminders(list, new Date(2025, 5, 15, 8, 0));
    expect(pending.map((n) => n.id)).toEqual(['a:2025-06-15']);
  });
});
