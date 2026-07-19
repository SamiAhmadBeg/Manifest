/**
 * SSVEP (Steady-State Visually Evoked Potential) stimulus defaults.
 *
 * Consensus dual-target pair on a 60 Hz display: 12 Hz + 15 Hz —
 * both produce clean harmonics, stay below the critical flicker fusion
 * band that feels "seizure strobe", and are widely used in CCA/FBCCA papers.
 * Tune via env or trial-and-error per subject / monitor refresh.
 */
export const SSVEP = {
  /** Look left → scroll previous */
  LEFT_HZ: Number(process.env.NEXT_PUBLIC_SSVEP_LEFT_HZ ?? 12),
  /** Look right → scroll next */
  RIGHT_HZ: Number(process.env.NEXT_PUBLIC_SSVEP_RIGHT_HZ ?? 15),
} as const
