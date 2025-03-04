import { Dashboard } from "@/components/dashboard/dashboard"

export default function HomePage() {
  // This would come from an auth provider in a real app
  const userRole = "teacher" // or "administrator" or "student"

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to Pathway AI. Here's your overview.</p>
      </div>

      <Dashboard userRole={userRole} />
    </main>
  )
} 