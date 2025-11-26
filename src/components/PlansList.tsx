"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RetirementPlan } from "@/lib/supabase/retirementPlans"
import { useCalculatorStore } from "@/store/calculatorStore"
import { deletePlanAction } from "@/app/actions/deletePlan"

interface PlansListProps {
  plans: RetirementPlan[]
}

export function PlansList({ plans }: PlansListProps) {
  const router = useRouter()
  const { loadPlan } = useCalculatorStore()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleLoadPlan = (plan: RetirementPlan) => {
    // Load the plan data into the calculator store
    loadPlan(plan.plan_data)
    // Navigate to Step 5 to show the complete plan
    router.push("/calculator/step5")
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Are you sure you want to delete this retirement plan?")) {
      return
    }

    setDeletingId(planId)

    try {
      const result = await deletePlanAction(planId)

      if (result.success) {
        // Refresh the page to show updated plans list
        router.refresh()
      } else {
        alert(result.error || "Failed to delete plan")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("An unexpected error occurred while deleting the plan")
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <Card key={plan.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{plan.plan_name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Updated {formatDate(plan.updated_at)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-600">Monthly Budget</p>
                <p className="font-semibold">
                  ${plan.plan_data.totalMonthlyBudget.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Retirement Age</p>
                <p className="font-semibold">{plan.plan_data.retirementAge}</p>
              </div>
              <div>
                <p className="text-gray-600">Monthly Savings Goal</p>
                <p className="font-semibold text-green-600">
                  ${plan.plan_data.results.monthlySavingsGoal?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Total Needed</p>
                <p className="font-semibold text-purple-600">
                  ${plan.plan_data.results.totalRetirementNeeded?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => handleLoadPlan(plan)}
                className="flex-1"
              >
                View Plan
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeletePlan(plan.id)}
                disabled={deletingId === plan.id}
                className="sm:w-auto"
              >
                {deletingId === plan.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
