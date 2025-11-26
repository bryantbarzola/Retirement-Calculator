/**
 * Calculate the future value of a present amount
 *
 * Formula: FV = PV × (1 + r)^n
 *
 * @param presentValue - Current value (e.g., monthly budget)
 * @param rate - Growth/inflation rate per period (as decimal, e.g., 0.03 for 3%)
 * @param periods - Number of periods (e.g., years until retirement)
 * @returns Future value at the end of the period
 *
 * @example
 * // $5,000/month budget with 3% inflation over 30 years
 * calculateFutureValue(5000, 0.03, 30) // Returns: ~12,136
 */
export function calculateFutureValue(
  presentValue: number,
  rate: number,
  periods: number
): number {
  if (presentValue < 0) {
    throw new Error('Present value must be non-negative')
  }

  if (rate < 0) {
    throw new Error('Rate must be non-negative')
  }

  if (periods < 0) {
    throw new Error('Periods must be non-negative')
  }

  // FV = PV × (1 + r)^n
  return presentValue * Math.pow(1 + rate, periods)
}

/**
 * Calculate future value of monthly amount as annual amount
 *
 * @param monthlyAmount - Monthly amount
 * @param annualRate - Annual growth rate (as decimal)
 * @param years - Number of years
 * @returns Future annual value (monthly amount × 12 × growth factor)
 */
export function calculateFutureAnnualValue(
  monthlyAmount: number,
  annualRate: number,
  years: number
): number {
  const futureMonthly = calculateFutureValue(monthlyAmount, annualRate, years)
  return futureMonthly * 12
}
