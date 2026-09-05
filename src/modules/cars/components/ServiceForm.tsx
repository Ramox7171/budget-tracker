import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PartRow {
  id: string
  name: string
  detail: string
}

interface Props {
  onAdd: (
    mileage: number | null,
    date: string,
    note: string,
    totalCost: number,
    items: { name: string; detail: string }[],
  ) => void
}

function emptyRow(): PartRow {
  return { id: crypto.randomUUID(), name: '', detail: '' }
}

export function ServiceForm({ onAdd }: Props) {
  const { t } = useTranslation('cars')
  const [mileage, setMileage] = useState('')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [parts, setParts] = useState<PartRow[]>([emptyRow()])

  const updatePart = (id: string, field: 'name' | 'detail', value: string) => {
    setParts((rows) => rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)))
  }

  const addPartRow = () => setParts((rows) => [...rows, emptyRow()])
  const removePartRow = (id: string) =>
    setParts((rows) => (rows.length > 1 ? rows.filter((row) => row.id !== id) : rows))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const parsedCost = Number(totalCost.replace(',', '.'))
    if (!date || Number.isNaN(parsedCost)) return

    const parsedMileage = mileage.trim() ? Number(mileage.replace(/\s/g, '')) : null
    const finalMileage = parsedMileage !== null && Number.isNaN(parsedMileage) ? null : parsedMileage

    const items = parts
      .filter((row) => row.name.trim())
      .map((row) => ({ name: row.name.trim(), detail: row.detail.trim() }))

    onAdd(finalMileage, date, note.trim(), parsedCost, items)

    setMileage('')
    setDate('')
    setNote('')
    setTotalCost('')
    setParts([emptyRow()])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="flex flex-wrap gap-2">
        <input
          value={mileage}
          onChange={(event) => setMileage(event.target.value)}
          inputMode="numeric"
          placeholder={t('mileagePlaceholder')}
          className="w-32 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="min-w-[9rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        />
        <input
          value={totalCost}
          onChange={(event) => setTotalCost(event.target.value)}
          inputMode="decimal"
          placeholder={t('totalCostPlaceholder')}
          className="w-28 rounded-lg border border-ink/15 bg-white px-3 py-2 text-right font-mono text-sm tabular outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={t('serviceNotePlaceholder')}
        className="w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
      />

      <div className="space-y-2 rounded-xl border border-ink/10 p-3 dark:border-white/10">
        <p className="text-xs font-medium text-ink/50 dark:text-slate-400">{t('partsLabel')}</p>
        {parts.map((row) => (
          <div key={row.id} className="flex flex-wrap gap-2">
            <input
              value={row.name}
              onChange={(event) => updatePart(row.id, 'name', event.target.value)}
              placeholder={t('partNamePlaceholder')}
              className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <input
              value={row.detail}
              onChange={(event) => updatePart(row.id, 'detail', event.target.value)}
              placeholder={t('partDetailPlaceholder')}
              className="min-w-[8rem] flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => removePartRow(row.id)}
              className="shrink-0 text-ink/30 hover:text-ledger-red dark:text-slate-600"
              aria-label={t('removePart')}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPartRow}
          className="text-xs text-ink/50 underline-offset-2 hover:text-ink/80 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
        >
          + {t('addPart')}
        </button>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300 sm:w-auto"
      >
        {t('addService')}
      </button>
    </form>
  )
}
