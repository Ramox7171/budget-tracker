import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { PetEmergencyFund } from '../../../types/pet'

interface Props {
  fund: PetEmergencyFund
  onSetGoal: (goal: number) => void
  onAdjust: (delta: number) => void
}

export function EmergencyFundCard({ fund, onSetGoal, onAdjust }: Props) {
  const { t, i18n } = useTranslation(['pets', 'common'])
  const [goalInput, setGoalInput] = useState(String(fund.goal || ''))
  const [amountInput, setAmountInput] = useState('')
  const [isEditingGoal, setIsEditingGoal] = useState(false)

  useEffect(() => {
    setGoalInput(String(fund.goal || ''))
  }, [fund.goal])

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const handleGoalSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(goalInput.replace(',', '.'))
    if (Number.isNaN(parsed) || parsed < 0) return
    onSetGoal(parsed)
    setIsEditingGoal(false)
  }

  const handleDeleteGoal = () => {
    onSetGoal(0)
    setGoalInput('')
    setIsEditingGoal(false)
  }

  const handleDeposit = () => {
    const parsed = Number(amountInput.replace(',', '.'))
    if (Number.isNaN(parsed) || parsed <= 0) return
    onAdjust(parsed)
    setAmountInput('')
  }

  const handleWithdraw = () => {
    const parsed = Number(amountInput.replace(',', '.'))
    if (Number.isNaN(parsed) || parsed <= 0) return
    onAdjust(-parsed)
    setAmountInput('')
  }

  const progress = fund.goal > 0 ? Math.min(fund.collected / fund.goal, 1) : 0

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink/60 dark:text-slate-400">
          {fund.goal > 0 ? t('pets:goal') : t('pets:emergencyFund')}
        </p>
        {!isEditingGoal && (
          <button
            onClick={() => setIsEditingGoal(true)}
            className="text-xs text-ink/40 underline-offset-2 hover:text-ink/80 hover:underline dark:text-slate-500 dark:hover:text-slate-300"
          >
            {fund.goal > 0 ? t('pets:changeGoal') : t('pets:setGoal')}
          </button>
        )}
      </div>

      <p className="mt-1 font-mono text-2xl font-semibold tabular text-ledger-green">
        {formatMoney(fund.collected)}
        {fund.goal > 0 && (
          <span className="ml-1 text-base font-normal text-ink/40 dark:text-slate-500">
            / {formatMoney(fund.goal)}
          </span>
        )}
      </p>

      {isEditingGoal ? (
        <form onSubmit={handleGoalSubmit} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={goalInput}
            onChange={(event) => setGoalInput(event.target.value)}
            inputMode="decimal"
            placeholder={t('pets:goalPlaceholder')}
            className="flex-1 min-w-[120px] rounded-lg border border-ink/15 bg-white px-3 py-1.5 text-xs outline-none focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            autoFocus
          />
          <button
            type="submit"
            className="rounded-lg bg-ink/10 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/20 dark:bg-white/10 dark:text-slate-200"
          >
            {t('common:save')}
          </button>
          {fund.goal > 0 && (
            <button
              type="button"
              onClick={handleDeleteGoal}
              className="rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
            >
              {t('pets:deleteGoal')}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setGoalInput(String(fund.goal || ''))
              setIsEditingGoal(false)
            }}
            className="text-xs text-ink/40 hover:text-ink/70 dark:text-slate-500"
          >
            {t('common:cancel')}
          </button>
        </form>
      ) : (
        fund.goal > 0 && (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-ledger-green transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        )
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={amountInput}
          onChange={(event) => setAmountInput(event.target.value)}
          inputMode="decimal"
          placeholder={t('pets:amountPlaceholder')}
          className="flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <div className="flex gap-2">
          <button
            onClick={handleDeposit}
            className="flex-1 rounded-lg bg-ledger-green px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ledger-greendark sm:flex-initial"
          >
            {t('pets:deposit')}
          </button>
          <button
            onClick={handleWithdraw}
            className="flex-1 rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 sm:flex-initial"
          >
            {t('pets:withdraw')}
          </button>
        </div>
      </div>
    </div>
  )
}