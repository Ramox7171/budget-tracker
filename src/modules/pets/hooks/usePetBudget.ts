import { useEffect, useState } from 'react'
import type { Pet, PetEmergencyFund, PetExpense, PetExpenseCategory, PetTrackerState } from '../../../types/pet'
import { readJson, writeJson } from '../../../lib/storage'

const STORAGE_KEY = 'pet-tracker-state'
const EMPTY_STATE: PetTrackerState = { pets: [], expenses: [], funds: [] }

export function usePetBudget() {
  const [state, setState] = useState<PetTrackerState>(() => readJson(STORAGE_KEY, EMPTY_STATE))

  useEffect(() => {
    writeJson(STORAGE_KEY, state)
  }, [state])

  const addPet = (name: string, species: string) => {
    const pet: Pet = { id: crypto.randomUUID(), name, species, createdAt: Date.now() }
    const fund: PetEmergencyFund = { petId: pet.id, goal: 0, collected: 0 }
    setState((prev) => ({ ...prev, pets: [...prev.pets, pet], funds: [...prev.funds, fund] }))
    return pet.id
  }

  const removePet = (petId: string) => {
    setState((prev) => ({
      pets: prev.pets.filter((pet) => pet.id !== petId),
      expenses: prev.expenses.filter((expense) => expense.petId !== petId),
      funds: prev.funds.filter((fund) => fund.petId !== petId),
    }))
  }

  const addExpense = (petId: string, description: string, amount: number, category: PetExpenseCategory) => {
    const expense: PetExpense = {
      id: crypto.randomUUID(),
      petId,
      description,
      amount,
      category,
      createdAt: Date.now(),
    }
    setState((prev) => ({ ...prev, expenses: [expense, ...prev.expenses] }))
  }

  const removeExpense = (expenseId: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((expense) => expense.id !== expenseId),
    }))
  }

  const updateExpense = (
    expenseId: string,
    description: string,
    amount: number,
    category: PetExpenseCategory,
  ) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.map((expense) =>
        expense.id === expenseId ? { ...expense, description, amount, category } : expense,
      ),
    }))
  }

  const setFundGoal = (petId: string, goal: number) => {
    setState((prev) => ({
      ...prev,
      funds: prev.funds.map((fund) => (fund.petId === petId ? { ...fund, goal } : fund)),
    }))
  }

  const adjustFund = (petId: string, delta: number) => {
    setState((prev) => ({
      ...prev,
      funds: prev.funds.map((fund) =>
        fund.petId === petId
          ? { ...fund, collected: Math.max(0, fund.collected + delta) }
          : fund,
      ),
    }))
  }

  const expensesForPet = (petId: string) =>
    state.expenses.filter((expense) => expense.petId === petId)

  const fundForPet = (petId: string): PetEmergencyFund =>
    state.funds.find((fund) => fund.petId === petId) ?? { petId, goal: 0, collected: 0 }

  return {
    pets: state.pets,
    addPet,
    removePet,
    addExpense,
    removeExpense,
    updateExpense,
    setFundGoal,
    adjustFund,
    expensesForPet,
    fundForPet,
  }
}
