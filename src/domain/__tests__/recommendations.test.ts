import { describe, expect, it } from 'vitest';
import { activeContraindications, dailyHighlight, profileTags, selectRecommendations } from '../recommendations';
import { makeEntry, makeProfile } from '@/tests/fixtures';
import type { Recommendation } from '@/types/models';

function reco(overrides: Partial<Recommendation>): Recommendation {
  return {
    id: 'r1',
    phase: 'menstrual',
    category: 'activity',
    profileTags: ['all'],
    title: { fr: 'Titre', en: 'Title' },
    body: { fr: 'Corps', en: 'Body' },
    evidenceLevel: 'B',
    sourceRefs: ['acog'],
    contraindicationTags: [],
    ...overrides,
  };
}

describe('moteur de recommandations (§5.3, §5.6)', () => {
  it('filtre par phase et trie par niveau de preuve décroissant', () => {
    const catalog = [
      reco({ id: 'c', evidenceLevel: 'C' }),
      reco({ id: 'a', evidenceLevel: 'A' }),
      reco({ id: 'other-phase', phase: 'luteal' }),
      reco({ id: 'any', phase: 'any', evidenceLevel: 'B' }),
    ];
    const out = selectRecommendations(catalog, { phase: 'menstrual', profile: makeProfile() });
    expect(out.map((r) => r.id)).toEqual(['a', 'any', 'c']);
  });

  it('douleur invalidante → aucune reco d’intensification sportive (§17.5)', () => {
    const catalog = [
      reco({ id: 'intense', contraindicationTags: ['sport_intensity'] }),
      reco({ id: 'soft' }),
    ];
    const painDay = makeEntry('2025-05-14', { pain: { functionalImpact: 'impossible' } });
    const out = selectRecommendations(catalog, { phase: 'menstrual', profile: makeProfile(), todayEntry: painDay });
    expect(out.map((r) => r.id)).toEqual(['soft']);
  });

  it('la catégorie fertilité est réservée au profil conception (§5.4.3)', () => {
    const catalog = [reco({ id: 'fert', category: 'fertility', phase: 'ovulatory' })];
    expect(selectRecommendations(catalog, { phase: 'ovulatory', profile: makeProfile() })).toEqual([]);
    const conceive = makeProfile({ primaryGoal: 'conceive' });
    expect(selectRecommendations(catalog, { phase: 'ovulatory', profile: conceive })).toHaveLength(1);
  });

  it('limite le nombre d’items par catégorie', () => {
    const catalog = Array.from({ length: 8 }, (_, i) => reco({ id: `r${i}` }));
    const out = selectRecommendations(catalog, { phase: 'menstrual', profile: makeProfile(), maxPerCategory: 3 });
    expect(out).toHaveLength(3);
  });

  it('les items spécifiques au profil priment à preuve égale', () => {
    const catalog = [
      reco({ id: 'generic', profileTags: ['all'] }),
      reco({ id: 'pcos-specific', profileTags: ['pcos'] }),
    ];
    const pcos = makeProfile({ conditions: { ...makeProfile().conditions, pcos: true } });
    const out = selectRecommendations(catalog, { phase: 'menstrual', profile: pcos });
    expect(out[0]!.id).toBe('pcos-specific');
    expect(dailyHighlight(catalog, { phase: 'menstrual', profile: pcos })?.id).toBe('pcos-specific');
  });

  it('profileTags et contre-indications', () => {
    const pcos = makeProfile({ conditions: { ...makeProfile().conditions, pcos: true }, primaryGoal: 'conceive' });
    expect(profileTags(pcos)).toEqual(expect.arrayContaining(['all', 'pcos', 'conceive']));
    expect(activeContraindications(makeEntry('2025-01-01', { pain: { intensity: 8 } }))).toContain('sport_intensity');
    expect(activeContraindications(makeEntry('2025-01-01'))).toEqual([]);
  });
});
