import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  sessionId: string | null
  getOrCreateSessionId: () => string
  clearSession: () => void
}

const generateId = () => crypto.randomUUID()

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      getOrCreateSessionId: () => {
        const current = get().sessionId
        if (current) return current
        const newId = generateId()
        set({ sessionId: newId })
        return newId
      },
      clearSession: () => {
        set({ sessionId: generateId() })
      },
    }),
    {
      name: 'chat-session',
    }
  )
)
