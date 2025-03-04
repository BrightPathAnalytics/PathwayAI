import { Sheets } from "@/components/sheets/sheets"

export default function SheetsPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sheets</h1>
        <p className="text-muted-foreground">Manage worksheets, tests, and assignments for your classes.</p>
      </div>

      <Sheets />
    </main>
  )
} 