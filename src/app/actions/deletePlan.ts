"use server"

import { auth } from "@/lib/auth"
import { deletePlan, getPlanById } from "@/lib/supabase/retirementPlans"
import { revalidatePath } from "next/cache"

export async function deletePlanAction(planId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to delete a plan")
  }

  try {
    // Verify the plan belongs to the user before deleting
    const plan = await getPlanById(planId)

    if (plan.user_id !== session.user.id) {
      throw new Error("Unauthorized: You can only delete your own plans")
    }

    await deletePlan(planId)

    // Revalidate the dashboard page to show updated plans list
    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error deleting plan:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete plan"
    }
  }
}
