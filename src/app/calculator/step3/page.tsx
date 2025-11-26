"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCalculatorStore } from "@/store/calculatorStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculatePVGrowingAnnuity } from "@/lib/calculations/netPresentValue"
import ProgressIndicator from "@/components/ProgressIndicator"

export default function Step3Page() {
  const router = useRouter()
  const {
    retirementAge,
    lifeExpectancy,
    inflationRate,
    expectedReturn,
    setStep3Data,
    setResults,
    results
  } = useCalculatorStore()

  const [localExpectedReturn, setLocalExpectedReturn] = useState((expectedReturn * 100).toFixed(1))

  // Calculate total retirement needed when inputs change
  useEffect(() => {
    const returnRate = parseFloat(localExpectedReturn) / 100

    if (!isNaN(returnRate) && results.futureAnnualBudget) {
      const yearsInRetirement = lifeExpectancy - retirementAge
      const totalNeeded = calculatePVGrowingAnnuity(
        results.futureAnnualBudget,
        returnRate,
        inflationRate,
        yearsInRetirement
      )

      setResults({
        ...results,
        totalRetirementNeeded: totalNeeded
      })
    }
  }, [localExpectedReturn, results.futureAnnualBudget, retirementAge, lifeExpectancy, inflationRate])

  const handleNext = () => {
    const returnRate = parseFloat(localExpectedReturn) / 100

    if (isNaN(returnRate) || returnRate < 0 || returnRate > 0.3) {
      alert("Please enter a valid expected return rate (0-30%)")
      return
    }

    if (!results.futureAnnualBudget) {
      alert("Please complete Step 2 first")
      return
    }

    setStep3Data(returnRate)
    router.push("/calculator/step4")
  }

  const yearsInRetirement = lifeExpectancy - retirementAge

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressIndicator currentStep={3} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Step 3: Total Amount Needed</h1>
        <p className="text-gray-600">
          Calculate the lump sum needed at retirement to fund your expenses
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Return</CardTitle>
            <CardDescription>
              Expected annual return on your retirement investments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
              <Input
                id="expectedReturn"
                type="number"
                step="0.1"
                min="0"
                max="30"
                value={localExpectedReturn}
                onChange={(e) => setLocalExpectedReturn(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Conservative: 5-6% | Moderate: 7-8% | Aggressive: 9-10%
              </p>
            </div>

            <div className="border-t pt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Years in Retirement</p>
                <p className="text-lg font-semibold">{yearsInRetirement} years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Inflation Rate</p>
                <p className="text-lg font-semibold">{(inflationRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle>Retirement Fund Needed</CardTitle>
            <CardDescription>
              Total lump sum required at retirement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Future Annual Budget</p>
              <p className="text-xl font-bold">
                ${results.futureAnnualBudget?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || "0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Per year in retirement (adjusted for inflation)
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-1">Withdrawal Strategy</p>
              <p className="text-sm">
                Growing withdrawals that increase with inflation for {yearsInRetirement} years
              </p>
            </div>

            {results.totalRetirementNeeded && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">Total Lump Sum Needed</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${results.totalRetirementNeeded.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  This amount will fund your retirement for {yearsInRetirement} years, with withdrawals
                  growing at {(inflationRate * 100).toFixed(1)}% annually
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
        <Button variant="outline" onClick={() => router.push("/calculator/step2")} className="w-full sm:w-auto">
          ← Back
        </Button>
        <Button onClick={handleNext} disabled={!results.totalRetirementNeeded} className="w-full sm:w-auto">
          Next: Gap Analysis →
        </Button>
      </div>
    </div>
  )
}
