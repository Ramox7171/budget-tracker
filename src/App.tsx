import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { MobileNav } from './components/layout/MobileNav'
import { LockScreen } from './components/LockScreen'
import { useLock } from './lib/lock/LockContext'
import { DashboardPage } from './modules/dashboard/DashboardPage'
import { SimulatorPage } from './modules/simulator/SimulatorPage'
import { PetsPage } from './modules/pets/PetsPage'
import { CarsPage } from './modules/cars/CarsPage'
import { AccountsPage } from './modules/accounts/AccountsPage'
import { SettingsPage } from './modules/settings/SettingsPage'

export type ModuleKey = 'dashboard' | 'simulator' | 'pets' | 'cars' | 'accounts' | 'settings'

const PAGES: Record<ModuleKey, () => JSX.Element> = {
  dashboard: DashboardPage,
  simulator: SimulatorPage,
  pets: PetsPage,
  cars: CarsPage,
  accounts: AccountsPage,
  settings: SettingsPage,
}

export default function App() {
  const { isLocked } = useLock()
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard')
  const ActivePage = PAGES[activeModule]

  if (isLocked) {
    return <LockScreen />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar active={activeModule} onSelect={setActiveModule} />
      <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-10 md:pb-10 print:p-0">
        <ActivePage />
      </main>
      <MobileNav active={activeModule} onSelect={setActiveModule} />
    </div>
  )
}
