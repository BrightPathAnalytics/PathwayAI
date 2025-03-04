import { Reports } from "../../components/reports/reports"

/**
 * Reports page component
 * Displays the Reports component in a full page layout
 */
export default function ReportsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">
          Create, manage, and analyze reports for your students and classes
        </p>
      </div>
      <Reports />
    </div>
  )
} 