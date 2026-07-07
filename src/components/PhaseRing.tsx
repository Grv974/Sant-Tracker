import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { CyclePhase } from '@/types/models';
import { useI18n } from '@/i18n';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface PhaseSegment {
  phase: CyclePhase;
  /** Longueur du segment en jours. */
  days: number;
}

export interface PhaseRingProps {
  segments: PhaseSegment[];
  dayOfCycle: number;
  totalDays: number;
  phaseLabel: string;
  size?: number;
}

const PHASE_COLORS: Record<CyclePhase, string> = {
  menstrual: 'rgb(var(--c-phase-menstrual-strong))',
  follicular: 'rgb(var(--c-phase-follicular-strong))',
  ovulatory: 'rgb(var(--c-phase-ovulatory-strong))',
  luteal: 'rgb(var(--c-phase-luteal-strong))',
};

/**
 * Anneau de cycle (§6.3) : arc segmenté par phase, segments futurs plus pâles
 * (incertitude visuelle, §17.J), repère animé sur le jour courant.
 */
export function PhaseRing({ segments, dayOfCycle, totalDays, phaseLabel, size = 224 }: PhaseRingProps) {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const stroke = 14;
  const r = (size - stroke) / 2 - 6;
  const c = size / 2;
  const circumference = 2 * Math.PI * r;
  const gap = 3;

  const arcs = useMemo(() => {
    const total = Math.max(segments.reduce((acc, s) => acc + s.days, 0), 1);
    let offsetDays = 0;
    return segments.map((segment, i) => {
      const startFrac = offsetDays / total;
      const lenFrac = segment.days / total;
      offsetDays += segment.days;
      return {
        key: `${segment.phase}-${i}`,
        phase: segment.phase,
        dash: `${Math.max(lenFrac * circumference - gap, 1)} ${circumference}`,
        rotation: startFrac * 360 - 90,
        /** Un segment entièrement dans le futur est estompé. */
        future: (offsetDays - segment.days) >= dayOfCycle,
      };
    });
  }, [segments, circumference, dayOfCycle]);

  // Position du repère « jour courant »
  const angle = ((Math.min(dayOfCycle, totalDays) - 0.5) / Math.max(totalDays, 1)) * 2 * Math.PI - Math.PI / 2;
  const markerX = c + r * Math.cos(angle);
  const markerY = c + r * Math.sin(angle);

  return (
    <div className="relative inline-flex items-center justify-center" role="img" aria-label={`${t('phases.dayOfCycle', { day: dayOfCycle })} — ${phaseLabel}`}>
      <svg width={size} height={size} aria-hidden>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgb(var(--c-surface-2))" strokeWidth={stroke} />
        {arcs.map((arc) => (
          <circle
            key={arc.key}
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={PHASE_COLORS[arc.phase]}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={arc.dash}
            opacity={arc.future ? 0.28 : 0.92}
            transform={`rotate(${arc.rotation} ${c} ${c})`}
          />
        ))}
        <motion.circle
          cx={markerX}
          cy={markerY}
          r={stroke / 2 + 3}
          fill="rgb(var(--c-surface))"
          stroke="rgb(var(--c-primary-strong))"
          strokeWidth={3}
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-display text-3xl font-bold">{t('phases.dayOfCycle', { day: dayOfCycle })}</div>
        <div className="mt-1 max-w-[60%] text-sm text-muted">{phaseLabel}</div>
      </div>
    </div>
  );
}
