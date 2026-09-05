import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLock } from '../lib/lock/LockContext'
import { PinPad } from './PinPad'

export function LockScreen() {
  const { t } = useTranslation('settings')
  const { unlock } = useLock()
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (pin.length < 4) return
    let cancelled = false

    const attempt = async () => {
      const success = await unlock(pin)
      if (cancelled) return

      if (!success) {
        setError(true)
        setPin('')
      }
    }

    attempt()

    return () => {
      cancelled = true
    }
  }, [pin, unlock])

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 dark:bg-slate-950">
      <div className="w-full max-w-xs text-center">
        <p className="text-sm text-ink/50 dark:text-slate-400">{t('pinEnterTitle')}</p>

        <div className="mt-6">
          <PinPad
            value={pin}
            onChange={(next) => {
              setError(false)
              setPin(next)
            }}
          />
        </div>

        {error && <p className="mt-4 text-sm text-ledger-red">{t('pinIncorrect')}</p>}
      </div>
    </div>
  )
}
