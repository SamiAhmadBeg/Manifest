export type SceneId = 'movie' | 'focus' | 'sleep' | 'alloff'
export type DeviceId = 'lights' | 'fan' | 'blinds' | 'speaker'

export type Lights  = 'off' | 'dim' | 'on'
export type Fan     = 'off' | 'low' | 'high'
export type Blinds  = 'open' | 'closed'
export type Speaker = 'off' | 'on'

export interface SmartRoomState {
  activeScene: SceneId | 'manual'
  lights: Lights
  fan: Fan
  blinds: Blinds
  speaker: Speaker
  focusIndex: number
}

export type FocusItem =
  | { kind: 'scene'; id: SceneId }
  | { kind: 'device'; id: DeviceId }
