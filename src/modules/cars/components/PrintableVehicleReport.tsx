import { useTranslation } from 'react-i18next'
import type { CarExpense, CarInsurancePeriod, CarService, Vehicle } from '../../../types/car'

interface Totals {
  costWithoutInsurance: number
  insuranceCost: number
  grandTotal: number
}

interface Props {
  vehicle: Vehicle
  services: CarService[]
  insurancePeriods: CarInsurancePeriod[]
  expenses: CarExpense[]
  totals: Totals
}

// Renderowany tylko na wydruku (hidden print:block) - świadomie osobny,
// prosty layout zamiast recyklingu kart z ekranu, bo karty z tłem i
// ciemnym motywem nie drukują się czytelnie.
export function PrintableVehicleReport({ vehicle, services, insurancePeriods, expenses, totals }: Props) {
  const { t, i18n } = useTranslation('cars')

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'PLN' }).format(value)

  const formatDate = (isoDate: string) =>
    isoDate
      ? new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
          new Date(isoDate),
        )
      : '—'

  const headerLine = [
    vehicle.engineCode && `${t('engineCodeLabel')}: ${vehicle.engineCode}`,
    vehicle.vin && `${t('vinLabel')}: ${vehicle.vin}`,
  ]
    .filter(Boolean)
    .join('   ·   ')

  const purchaseLine = [
    `${t('purchaseDateLabel')}: ${formatDate(vehicle.purchaseDate)} (${formatMoney(vehicle.purchasePrice)})`,
    vehicle.firstRegistrationDate && `${t('firstRegistrationLabel')}: ${formatDate(vehicle.firstRegistrationDate)}`,
  ]
    .filter(Boolean)
    .join('   ·   ')

  return (
    <div className="hidden print:block print:text-black">
      <h1 className="text-2xl font-semibold">{vehicle.name}</h1>
      {headerLine && <p className="mt-1 text-sm text-neutral-600">{headerLine}</p>}
      <p className="text-sm text-neutral-600">{purchaseLine}</p>

      <div className="mt-4 flex gap-8 border-y border-neutral-300 py-3 text-sm">
        <p>
          {t('costWithoutInsurance')}: <strong>{formatMoney(totals.costWithoutInsurance)}</strong>
        </p>
        <p>
          {t('insuranceTotal')}: <strong>{formatMoney(totals.insuranceCost)}</strong>
        </p>
        <p>
          {t('printGrandTotal')}: <strong>{formatMoney(totals.grandTotal)}</strong>
        </p>
      </div>

      {services.length > 0 && (
        <section className="mt-6 break-inside-avoid">
          <h2 className="text-base font-semibold">{t('servicesTitle')}</h2>
          <table className="mt-2 w-full border-collapse text-sm">
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="break-inside-avoid border-b border-neutral-200 align-top">
                  <td className="whitespace-nowrap py-2 pr-3">{formatDate(service.date)}</td>
                  <td className="whitespace-nowrap py-2 pr-3">
                    {service.mileage !== null
                      ? t('mileageValue', { value: service.mileage.toLocaleString(i18n.language) })
                      : '—'}
                  </td>
                  <td className="py-2 pr-3">
                    {service.note && <p>{service.note}</p>}
                    {service.items.length > 0 && (
                      <p className="text-neutral-600">
                        {service.items
                          .map((item) => (item.detail ? `${item.name} (${item.detail})` : item.name))
                          .join(', ')}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-2 text-right font-medium">{formatMoney(service.totalCost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {insurancePeriods.length > 0 && (
        <section className="mt-6 break-inside-avoid">
          <h2 className="text-base font-semibold">{t('insuranceTitle')}</h2>
          <table className="mt-2 w-full border-collapse text-sm">
            <tbody>
              {insurancePeriods.map((period) => (
                <tr key={period.id} className="border-b border-neutral-200">
                  <td className="whitespace-nowrap py-2 pr-3">{formatDate(period.date)}</td>
                  <td className="py-2 pr-3">{period.label}</td>
                  <td className="whitespace-nowrap py-2 text-right font-medium">{formatMoney(period.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {expenses.length > 0 && (
        <section className="mt-6 break-inside-avoid">
          <h2 className="text-base font-semibold">{t('expensesTitle')}</h2>
          <table className="mt-2 w-full border-collapse text-sm">
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-neutral-200 align-top">
                  <td className="whitespace-nowrap py-2 pr-3">{formatDate(expense.date)}</td>
                  <td className="py-2 pr-3">
                    {expense.description}
                    {expense.detail && <span className="text-neutral-600"> — {expense.detail}</span>}
                    {expense.mileage !== null && (
                      <span className="text-neutral-500">
                        {' '}
                        ({t('mileageValue', { value: expense.mileage.toLocaleString(i18n.language) })})
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-2 text-right font-medium">{formatMoney(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <p className="mt-8 text-xs text-neutral-400">
        {t('printGeneratedOn', {
          date: new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(new Date()),
        })}
      </p>
    </div>
  )
}
