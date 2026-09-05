import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Vehicle } from '../../../types/car'

interface Props {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onSelect: (vehicleId: string) => void
  onAdd: (input: Omit<Vehicle, 'id' | 'createdAt'>) => void
}

export function VehicleProfiles({ vehicles, selectedVehicleId, onSelect, onAdd }: Props) {
  const { t } = useTranslation('cars')
  const [formOpen, setFormOpen] = useState(vehicles.length === 0)
  const [name, setName] = useState('')
  const [engineCode, setEngineCode] = useState('')
  const [vin, setVin] = useState('')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [firstRegistrationDate, setFirstRegistrationDate] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return

    const parsedPrice = Number(purchasePrice.replace(',', '.'))

    onAdd({
      name: name.trim(),
      engineCode: engineCode.trim(),
      vin: vin.trim(),
      purchaseDate,
      firstRegistrationDate,
      purchasePrice: Number.isNaN(parsedPrice) ? 0 : parsedPrice,
    })

    setName('')
    setEngineCode('')
    setVin('')
    setPurchaseDate('')
    setFirstRegistrationDate('')
    setPurchasePrice('')
    setFormOpen(false)
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            onClick={() => onSelect(vehicle.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              vehicle.id === selectedVehicleId
                ? 'border-ledger-green bg-ledger-green text-paper'
                : 'border-ink/15 text-ink/70 hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30'
            }`}
          >
            {vehicle.name}
          </button>
        ))}

        <button
          onClick={() => setFormOpen((open) => !open)}
          className="rounded-full border border-dashed border-ink/25 px-4 py-1.5 text-sm text-ink/50 transition-colors hover:border-ink/40 hover:text-ink/70 dark:border-white/20 dark:text-slate-400 dark:hover:border-white/40"
        >
          + {t('addVehicle')}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('vehicleNamePlaceholder')}
            className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
          />

          <div className="flex flex-wrap gap-2">
            <input
              value={engineCode}
              onChange={(event) => setEngineCode(event.target.value)}
              placeholder={t('engineCodePlaceholder')}
              className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <input
              value={vin}
              onChange={(event) => setVin(event.target.value)}
              placeholder={t('vinPlaceholder')}
              className="min-w-[12rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs text-ink/50 dark:text-slate-400">
              {t('purchaseDateLabel')}
              <input
                type="date"
                value={purchaseDate}
                onChange={(event) => setPurchaseDate(event.target.value)}
                className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              />
            </label>
            <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-xs text-ink/50 dark:text-slate-400">
              {t('firstRegistrationLabel')}
              <input
                type="date"
                value={firstRegistrationDate}
                onChange={(event) => setFirstRegistrationDate(event.target.value)}
                className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              />
            </label>
            <label className="flex w-32 flex-col gap-1 text-xs text-ink/50 dark:text-slate-400">
              {t('purchasePriceLabel')}
              <input
                value={purchasePrice}
                onChange={(event) => setPurchasePrice(event.target.value)}
                inputMode="decimal"
                placeholder="0"
                className="rounded-lg border border-ink/15 bg-white px-3 py-2 text-right font-mono text-sm tabular outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            {t('addVehicle')}
          </button>
        </form>
      )}
    </div>
  )
}
