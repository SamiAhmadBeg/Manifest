/**
 * Keyboard stand-ins for Emotiv biosignals (dev / demo mode).
 * Maps 1:1 to planned EEG + EMG gestures.
 */

export const BCI = {
  /** EEG — scroll carousel / movie list */
  SCROLL_LEFT: 'ArrowLeft',
  SCROLL_RIGHT: 'ArrowRight',

  /** EMG jaw clench — open app, select movie, play / pause */
  JAW_CLENCH: 'Enter',

  /** Eyebrow raise — exit player → OS home */
  BROW_RAISE: 'ArrowUp',

  /** Exit — player → library; library → leave app */
  EXIT: 'Escape',
  EXIT_ALT: 'x',

  /** Mac Delete key (labeled Delete, sends Backspace) */
  DELETE: 'Backspace',

  /** Long blink — previous state / reverse cycle */
  LONG_BLINK: 'b',
} as const

export type BciSignal =
  | 'scroll-left'
  | 'scroll-right'
  | 'jaw-clench'
  | 'brow-raise'
  | 'exit'
  | 'long-blink'

export function keyToSignal(key: string): BciSignal | null {
  const k = key.length === 1 ? key.toLowerCase() : key
  if (k === BCI.SCROLL_LEFT) return 'scroll-left'
  if (k === BCI.SCROLL_RIGHT) return 'scroll-right'
  if (k === BCI.JAW_CLENCH) return 'jaw-clench'
  if (k === BCI.BROW_RAISE) return 'brow-raise'
  if (k === BCI.EXIT || k === BCI.EXIT_ALT) return 'exit'
  if (k === BCI.LONG_BLINK) return 'long-blink'
  return null
}

export function isDeleteKey(key: string) {
  return key === BCI.DELETE
}

export const MOVIES_CONTROLS = {
  library: {
    scrollLeft: BCI.SCROLL_LEFT,
    scrollRight: BCI.SCROLL_RIGHT,
    play: BCI.JAW_CLENCH,
    delete: BCI.DELETE,
  },
  player: {
    exit: BCI.EXIT,
    pause: BCI.JAW_CLENCH,
  },
} as const

export const BCI_LABELS = {
  scrollLeft: { keys: '←', signal: 'EEG Left', action: 'Scroll' },
  scrollRight: { keys: '→', signal: 'EEG Right', action: 'Scroll' },
  jawClench: { keys: '↵', signal: 'EMG Jaw', action: 'Select / Play / Pause' },
  browRaise: { keys: '↑', signal: 'Brow Raise', action: 'Exit to Home' },
  exit: { keys: 'Esc', signal: 'Exit', action: 'Close' },
  delete: { keys: 'Delete', signal: 'Delete', action: 'Remove movie' },
} as const
