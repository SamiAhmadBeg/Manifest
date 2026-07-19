'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  BIOSIGNAL_BRIDGE_URL,
  INITIAL_BIOSIGNAL_STATE,
  type BiosignalState,
  type BridgeServerMessage,
} from '@/lib/biosignal/protocol'

type BiosignalContextValue = {
  state: BiosignalState
  controlOs: boolean
  setControlOs: (enabled: boolean) => void
  isLive: boolean
}

const BiosignalContext = createContext<BiosignalContextValue | null>(null)

const CONTROL_OS_KEY = 'manifest-biosignal-control-os'

export function BiosignalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BiosignalState>(INITIAL_BIOSIGNAL_STATE)
  // Default ON so jaw/brow drive enter/exit once Emotiv is live (persisted override wins).
  const [controlOs, setControlOsState] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONTROL_OS_KEY)
      if (stored === null) {
        localStorage.setItem(CONTROL_OS_KEY, '1')
        setControlOsState(true)
        return
      }
      setControlOsState(stored === '1')
    } catch {
      // ignore
    }
  }, [])

  const setControlOs = useCallback((enabled: boolean) => {
    setControlOsState(enabled)
    try {
      localStorage.setItem(CONTROL_OS_KEY, enabled ? '1' : '0')
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null
    let closed = false

    const connect = () => {
      if (closed) return
      ws = new WebSocket(BIOSIGNAL_BRIDGE_URL)

      ws.onopen = () => {
        setState((s) => ({
          ...s,
          bridgeConnected: true,
          statusMessage: s.phase === 'idle' ? 'Bridge connected' : s.statusMessage,
        }))
      }

      ws.onclose = () => {
        setState((s) => ({
          ...INITIAL_BIOSIGNAL_STATE,
          bridgeConnected: false,
          statusMessage: 'Bridge offline — run npm run bridge',
        }))
        if (!closed) reconnectTimer = setTimeout(connect, 2500)
      }

      ws.onerror = () => {
        ws?.close()
      }

      ws.onmessage = (event) => {
        let msg: BridgeServerMessage
        try {
          msg = JSON.parse(event.data as string)
        } catch {
          return
        }

        if (msg.type === 'status') {
          setState((s) => ({
            ...s,
            bridgeConnected: true,
            phase: msg.phase,
            statusMessage: msg.message,
            headset: msg.headset ?? s.headset,
          }))
          return
        }

        if (msg.type === 'telemetry') {
          setState((s) => ({
            ...s,
            jaw: msg.jaw,
            brow: msg.brow,
            lAct: msg.lAct,
            uAct: msg.uAct,
            lPow: msg.lPow,
            uPow: msg.uPow,
            jawThreshold: msg.thresholds?.jaw ?? s.jawThreshold,
            browThreshold: msg.thresholds?.brow ?? s.browThreshold,
          }))
          return
        }

        if (msg.type === 'event') {
          setState((s) => ({
            ...s,
            lastSignal: msg.signal,
            lastSignalAt: Date.now(),
          }))
        }
      }
    }

    connect()

    return () => {
      closed = true
      if (reconnectTimer) clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [])

  const isLive = state.phase === 'streaming'

  const value = useMemo(
    () => ({ state, controlOs, setControlOs, isLive }),
    [state, controlOs, setControlOs, isLive],
  )

  return (
    <BiosignalContext.Provider value={value}>{children}</BiosignalContext.Provider>
  )
}

export function useBiosignal() {
  const ctx = useContext(BiosignalContext)
  if (!ctx) throw new Error('useBiosignal must be used within BiosignalProvider')
  return ctx
}

export function useBiosignalOptional() {
  return useContext(BiosignalContext)
}
