import type { CyclePhase, DailyEntry, Profile, Recommendation } from '@/types/models';

const EVIDENCE_ORDER = { A: 0, B: 1, C: 2, D: 3 } as const;

export interface RecommendationContext {
  phase: CyclePhase | null;
  profile: Profile;
  todayEntry?: DailyEntry;
  maxPerCategory?: number;
}

/** Tags de profil actifs pour la sélection (§5.3, §5.5). */
export function profileTags(profile: Profile): string[] {
  const tags: string[] = ['all'];
  if (profile.conditions.pcos) tags.push('pcos');
  if (profile.conditions.endometriosis) tags.push('endometriosis');
  if (profile.conditions.perimenopause || profile.conditions.earlyMenopause) tags.push('perimenopause');
  if (profile.conditions.postpartum) tags.push('postpartum');
  if (profile.primaryGoal === 'conceive') tags.push('conceive');
  return tags;
}

/** Contre-indications du jour (§5.6) : ex. douleur invalidante → pas d'intensification sportive. */
export function activeContraindications(todayEntry?: DailyEntry): string[] {
  const tags: string[] = [];
  const impact = todayEntry?.pain?.functionalImpact;
  if (impact === 'impossible' || impact === 'limited') tags.push('sport_intensity');
  if ((todayEntry?.pain?.intensity ?? 0) >= 7) tags.push('sport_intensity');
  return tags;
}

/**
 * Moteur de sélection (§5.3) : filtre par phase + profil, exclut les contre-indiqués,
 * ordonne par niveau de preuve décroissant, limite à 3–5 items par catégorie.
 * Ne génère jamais de contenu : puise uniquement dans la base statique M16 (§5.6).
 */
export function selectRecommendations(
  catalog: Recommendation[],
  ctx: RecommendationContext,
): Recommendation[] {
  const tags = profileTags(ctx.profile);
  const contra = activeContraindications(ctx.todayEntry);
  const max = ctx.maxPerCategory ?? 4;

  const eligible = catalog
    .filter((r) => r.phase === 'any' || r.phase === ctx.phase)
    .filter((r) => r.profileTags.some((t) => tags.includes(t)))
    .filter((r) => !r.contraindicationTags.some((t) => contra.includes(t)))
    // Fertilité : réservé au profil « désir de grossesse » (§5.4.3)
    .filter((r) => r.category !== 'fertility' || ctx.profile.primaryGoal === 'conceive')
    .sort((a, b) => {
      const byEvidence = EVIDENCE_ORDER[a.evidenceLevel] - EVIDENCE_ORDER[b.evidenceLevel];
      if (byEvidence !== 0) return byEvidence;
      // Les items spécifiques au profil priment sur les génériques.
      const aSpecific = a.profileTags.includes('all') ? 1 : 0;
      const bSpecific = b.profileTags.includes('all') ? 1 : 0;
      return aSpecific - bSpecific;
    });

  const byCategory = new Map<string, Recommendation[]>();
  for (const r of eligible) {
    const list = byCategory.get(r.category) ?? [];
    if (list.length < max) {
      list.push(r);
      byCategory.set(r.category, list);
    }
  }
  return [...byCategory.values()].flat();
}

/** Recommandation phare du jour (widget dashboard) — meilleure preuve, spécifique au profil d'abord. */
export function dailyHighlight(catalog: Recommendation[], ctx: RecommendationContext): Recommendation | null {
  const all = selectRecommendations(catalog, { ...ctx, maxPerCategory: 1 });
  return all[0] ?? null;
}
