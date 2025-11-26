import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUserPlans } from "@/lib/supabase/retirementPlans"
import { PlansList } from "@/components/PlansList"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const plans = await getUserPlans(session.user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {session.user.name}!
          </p>
        </div>

        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/" })
          }}
        >
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Retirement Plans</h2>
          <Link href="/calculator/step1">
            <Button>+ New Plan</Button>
          </Link>
        </div>

        {plans.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No plans yet. Create your first retirement plan to get started!
          </p>
        ) : (
          <PlansList plans={plans} />
        )}
      </div>
    </div>
  )
}
