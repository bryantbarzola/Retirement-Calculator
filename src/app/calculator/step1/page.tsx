"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCalculatorStore } from "@/store/calculatorStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProgressIndicator from "@/components/ProgressIndicator"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function Step1Page() {
  const router = useRouter()
  const { expenses, totalMonthlyBudget, addExpense, removeExpense } = useCalculatorStore()

  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")

  // Prepare data for pie chart
  const chartData = useMemo(() => {
    return expenses.map((expense) => ({
      name: expense.category,
      value: expense.amount,
      percentage: ((expense.amount / totalMonthlyBudget) * 100).toFixed(1)
    }))
  }, [expenses, totalMonthlyBudget])

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()

    if (!category.trim() || !amount) return

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return

    addExpense(category.trim(), numAmount)
    setCategory("")
    setAmount("")
  }

  const handleNext = () => {
    if (expenses.length === 0) {
      alert("Please add at least one expense")
      return
    }
    router.push("/calculator/step2")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <ProgressIndicator currentStep={1} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Step 1: Monthly Budget</h1>
        <p className="text-gray-600">
          Enter your current monthly expenses by category
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
            <CardDescription>
              Enter expense category and monthly amount
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Housing, Groceries, Transportation"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Monthly Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Expenses</CardTitle>
            <CardDescription>
              Total: ${totalMonthlyBudget.toLocaleString()}/month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No expenses added yet
              </p>
            ) : (
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-gray-600">
                        ${expense.amount.toLocaleString()}/month
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExpense(expense.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown Chart */}
      {expenses.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>
              Visual breakdown of your monthly budget by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} (${props.percentage}%)`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-between">
        <Button variant="outline" onClick={() => router.push("/")} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button onClick={handleNext} disabled={expenses.length === 0} className="w-full sm:w-auto">
          Next: Future Value →
        </Button>
      </div>
    </div>
  )
}
