"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCalculatorStore } from "@/store/calculatorStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateSavingsGoals } from "@/lib/calculations/savingsGoal"
import ProgressIndicator from "@/components/ProgressIndicator"

export default function Step4Page() {
  const router = useRouter()
  const {
    currentAge,
    retirementAge,
    expectedReturn,
    currentInvestments,
    setStep4Data,
    setResults,
    results
  } = useCalculatorStore()

  const [localCurrentInvestments, setLocalCurrentInvestments] = useState(currentInvestments.toString())

  // Calculate savings goals when inputs change
  useEffect(() => {
    const investments = parseFloat(localCurrentInvestments)

    if (!isNaN(investments) && investments >= 0 && results.totalRetirementNeeded) {
      const yearsToRetirement = retirementAge - currentAge
      const goals = calculateSavingsGoals(
        results.totalRetirementNeeded,
        investments,
        yearsToRetirement,
        expectedReturn
      )

      setResults({
        ...results,
        fvCurrentInvestments: goals.fvCurrentInvestments,
        savingsGap: goals.savingsGap,
        annualSavingsGoal: goals.annualSavingsGoal,
        monthlySavingsGoal: goals.monthlySavingsGoal
      })
    }
  }, [localCurrentInvestments, results.totalRetirementNeeded, currentAge, retirementAge, expectedReturn])

  const handleNext = () => {
    const investments = parseFloat(localCurrentInvestments)

    if (isNaN(investments) || investments < 0) {
      alert("Please enter a valid amount for current investments (0 or greater)")
      return
    }

    if (!results.totalRetirementNeeded) {
      alert("Please complete previous steps first")
      return
    }

    setStep4Data(investments)
    router.push("/calculator/step5")
  }

  const yearsToRetirement = retirementAge - currentAge

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressIndicator currentStep={4} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Step 4: Gap Analysis</h1>
        <p className="text-gray-600">
          Determine how much you need to save to reach your retirement goal
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Current Investments</CardTitle>
            <CardDescription>
              How much have you already saved for retirement?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentInvestments">Current Retirement Savings ($)</Label>
              <Input
                id="currentInvestments"
                type="number"
                step="1000"
                min="0"
                placeholder="0"
                value={localCurrentInvestments}
                onChange={(e) => setLocalCurrentInvestments(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Include 401(k), IRA, brokerage accounts, etc.
              </p>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Years Until Retirement</p>
                <p className="text-lg font-semibold">{yearsToRetirement} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expected Return</p>
                <p className="text-lg font-semibold">{(expectedReturn * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Your retirement savings gap and goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Retirement Goal</p>
              <p className="text-2xl font-bold">
                ${results.totalRetirementNeeded?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}
              </p>
            </div>

            {results.fvCurrentInvestments !== undefined && (
              <>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-1">Current Savings Will Grow To</p>
                  <p className="text-xl font-semibold text-green-600">
                    ${results.fvCurrentInvestments.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    By retirement at {(expectedReturn * 100).toFixed(1)}% return
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-1">Savings Gap</p>
                  <p className="text-xl font-semibold text-orange-600">
                    ${results.savingsGap?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Additional amount you need to save
                  </p>
                </div>

                <div className="border-t pt-4 bg-blue-50 -mx-6 px-6 py-4">
                  <p className="text-sm text-gray-600 mb-2">Your Savings Goals</p>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600">Monthly</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ${results.monthlySavingsGoal?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-600">Annually</p>
                    <p className="text-xl font-semibold text-blue-600">
                      ${results.annualSavingsGoal?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Save this amount for {yearsToRetirement} years to reach your goal
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings Progress Visual */}
      {results.fvCurrentInvestments !== undefined && results.totalRetirementNeeded && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Retirement Savings Progress</CardTitle>
            <CardDescription>
              Visual representation of your savings journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress toward retirement goal</span>
                <span className="font-bold">
                  {((results.fvCurrentInvestments / results.totalRetirementNeeded) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="relative h-10 bg-gray-200 rounded-lg overflow-hidden">
                {/* Current Investments Bar (Green) */}
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-500"
                  style={{
                    width: `${Math.min((results.fvCurrentInvestments / results.totalRetirementNeeded) * 100, 100)}%`
                  }}
                >
                  <div className="h-full flex items-center justify-center text-white font-semibold text-sm px-2">
                    {results.fvCurrentInvestments > results.totalRetirementNeeded * 0.15 && (
                      "Current Savings"
                    )}
                  </div>
                </div>

                {/* Savings Gap Indicator (if not 100%) */}
                {results.fvCurrentInvestments < results.totalRetirementNeeded && (
                  <div className="absolute top-0 right-0 h-full flex items-center text-gray-600 font-medium text-sm px-2">
                    Gap to fill
                  </div>
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded mt-1"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Current Path</p>
                  <p className="text-lg font-bold text-green-600">
                    ${results.fvCurrentInvestments.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((results.fvCurrentInvestments / results.totalRetirementNeeded) * 100).toFixed(1)}% of goal
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded mt-1"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Savings Needed</p>
                  <p className="text-lg font-bold text-orange-600">
                    ${results.savingsGap?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {((results.savingsGap! / results.totalRetirementNeeded) * 100).toFixed(1)}% gap remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Total Goal */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Retirement Goal</span>
                <span className="text-xl font-bold">
                  ${results.totalRetirementNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
        <Button variant="outline" onClick={() => router.push("/calculator/step3")} className="w-full sm:w-auto">
          ← Back
        </Button>
        <Button onClick={handleNext} disabled={!results.monthlySavingsGoal} className="w-full sm:w-auto">
          Next: Savings Plan →
        </Button>
      </div>
    </div>
  )
}
