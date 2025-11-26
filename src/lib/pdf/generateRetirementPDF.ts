import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface PDFData {
  // Budget
  totalMonthlyBudget: number
  futureMonthlyBudget: number

  // Ages
  currentAge: number
  retirementAge: number
  lifeExpectancy: number

  // Rates
  inflationRate: number
  expectedReturn: number

  // Investments & Goals
  currentInvestments: number
  totalRetirementNeeded: number
  monthlySavingsGoal: number
  annualSavingsGoal: number

  // Schedule
  schedule: Array<{
    year: number
    age: number
    startingBalance: number
    contribution: number
    investmentGrowth: number
    endingBalance: number
  }>
}

export function generateRetirementPDF(data: PDFData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.width
  let yPos = 20

  // Title
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Retirement Plan Summary', pageWidth / 2, yPos, { align: 'center' })
  yPos += 8

  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.text(`Generated: ${date}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += 15
  doc.setTextColor(0, 0, 0)

  // Key Metrics Box
  doc.setFillColor(240, 240, 240)
  doc.roundedRect(14, yPos, pageWidth - 28, 45, 3, 3, 'F')
  yPos += 7

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')

  const col1X = 20
  const col2X = pageWidth / 2 + 5

  // Column 1
  doc.setTextColor(100, 100, 100)
  doc.text('Monthly Budget Today', col1X, yPos)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text(`$${data.totalMonthlyBudget.toLocaleString()}`, col1X, yPos + 7)

  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text('Total Needed at Retirement', col1X, yPos + 18)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text(`$${Math.round(data.totalRetirementNeeded).toLocaleString()}`, col1X, yPos + 25)

  // Column 2
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text('Monthly at Retirement', col2X, yPos)
  doc.setTextColor(37, 99, 235) // Blue
  doc.setFontSize(16)
  doc.text(`$${Math.round(data.futureMonthlyBudget).toLocaleString()}`, col2X, yPos + 7)

  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text('Save Monthly', col2X, yPos + 18)
  doc.setTextColor(22, 163, 74) // Green
  doc.setFontSize(16)
  doc.text(`$${Math.round(data.monthlySavingsGoal).toLocaleString()}`, col2X, yPos + 25)

  doc.setTextColor(0, 0, 0)
  yPos += 50

  // Plan Assumptions Section
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Plan Assumptions', 14, yPos)
  yPos += 8

  const yearsToRetirement = data.retirementAge - data.currentAge
  const yearsInRetirement = data.lifeExpectancy - data.retirementAge

  const assumptions = [
    ['Current Age', data.currentAge.toString(), 'Expected Return', `${(data.expectedReturn * 100).toFixed(1)}%`],
    ['Retirement Age', data.retirementAge.toString(), 'Inflation Rate', `${(data.inflationRate * 100).toFixed(1)}%`],
    ['Life Expectancy', data.lifeExpectancy.toString(), 'Monthly Expenses', `$${data.totalMonthlyBudget.toLocaleString()}`],
    ['Years to Save', `${yearsToRetirement} years`, 'Current Investments', `$${Math.round(data.currentInvestments).toLocaleString()}`],
    ['Years in Retirement', `${yearsInRetirement} years`, 'Annual Savings Goal', `$${Math.round(data.annualSavingsGoal).toLocaleString()}`],
  ]

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: assumptions,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 3
    },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 45 },
      1: { cellWidth: 40 },
      2: { fontStyle: 'bold', textColor: [100, 100, 100], cellWidth: 45 },
      3: { cellWidth: 50 }
    }
  })

  yPos = (doc as any).lastAutoTable.finalY + 12

  // Contribution Schedule
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Year-by-Year Contribution Schedule', 14, yPos)
  yPos += 8

  const scheduleRows = data.schedule.map(row => [
    row.year.toString(),
    row.age.toString(),
    `$${Math.round(row.startingBalance).toLocaleString()}`,
    `$${Math.round(row.contribution).toLocaleString()}`,
    `$${Math.round(row.investmentGrowth).toLocaleString()}`,
    `$${Math.round(row.endingBalance).toLocaleString()}`
  ])

  autoTable(doc, {
    startY: yPos,
    head: [['Year', 'Age', 'Starting', 'Contribution', 'Growth', 'Ending Balance']],
    body: scheduleRows,
    foot: [[
      '',
      '',
      '',
      '',
      'At Retirement:',
      `$${Math.round(data.schedule[data.schedule.length - 1]?.endingBalance || 0).toLocaleString()}`
    ]],
    theme: 'striped',
    headStyles: {
      fillColor: [37, 99, 235],
      fontSize: 9,
      fontStyle: 'bold'
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 10
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 15 },
      2: { halign: 'right', cellWidth: 30 },
      3: { halign: 'right', cellWidth: 30, textColor: [22, 163, 74] },
      4: { halign: 'right', cellWidth: 30, textColor: [37, 99, 235] },
      5: { halign: 'right', cellWidth: 35, fontStyle: 'bold' }
    }
  })

  // Footer
  const finalY = (doc as any).lastAutoTable.finalY
  const pageHeight = doc.internal.pageSize.height

  if (finalY < pageHeight - 20) {
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      'This is a projection based on assumptions. Actual results may vary.',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Save
  const filename = `retirement-plan-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}
