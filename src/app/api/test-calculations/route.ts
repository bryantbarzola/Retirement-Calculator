import { NextResponse } from 'next/server'
import { calculateFutureValue, calculateFutureAnnualValue } from '@/lib/calculations/futureValue'
import { calculateRetirementNestEgg } from '@/lib/calculations/netPresentValue'
import { calculateSavingsGoals } from '@/lib/calculations/savingsGoal'
import { generateContributionSchedule, calculateScheduleSummary } from '@/lib/calculations/schedule'

export async function GET() {
  try {
    // Sample scenario: 35-year-old planning retirement at 65
    const scenario = {
      // Step 1: Budget
      monthlyBudget: 5000, // $5,000/month current expenses

      // Step 2: Future Value inputs
      currentAge: 35,
      retirementAge: 65,
      lifeExpectancy: 90,
      inflationRate: 0.03, // 3%

      // Step 3: NPV inputs
      expectedReturn: 0.07, // 7%

      // Step 4: Current savings
      currentInvestments: 50000, // $50,000 already saved
    }

    // STEP 1: Calculate total monthly budget
    const totalMonthlyBudget = scenario.monthlyBudget

    // STEP 2: Calculate future value at retirement
    const yearsUntilRetirement = scenario.retirementAge - scenario.currentAge
    const futureMonthlyBudget = calculateFutureValue(
      totalMonthlyBudget,
      scenario.inflationRate,
      yearsUntilRetirement
    )
    const futureAnnualBudget = calculateFutureAnnualValue(
      totalMonthlyBudget,
      scenario.inflationRate,
      yearsUntilRetirement
    )

    // STEP 3: Calculate total retirement nest egg needed (NPV)
    const yearsInRetirement = scenario.lifeExpectancy - scenario.retirementAge
    const totalRetirementNeeded = calculateRetirementNestEgg(
      futureAnnualBudget,
      yearsInRetirement,
      scenario.expectedReturn,
      scenario.inflationRate
    )

    // STEP 4: Calculate savings goals
    const savingsGoals = calculateSavingsGoals(
      totalRetirementNeeded,
      scenario.currentInvestments,
      yearsUntilRetirement,
      scenario.expectedReturn
    )

    // STEP 5: Generate contribution schedule
    const schedule = generateContributionSchedule(
      scenario.currentAge,
      scenario.retirementAge,
      scenario.currentInvestments,
      savingsGoals.annualSavingsGoal,
      scenario.expectedReturn
    )

    const scheduleSummary = calculateScheduleSummary(schedule)

    // Return complete calculation results
    return NextResponse.json({
      success: true,
      scenario,
      results: {
        step1: {
          totalMonthlyBudget: Math.round(totalMonthlyBudget),
        },
        step2: {
          yearsUntilRetirement,
          futureMonthlyBudget: Math.round(futureMonthlyBudget),
          futureAnnualBudget: Math.round(futureAnnualBudget),
        },
        step3: {
          yearsInRetirement,
          totalRetirementNeeded: Math.round(totalRetirementNeeded),
        },
        step4: {
          fvCurrentInvestments: Math.round(savingsGoals.fvCurrentInvestments),
          savingsGap: Math.round(savingsGoals.savingsGap),
          annualSavingsGoal: Math.round(savingsGoals.annualSavingsGoal),
          monthlySavingsGoal: Math.round(savingsGoals.monthlySavingsGoal),
        },
        step5: {
          scheduleLength: schedule.length,
          firstYear: schedule[0],
          lastYear: schedule[schedule.length - 1],
          summary: {
            totalContributions: Math.round(scheduleSummary.totalContributions),
            totalGrowth: Math.round(scheduleSummary.totalGrowth),
            finalBalance: Math.round(scheduleSummary.finalBalance),
            years: scheduleSummary.years,
          },
        },
      },
    })
  } catch (error) {
    console.error('Calculation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Calculation failed',
      },
      { status: 500 }
    )
  }
}
