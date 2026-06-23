import {
  Clapperboard,
  Music2,
  Globe,
  Calendar,
  MessageCircle,
  CloudSun,
  ImageIcon,
  Sparkles,
  Disc3,
  Map,
  Gamepad2,
  House,
  type LucideIcon,
} from 'lucide-react'

export type ManifestApp = {
  id: string
  name: string
  tagline: string
  icon: LucideIcon
}

export const APPS: ManifestApp[] = [
  { id: 'spotify', name: 'Spotify', tagline: 'Listening now', icon: Music2 },
  { id: 'browser', name: 'Browser', tagline: 'Explore', icon: Globe },
  { id: 'calendar', name: 'Calendar', tagline: 'Today · 4 events', icon: Calendar },
  { id: 'messages', name: 'Messages', tagline: '3 new', icon: MessageCircle },
  { id: 'weather', name: 'Weather', tagline: '21° · Clear', icon: CloudSun },
  { id: 'photos', name: 'Photos', tagline: '2,481 items', icon: ImageIcon },
  { id: 'movies', name: 'Movies', tagline: 'Your library', icon: Clapperboard },
  { id: 'snake', name: 'Snake', tagline: 'High score chase', icon: Gamepad2 },
  { id: 'assistant', name: 'AI Assistant', tagline: 'Ready', icon: Sparkles },
  { id: 'music', name: 'Music', tagline: 'Library', icon: Disc3 },
  { id: 'maps', name: 'Maps', tagline: 'Nearby', icon: Map },
  { id: 'smartroom', name: 'Smart Room', tagline: 'Set the scene', icon: House },
]
