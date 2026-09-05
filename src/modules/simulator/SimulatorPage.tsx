import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BudgetSetup } from './components/BudgetSetup'
import { EntryForm } from './components/EntryForm'
import { EntryList } from './components/EntryList'
import { SummaryPanel } from './components/SummaryPanel'
import { SavedBudgetsList } from './components/SavedBudgetsList'
import { useBudget } from './useBudget'
import { useSavedBudgets } from './useSavedBudgets'
import type { SavedBudget } from './types'

export function SimulatorPage() {
  const { t } = useTranslation('simulator')
  const {
    budget,
    entries,
    spent,
    remaining,
    setBudget,
    addEntry,
    removeEntry,
    updateEntry,
    toggleEntry,
    resetBudget,
    applySnapshot,
    exportToFile,
    importFromFile,
  } = useBudget()

  const { savedBudgets, saveSnapshot, removeSnapshot } = useSavedBudgets()

  const [importError, setImportError] = useState<string | null>(null)

  const handleImport = async (file: File) => {
    try {
      await importFromFile(file)
      setImportError(null)
    } catch {
      setImportError(t('importError'))
    }
  }

  const handleSaveSnapshot = (name: string) => {
    if (budget === null) return
    saveSnapshot(name, budget, entries)
  }

  const handleLoadSnapshot = (snapshot: SavedBudget) => {
    applySnapshot(snapshot.budget, snapshot.entries)
  }

  return (
    <div className="mx-auto max-w-md">
      {importError && (
        <p className="mb-4 rounded-lg bg-ledger-red/10 px-3 py-2 text-sm text-ledger-red">
          {importError}
        </p>
      )}

      {budget === null ? (
        <BudgetSetup onSubmit={setBudget} onImport={handleImport} />
      ) : (
        <>
          <SummaryPanel
            budget={budget}
            spent={spent}
            remaining={remaining}
            onReset={resetBudget}
            onExport={exportToFile}
            onImport={handleImport}
          />

          <div className="mt-6 animate-rise">
            <EntryForm onAdd={addEntry} />
          </div>

          <div className="mt-4 animate-rise">
            <EntryList entries={entries} onRemove={removeEntry} onUpdate={updateEntry} onToggle={toggleEntry} />
          </div>
        </>
      )}

      <div className="mt-8 border-t border-ink/10 pt-6 dark:border-white/10">
        <SavedBudgetsList
          savedBudgets={savedBudgets}
          currentBudget={budget}
          onSave={handleSaveSnapshot}
          onLoad={handleLoadSnapshot}
          onRemove={removeSnapshot}
        />
      </div>
    </div>
  )
}
