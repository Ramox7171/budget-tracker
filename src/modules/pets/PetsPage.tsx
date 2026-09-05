import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePetBudget } from './hooks/usePetBudget'
import { PetProfiles } from './components/PetProfiles'
import { EmergencyFundCard } from './components/EmergencyFundCard'
import { PetExpenseForm } from './components/PetExpenseForm'
import { PetExpenseList } from './components/PetExpenseList'

export function PetsPage() {
  const { t } = useTranslation('pets')
  const {
    pets,
    addPet,
    addExpense,
    removeExpense,
    updateExpense,
    setFundGoal,
    adjustFund,
    expensesForPet,
    fundForPet,
  } = usePetBudget()

  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id ?? null)

  useEffect(() => {
    if (!selectedPetId && pets.length > 0) {
      setSelectedPetId(pets[0].id)
    }
  }, [pets, selectedPetId])

  const handleAddPet = (name: string, species: string) => {
    const id = addPet(name, species)
    setSelectedPetId(id)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-lg font-semibold tracking-tight">{t('title')}</h1>
      <p className="mb-6 text-sm text-ink/50 dark:text-slate-400">{t('subtitle')}</p>

      <PetProfiles
        pets={pets}
        selectedPetId={selectedPetId}
        onSelect={setSelectedPetId}
        onAdd={handleAddPet}
      />

      {selectedPetId && (
        <>
          <div className="mt-6">
            <EmergencyFundCard
              fund={fundForPet(selectedPetId)}
              onSetGoal={(goal) => setFundGoal(selectedPetId, goal)}
              onAdjust={(delta) => adjustFund(selectedPetId, delta)}
            />
          </div>

          <p className="mb-2 mt-6 text-sm font-medium text-ink/70 dark:text-slate-300">
            {t('expenses')}
          </p>

          <PetExpenseForm
            onAdd={(description, amount, category) =>
              addExpense(selectedPetId, description, amount, category)
            }
          />

          <div className="mt-4">
            <PetExpenseList
              expenses={expensesForPet(selectedPetId)}
              onRemove={removeExpense}
              onUpdate={updateExpense}
            />
          </div>
        </>
      )}

      {pets.length === 0 && (
        <p className="mt-6 text-center text-sm text-ink/40 dark:text-slate-500">{t('noPets')}</p>
      )}
    </div>
  )
}
