export type SceneId = 'movie' | 'focus' | 'sleep' | 'alloff'
export type DeviceId = 'lights' | 'fan' | 'blinds' | 'speaker'

export type Lights = 'off' | 'dim' | 'on'
export type Blinds = 'open' | 'closed'

export interface SmartRoomState {
  activeScene: SceneId | 'manual'
  lights: Lights
  fanOn: boolean
  blinds: Blinds
  speakerOn: boolean
  focusIndex: number
}

export type FocusItem =
  | { kind: 'scene'; id: SceneId }
  | { kind: 'device'; id: DeviceId }
