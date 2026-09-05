import { useTranslation } from 'react-i18next'
import type { Vehicle } from '../../../types/car'

interface Props {
  vehicle: Vehicle
  costWithoutInsurance: number
  insuranceCost: number
}

export function VehicleSummaryCard({ vehicle, costWithoutInsurance, insuranceCost }: Props) {
  const { t, i18n } = useTranslation('cars')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (isoDate: string) =>
    isoDate
      ? new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(
          new Date(isoDate),
        )
      : '—'

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
        {vehicle.engineCode && (
          <p className="text-ink/60 dark:text-slate-400">
            {t('engineCodeLabel')}: <span className="text-ink dark:text-slate-100">{vehicle.engineCode}</span>
          </p>
        )}
        {vehicle.vin && (
          <p className="truncate text-ink/60 dark:text-slate-400">
            {t('vinLabel')}: <span className="font-mono text-xs text-ink dark:text-slate-100">{vehicle.vin}</span>
          </p>
        )}
        <p className="text-ink/60 dark:text-slate-400">
          {t('purchaseDateLabel')}:{' '}
          <span className="text-ink dark:text-slate-100">{formatDate(vehicle.purchaseDate)}</span>
        </p>
        <p className="text-ink/60 dark:text-slate-400">
          {t('firstRegistrationLabel')}:{' '}
          <span className="text-ink dark:text-slate-100">{formatDate(vehicle.firstRegistrationDate)}</span>
        </p>
      </div>

      <div className="mt-4 grid gap-3 border-t border-ink/10 pt-4 dark:border-white/10 sm:grid-cols-3">
        <div>
          <p className="text-xs text-ink/50 dark:text-slate-400">{t('purchasePriceLabel')}</p>
          <p className="font-mono text-lg font-semibold tabular">{formatMoney(vehicle.purchasePrice)}</p>
        </div>
        <div>
          <p className="text-xs text-ink/50 dark:text-slate-400">{t('costWithoutInsurance')}</p>
          <p className="font-mono text-lg font-semibold tabular text-ink dark:text-slate-100">
            {formatMoney(costWithoutInsurance)}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink/50 dark:text-slate-400">{t('insuranceTotal')}</p>
          <p className="font-mono text-lg font-semibold tabular text-ledger-red">{formatMoney(insuranceCost)}</p>
        </div>
      </div>
    </div>
  )
}
