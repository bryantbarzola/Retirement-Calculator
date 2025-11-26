/**
 * Represents a single year in the contribution schedule
 */
export interface YearlyContribution {
  year: number // Year number (1, 2, 3, ...)
  age: number // User's age during this year
  startingBalance: number // Balance at start of year
  contribution: number // Amount contributed during year
  investmentGrowth: number // Growth from investments during year
  endingBalance: number // Balance at end of year
}

/**
 * Generate year-by-year contribution schedule showing path to retirement goal
 *
 * @param currentAge - User's current age
 * @param retirementAge - Age at retirement
 * @param currentInvestments - Current amount already saved
 * @param annualContribution - Annual contribution amount
 * @param expectedReturn - Expected annual return rate (decimal)
 * @returns Array of yearly contributions showing the accumulation path
 *
 * @example
 * // 35-year-old saving for retirement at 65
 * generateContributionSchedule(35, 65, 50000, 10000, 0.07)
 * // Returns 30 years of data showing balance growth
 */
export function generateContributionSchedule(
  currentAge: number,
  retirementAge: number,
  currentInvestments: number,
  annualContribution: number,
  expectedReturn: number
): YearlyContribution[] {
  if (currentAge < 0) {
    throw new Error('Current age must be non-negative')
  }

  if (retirementAge <= currentAge) {
    throw new Error('Retirement age must be greater than current age')
  }

  if (currentInvestments < 0) {
    throw new Error('Current investments must be non-negative')
  }

  if (annualContribution < 0) {
    throw new Error('Annual contribution must be non-negative')
  }

  if (expectedReturn < 0) {
    throw new Error('Expected return must be non-negative')
  }

  const schedule: YearlyContribution[] = []
  let balance = currentInvestments
  const yearsUntilRetirement = retirementAge - currentAge

  for (let year = 1; year <= yearsUntilRetirement; year++) {
    const startingBalance = balance

    // Add contribution at beginning of year
    balance += annualContribution

    // Calculate investment growth for the year
    const investmentGrowth = balance * expectedReturn

    // Add growth to balance
    balance += investmentGrowth

    const endingBalance = balance

    schedule.push({
      year,
      age: currentAge + year,
      startingBalance,
      contribution: annualContribution,
      investmentGrowth,
      endingBalance,
    })
  }

  return schedule
}

/**
 * Calculate summary statistics for the contribution schedule
 *
 * @param schedule - Array of yearly contributions
 * @returns Summary statistics
 */
export function calculateScheduleSummary(schedule: YearlyContribution[]): {
  totalContributions: number
  totalGrowth: number
  finalBalance: number
  years: number
} {
  if (schedule.length === 0) {
    return {
      totalContributions: 0,
      totalGrowth: 0,
      finalBalance: 0,
      years: 0,
    }
  }

  const totalContributions = schedule.reduce(
    (sum, year) => sum + year.contribution,
    0
  )

  const totalGrowth = schedule.reduce(
    (sum, year) => sum + year.investmentGrowth,
    0
  )

  const finalBalance = schedule[schedule.length - 1].endingBalance

  return {
    totalContributions,
    totalGrowth,
    finalBalance,
    years: schedule.length,
  }
}
