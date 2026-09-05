export type PetExpenseCategory =
  | 'VET'
  | 'FOOD'
  | 'ACCESSORIES'
  | 'GROOMING'
  | 'INSURANCE'
  | 'OTHER'

export interface Pet {
  id: string
  name: string
  species: string
  createdAt: number
}

export interface PetExpense {
  id: string
  petId: string
  description: string
  amount: number
  category: PetExpenseCategory
  createdAt: number
}

export interface PetEmergencyFund {
  petId: string
  goal: number
  collected: number
}

export interface PetTrackerState {
  pets: Pet[]
  expenses: PetExpense[]
  funds: PetEmergencyFund[]
}
