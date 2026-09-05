import { createContext, ReactNode, useContext, useState } from 'react'
import { hashPin } from './pin'

const PIN_KEY = 'app-pin-hash'
const SESSION_KEY = 'app-unlocked'

interface LockContextValue {
  hasPin: boolean
  isLocked: boolean
  setPin: (pin: string) => Promise<void>
  removePin: () => void
  unlock: (pin: string) => Promise<boolean>
  lockNow: () => void
}

const LockContext = createContext<LockContextValue | null>(null)

export function LockProvider({ children }: { children: ReactNode }) {
  const [pinHash, setPinHash] = useState<string | null>(() => localStorage.getItem(PIN_KEY))
  const [unlocked, setUnlocked] = useState<boolean>(() => sessionStorage.getItem(SESSION_KEY) === 'true')

  const setPin = async (pin: string) => {
    const hash = await hashPin(pin)
    localStorage.setItem(PIN_KEY, hash)
    setPinHash(hash)
    sessionStorage.setItem(SESSION_KEY, 'true')
    setUnlocked(true)
  }

  const removePin = () => {
    localStorage.removeItem(PIN_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setPinHash(null)
    setUnlocked(false)
  }

  const unlock = async (pin: string) => {
    const hash = await hashPin(pin)
    if (hash !== pinHash) return false

    sessionStorage.setItem(SESSION_KEY, 'true')
    setUnlocked(true)
    return true
  }

  const lockNow = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setUnlocked(false)
  }

  return (
    <LockContext.Provider
      value={{
        hasPin: pinHash !== null,
        isLocked: pinHash !== null && !unlocked,
        setPin,
        removePin,
        unlock,
        lockNow,
      }}
    >
      {children}
    </LockContext.Provider>
  )
}

export function useLock() {
  const context = useContext(LockContext)
  if (!context) throw new Error('useLock must be used within LockProvider')
  return context
}
