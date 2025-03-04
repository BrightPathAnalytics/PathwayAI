import { AlertTriangle } from "lucide-react"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

/**
 * Severity type for alert priority levels
 */
type Severity = "low" | "medium" | "high"

/**
 * Alert interface defining the structure of a student alert
 */
interface Alert {
  id: string
  name: string
  issue: string
  severity: Severity
}

/**
 * Props for the StudentAlerts component
 */
interface StudentAlertsProps {
  alerts: Alert[]
}

/**
 * StudentAlerts component displays a list of alerts for students requiring attention
 */
export function StudentAlerts({ alerts }: StudentAlertsProps) {
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={cn(
              "flex items-start justify-between rounded-lg border p-3",
              alert.severity === "high" && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40",
              alert.severity === "medium" &&
                "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/40",
              alert.severity === "low" && "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
            )}
          >
            <div className="space-y-1">
              <p className="font-medium leading-none">{alert.name}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle
                  className={cn(
                    "mr-1 h-3 w-3",
                    alert.severity === "high" && "text-red-500",
                    alert.severity === "medium" && "text-yellow-500",
                    alert.severity === "low" && "text-blue-500",
                  )}
                />
                {alert.issue}
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "uppercase",
                alert.severity === "high" && "border-red-500 text-red-500",
                alert.severity === "medium" && "border-yellow-500 text-yellow-500",
                alert.severity === "low" && "border-blue-500 text-blue-500",
              )}
            >
              {alert.severity}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  )
} 