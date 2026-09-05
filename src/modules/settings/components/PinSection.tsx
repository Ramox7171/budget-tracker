import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLock } from '../../../lib/lock/LockContext'
import { PinPad } from '../../../components/PinPad'

type Step = 'idle' | 'verifyForChange' | 'verifyForRemove' | 'enterNew' | 'confirmNew'

export function PinSection() {
  const { t } = useTranslation(['settings', 'common'])
  const { hasPin, setPin, removePin, unlock, lockNow } = useLock()

  const [step, setStep] = useState<Step>('idle')
  const [input, setInput] = useState('')
  const [pendingPin, setPendingPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const reset = () => {
    setStep('idle')
    setInput('')
    setPendingPin('')
    setError(null)
  }

  const startFlow = (next: Step) => {
    setMessage(null)
    setError(null)
    setStep(next)
  }

  const handleDigits = async (value: string) => {
    setInput(value)
    setError(null)
    if (value.length < 4) return

    if (step === 'verifyForChange' || step === 'verifyForRemove') {
      const ok = await unlock(value)
      if (!ok) {
        setError(t('settings:pinIncorrect'))
        setInput('')
        return
      }

      if (step === 'verifyForRemove') {
        removePin()
        setMessage(t('settings:pinRemoved'))
        reset()
        return
      }

      setStep('enterNew')
      setInput('')
      return
    }

    if (step === 'enterNew') {
      setPendingPin(value)
      setStep('confirmNew')
      setInput('')
      return
    }

    if (step === 'confirmNew') {
      if (value !== pendingPin) {
        setError(t('settings:pinMismatch'))
        setInput('')
        setStep('enterNew')
        setPendingPin('')
        return
      }

      await setPin(value)
      setMessage(t('settings:pinSaved'))
      reset()
    }
  }

  if (step === 'idle') {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
        <p className="text-sm font-medium">{t('settings:pinTitle')}</p>
        <p className="mt-0.5 text-xs text-ink/50 dark:text-slate-400">{t('settings:pinHint')}</p>

        {message && <p className="mt-3 text-xs text-ledger-green">{message}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {!hasPin && (
            <button
              onClick={() => startFlow('enterNew')}
              className="rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
            >
              {t('settings:pinSet')}
            </button>
          )}
          {hasPin && (
            <>
              <button
                onClick={() => startFlow('verifyForChange')}
                className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30"
              >
                {t('settings:pinChange')}
              </button>
              <button
                onClick={() => startFlow('verifyForRemove')}
                className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30"
              >
                {t('settings:pinDisable')}
              </button>
              <button
                onClick={lockNow}
                className="rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30"
              >
                {t('settings:pinLockNow')}
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const stepLabel =
    step === 'verifyForChange' || step === 'verifyForRemove'
      ? t('settings:pinEnterCurrent')
      : step === 'enterNew'
        ? t('settings:pinEnterNew')
        : t('settings:pinConfirmNew')

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{stepLabel}</p>
        <button
          onClick={reset}
          className="text-xs text-ink/40 hover:text-ink/70 dark:text-slate-500 dark:hover:text-slate-300"
        >
          {t('common:cancel')}
        </button>
      </div>

      <div className="mt-4">
        <PinPad value={input} onChange={handleDigits} />
      </div>

      {error && <p className="mt-3 text-center text-xs text-ledger-red">{error}</p>}
    </div>
  )
}
