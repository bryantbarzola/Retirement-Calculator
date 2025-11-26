"use server"

import { auth } from "@/lib/auth"
import { savePlan, updatePlan } from "@/lib/supabase/retirementPlans"
import { CalculatorState } from "@/store/calculatorStore"

export async function savePlanAction(planName: string, planData: CalculatorState, planId?: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to save a plan")
  }

  try {
    if (planId) {
      // Update existing plan
      const updatedPlan = await updatePlan(planId, planName, planData)
      return { success: true, plan: updatedPlan }
    } else {
      // Create new plan
      const newPlan = await savePlan(session.user.id, planName, planData)
      return { success: true, plan: newPlan }
    }
  } catch (error) {
    console.error("Error saving plan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save plan"
    }
  }
}
