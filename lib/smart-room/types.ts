export type SceneId = 'focus' | 'sleep' | 'alloff'
export type DeviceId = 'lights' | 'fan' | 'blinds' | 'monitor'

export type Lights  = 'off' | 'dim' | 'on'
export type Fan     = 'off' | 'low' | 'high'
export type Blinds  = 'open' | 'closed'
export type Monitor = 'on' | 'off'
export type Pose    = 'desk' | 'bed'

export type FocusItem =
  | { kind: 'scene'; id: SceneId }
  | { kind: 'device'; id: DeviceId }

export interface SmartRoomState {
  monitor: Monitor
  lights: Lights
  fan: Fan
  blinds: Blinds
  activeScene: SceneId | 'manual'
  pose: Pose
  headphones: boolean
  lastAction: string
}
