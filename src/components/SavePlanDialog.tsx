"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCalculatorStore } from "@/store/calculatorStore"
import { savePlanAction } from "@/app/actions/savePlan"

interface SavePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SavePlanDialog({ open, onOpenChange }: SavePlanDialogProps) {
  const { data: session, status } = useSession()
  const [planName, setPlanName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const calculatorState = useCalculatorStore()

  const handleSignIn = () => {
    // Redirect to login page
    router.push("/login")
  }

  const handleSave = async () => {
    if (!planName.trim()) {
      setError("Please enter a plan name")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const result = await savePlanAction(planName, calculatorState)

      if (result.success) {
        onOpenChange(false)
        setPlanName("")
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to save plan")
      }
    } catch (err) {
      console.error("Save error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save Retirement Plan</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center text-gray-500">
            Loading...
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Show sign-in prompt for guests
  if (!session) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Sign in to Save</DialogTitle>
            <DialogDescription>
              Create an account or sign in to save your retirement plan and access it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-sm text-gray-600">
              Your calculator progress is saved locally. Sign in to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
              <li>Save multiple retirement plans</li>
              <li>Access your plans from any device</li>
              <li>Keep your data secure in the cloud</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSignIn}>
              Sign In to Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Show normal save form for logged-in users
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Retirement Plan</DialogTitle>
          <DialogDescription>
            Give your retirement plan a name so you can find it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              placeholder="My Retirement Plan"
              value={planName}
              onChange={(e) => {
                setPlanName(e.target.value)
                setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSaving) {
                  handleSave()
                }
              }}
              disabled={isSaving}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
