import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Pet } from '../../../types/pet'

interface Props {
  pets: Pet[]
  selectedPetId: string | null
  onSelect: (petId: string) => void
  onAdd: (name: string, species: string) => void
}

export function PetProfiles({ pets, selectedPetId, onSelect, onAdd }: Props) {
  const { t } = useTranslation('pets')
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [formOpen, setFormOpen] = useState(pets.length === 0)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) return

    onAdd(name.trim(), species.trim())
    setName('')
    setSpecies('')
    setFormOpen(false)
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center gap-2">
        {pets.map((pet) => (
          <button
            key={pet.id}
            onClick={() => onSelect(pet.id)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              pet.id === selectedPetId
                ? 'border-ledger-green bg-ledger-green text-paper'
                : 'border-ink/15 text-ink/70 hover:border-ink/30 dark:border-white/15 dark:text-slate-300 dark:hover:border-white/30'
            }`}
          >
            {pet.name}
          </button>
        ))}

        <button
          onClick={() => setFormOpen((open) => !open)}
          className="rounded-full border border-dashed border-ink/25 px-4 py-1.5 text-sm text-ink/50 transition-colors hover:border-ink/40 hover:text-ink/70 dark:border-white/20 dark:text-slate-400 dark:hover:border-white/40"
        >
          + {t('addPet')}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-wrap gap-2">
          <input
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('petNamePlaceholder')}
            className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <input
            value={species}
            onChange={(event) => setSpecies(event.target.value)}
            placeholder={t('petSpeciesPlaceholder')}
            className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink/35 focus:border-ledger-green dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink px-4 text-sm font-medium text-paper transition-colors hover:bg-ink/85 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
          >
            {t('addPet')}
          </button>
        </form>
      )}
    </div>
  )
}
