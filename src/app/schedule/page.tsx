import { Schedule } from "@/components/schedule/schedule"

export default function SchedulePage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
        <p className="text-muted-foreground">Manage your school calendar, duties, and events in one place.</p>
      </div>

      <Schedule />
    </main>
  )
} 