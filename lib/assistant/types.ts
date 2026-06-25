export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type AssistantPhase = 'idle' | 'listening' | 'thinking' | 'ready' | 'error'
