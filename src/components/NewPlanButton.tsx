"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCalculatorStore } from "@/store/calculatorStore"

interface NewPlanButtonProps {
  variant?: "default" | "outline"
  children: React.ReactNode
  className?: string
}

export function NewPlanButton({ variant = "default", children, className }: NewPlanButtonProps) {
  const router = useRouter()
  const { reset } = useCalculatorStore()

  const handleNewPlan = () => {
    reset()
    router.push("/calculator/step1")
  }

  return (
    <Button variant={variant} onClick={handleNewPlan} className={className}>
      {children}
    </Button>
  )
}
