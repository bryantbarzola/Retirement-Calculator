"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCalculatorStore } from "@/store/calculatorStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateContributionSchedule } from "@/lib/calculations/schedule"

export default function Step5Page() {
  const router = useRouter()
  const {
    currentAge,
    retirementAge,
    currentInvestments,
    expectedReturn,
    results,
    expenses,
    totalMonthlyBudget,
    inflationRate,
    lifeExpectancy
  } = useCalculatorStore()

  const schedule = useMemo(() => {
    if (!results.annualSavingsGoal) return []

    return generateContributionSchedule(
      currentAge,
      retirementAge,
      currentInvestments,
      results.annualSavingsGoal,
      expectedReturn
    )
  }, [currentAge, retirementAge, currentInvestments, results.annualSavingsGoal, expectedReturn])

  const yearsToRetirement = retirementAge - currentAge
  const yearsInRetirement = lifeExpectancy - retirementAge

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Step 5: Your Retirement Plan</h1>
        <p className="text-gray-600">
          Complete savings plan to reach your retirement goals
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Budget Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalMonthlyBudget.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly at Retirement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              ${results.futureMonthlyBudget?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Needed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              ${results.totalRetirementNeeded?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Save Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              ${results.monthlySavingsGoal?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Details */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Plan Assumptions</CardTitle>
            <CardDescription>Key parameters for your retirement plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Age</span>
              <span className="font-semibold">{currentAge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Retirement Age</span>
              <span className="font-semibold">{retirementAge}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Life Expectancy</span>
              <span className="font-semibold">{lifeExpectancy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Years to Save</span>
              <span className="font-semibold">{yearsToRetirement} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Years in Retirement</span>
              <span className="font-semibold">{yearsInRetirement} years</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-sm text-gray-600">Expected Return</span>
              <span className="font-semibold">{(expectedReturn * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Inflation Rate</span>
              <span className="font-semibold">{(inflationRate * 100).toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Your current budget breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{expense.category}</span>
                  <span className="font-semibold">${expense.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span>${totalMonthlyBudget.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Year-by-Year Contribution Schedule</CardTitle>
          <CardDescription>
            How your savings will grow over {yearsToRetirement} years
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="pb-2 font-semibold">Year</th>
                  <th className="pb-2 font-semibold">Age</th>
                  <th className="pb-2 font-semibold text-right">Starting Balance</th>
                  <th className="pb-2 font-semibold text-right">Contribution</th>
                  <th className="pb-2 font-semibold text-right">Investment Growth</th>
                  <th className="pb-2 font-semibold text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.year} className="border-b">
                    <td className="py-2">{row.year}</td>
                    <td className="py-2">{row.age}</td>
                    <td className="py-2 text-right">
                      ${row.startingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2 text-right text-green-600">
                      ${row.contribution.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2 text-right text-blue-600">
                      ${row.investmentGrowth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      ${row.endingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 font-bold">
                <tr>
                  <td colSpan={5} className="py-2">At Retirement (Age {retirementAge})</td>
                  <td className="py-2 text-right text-lg text-green-600">
                    ${schedule[schedule.length - 1]?.endingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.push("/calculator/step4")}>
          ← Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Save Plan
          </Button>
          <Button onClick={() => router.push("/dashboard")}>
            Complete →
          </Button>
        </div>
      </div>
    </div>
  )
}
