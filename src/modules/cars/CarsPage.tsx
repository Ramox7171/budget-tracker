import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCarTracker } from './useCarTracker'
import { VehicleProfiles } from './components/VehicleProfiles'
import { VehicleSummaryCard } from './components/VehicleSummaryCard'
import { ServiceForm } from './components/ServiceForm'
import { ServiceList } from './components/ServiceList'
import { InsuranceForm } from './components/InsuranceForm'
import { InsuranceList } from './components/InsuranceList'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { PrintableVehicleReport } from './components/PrintableVehicleReport'
import type { Vehicle } from '../../types/car'

export function CarsPage() {
  const { t } = useTranslation('cars')
  const {
    vehicles,
    addVehicle,
    servicesForVehicle,
    insuranceForVehicle,
    expensesForVehicle,
    addService,
    removeService,
    addInsurancePeriod,
    removeInsurancePeriod,
    updateInsurancePeriod,
    addExpense,
    removeExpense,
    updateExpense,
    totalsForVehicle,
  } = useCarTracker()

  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(vehicles[0]?.id ?? null)

  useEffect(() => {
    if (!selectedVehicleId && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id)
    }
  }, [vehicles, selectedVehicleId])

  const handleAddVehicle = (input: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const id = addVehicle(input)
    setSelectedVehicleId(id)
  }

  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedVehicleId) ?? null
  const totals = selectedVehicle ? totalsForVehicle(selectedVehicle.id) : null

  return (
    <div className="mx-auto max-w-2xl">
      <div className="print:hidden">
        <h1 className="mb-1 text-lg font-semibold tracking-tight">{t('title')}</h1>
        <p className="mb-6 text-sm text-ink/50 dark:text-slate-400">{t('subtitle')}</p>

        <VehicleProfiles
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelect={setSelectedVehicleId}
          onAdd={handleAddVehicle}
        />

        {selectedVehicle && totals && (
          <>
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <VehicleSummaryCard
                  vehicle={selectedVehicle}
                  costWithoutInsurance={totals.costWithoutInsurance}
                  insuranceCost={totals.insuranceCost}
                />
              </div>
              <button
                onClick={() => window.print()}
                className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-ink/15 px-3 py-2 text-xs font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30 dark:hover:text-slate-100"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
                  <path
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    d="M6.5 9V4.5h11V9M6.5 18.5h11V15H6.5v3.5Z"
                  />
                  <rect x="3.5" y="9" width="17" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                {t('printButton')}
              </button>
            </div>

            <p className="mb-2 mt-6 text-sm font-medium text-ink/70 dark:text-slate-300">{t('servicesTitle')}</p>
            <ServiceForm
              onAdd={(mileage, date, note, totalCost, items) =>
                addService(selectedVehicle.id, mileage, date, note, totalCost, items)
              }
            />
            <div className="mt-3">
              <ServiceList services={servicesForVehicle(selectedVehicle.id)} onRemove={removeService} />
            </div>

            <p className="mb-2 mt-6 text-sm font-medium text-ink/70 dark:text-slate-300">{t('insuranceTitle')}</p>
            <InsuranceForm
              onAdd={(label, amount, date) => addInsurancePeriod(selectedVehicle.id, label, amount, date)}
            />
            <div className="mt-3">
              <InsuranceList
              periods={insuranceForVehicle(selectedVehicle.id)}
              onRemove={removeInsurancePeriod}
              onUpdate={updateInsurancePeriod}
            />
            </div>

            <p className="mb-2 mt-6 text-sm font-medium text-ink/70 dark:text-slate-300">{t('expensesTitle')}</p>
            <ExpenseForm
              onAdd={(description, detail, amount, date, mileage) =>
                addExpense(selectedVehicle.id, description, detail, amount, date, mileage)
              }
            />
            <div className="mt-3">
              <ExpenseList
              expenses={expensesForVehicle(selectedVehicle.id)}
              onRemove={removeExpense}
              onUpdate={updateExpense}
            />
            </div>
          </>
        )}

        {vehicles.length === 0 && (
          <p className="mt-6 text-center text-sm text-ink/40 dark:text-slate-500">{t('noVehicles')}</p>
        )}
      </div>

      {selectedVehicle && totals && (
        <PrintableVehicleReport
          vehicle={selectedVehicle}
          services={servicesForVehicle(selectedVehicle.id)}
          insurancePeriods={insuranceForVehicle(selectedVehicle.id)}
          expenses={expensesForVehicle(selectedVehicle.id)}
          totals={totals}
        />
      )}
    </div>
  )
}
