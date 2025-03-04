import type { ReactNode } from "react"
import { Activity, AlertTriangle, BookOpen, Calendar, CheckSquare, Clock, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { PerformanceChart } from "./performance-chart"
import { AttendanceChart } from "./attendance-chart"
import { RecentAssignments } from "./recent-assignments"
import { StudentAlerts } from "./student-alerts"
import { UpcomingEvents } from "./upcoming-events"

/**
 * User role type
 */
type UserRole = "teacher" | "administrator" | "student"

/**
 * Props for the Dashboard component
 */
interface DashboardProps {
  userRole: UserRole
}

/**
 * Props for the StatCard component
 */
interface StatCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

/**
 * StatCard component displays a metric with optional trend indicator
 */
function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`mt-1 flex items-center text-xs ${trend.isPositive ? "text-green-500" : "text-red-500"}`}>
            {trend.isPositive ? "+" : "-"}
            {trend.value}% <span className="ml-1">{trend.isPositive ? "increase" : "decrease"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Dashboard component displays different views based on user role
 */
export function Dashboard({ userRole }: DashboardProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        {userRole === "administrator" && <TabsTrigger value="reports">Reports</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userRole === "administrator" ? (
            <>
              <StatCard
                title="Total Students"
                value="2,345"
                description="Across all schools"
                icon={<Users />}
                trend={{ value: 12, isPositive: true }}
              />
              <StatCard
                title="Average Attendance"
                value="93.8%"
                description="This week"
                icon={<CheckSquare />}
                trend={{ value: 3, isPositive: true }}
              />
              <StatCard
                title="Open Reports"
                value="48"
                description="Needs attention"
                icon={<AlertTriangle />}
                trend={{ value: 7, isPositive: false }}
              />
              <StatCard title="District Events" value="12" description="This month" icon={<Calendar />} />
            </>
          ) : (
            <>
              <StatCard title="Active Students" value="28" description="In your classes" icon={<Users />} />
              <StatCard
                title="Class Average"
                value="87.4%"
                description="Math 101"
                icon={<Activity />}
                trend={{ value: 4, isPositive: true }}
              />
              <StatCard title="Assignments" value="5" description="Due this week" icon={<BookOpen />} />
              <StatCard title="Office Hours" value="3h 45m" description="This week" icon={<Clock />} />
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userRole === "administrator" ? (
            <>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>District-wide Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <AttendanceChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Faculty Activity</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <UpcomingEvents
                    events={[
                      {
                        id: "1",
                        title: "Teacher Conference",
                        date: "Tomorrow, 10:00 AM",
                        type: "meeting",
                      },
                      {
                        id: "2",
                        title: "Grade Submission Deadline",
                        date: "Friday, 3:00 PM",
                        type: "deadline",
                      },
                      {
                        id: "3",
                        title: "Staff Development Day",
                        date: "Next Monday, All Day",
                        type: "event",
                      },
                      {
                        id: "4",
                        title: "District Budget Meeting",
                        date: "Jun 15, 1:00 PM",
                        type: "meeting",
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Class Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>At-Risk Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <StudentAlerts
                    alerts={[
                      {
                        id: "1",
                        name: "Alex Johnson",
                        issue: "Missing 3 assignments",
                        severity: "high",
                      },
                      {
                        id: "2",
                        name: "Taylor Smith",
                        issue: "Attendance below 70%",
                        severity: "high",
                      },
                      {
                        id: "3",
                        name: "Jordan Clark",
                        issue: "Grade dropped to D",
                        severity: "medium",
                      },
                      {
                        id: "4",
                        name: "Casey Miller",
                        issue: "Disruptive in class",
                        severity: "low",
                      },
                    ]}
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle>{userRole === "administrator" ? "Recent District Reports" : "Recent Assignments"}</CardTitle>
            </CardHeader>
            <CardContent>
              {userRole === "administrator" ? (
                <RecentAssignments
                  assignments={[
                    {
                      id: "1",
                      title: "Q2 Budget Report",
                      subject: "Finance",
                      dueDate: "Submitted May 15",
                      status: "completed",
                    },
                    {
                      id: "2",
                      title: "Staff Evaluation Summary",
                      subject: "HR",
                      dueDate: "In Progress",
                      status: "in-progress",
                    },
                    {
                      id: "3",
                      title: "Annual Achievement Data",
                      subject: "Academics",
                      dueDate: "Due June 30",
                      status: "pending",
                    },
                    {
                      id: "4",
                      title: "Facility Maintenance Plan",
                      subject: "Operations",
                      dueDate: "In Review",
                      status: "in-progress",
                    },
                  ]}
                />
              ) : (
                <RecentAssignments
                  assignments={[
                    {
                      id: "1",
                      title: "Cell Biology Quiz",
                      subject: "Biology 101",
                      dueDate: "Today",
                      status: "overdue",
                    },
                    {
                      id: "2",
                      title: "Literary Analysis Essay",
                      subject: "English 10",
                      dueDate: "Tomorrow",
                      status: "in-progress",
                    },
                    {
                      id: "3",
                      title: "Algebra Problem Set",
                      subject: "Math 101",
                      dueDate: "May 20",
                      status: "pending",
                    },
                    {
                      id: "4",
                      title: "Historical Research Project",
                      subject: "History 11",
                      dueDate: "May 15",
                      status: "completed",
                    },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {userRole === "administrator" && (
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>District Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access and manage district-wide reports and analytics. Generate custom reports based on various metrics
                and export data for further analysis.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
} 