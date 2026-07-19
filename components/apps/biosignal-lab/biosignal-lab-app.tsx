'use client'

import {
  useCallback,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from 'react'
import { motion } from 'framer-motion'
import { Brain, X } from 'lucide-react'
import { keyToSignal } from '@/lib/bci-controls'
import { useBiosignal } from '@/components/biosignal-provider'
import { SignalMeter } from '@/components/apps/biosignal-lab/signal-meter'

export type BiosignalLabAppHandle = {
  handleKey: (key: string) => boolean
}

export type BiosignalLabAppProps = {
  onClose: () => void
  onNotify: (text: string) => void
}

const PHASE_LABEL: Record<string, string> = {
  idle: 'Offline',
  connecting: 'Connecting',
  'waiting-approval': 'Approve in Launcher',
  authorizing: 'Authorizing',
  headset: 'Headset',
  streaming: 'Live',
  error: 'Error',
}

export const BiosignalLabApp = forwardRef<BiosignalLabAppHandle, BiosignalLabAppProps>(
  function BiosignalLabApp({ onClose, onNotify }, ref) {
    const { state, controlOs, setControlOs, isLive } = useBiosignal()

    useEffect(() => {
      if (isLive) onNotify('Emotiv live')
    }, [isLive, onNotify])

    const handleKey = useCallback(
      (key: string): boolean => {
        const signal = keyToSignal(key)
        if (signal === 'exit' || signal === 'frown' || signal === 'brow-raise') {
          onClose()
          onNotify('Exited Biosignal Lab')
          return true
        }
        // Jaw is enter/select globally — don't remapa it here (Control OS is button-only).
        if (signal === 'jaw-clench') {
          onNotify(
            controlOs
              ? `Live · jaw ≥${Math.round(state.jawThreshold * 100)}% · brow ≥${Math.round(state.browThreshold * 100)}%`
              : 'Turn on Controlling Manifest OS to drive enter/exit',
          )
          return true
        }
        return false
      },
      [
        controlOs,
        onClose,
        onNotify,
        state.browThreshold,
        state.jawThreshold,
      ],
    )

    useImperativeHandle(ref, () => ({ handleKey }), [handleKey])

    const statusColor = isLive
      ? 'text-emerald-600'
      : state.phase === 'error'
        ? 'text-primary'
        : 'text-muted-foreground'

    return (
      <>
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/25">
              <Brain className="size-5" strokeWidth={1.6} />
            </div>
            <div className="leading-tight">
              <span className="text-sm font-medium tracking-tight text-muted-foreground">
                Manifest
              </span>
              <p className="text-base font-semibold tracking-tight">Biosignal Lab</p>
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

        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-48 w-2/3 max-w-md rounded-full opacity-50 blur-3xl"
            style={{
              background: isLive
                ? 'radial-gradient(circle, oklch(0.58 0.21 27 / 0.1), transparent 70%)'
                : 'radial-gradient(circle, oklch(0.5 0.05 280 / 0.08), transparent 70%)',
            }}
          />

          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
            <div className="flex items-center justify-center gap-3">
              <span className={`relative flex size-2.5 ${isLive ? '' : 'opacity-40'}`}>
                {isLive && (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                )}
                <span
                  className={`relative inline-flex size-2.5 rounded-full ${
                    isLive ? 'bg-emerald-500' : state.bridgeConnected ? 'bg-amber-400' : 'bg-muted-foreground/40'
                  }`}
                />
              </span>
              <span className={`text-xs font-semibold tracking-wide ${statusColor}`}>
                {PHASE_LABEL[state.phase] ?? state.phase} · {state.statusMessage}
              </span>
            </div>

            {!state.bridgeConnected && (
              <div className="max-w-sm rounded-[1.5rem] border border-border/80 bg-secondary/30 px-6 py-5 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Start the bridge in a terminal:
                </p>
                <p className="mt-2 font-mono text-xs text-foreground/80">npm run bridge</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Emotiv Launcher must be open with your EPOC+ connected.
                </p>
              </div>
            )}

            <div className="flex w-full max-w-md flex-col gap-5">
              <SignalMeter
                label="Jaw clench"
                value={state.jaw}
                active={state.lAct === 'clench'}
                threshold={state.jawThreshold}
              />
              <SignalMeter
                label="Brow raise"
                value={state.brow}
                active={state.uAct === 'surprise'}
                threshold={state.browThreshold}
                accent="violet"
              />
            </div>

            <div className="w-full max-w-md rounded-[1.5rem] border border-border/80 bg-card/80 px-6 py-4 text-center shadow-sm">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Cortex facial stream
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                lower: {state.lAct} ({state.lPow.toFixed(2)}) · upper: {state.uAct} (
                {state.uPow.toFixed(2)})
              </p>
              {state.headset && (
                <p className="mt-2 truncate text-[11px] text-muted-foreground">
                  {state.headset}
                </p>
              )}
            </div>

            {state.lastSignal && state.lastSignalAt && (
              <motion.div
                key={state.lastSignalAt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full border border-primary/25 bg-primary/10 px-5 py-2 text-sm font-medium text-primary"
              >
                Detected:{' '}
                {state.lastSignal === 'jaw-clench' ? 'Jaw clench' : 'Brow raise'}
              </motion.div>
            )}

            <button
              type="button"
              onClick={() => {
                setControlOs(!controlOs)
                onNotify(controlOs ? 'OS control off' : 'OS control on')
              }}
              className={`rounded-full px-6 py-2.5 text-xs font-semibold shadow-sm transition-colors ${
                controlOs
                  ? 'bg-primary text-primary-foreground shadow-primary/25'
                  : 'border border-border bg-secondary text-muted-foreground'
              }`}
            >
              {controlOs ? '● Controlling Manifest OS' : 'Control Manifest OS'}
            </button>

            <p className="max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
              Jaw clench ≥{Math.round(state.jawThreshold * 100)}% → open / select · Brow
              raise ≥{Math.round(state.browThreshold * 100)}% → exit / back
              {controlOs ? ' (OS control on)' : ' — turn on Controlling Manifest OS'}
            </p>
          </div>
        </div>
      </>
    )
  },
)
