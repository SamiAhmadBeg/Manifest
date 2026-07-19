import type { BciSignal } from '@/lib/bci-controls'

export const BIOSIGNAL_BRIDGE_URL =
  process.env.NEXT_PUBLIC_BIOSIGNAL_BRIDGE_URL ?? 'ws://localhost:8765'

export type BridgePhase =
  | 'idle'
  | 'connecting'
  | 'waiting-approval'
  | 'authorizing'
  | 'headset'
  | 'streaming'
  | 'error'

export type BridgeStatusMessage = {
  type: 'status'
  phase: BridgePhase
  message: string
  headset?: string
  cortexConnected?: boolean
}

export type BridgeTelemetryMessage = {
  type: 'telemetry'
  jaw: number
  brow: number
  lAct: string
  uAct: string
  lPow: number
  uPow: number
  thresholds?: { jaw: number; brow: number }
}

export type BridgeEventMessage = {
  type: 'event'
  signal: BciSignal
  source: 'emotiv-fac'
}

export type BridgeErrorMessage = {
  type: 'error'
  message: string
}

export type BridgeServerMessage =
  | BridgeStatusMessage
  | BridgeTelemetryMessage
  | BridgeEventMessage
  | BridgeErrorMessage

export type BridgeClientMessage =
  | { type: 'ping' }
  | { type: 'set-thresholds'; jaw: number; brow: number }

export type BiosignalState = {
  bridgeConnected: boolean
  phase: BridgePhase
  statusMessage: string
  headset: string | null
  jaw: number
  brow: number
  lAct: string
  uAct: string
  lPow: number
  uPow: number
  jawThreshold: number
  browThreshold: number
  lastSignal: BciSignal | null
  lastSignalAt: number | null
}

export const INITIAL_BIOSIGNAL_STATE: BiosignalState = {
  bridgeConnected: false,
  phase: 'idle',
  statusMessage: 'Bridge offline — run npm run bridge',
  headset: null,
  jaw: 0,
  brow: 0,
  lAct: 'neutral',
  uAct: 'neutral',
  lPow: 0,
  uPow: 0,
  jawThreshold: 0.1,
  browThreshold: 0.62,
  lastSignal: null,
  lastSignalAt: null,
}
