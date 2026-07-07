import { describe, expect, it } from 'vitest';
import { RECOMMENDATIONS } from '../recommendations';
import { PHASE_EDUCATION } from '../phaseEducation';
import { SOURCE_IDS } from '../sources';

/** Test de cohérence de gouvernance des contenus (annexe E). */

const UNCERTAINTY_PATTERNS_FR = [
  'peut ',
  'peuvent',
  'pourrait',
  'pourraient',
  'parfois',
  'certaines personnes',
  'individuel',
  'limitée',
  'limitées',
  'émergente',
  'pas une certitude',
  'sans que ce soit',
  'variabilité',
  "n'est pas un",
  'n’est pas un',
];

describe('gouvernance des contenus M16 (annexe E)', () => {
  it('chaque sourceRef pointe vers une source existante', () => {
    for (const r of RECOMMENDATIONS) {
      expect(r.sourceRefs.length, `${r.id} doit avoir au moins une source`).toBeGreaterThan(0);
      for (const ref of r.sourceRefs) {
        expect(SOURCE_IDS, `${r.id} → source inconnue "${ref}"`).toContain(ref);
      }
    }
    for (const p of PHASE_EDUCATION) {
      for (const ref of p.sourceRefs) {
        expect(SOURCE_IDS).toContain(ref);
      }
    }
  });

  it('tout item C ou D contient une formulation d’incertitude (§5.1, §17.5)', () => {
    for (const r of RECOMMENDATIONS.filter((r) => r.evidenceLevel === 'C' || r.evidenceLevel === 'D')) {
      const hasUncertainty = UNCERTAINTY_PATTERNS_FR.some((p) => r.body.fr.toLowerCase().includes(p));
      expect(hasUncertainty, `${r.id} (${r.evidenceLevel}) doit mentionner l'incertitude : "${r.body.fr}"`).toBe(true);
    }
  });

  it('toute mention de supplémentation renvoie à un avis professionnel (§17.5)', () => {
    const supplementWords = ['supplément', 'supplémentation', 'se supplémenter'];
    for (const r of RECOMMENDATIONS) {
      const mentions = supplementWords.some((w) => r.body.fr.toLowerCase().includes(w));
      if (mentions) {
        const refersPro = /professionnel|avis médical|conseil/i.test(r.body.fr);
        expect(refersPro, `${r.id} mentionne une supplémentation sans renvoi à un professionnel`).toBe(true);
      }
    }
  });

  it('les ids sont uniques et les deux locales sont fournies', () => {
    const ids = RECOMMENDATIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of RECOMMENDATIONS) {
      expect(r.title.fr.length).toBeGreaterThan(0);
      expect(r.title.en.length).toBeGreaterThan(0);
      expect(r.body.fr.length).toBeGreaterThan(0);
      expect(r.body.en.length).toBeGreaterThan(0);
    }
    expect(PHASE_EDUCATION).toHaveLength(4);
  });
});
