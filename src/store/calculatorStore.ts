import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Expense {
  id: string
  category: string
  amount: number
}

export interface CalculatorState {
  // Step 1: Budget
  expenses: Expense[]
  totalMonthlyBudget: number

  // Step 2: Future Value Inputs
  currentAge: number
  retirementAge: number
  lifeExpectancy: number
  inflationRate: number

  // Step 3: NPV Inputs
  expectedReturn: number

  // Step 4: Gap Analysis
  currentInvestments: number

  // Calculated Results
  results: {
    futureMonthlyBudget?: number
    futureAnnualBudget?: number
    totalRetirementNeeded?: number
    fvCurrentInvestments?: number
    savingsGap?: number
    annualSavingsGoal?: number
    monthlySavingsGoal?: number
  }

  // Actions
  addExpense: (category: string, amount: number) => void
  removeExpense: (id: string) => void
  updateExpense: (id: string, category: string, amount: number) => void
  setStep2Data: (data: {
    currentAge: number
    retirementAge: number
    lifeExpectancy: number
    inflationRate: number
  }) => void
  setStep3Data: (expectedReturn: number) => void
  setStep4Data: (currentInvestments: number) => void
  setResults: (results: CalculatorState['results']) => void
  loadPlan: (planData: Omit<CalculatorState, 'addExpense' | 'removeExpense' | 'updateExpense' | 'setStep2Data' | 'setStep3Data' | 'setStep4Data' | 'setResults' | 'reset' | 'loadPlan'>) => void
  reset: () => void
}

const initialState = {
  expenses: [],
  totalMonthlyBudget: 0,
  currentAge: 35,
  retirementAge: 65,
  lifeExpectancy: 90,
  inflationRate: 0.03,
  expectedReturn: 0.07,
  currentInvestments: 0,
  results: {},
}

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addExpense: (category, amount) => {
        const newExpense: Expense = {
          id: crypto.randomUUID(),
          category,
          amount,
        }
        set((state) => {
          const expenses = [...state.expenses, newExpense]
          const totalMonthlyBudget = expenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
          )
          return { expenses, totalMonthlyBudget }
        })
      },

      removeExpense: (id) => {
        set((state) => {
          const expenses = state.expenses.filter((exp) => exp.id !== id)
          const totalMonthlyBudget = expenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
          )
          return { expenses, totalMonthlyBudget }
        })
      },

      updateExpense: (id, category, amount) => {
        set((state) => {
          const expenses = state.expenses.map((exp) =>
            exp.id === id ? { ...exp, category, amount } : exp
          )
          const totalMonthlyBudget = expenses.reduce(
            (sum, exp) => sum + exp.amount,
            0
          )
          return { expenses, totalMonthlyBudget }
        })
      },

      setStep2Data: (data) => {
        set(data)
      },

      setStep3Data: (expectedReturn) => {
        set({ expectedReturn })
      },

      setStep4Data: (currentInvestments) => {
        set({ currentInvestments })
      },

      setResults: (results) => {
        set({ results })
      },

      loadPlan: (planData) => {
        set({
          expenses: planData.expenses,
          totalMonthlyBudget: planData.totalMonthlyBudget,
          currentAge: planData.currentAge,
          retirementAge: planData.retirementAge,
          lifeExpectancy: planData.lifeExpectancy,
          inflationRate: planData.inflationRate,
          expectedReturn: planData.expectedReturn,
          currentInvestments: planData.currentInvestments,
          results: planData.results,
        })
      },

      reset: () => {
        set(initialState)
      },
    }),
    {
      name: 'calculator-storage',
    }
  )
)
