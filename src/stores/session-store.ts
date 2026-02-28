import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  sessionId: string | null
  getOrCreateSessionId: () => string
  clearSession: () => void
}

const generateId = () => crypto.randomUUID()

const COOKIE_NAME = 'chat-session'

const setSessionCookie = (id: string) => {
  document.cookie = `${COOKIE_NAME}=${id}; path=/; samesite=lax`
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      getOrCreateSessionId: () => {
        const current = get().sessionId
        if (current) {
          setSessionCookie(current)
          return current
        }
        const newId = generateId()
        set({ sessionId: newId })
        setSessionCookie(newId)
        return newId
      },
      clearSession: () => {
        const newId = generateId()
        set({ sessionId: newId })
        setSessionCookie(newId)
      },
    }),
    {
      name: 'chat-session',
    }
  )
)
