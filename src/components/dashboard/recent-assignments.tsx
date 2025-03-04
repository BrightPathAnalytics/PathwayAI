import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { cn } from "../../lib/utils"

/**
 * Status type for assignment completion status
 */
type Status = "completed" | "in-progress" | "pending" | "overdue"

/**
 * Assignment interface defining the structure of an assignment
 */
interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  status: Status
}

/**
 * Props for the RecentAssignments component
 */
interface RecentAssignmentsProps {
  assignments: Assignment[]
}

/**
 * RecentAssignments component displays a table of recent assignments with their status
 */
export function RecentAssignments({ assignments }: RecentAssignmentsProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">{assignment.title}</TableCell>
              <TableCell>{assignment.subject}</TableCell>
              <TableCell>{assignment.dueDate}</TableCell>
              <TableCell>
                <div
                  className={cn(
                    "flex items-center",
                    assignment.status === "completed" && "text-green-500",
                    assignment.status === "in-progress" && "text-blue-500",
                    assignment.status === "pending" && "text-amber-500",
                    assignment.status === "overdue" && "text-red-500",
                  )}
                >
                  {assignment.status === "completed" && <CheckCircle2 className="mr-1 h-4 w-4" />}
                  {assignment.status === "in-progress" && <Clock className="mr-1 h-4 w-4" />}
                  {assignment.status === "pending" && <Clock className="mr-1 h-4 w-4" />}
                  {assignment.status === "overdue" && <XCircle className="mr-1 h-4 w-4" />}
                  <span className="capitalize">{assignment.status}</span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 