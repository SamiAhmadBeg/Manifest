/** Webcam look-proxy for home carousel (option 4 — free, no Emotiv Premium). */

export type GazeSide = 'left' | 'right' | 'center'

export const GAZE = {
  /**
   * |score| to start a left/right trigger.
   * 20% easier than prior 0.045 (~0.036).
   */
  ARM_THRESHOLD: 0.036,
  /**
   * Must drop below this to clear back to center (stop).
   * Wider gap vs arm = more breathing room so you don't re-fire while easing off.
   */
  RELEASE_THRESHOLD: 0.014,
  /** Amplify nose-yaw (+20% vs prior 2.4). */
  SCORE_GAIN: 2.88,
  /** Must hold gaze this long before a scroll fires. */
  DWELL_MS: 380,
  /** After a scroll — longer pause before another look can fire. */
  COOLDOWN_MS: 1050,
  /** Soft EMA on the raw look score. */
  SMOOTH: 0.35,
} as const
