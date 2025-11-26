import { createAdminClient } from './admin'
import { CalculatorState } from '@/store/calculatorStore'

export interface RetirementPlan {
  id: string
  user_id: string
  plan_name: string
  plan_data: Omit<CalculatorState, 'addExpense' | 'removeExpense' | 'updateExpense' | 'setStep2Data' | 'setStep3Data' | 'setStep4Data' | 'setResults' | 'reset'>
  created_at: string
  updated_at: string
}

export async function savePlan(userId: string, planName: string, planData: CalculatorState) {
  const supabase = createAdminClient()

  // Extract only the data (not the methods) from calculator state
  const dataToSave = {
    expenses: planData.expenses,
    totalMonthlyBudget: planData.totalMonthlyBudget,
    currentAge: planData.currentAge,
    retirementAge: planData.retirementAge,
    lifeExpectancy: planData.lifeExpectancy,
    inflationRate: planData.inflationRate,
    expectedReturn: planData.expectedReturn,
    currentInvestments: planData.currentInvestments,
    results: planData.results,
  }

  const { data, error } = await supabase
    .from('retirement_plans')
    .insert({
      user_id: userId,
      plan_name: planName,
      plan_data: dataToSave,
    })
    .select()
    .single()

  if (error) throw error
  return data as RetirementPlan
}

export async function updatePlan(planId: string, planName: string, planData: CalculatorState) {
  const supabase = createAdminClient()

  // Extract only the data (not the methods) from calculator state
  const dataToSave = {
    expenses: planData.expenses,
    totalMonthlyBudget: planData.totalMonthlyBudget,
    currentAge: planData.currentAge,
    retirementAge: planData.retirementAge,
    lifeExpectancy: planData.lifeExpectancy,
    inflationRate: planData.inflationRate,
    expectedReturn: planData.expectedReturn,
    currentInvestments: planData.currentInvestments,
    results: planData.results,
  }

  const { data, error } = await supabase
    .from('retirement_plans')
    .update({
      plan_name: planName,
      plan_data: dataToSave,
    })
    .eq('id', planId)
    .select()
    .single()

  if (error) throw error
  return data as RetirementPlan
}

export async function getUserPlans(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('retirement_plans')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data as RetirementPlan[]
}

export async function getPlanById(planId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('retirement_plans')
    .select('*')
    .eq('id', planId)
    .single()

  if (error) throw error
  return data as RetirementPlan
}

export async function deletePlan(planId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('retirement_plans')
    .delete()
    .eq('id', planId)

  if (error) throw error
}
