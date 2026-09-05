import { useTranslation } from 'react-i18next'
import type { CarService } from '../../../types/car'

interface Props {
  services: CarService[]
  onRemove: (id: string) => void
}

export function ServiceList({ services, onRemove }: Props) {
  const { t, i18n } = useTranslation('cars')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (isoDate: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(
      new Date(isoDate),
    )

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 py-8 text-center dark:border-white/15">
        <p className="text-sm text-ink/40 dark:text-slate-500">{t('noServices')}</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {services.map((service) => (
        <li
          key={service.id}
          className="group rounded-2xl border border-ink/10 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                {service.mileage !== null
                  ? t('mileageValue', { value: service.mileage.toLocaleString(i18n.language) })
                  : t('serviceLabel')}
              </p>
              <p className="text-xs text-ink/40 dark:text-slate-500">
                {formatDate(service.date)}
                {service.note ? ` · ${service.note}` : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="font-mono text-sm tabular text-ink/80 dark:text-slate-200">
                {formatMoney(service.totalCost)}
              </span>
              <button
                onClick={() => onRemove(service.id)}
                className="text-ink/25 opacity-0 transition-opacity hover:text-ledger-red group-hover:opacity-100 dark:text-slate-600"
                aria-label={t('removeService')}
              >
                ✕
              </button>
            </div>
          </div>

          {service.items.length > 0 && (
            <ul className="mt-3 space-y-1 border-t border-ink/10 pt-3 dark:border-white/10">
              {service.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-xs text-ink/60 dark:text-slate-400">
                  <span className="truncate">{item.name}</span>
                  {item.detail && <span className="shrink-0 text-ink/40 dark:text-slate-500">{item.detail}</span>}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}
