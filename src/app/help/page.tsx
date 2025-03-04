import { Help } from "@/components/help/help"

export default function HelpPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">Find answers to common questions and get support.</p>
      </div>

      <Help />
    </main>
  )
} 