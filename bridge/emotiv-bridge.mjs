#!/usr/bin/env node
/**
 * Manifest ↔ Emotiv Cortex bridge
 *
 * Reads EMOTIV_CLIENT_ID / EMOTIV_CLIENT_SECRET from .env.local,
 * connects to Cortex (wss://localhost:6868), streams facial expressions,
 * and broadcasts telemetry + gesture events to the UI on ws://localhost:8765.
 *
 * Requires Emotiv Launcher running with headset connected.
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:http'
import WebSocket, { WebSocketServer } from 'ws'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

const CORTEX_URL = process.env.CORTEX_URL ?? 'wss://localhost:6868'
const BRIDGE_PORT = Number(process.env.BIOSIGNAL_BRIDGE_PORT ?? 8765)
const TELEMETRY_HZ = 8

function loadEnvLocal() {
  try {
    const text = readFileSync(resolve(ROOT, '.env.local'), 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    // .env.local optional if vars exported in shell
  }
}

loadEnvLocal()

/** Accept "0.40" or "40" (percent) for thresholds on Emotiv fac power 0–1. */
function parsePowThreshold(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  const unit = n > 1 ? n / 100 : n
  return Math.min(1, Math.max(0, unit))
}

// Benchmarks: jaw clench 10% → enter; brow raise 50% → exit (Emotiv fac uAct: surprise).
// Basic License / fac stream only — no Professional EEG / raw eeg required (Cortex license).
const JAW_POW_THRESHOLD = parsePowThreshold(
  process.env.BIOSIGNAL_JAW_THRESHOLD,
  0.1,
)
const BROW_POW_THRESHOLD = parsePowThreshold(
  process.env.BIOSIGNAL_BROW_THRESHOLD ?? process.env.BIOSIGNAL_FROWN_THRESHOLD,
  0.62,
)
// Hysteresis release = must drop before the same gesture can fire again (rising edge).
const JAW_RELEASE = parsePowThreshold(
  process.env.BIOSIGNAL_JAW_RELEASE,
  JAW_POW_THRESHOLD * 0.55,
)
const BROW_RELEASE = parsePowThreshold(
  process.env.BIOSIGNAL_BROW_RELEASE ?? process.env.BIOSIGNAL_FROWN_RELEASE,
  BROW_POW_THRESHOLD * 0.55,
)
const GESTURE_COOLDOWN_MS = Number(process.env.BIOSIGNAL_COOLDOWN_MS ?? 900)
const CROSS_GESTURE_LOCK_MS = Number(process.env.BIOSIGNAL_CROSS_LOCK_MS ?? 750)
/** Must stay released this long before the same gesture can fire again (label-flap guard). */
const RELEASE_HOLD_MS = Number(process.env.BIOSIGNAL_RELEASE_HOLD_MS ?? 280)

console.log(
  `[bridge] Thresholds jaw≥${JAW_POW_THRESHOLD.toFixed(2)} brow≥${BROW_POW_THRESHOLD.toFixed(2)} ` +
    `release jaw≤${JAW_RELEASE.toFixed(2)} brow≤${BROW_RELEASE.toFixed(2)} ` +
    `hold=${RELEASE_HOLD_MS}ms cooldown=${GESTURE_COOLDOWN_MS}ms crossLock=${CROSS_GESTURE_LOCK_MS}ms`,
)

const CLIENT_ID = process.env.EMOTIV_CLIENT_ID
const CLIENT_SECRET = process.env.EMOTIV_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    '[bridge] Missing EMOTIV_CLIENT_ID or EMOTIV_CLIENT_SECRET in .env.local',
  )
  process.exit(1)
}

/** @type {Set<WebSocket>} */
const uiClients = new Set()

let rpcId = 1
/** @type {Map<number, { resolve: Function, reject: Function }>} */
const pending = new Map()

/** @type {WebSocket | null} */
let cortexWs = null
let cortexToken = null
let sessionId = null
let headsetId = null

let lastJawFire = 0
let lastBrowFire = 0
let lastAnyGestureAt = 0
let lastTelemetryAt = 0
/** Rising-edge arming: gesture must release below hysteresis before re-fire. */
let jawReady = true
let browReady = true
/** Timestamp when gesture first dropped into the release zone (0 = armed or still hot). */
let jawReleaseSince = 0
let browReleaseSince = 0
/**
 * Smoothed powers so brief Emotiv label flaps to neutral don't re-arm mid-gesture.
 * Surprise/clench update immediately; other labels decay toward 0.
 */
let jawSmooth = 0
let browSmooth = 0
const SMOOTH_DECAY = 0.9

/** @type {{ phase: string, message: string, headset?: string }} */
let currentStatus = { phase: 'idle', message: 'Starting…' }

function broadcast(msg) {
  const payload = JSON.stringify(msg)
  for (const client of uiClients) {
    if (client.readyState === WebSocket.OPEN) client.send(payload)
  }
}

function friendlyError(message) {
  if (message.includes('-32232') || message.includes('valid license')) {
    return (
      'Cortex app requires paid EEG license. Create a new app at emotiv.com/developer ' +
      'with "Enable EEG for Professional devices" OFF, then update .env.local.'
    )
  }
  return message
}

function broadcastStatus(phase, message, extra = {}) {
  const friendly = phase === 'error' ? friendlyError(message) : message
  currentStatus = { phase, message: friendly, headset: extra.headset ?? currentStatus.headset }
  broadcast({
    type: 'status',
    phase,
    message: friendly,
    cortexConnected: cortexWs?.readyState === WebSocket.OPEN,
    ...extra,
  })
}

function cortexSend(method, params = {}) {
  return new Promise((resolve, reject) => {
    if (!cortexWs || cortexWs.readyState !== WebSocket.OPEN) {
      reject(new Error('Cortex socket not open'))
      return
    }
    const id = rpcId++
    pending.set(id, { resolve, reject })
    cortexWs.send(JSON.stringify({ id, jsonrpc: '2.0', method, params }))
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function requestAccessWithRetry(maxAttempts = 30) {
  broadcastStatus('waiting-approval', 'Approve Manifest in Emotiv Launcher…')
  for (let i = 0; i < maxAttempts; i++) {
    const result = await cortexSend('requestAccess', {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    })
    if (result?.accessGranted) return result
    const msg = result?.message ?? 'Waiting for Launcher approval…'
    broadcastStatus('waiting-approval', msg)
    await sleep(2000)
  }
  throw new Error('Launcher approval timed out. Open Emotiv Launcher and approve access.')
}

async function pickHeadset() {
  // Refresh discovery so virtual / simulated devices show up reliably.
  try {
    await cortexSend('controlDevice', { command: 'refresh' })
    await sleep(1200)
  } catch {
    // refresh is best-effort
  }

  const result = await cortexSend('queryHeadsets')
  // Cortex may return either an array or { headsets: [...] }
  const headsets = Array.isArray(result)
    ? result
    : (result?.headsets ?? [])

  // Prefer a real connected EPOC+ over Virtual Brainwear when both appear.
  const physicalConnected = headsets.find(
    (h) => !h.isVirtual && h.status === 'connected',
  )
  const anyConnected = headsets.find((h) => h.status === 'connected')
  const physical = headsets.find((h) => !h.isVirtual)
  const connected =
    physicalConnected ??
    anyConnected ??
    headsets.find((h) => h.status === 'connecting') ??
    physical ??
    headsets[0]
  if (!connected?.id) {
    throw new Error(
      'No headset found. Connect EPOC+ or enable a Simulated Device in Emotiv Launcher → Devices.',
    )
  }
  const label = connected.isVirtual
    ? `${connected.id} (simulator)`
    : connected.id
  console.log('[bridge] Using headset', label, connected.status)
  return connected
}

async function connectHeadset(headset) {
  headsetId = headset.id
  if (headset.status !== 'connected') {
    broadcastStatus('headset', `Connecting to ${headset.id}…`, { headset: headset.id })
    try {
      await cortexSend('controlDevice', { command: 'connect', headset: headset.id })
    } catch (err) {
      // Soft-fail: headset may already be mid-connect
      console.warn('[bridge] controlDevice connect:', err.message)
    }
    await sleep(1500)
  }
}

async function openFacSession(maxAttempts = 40) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const headset = await pickHeadset()
    await connectHeadset(headset)

    broadcastStatus(
      'headset',
      attempt === 1
        ? 'Creating session…'
        : `Waiting for headset… (${attempt}/${maxAttempts})`,
      { headset: headset.id },
    )

    try {
      const session = await cortexSend('createSession', {
        cortexToken,
        headset: headset.id,
        status: 'active',
      })
      sessionId = session.id

      await cortexSend('subscribe', {
        cortexToken,
        session: sessionId,
        streams: ['fac'],
      })

      broadcastStatus('streaming', 'Live — clench jaw or raise brows', {
        headset: headset.id,
      })
      console.log('[bridge] Streaming facial expressions from', headset.id)
      return
    } catch (err) {
      const msg = String(err.message ?? err)
      console.warn(`[bridge] session attempt ${attempt}:`, msg)
      broadcastStatus('headset', msg, { headset: headset.id })
      // Typical while USB/BT settles or another app briefly holds the device.
      if (
        /not available|busy|32004|32152/i.test(msg) &&
        attempt < maxAttempts
      ) {
        await sleep(2000)
        continue
      }
      throw err
    }
  }
}

async function startCortexSession() {
  // Drop any prior Cortex socket before opening a fresh session path.
  if (cortexWs) {
    try {
      cortexWs.removeAllListeners()
      cortexWs.close()
    } catch {
      // ignore
    }
    cortexWs = null
  }

  broadcastStatus('connecting', 'Connecting to Cortex…')
  cortexWs = new WebSocket(CORTEX_URL, { rejectUnauthorized: false })

  cortexWs.on('message', (raw) => {
    let data
    try {
      data = JSON.parse(raw.toString())
    } catch {
      return
    }

    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id)
      pending.delete(data.id)
      if (data.error) reject(new Error(data.error.message ?? JSON.stringify(data.error)))
      else resolve(data.result)
      return
    }

    if (data.fac) handleFacSample(data.fac)
  })

  cortexWs.on('close', () => {
    broadcastStatus('error', 'Cortex disconnected. Is Emotiv Launcher running?')
    cortexToken = null
    sessionId = null
    setTimeout(() => startCortexSession().catch(console.error), 5000)
  })

  cortexWs.on('error', (err) => {
    broadcast({ type: 'error', message: err.message })
  })

  await new Promise((resolve, reject) => {
    cortexWs.once('open', resolve)
    cortexWs.once('error', reject)
  })

  await requestAccessWithRetry()

  broadcastStatus('authorizing', 'Authorizing…')
  const auth = await cortexSend('authorize', {
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    debit: 1,
  })
  cortexToken = auth.cortexToken

  await openFacSession()
}

function handleFacSample(fac) {
  const values = Array.isArray(fac) ? fac : []
  const eyeAct = String(values[0] ?? 'neutral')
  const uAct = String(values[1] ?? 'neutral')
  const uPow = Number(values[2] ?? 0)
  const lAct = String(values[3] ?? 'neutral')
  const lPow = Number(values[4] ?? 0)

  // Telemetry: `brow` = eyebrow raise (surprise) power for the Lab exit meter.
  const jaw = lAct === 'clench' ? lPow : lAct !== 'neutral' ? lPow * 0.4 : 0
  const brow = uAct === 'surprise' ? uPow : uAct !== 'neutral' ? uPow * 0.4 : 0

  const now = Date.now()
  if (now - lastTelemetryAt >= 1000 / TELEMETRY_HZ) {
    lastTelemetryAt = now
    broadcast({
      type: 'telemetry',
      jaw,
      brow,
      lAct,
      uAct,
      lPow,
      uPow,
      thresholds: {
        jaw: JAW_POW_THRESHOLD,
        brow: BROW_POW_THRESHOLD,
      },
    })
  }

  // Power for the discrete action only — decay when labels flap to avoid re-arm chatter.
  if (lAct === 'clench') jawSmooth = lPow
  else jawSmooth *= SMOOTH_DECAY
  if (uAct === 'surprise') browSmooth = uPow
  else browSmooth *= SMOOTH_DECAY

  const jawPower = jawSmooth
  const browPower = browSmooth
  const jawActive = lAct === 'clench' && jawPower >= JAW_POW_THRESHOLD
  const browActive = uAct === 'surprise' && browPower >= BROW_POW_THRESHOLD

  // Re-arm only after sustained release (hysteresis + hold). Instant label flaps stay hot.
  if (jawPower <= JAW_RELEASE) {
    if (!jawReleaseSince) jawReleaseSince = now
    if (now - jawReleaseSince >= RELEASE_HOLD_MS) jawReady = true
  } else {
    jawReleaseSince = 0
  }
  if (browPower <= BROW_RELEASE) {
    if (!browReleaseSince) browReleaseSince = now
    if (now - browReleaseSince >= RELEASE_HOLD_MS) browReady = true
  } else {
    browReleaseSince = 0
  }

  const pastSelfCooldown = (lastFire) => now - lastFire > GESTURE_COOLDOWN_MS
  const pastCrossLock = now - lastAnyGestureAt > CROSS_GESTURE_LOCK_MS

  // Both over threshold in one sample → ignore (avoids open+exit chatter).
  if (jawActive && browActive) {
    void eyeAct
    return
  }

  if (
    jawActive &&
    jawReady &&
    pastSelfCooldown(lastJawFire) &&
    pastCrossLock
  ) {
    jawReady = false
    jawReleaseSince = 0
    lastJawFire = now
    lastAnyGestureAt = now
    broadcast({ type: 'event', signal: 'jaw-clench', source: 'emotiv-fac' })
    console.log('[bridge] jaw-clench', jawPower.toFixed(3))
  } else if (
    browActive &&
    browReady &&
    pastSelfCooldown(lastBrowFire) &&
    pastCrossLock
  ) {
    browReady = false
    browReleaseSince = 0
    lastBrowFire = now
    lastAnyGestureAt = now
    broadcast({ type: 'event', signal: 'brow-raise', source: 'emotiv-fac' })
    console.log('[bridge] brow-raise', browPower.toFixed(3))
  }

  void eyeAct
}

const httpServer = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Manifest biosignal bridge\n')
})

const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', (ws) => {
  uiClients.add(ws)
  ws.send(
    JSON.stringify({
      type: 'status',
      phase: currentStatus.phase,
      message: currentStatus.message,
      cortexConnected: cortexWs?.readyState === WebSocket.OPEN,
      headset: currentStatus.headset ?? headsetId ?? undefined,
    }),
  )

  ws.on('close', () => uiClients.delete(ws))
  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString())
      if (msg.type === 'ping') ws.send(JSON.stringify({ type: 'status', phase: 'idle', message: 'pong' }))
    } catch {
      // ignore
    }
  })
})

httpServer.listen(BRIDGE_PORT, () => {
  console.log(`[bridge] UI WebSocket on ws://localhost:${BRIDGE_PORT}`)
  const boot = () =>
    startCortexSession().catch((err) => {
      const msg = friendlyError(err.message)
      console.error('[bridge]', msg)
      broadcastStatus('error', err.message)
      // Keep retrying — do not exit; Manifest UI stays attached to :8765
      setTimeout(boot, 4000)
    })
  boot()
})

process.on('SIGINT', () => {
  console.log('\n[bridge] Shutting down')
  cortexWs?.close()
  httpServer.close()
  process.exit(0)
})
