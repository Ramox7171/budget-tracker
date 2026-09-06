import type { Account, Transaction } from '../types/finance'
import type { BudgetState, Entry, SavedBudget } from '../modules/simulator/types'
import type { PetTrackerState } from '../types/pet'
import type { CarTrackerState } from '../types/car'
import { writeJson } from './storage'

const DEMO_KEYS = [
  'accounts-state',
  'budget-tracker-state',
  'budget-tracker-saved-budgets',
  'pet-tracker-state',
  'car-tracker-state',
] as const

const AUTO_SEED_FLAG = 'demo-auto-seeded'

function daysAgo(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().slice(0, 10)
}


function monthDay(monthsAgo: number, day: number): string {
  const now = new Date()
  const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day)
  return date.toISOString().slice(0, 10)
}

interface Row {
  date: string
  description: string
  category: string | null
  amount: number
}

function buildAccountsState() {
  const checkingId = crypto.randomUUID()
  const savingsId = crypto.randomUUID()

  const accounts: Account[] = [
    { id: checkingId, name: 'Konto osobiste', openingBalance: 2400, createdAt: Date.now() },
    { id: savingsId, name: 'Oszczędności', openingBalance: 8000, createdAt: Date.now() },
  ]

  const rows: Row[] = [
    
    { date: monthDay(5, 3), description: 'Wypłata', category: null, amount: 6200 },
    { date: monthDay(5, 4), description: 'Czynsz', category: 'Mieszkanie', amount: -1650 },
    { date: monthDay(5, 6), description: 'Biedronka', category: 'Jedzenie', amount: -92 },
    { date: monthDay(5, 9), description: 'Orlen', category: 'Transport', amount: -170 },
    { date: monthDay(5, 12), description: 'Play', category: 'Rachunki', amount: -55 },
    { date: monthDay(5, 15), description: 'Lidl', category: 'Jedzenie', amount: -105 },
    { date: monthDay(5, 18), description: 'Prąd', category: 'Rachunki', amount: -195 },
    { date: monthDay(5, 22), description: 'Kino', category: 'Rozrywka', amount: -42 },
    { date: monthDay(5, 26), description: 'Rossmann', category: 'Zdrowie', amount: -68 },

    
    { date: monthDay(4, 3), description: 'Wypłata', category: null, amount: 6200 },
    { date: monthDay(4, 5), description: 'Czynsz', category: 'Mieszkanie', amount: -1650 },
    { date: monthDay(4, 7), description: 'Biedronka', category: 'Jedzenie', amount: -78 },
    { date: monthDay(4, 10), description: 'Uber', category: 'Transport', amount: -31 },
    { date: monthDay(4, 13), description: 'Netflix', category: 'Rozrywka', amount: -43 },
    { date: monthDay(4, 16), description: 'Apteka Dr Max', category: 'Zdrowie', amount: -60 },
    { date: monthDay(4, 19), description: 'Lidl', category: 'Jedzenie', amount: -118 },
    { date: monthDay(4, 23), description: 'Internet', category: 'Rachunki', amount: -70 },
    { date: monthDay(4, 27), description: 'Restauracja Sushi', category: 'Rozrywka', amount: -95 },

    
    { date: monthDay(3, 3), description: 'Wypłata', category: null, amount: 6200 },
    { date: monthDay(3, 4), description: 'Czynsz', category: 'Mieszkanie', amount: -1650 },
    { date: monthDay(3, 8), description: 'Media Expert', category: 'Inne', amount: -420 },
    { date: monthDay(3, 11), description: 'Biedronka', category: 'Jedzenie', amount: -88 },
    { date: monthDay(3, 14), description: 'Orlen', category: 'Transport', amount: -160 },
    { date: monthDay(3, 17), description: 'Play', category: 'Rachunki', amount: -55 },
    { date: monthDay(3, 21), description: 'Rossmann', category: 'Zdrowie', amount: -72 },

    
    { date: monthDay(2, 3), description: 'Wypłata', category: null, amount: 6200 },
    { date: monthDay(2, 5), description: 'Czynsz', category: 'Mieszkanie', amount: -1650 },
    { date: monthDay(2, 8), description: 'Biedronka', category: 'Jedzenie', amount: -95 },
    { date: monthDay(2, 11), description: 'Prąd', category: 'Rachunki', amount: -205 },
    { date: monthDay(2, 14), description: 'Kino', category: 'Rozrywka', amount: -48 },
    { date: monthDay(2, 18), description: 'Lidl', category: 'Jedzenie', amount: -112 },
    { date: monthDay(2, 22), description: 'Orlen', category: 'Transport', amount: -175 },
    { date: monthDay(2, 26), description: 'Apteka Dr Max', category: 'Zdrowie', amount: -54 },

    
    { date: monthDay(1, 3), description: 'Wypłata', category: null, amount: 6200 },
    { date: monthDay(1, 4), description: 'Czynsz', category: 'Mieszkanie', amount: -1650 },
    { date: monthDay(1, 7), description: 'Biedronka', category: 'Jedzenie', amount: -101 },
    { date: monthDay(1, 10), description: 'Uber', category: 'Transport', amount: -29 },
    { date: monthDay(1, 13), description: 'Netflix', category: 'Rozrywka', amount: -43 },
    { date: monthDay(1, 16), description: 'Empik', category: 'Inne', amount: -68 },
    { date: monthDay(1, 19), description: 'Lidl', category: 'Jedzenie', amount: -122 },
    { date: monthDay(1, 23), description: 'Internet', category: 'Rachunki', amount: -70 },
    { date: monthDay(1, 27), description: 'Prezent urodzinowy', category: 'Inne', amount: -180 },

   
    { date: daysAgo(1), description: 'Biedronka', category: 'Jedzenie', amount: -84.32 },
    { date: daysAgo(2), description: 'Żabka', category: 'Jedzenie', amount: -19.5 },
    { date: daysAgo(4), description: 'Przelew na oszczędności', category: null, amount: -500 },
    { date: daysAgo(5), description: 'Uber', category: 'Transport', amount: -27.4 },
    { date: daysAgo(8), description: 'Apteka Dr Max', category: 'Zdrowie', amount: -56.9 },
  ]

  const transactions: Transaction[] = rows.map((row) => ({
    id: crypto.randomUUID(),
    accountId: checkingId,
    date: row.date,
    description: row.description,
    category: row.category,
    amount: row.amount,
    source: 'import',
    createdAt: Date.now(),
  }))

  transactions.push({
    id: crypto.randomUUID(),
    accountId: savingsId,
    date: daysAgo(4),
    description: 'Wpłata z konta osobistego',
    category: null,
    amount: 500,
    source: 'manual',
    createdAt: Date.now(),
  })

  return { accounts, transactions }
}

function buildBudgetState(): BudgetState {
  const entries: Entry[] = [
    { id: crypto.randomUUID(), label: 'Zakupy spożywcze', amount: 450, checked: true, createdAt: Date.now() },
    { id: crypto.randomUUID(), label: 'Paliwo', amount: 320, checked: true, createdAt: Date.now() },
    { id: crypto.randomUUID(), label: 'Rozrywka', amount: 150, checked: false, createdAt: Date.now() },
    { id: crypto.randomUUID(), label: 'Prezent urodzinowy', amount: 120, checked: false, createdAt: Date.now() },
  ]

  return { budget: 1500, entries }
}

function buildSavedBudgets(): SavedBudget[] {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Sierpień 2026',
      budget: 1400,
      entries: [
        { id: crypto.randomUUID(), label: 'Zakupy spożywcze', amount: 480, checked: true, createdAt: Date.now() },
        { id: crypto.randomUUID(), label: 'Paliwo', amount: 300, checked: true, createdAt: Date.now() },
        { id: crypto.randomUUID(), label: 'Wyjście do kina', amount: 90, checked: true, createdAt: Date.now() },
      ],
      savedAt: Date.now(),
    },
  ]
}

function buildPetState(): PetTrackerState {
  const petId = crypto.randomUUID()

  return {
    pets: [{ id: petId, name: 'Reksio', species: 'pies', createdAt: Date.now() }],
    expenses: [
      {
        id: crypto.randomUUID(),
        petId,
        description: 'Karma sucha 10kg',
        amount: 189,
        category: 'FOOD',
        createdAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        petId,
        description: 'Wizyta kontrolna',
        amount: 150,
        category: 'VET',
        createdAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        petId,
        description: 'Szczepienie',
        amount: 220,
        category: 'VET',
        createdAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        petId,
        description: 'Smycz i obroża',
        amount: 85,
        category: 'ACCESSORIES',
        createdAt: Date.now(),
      },
    ],
    funds: [{ petId, goal: 2000, collected: 750 }],
  }
}

function buildCarState(): CarTrackerState {
  const vehicleId = crypto.randomUUID()

  return {
    vehicles: [
      {
        id: vehicleId,
        name: 'Škoda Octavia II 1.9 TDI',
        engineCode: 'BXE',
        vin: 'TMBJK25J1234567XX',
        purchaseDate: daysAgo(600),
        firstRegistrationDate: daysAgo(6000),
        purchasePrice: 14500,
        createdAt: Date.now(),
      },
    ],
    services: [
      {
        id: crypto.randomUUID(),
        vehicleId,
        mileage: 210000,
        date: daysAgo(300),
        note: 'Wymiana oleju i filtrów',
        totalCost: 380,
        items: [
          { id: crypto.randomUUID(), name: 'Olej', detail: 'Castrol 5W40' },
          { id: crypto.randomUUID(), name: 'Filtr oleju', detail: 'Bosch' },
          { id: crypto.randomUUID(), name: 'Filtr powietrza', detail: 'Mann' },
        ],
        createdAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        vehicleId,
        mileage: 218000,
        date: daysAgo(90),
        note: 'Przegląd okresowy',
        totalCost: 210,
        items: [{ id: crypto.randomUUID(), name: 'Filtr kabinowy', detail: 'Filtron' }],
        createdAt: Date.now(),
      },
    ],
    insurancePeriods: [
      {
        id: crypto.randomUUID(),
        vehicleId,
        label: 'OC/AC rocznie',
        amount: 1250,
        date: daysAgo(200),
        createdAt: Date.now(),
      },
    ],
    expenses: [
      {
        id: crypto.randomUUID(),
        vehicleId,
        description: 'Klocki hamulcowe przód',
        detail: 'ATE',
        amount: 240,
        date: daysAgo(150),
        mileage: 214000,
        createdAt: Date.now(),
      },
      {
        id: crypto.randomUUID(),
        vehicleId,
        description: 'Wymiana żarówki',
        detail: null,
        amount: 25,
        date: daysAgo(40),
        mileage: null,
        createdAt: Date.now(),
      },
    ],
  }
}

export function seedDemoData(): void {
  writeJson('accounts-state', buildAccountsState())
  writeJson('budget-tracker-state', buildBudgetState())
  writeJson('budget-tracker-saved-budgets', buildSavedBudgets())
  writeJson('pet-tracker-state', buildPetState())
  writeJson('car-tracker-state', buildCarState())
}

export function clearAllData(): void {
  for (const key of DEMO_KEYS) {
    localStorage.removeItem(key)
  }
}

export function hasAnyData(): boolean {
  return DEMO_KEYS.some((key) => localStorage.getItem(key) !== null)
}


export function autoSeedIfEmpty(): void {
  if (localStorage.getItem(AUTO_SEED_FLAG)) return

  if (!hasAnyData()) {
    seedDemoData()
  }

  localStorage.setItem(AUTO_SEED_FLAG, 'true')
}
