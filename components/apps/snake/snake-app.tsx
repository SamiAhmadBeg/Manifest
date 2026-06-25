'use client'

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from 'react'
import { Gamepad2, X } from 'lucide-react'
import { keyToSignal } from '@/lib/bci-controls'
import { loadHighScore, saveHighScore } from '@/lib/snake/score'

const COLS = 22
const ROWS = 16
const TICK_MS = 140

type Point = { x: number; y: number }
type Dir = 'up' | 'right' | 'down' | 'left'
type GamePhase = 'playing' | 'over'

const TURN_LEFT: Record<Dir, Dir> = {
  up: 'left',
  left: 'down',
  down: 'right',
  right: 'up',
}

const DELTA: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
}

function same(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y
}

function randomFood(snake: Point[]): Point {
  const blocked = new Set(snake.map((s) => `${s.x},${s.y}`))
  const open: Point[] = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!blocked.has(`${x},${y}`)) open.push({ x, y })
    }
  }
  return open[Math.floor(Math.random() * open.length)] ?? { x: 0, y: 0 }
}

function initialState() {
  const mid = { x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }
  return {
    snake: [mid, { x: mid.x - 1, y: mid.y }, { x: mid.x - 2, y: mid.y }],
    dir: 'right' as Dir,
    food: { x: mid.x + 4, y: mid.y },
    score: 0,
    phase: 'playing' as GamePhase,
  }
}

export type SnakeAppHandle = {
  handleKey: (key: string) => boolean
}

export type SnakeAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
}

export const SnakeApp = forwardRef<SnakeAppHandle, SnakeAppProps>(
  function SnakeApp({ onClose, onNotify }, ref) {
    const [snake, setSnake] = useState<Point[]>(() => initialState().snake)
    const [food, setFood] = useState<Point>(() => initialState().food)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [phase, setPhase] = useState<GamePhase>('playing')

    const dirRef = useRef<Dir>('right')
    const turnQueue = useRef<Dir[]>([])
    const snakeRef = useRef(snake)
    const foodRef = useRef(food)
    const scoreRef = useRef(score)
    const phaseRef = useRef(phase)

    useEffect(() => {
      snakeRef.current = snake
    }, [snake])
    useEffect(() => {
      foodRef.current = food
    }, [food])
    useEffect(() => {
      scoreRef.current = score
    }, [score])
    useEffect(() => {
      phaseRef.current = phase
    }, [phase])

    useEffect(() => {
      setHighScore(loadHighScore())
    }, [])

    const resetGame = useCallback(() => {
      const s = initialState()
      dirRef.current = s.dir
      turnQueue.current = []
      snakeRef.current = s.snake
      foodRef.current = s.food
      scoreRef.current = 0
      phaseRef.current = 'playing'
      setSnake(s.snake)
      setFood(s.food)
      setScore(0)
      setPhase('playing')
      onNotify('Snake started')
    }, [onNotify])

    const endGame = useCallback(
      (finalScore: number) => {
        setPhase('over')
        phaseRef.current = 'over'
        const prev = loadHighScore()
        const best = saveHighScore(finalScore)
        setHighScore(best)
        onNotify(finalScore > prev ? 'New high score!' : 'Game over')
      },
      [onNotify],
    )

    const tick = useCallback(() => {
      if (phaseRef.current !== 'playing') return

      if (turnQueue.current.length) {
        dirRef.current = turnQueue.current.shift()!
      }

      const dir = dirRef.current
      const delta = DELTA[dir]
      const head = snakeRef.current[0]
      const next = { x: head.x + delta.x, y: head.y + delta.y }

      if (next.x < 0 || next.x >= COLS || next.y < 0 || next.y >= ROWS) {
        endGame(scoreRef.current)
        return
      }

      if (snakeRef.current.some((s) => same(s, next))) {
        endGame(scoreRef.current)
        return
      }

      const ate = same(next, foodRef.current)
      const body = ate ? snakeRef.current : snakeRef.current.slice(0, -1)
      const nextSnake = [next, ...body]

      snakeRef.current = nextSnake
      setSnake(nextSnake)

      if (ate) {
        const nextScore = scoreRef.current + 1
        scoreRef.current = nextScore
        setScore(nextScore)
        const nextFood = randomFood(nextSnake)
        foodRef.current = nextFood
        setFood(nextFood)
      }
    }, [endGame])

    useEffect(() => {
      const id = setInterval(tick, TICK_MS)
      return () => clearInterval(id)
    }, [tick])

    const turnLeft = useCallback(() => {
      if (phaseRef.current === 'over') {
        resetGame()
        return
      }
      const next = TURN_LEFT[dirRef.current]
      turnQueue.current.push(next)
      onNotify('Turn left')
    }, [resetGame, onNotify])

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit') {
          onClose()
          onNotify('Exited Snake')
          return true
        }
        if (signal === 'jaw-clench') {
          turnLeft()
          return true
        }
        return false
      },
      [onClose, onNotify, turnLeft],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    return (
      <>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Gamepad2 className="size-5" strokeWidth={1.6} />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-medium tracking-tight text-muted-foreground">
                Manifest
              </span>
              <p className="text-base font-semibold tracking-tight">Snake</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <X className="size-3.5" />
            Exit
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 p-6">
          <div className="flex w-full max-w-lg items-center justify-center gap-12 px-1">
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Score
              </p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {score}
              </p>
            </div>
            <div className="h-8 w-px bg-border/80" />
            <div className="text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                High Score
              </p>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-primary">
                {highScore}
              </p>
            </div>
          </div>

          <div
            className="relative w-full max-w-lg overflow-hidden rounded-[1.25rem] border border-border bg-secondary/40 p-2 shadow-inner"
            style={{ aspectRatio: `${COLS} / ${ROWS}` }}
          >
            <div
              className="grid h-full w-full gap-[2px] rounded-[1rem] bg-border/30 p-[2px]"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows: `repeat(${ROWS}, 1fr)`,
              }}
            >
              {Array.from({ length: ROWS * COLS }).map((_, i) => {
                const x = i % COLS
                const y = Math.floor(i / COLS)
                const cell = { x, y }
                const isHead = snake.length > 0 && same(cell, snake[0])
                const isBody = snake.some((s, idx) => idx > 0 && same(s, cell))
                const isFood = same(cell, food)

                return (
                  <div
                    key={i}
                    className={[
                      'rounded-[3px] transition-colors duration-75',
                      isHead
                        ? 'bg-primary shadow-sm shadow-primary/40'
                        : isBody
                          ? 'bg-primary/75'
                          : isFood
                            ? 'bg-foreground/80 ring-2 ring-primary ring-inset'
                            : 'bg-card/80',
                    ].join(' ')}
                  />
                )
              })}
            </div>

            {phase === 'over' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.25rem] bg-background/85 backdrop-blur-sm">
                <p className="text-xl font-semibold tracking-tight">Game Over</p>
                <p className="text-sm text-muted-foreground">
                  Score {score} · Best {Math.max(highScore, score)}
                </p>
                <p className="text-xs font-medium text-primary">↵ to play again</p>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            ↵ turn left · Esc exit
          </p>
        </div>
      </>
    )
  },
)
