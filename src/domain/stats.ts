/** Primitives statistiques pures (§4.3, §4.7). */

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

export function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? (s[mid] as number) : ((s[mid - 1] as number) + (s[mid] as number)) / 2;
}

/** Écart-type échantillon (n−1) ; 0 si moins de 2 valeurs. */
export function std(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const v = xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(v);
}

/** Percentile par interpolation linéaire (p ∈ [0, 100]). */
export function percentile(xs: number[], p: number): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const idx = (clamp(p, 0, 100) / 100) * (s.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return s[lo] as number;
  return (s[lo] as number) + ((s[hi] as number) - (s[lo] as number)) * (idx - lo);
}

/** Moyenne mobile à pondération exponentielle, initialisée sur la première valeur (§4.3). */
export function ewma(xs: number[], alpha: number): number {
  if (xs.length === 0) return 0;
  let acc = xs[0] as number;
  for (let i = 1; i < xs.length; i++) acc = alpha * (xs[i] as number) + (1 - alpha) * acc;
  return acc;
}

/** Pente de la régression linéaire simple y = a + b·x sur des indices 0..n−1 (§4.7). */
export function linearTrendSlope(ys: number[]): number {
  const n = ys.length;
  if (n < 3) return 0;
  const xMean = (n - 1) / 2;
  const yMean = mean(ys);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xMean) * ((ys[i] as number) - yMean);
    den += (i - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}
