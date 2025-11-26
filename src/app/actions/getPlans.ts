"use server"

import { auth } from "@/lib/auth"
import { getUserPlans } from "@/lib/supabase/retirementPlans"

export async function getPlansAction() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to view plans")
  }

  try {
    const plans = await getUserPlans(session.user.id)
    return { success: true, plans }
  } catch (error) {
    console.error("Error fetching plans:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch plans",
      plans: []
    }
  }
}
