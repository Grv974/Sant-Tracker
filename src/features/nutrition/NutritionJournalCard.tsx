import { useMemo, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { DailyEntry, ISODate } from '@/types/models';
import { useAppStore } from '@/store/appStore';
import { useI18n } from '@/i18n';
import { FOODS } from '@/content/nutrition/foods.generated';
import { dayNutrition, searchFoods } from '@/domain/nutrition';
import { foodsById } from './useNutrition';
import { Card, CardTitle } from '@/components/ui/Card';
import { BandChip } from './BandChip';

/** Saisie des aliments du jour dans le journal (§N.1) : recherche, portions, bande du jour. */
export function NutritionJournalCard({ date, entry }: { date: ISODate; entry: DailyEntry | undefined }) {
  const { t } = useI18n();
  const store = useAppStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const logged = entry?.nutrition?.foods ?? [];
  const results = useMemo(() => searchFoods(query, FOODS), [query]);
  const day = dayNutrition(entry?.nutrition, foodsById);

  const setFoods = (foods: { foodId: string; servings: number }[]) => {
    store.updateEntry(date, { nutrition: { foods } });
  };

  const addFood = (foodId: string) => {
    const existing = logged.find((f) => f.foodId === foodId);
    setFoods(
      existing
        ? logged.map((f) => (f.foodId === foodId ? { ...f, servings: f.servings + 1 } : f))
        : [...logged, { foodId, servings: 1 }],
    );
    setQuery('');
    inputRef.current?.focus();
  };

  const changeServings = (foodId: string, delta: number) => {
    const item = logged.find((f) => f.foodId === foodId);
    if (!item) return;
    const servings = Math.round((item.servings + delta) * 2) / 2;
    if (servings < 0.5) setFoods(logged.filter((f) => f.foodId !== foodId));
    else setFoods(logged.map((f) => (f.foodId === foodId ? { ...f, servings } : f)));
  };

  return (
    <Card>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <CardTitle className="mb-0">{t('nutrition.journalCard')}</CardTitle>
        <BandChip band={day.band} score={day.score} />
      </div>

      <div className="relative">
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-label={t('nutrition.journalCard')}
          placeholder={t('nutrition.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) {
              e.preventDefault();
              addFood(results[0].id);
            }
            if (e.key === 'Escape') setQuery('');
          }}
          className="min-h-[44px] w-full rounded-md border border-muted/30 bg-surface px-3 text-sm outline-none focus:border-primary"
        />
        {query.trim().length >= 2 && (
          <ul role="listbox" className="absolute inset-x-0 top-full z-10 mt-1 max-h-56 overflow-y-auto rounded-lg bg-surface shadow-lifted">
            {results.length === 0 && <li className="px-3 py-2.5 text-sm text-muted">{t('nutrition.noResult')}</li>}
            {results.map((food) => (
              <li key={food.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => addFood(food.id)}
                  className="flex min-h-[44px] w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-surface-2"
                >
                  <span className="truncate">{food.name}</span>
                  <span aria-hidden className={`shrink-0 text-xs ${food.inflammationScore <= -1 ? 'text-fertile' : food.inflammationScore >= 1 ? 'text-warning' : 'text-muted'}`}>
                    {food.inflammationScore > 0 ? `+${food.inflammationScore}` : food.inflammationScore}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {logged.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {logged.map((item) => {
            const food = foodsById.get(item.foodId);
            if (!food) return null;
            return (
              <li key={item.foodId} className="flex items-center gap-2 rounded-lg bg-surface-2/60 px-3 py-1.5 text-sm">
                <span className="min-w-0 flex-1 truncate">{food.name}</span>
                <div className="flex items-center gap-1" role="group" aria-label={`${food.name} — ${t('nutrition.servings')}`}>
                  <button type="button" aria-label={`− ${food.name}`} onClick={() => changeServings(item.foodId, -0.5)} className="tap-target rounded-full text-muted hover:text-ink">
                    <Minus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold tabular-nums">{item.servings}</span>
                  <button type="button" aria-label={`+ ${food.name}`} onClick={() => changeServings(item.foodId, 0.5)} className="tap-target rounded-full text-muted hover:text-ink">
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`${t('common.delete')} ${food.name}`}
                    onClick={() => setFoods(logged.filter((f) => f.foodId !== item.foodId))}
                    className="tap-target ml-1 rounded-full text-muted hover:text-period"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="mt-2 text-xs text-muted">{t('nutrition.noJudgment')}</p>
    </Card>
  );
}
