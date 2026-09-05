import { useState } from 'react'
import type {
  CarExpense,
  CarInsurancePeriod,
  CarService,
  CarServiceItem,
  CarTrackerState,
  Vehicle,
} from '../../types/car'
import { readJson, writeJson } from '../../lib/storage'

const STORAGE_KEY = 'car-tracker-state'
const EMPTY_STATE: CarTrackerState = { vehicles: [], services: [], insurancePeriods: [], expenses: [] }

export function useCarTracker() {
  const [state, setState] = useState<CarTrackerState>(() => readJson(STORAGE_KEY, EMPTY_STATE))

  const persist = (next: CarTrackerState) => {
    setState(next)
    writeJson(STORAGE_KEY, next)
  }

  const addVehicle = (input: Omit<Vehicle, 'id' | 'createdAt'>) => {
    const vehicle: Vehicle = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
    persist({ ...state, vehicles: [...state.vehicles, vehicle] })
    return vehicle.id
  }

  const removeVehicle = (vehicleId: string) => {
    persist({
      vehicles: state.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
      services: state.services.filter((service) => service.vehicleId !== vehicleId),
      insurancePeriods: state.insurancePeriods.filter((period) => period.vehicleId !== vehicleId),
      expenses: state.expenses.filter((expense) => expense.vehicleId !== vehicleId),
    })
  }

  const addService = (
    vehicleId: string,
    mileage: number | null,
    date: string,
    note: string,
    totalCost: number,
    items: Omit<CarServiceItem, 'id'>[],
  ) => {
    const service: CarService = {
      id: crypto.randomUUID(),
      vehicleId,
      mileage,
      date,
      note,
      totalCost,
      items: items.map((item) => ({ ...item, id: crypto.randomUUID() })),
      createdAt: Date.now(),
    }
    persist({ ...state, services: [service, ...state.services] })
  }

  const removeService = (serviceId: string) => {
    persist({ ...state, services: state.services.filter((service) => service.id !== serviceId) })
  }

  const addInsurancePeriod = (vehicleId: string, label: string, amount: number, date: string) => {
    const period: CarInsurancePeriod = {
      id: crypto.randomUUID(),
      vehicleId,
      label,
      amount,
      date,
      createdAt: Date.now(),
    }
    persist({ ...state, insurancePeriods: [period, ...state.insurancePeriods] })
  }

  const removeInsurancePeriod = (periodId: string) => {
    persist({
      ...state,
      insurancePeriods: state.insurancePeriods.filter((period) => period.id !== periodId),
    })
  }

  const updateInsurancePeriod = (periodId: string, label: string, amount: number, date: string) => {
    persist({
      ...state,
      insurancePeriods: state.insurancePeriods.map((period) =>
        period.id === periodId ? { ...period, label, amount, date } : period,
      ),
    })
  }

  const addExpense = (
    vehicleId: string,
    description: string,
    detail: string | null,
    amount: number,
    date: string,
    mileage: number | null,
  ) => {
    const expense: CarExpense = {
      id: crypto.randomUUID(),
      vehicleId,
      description,
      detail,
      amount,
      date,
      mileage,
      createdAt: Date.now(),
    }
    persist({ ...state, expenses: [expense, ...state.expenses] })
  }

  const removeExpense = (expenseId: string) => {
    persist({ ...state, expenses: state.expenses.filter((expense) => expense.id !== expenseId) })
  }

  const updateExpense = (
    expenseId: string,
    description: string,
    detail: string | null,
    amount: number,
    date: string,
    mileage: number | null,
  ) => {
    persist({
      ...state,
      expenses: state.expenses.map((expense) =>
        expense.id === expenseId ? { ...expense, description, detail, amount, date, mileage } : expense,
      ),
    })
  }

  const servicesForVehicle = (vehicleId: string) =>
    state.services
      .filter((service) => service.vehicleId === vehicleId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  const insuranceForVehicle = (vehicleId: string) =>
    state.insurancePeriods
      .filter((period) => period.vehicleId === vehicleId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  const expensesForVehicle = (vehicleId: string) =>
    state.expenses
      .filter((expense) => expense.vehicleId === vehicleId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt)

  const totalsForVehicle = (vehicleId: string) => {
    const serviceCost = servicesForVehicle(vehicleId).reduce((sum, service) => sum + service.totalCost, 0)
    const expenseCost = expensesForVehicle(vehicleId).reduce((sum, expense) => sum + expense.amount, 0)
    const insuranceCost = insuranceForVehicle(vehicleId).reduce((sum, period) => sum + period.amount, 0)

    return {
      costWithoutInsurance: serviceCost + expenseCost,
      insuranceCost,
      grandTotal: serviceCost + expenseCost + insuranceCost,
    }
  }

  return {
    vehicles: state.vehicles,
    addVehicle,
    removeVehicle,
    addService,
    removeService,
    addInsurancePeriod,
    removeInsurancePeriod,
    updateInsurancePeriod,
    addExpense,
    removeExpense,
    updateExpense,
    servicesForVehicle,
    insuranceForVehicle,
    expensesForVehicle,
    totalsForVehicle,
  }
}
