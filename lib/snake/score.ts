const KEY = 'manifest-snake-hiscore'

export function loadHighScore(): number {
  if (typeof window === 'undefined') return 0
  const raw = localStorage.getItem(KEY)
  const n = raw ? parseInt(raw, 10) : 0
  return Number.isFinite(n) ? n : 0
}

export function saveHighScore(score: number): number {
  const current = loadHighScore()
  if (score <= current) return current
  localStorage.setItem(KEY, String(score))
  return score
}
