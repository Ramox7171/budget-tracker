export interface Vehicle {
  id: string
  name: string
  engineCode: string
  vin: string
  purchaseDate: string
  firstRegistrationDate: string
  purchasePrice: number
  createdAt: number
}

export interface CarServiceItem {
  id: string
  name: string
  detail: string
}

export interface CarService {
  id: string
  vehicleId: string
  mileage: number | null
  date: string
  note: string
  totalCost: number
  items: CarServiceItem[]
  createdAt: number
}

export interface CarInsurancePeriod {
  id: string
  vehicleId: string
  label: string
  amount: number
  date: string
  createdAt: number
}

export interface CarExpense {
  id: string
  vehicleId: string
  description: string
  detail: string | null
  amount: number
  date: string
  mileage: number | null
  createdAt: number
}

export interface CarTrackerState {
  vehicles: Vehicle[]
  services: CarService[]
  insurancePeriods: CarInsurancePeriod[]
  expenses: CarExpense[]
}
