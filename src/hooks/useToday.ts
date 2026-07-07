import { useEffect, useState } from 'react';
import { todayISO } from '@/domain/dates';
import type { ISODate } from '@/types/models';

/** Date civile du jour, rafraîchie au passage de minuit et au retour au premier plan. */
export function useToday(): ISODate {
  const [today, setToday] = useState<ISODate>(() => todayISO());
  useEffect(() => {
    const check = () => setToday((prev) => (prev === todayISO() ? prev : todayISO()));
    const interval = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);
  return today;
}
