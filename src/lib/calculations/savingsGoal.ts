import { calculateFutureValue } from './futureValue'

/**
 * Calculate periodic payment needed to reach a future value
 *
 * Formula: PMT = FV × [r / ((1 + r)^n - 1)]
 * When starting with present value: PMT = (FV - PV × (1+r)^n) × [r / ((1+r)^n - 1)]
 *
 * @param rate - Interest/return rate per period (as decimal, e.g., 0.07 for 7%)
 * @param periods - Number of periods (e.g., years until retirement)
 * @param presentValue - Current amount already saved (default: 0)
 * @param futureValue - Target amount needed
 * @returns Periodic payment required
 *
 * @example
 * // Need $1M in 30 years, already have $50k, earning 7%/year
 * calculatePMT(0.07, 30, 50000, 1000000) // Returns: ~$9,073/year
 */
export function calculatePMT(
  rate: number,
  periods: number,
  presentValue: number,
  futureValue: number
): number {
  if (rate < 0) {
    throw new Error('Rate must be non-negative')
  }

  if (periods <= 0) {
    throw new Error('Periods must be positive')
  }

  if (futureValue < 0) {
    throw new Error('Future value must be non-negative')
  }

  if (presentValue < 0) {
    throw new Error('Present value must be non-negative')
  }

  // Special case: no return (rate = 0)
  if (rate === 0) {
    return (futureValue - presentValue) / periods
  }

  // Calculate future value of present amount
  const fvOfPresent = presentValue * Math.pow(1 + rate, periods)

  // Remaining gap to fill with periodic payments
  const gap = futureValue - fvOfPresent

  // PMT = Gap × [r / ((1+r)^n - 1)]
  const factor = Math.pow(1 + rate, periods)
  return (gap * rate) / (factor - 1)
}

/**
 * Calculate annual and monthly savings goals
 *
 * @param totalNeeded - Total amount needed at retirement
 * @param currentInvestments - Current amount already saved
 * @param yearsUntilRetirement - Years until retirement
 * @param expectedReturn - Expected annual return rate (decimal)
 * @returns Object with annual and monthly savings goals
 */
export function calculateSavingsGoals(
  totalNeeded: number,
  currentInvestments: number,
  yearsUntilRetirement: number,
  expectedReturn: number
): {
  fvCurrentInvestments: number
  savingsGap: number
  annualSavingsGoal: number
  monthlySavingsGoal: number
} {
  // Calculate future value of current investments
  const fvCurrentInvestments = calculateFutureValue(
    currentInvestments,
    expectedReturn,
    yearsUntilRetirement
  )

  // Calculate gap between need and projected growth of current investments
  const savingsGap = totalNeeded - fvCurrentInvestments

  // If current investments already cover the need
  if (savingsGap <= 0) {
    return {
      fvCurrentInvestments,
      savingsGap: 0,
      annualSavingsGoal: 0,
      monthlySavingsGoal: 0,
    }
  }

  // Calculate annual payment needed
  const annualSavingsGoal = calculatePMT(
    expectedReturn,
    yearsUntilRetirement,
    0, // We already accounted for current investments in the gap
    savingsGap
  )

  // Convert to monthly (simple division, assuming end-of-year contributions)
  const monthlySavingsGoal = annualSavingsGoal / 12

  return {
    fvCurrentInvestments,
    savingsGap,
    annualSavingsGoal,
    monthlySavingsGoal,
  }
}
