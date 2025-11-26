/**
 * Calculate Net Present Value of a series of cash flows
 *
 * Formula: NPV = Σ [CF_t / (1 + r)^t]
 *
 * @param rate - Discount rate per period (as decimal, e.g., 0.07 for 7%)
 * @param cashFlows - Array of cash flows, indexed by period (period 0 = initial, period 1 = year 1, etc.)
 * @returns Net present value of all cash flows
 *
 * @example
 * // Calculate NPV of receiving $100k/year for 3 years with 7% discount rate
 * calculateNPV(0.07, [0, 100000, 100000, 100000]) // Returns: ~262,432
 */
export function calculateNPV(rate: number, cashFlows: number[]): number {
  if (rate < 0) {
    throw new Error('Rate must be non-negative')
  }

  return cashFlows.reduce((npv, cashFlow, period) => {
    // NPV = Σ [CF_t / (1 + r)^t]
    // For period 0, (1 + r)^0 = 1, so it's just cashFlow
    return npv + cashFlow / Math.pow(1 + rate, period)
  }, 0)
}

/**
 * Calculate present value of a growing annuity (simplified retirement calculation)
 *
 * This calculates the lump sum needed today to fund retirement expenses that grow with inflation
 *
 * Formula: PV = P × [(1 - ((1+g)/(1+r))^n) / (r - g)]
 * Special case when r = g: PV = P × n / (1 + r)
 *
 * @param firstPayment - First annual payment amount
 * @param discountRate - Expected return rate (as decimal, e.g., 0.07 for 7%)
 * @param growthRate - Payment growth rate/inflation (as decimal, e.g., 0.03 for 3%)
 * @param periods - Number of periods (years in retirement)
 * @returns Present value of growing annuity
 *
 * @example
 * // Need $60k/year for 25 years, growing 3%/year, with 7% return
 * calculatePVGrowingAnnuity(60000, 0.07, 0.03, 25) // Returns: ~1,174,896
 */
export function calculatePVGrowingAnnuity(
  firstPayment: number,
  discountRate: number,
  growthRate: number,
  periods: number
): number {
  if (firstPayment < 0) {
    throw new Error('First payment must be non-negative')
  }

  if (discountRate < 0) {
    throw new Error('Discount rate must be non-negative')
  }

  if (periods < 0) {
    throw new Error('Periods must be non-negative')
  }

  // Special case: if discount rate equals growth rate
  if (Math.abs(discountRate - growthRate) < 0.0001) {
    return (firstPayment * periods) / (1 + discountRate)
  }

  // General formula: PV = P × [(1 - ((1+g)/(1+r))^n) / (r - g)]
  const factor = Math.pow((1 + growthRate) / (1 + discountRate), periods)
  return (firstPayment * (1 - factor)) / (discountRate - growthRate)
}

/**
 * Calculate total retirement nest egg needed
 *
 * This is a convenience function that calculates the total amount needed at retirement
 * to fund annual expenses that grow with inflation
 *
 * @param annualExpense - Annual expense at start of retirement
 * @param yearsInRetirement - Number of years in retirement
 * @param expectedReturn - Expected investment return rate (decimal)
 * @param inflationRate - Expected inflation rate (decimal)
 * @returns Total lump sum needed at retirement
 */
export function calculateRetirementNestEgg(
  annualExpense: number,
  yearsInRetirement: number,
  expectedReturn: number,
  inflationRate: number
): number {
  return calculatePVGrowingAnnuity(
    annualExpense,
    expectedReturn,
    inflationRate,
    yearsInRetirement
  )
}
