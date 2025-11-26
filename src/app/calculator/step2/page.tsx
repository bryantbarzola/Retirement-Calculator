"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCalculatorStore } from "@/store/calculatorStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateFutureValue, calculateFutureAnnualValue } from "@/lib/calculations/futureValue"

export default function Step2Page() {
  const router = useRouter()
  const {
    totalMonthlyBudget,
    currentAge,
    retirementAge,
    lifeExpectancy,
    inflationRate,
    setStep2Data,
    setResults,
    results
  } = useCalculatorStore()

  const [localCurrentAge, setLocalCurrentAge] = useState(currentAge.toString())
  const [localRetirementAge, setLocalRetirementAge] = useState(retirementAge.toString())
  const [localLifeExpectancy, setLocalLifeExpectancy] = useState(lifeExpectancy.toString())
  const [localInflationRate, setLocalInflationRate] = useState((inflationRate * 100).toString())

  // Calculate future values when inputs change
  useEffect(() => {
    const age = parseFloat(localCurrentAge)
    const retAge = parseFloat(localRetirementAge)
    const inflation = parseFloat(localInflationRate) / 100

    if (!isNaN(age) && !isNaN(retAge) && !isNaN(inflation) && retAge > age) {
      const yearsUntilRetirement = retAge - age
      const futureMonthly = calculateFutureValue(totalMonthlyBudget, inflation, yearsUntilRetirement)
      const futureAnnual = calculateFutureAnnualValue(totalMonthlyBudget, inflation, yearsUntilRetirement)

      setResults({
        ...results,
        futureMonthlyBudget: futureMonthly,
        futureAnnualBudget: futureAnnual
      })
    }
  }, [localCurrentAge, localRetirementAge, localInflationRate, totalMonthlyBudget])

  const handleNext = () => {
    const age = parseFloat(localCurrentAge)
    const retAge = parseFloat(localRetirementAge)
    const lifeExp = parseFloat(localLifeExpectancy)
    const inflation = parseFloat(localInflationRate) / 100

    if (isNaN(age) || age < 18 || age > 100) {
      alert("Please enter a valid current age (18-100)")
      return
    }
    if (isNaN(retAge) || retAge <= age || retAge > 100) {
      alert("Please enter a valid retirement age (must be greater than current age)")
      return
    }
    if (isNaN(lifeExp) || lifeExp <= retAge || lifeExp > 120) {
      alert("Please enter a valid life expectancy (must be greater than retirement age)")
      return
    }
    if (isNaN(inflation) || inflation < 0 || inflation > 0.2) {
      alert("Please enter a valid inflation rate (0-20%)")
      return
    }

    setStep2Data({
      currentAge: age,
      retirementAge: retAge,
      lifeExpectancy: lifeExp,
      inflationRate: inflation
    })

    router.push("/calculator/step3")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Step 2: Future Value</h1>
        <p className="text-gray-600">
          Calculate what your expenses will be at retirement due to inflation
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Enter your age and retirement planning details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentAge">Current Age</Label>
              <Input
                id="currentAge"
                type="number"
                min="18"
                max="100"
                value={localCurrentAge}
                onChange={(e) => setLocalCurrentAge(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="retirementAge">Planned Retirement Age</Label>
              <Input
                id="retirementAge"
                type="number"
                min="18"
                max="100"
                value={localRetirementAge}
                onChange={(e) => setLocalRetirementAge(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
              <Input
                id="lifeExpectancy"
                type="number"
                min="18"
                max="120"
                value={localLifeExpectancy}
                onChange={(e) => setLocalLifeExpectancy(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inflationRate">Expected Inflation Rate (%)</Label>
              <Input
                id="inflationRate"
                type="number"
                step="0.1"
                min="0"
                max="20"
                value={localInflationRate}
                onChange={(e) => setLocalInflationRate(e.target.value)}
              />
              <p className="text-xs text-gray-500">Historical average: 3%</p>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle>Future Budget Projection</CardTitle>
            <CardDescription>
              Your expenses at retirement in future dollars
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Monthly Budget</p>
              <p className="text-2xl font-bold">${totalMonthlyBudget.toLocaleString()}</p>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-1">Years Until Retirement</p>
              <p className="text-lg font-semibold">
                {parseFloat(localRetirementAge) - parseFloat(localCurrentAge) || 0} years
              </p>
            </div>

            {results.futureMonthlyBudget && (
              <>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-1">Future Monthly Budget</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${results.futureMonthlyBudget.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    At retirement in {parseFloat(localRetirementAge) || 0} years
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-1">Future Annual Budget</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${results.futureAnnualBudget?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Per year in retirement
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => router.push("/calculator/step1")}>
          ← Back
        </Button>
        <Button onClick={handleNext}>
          Next: Total Needed →
        </Button>
      </div>
    </div>
  )
}
