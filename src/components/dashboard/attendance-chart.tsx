import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

// Sample attendance data for different school levels
const attendanceData = [
  {
    name: "Elementary",
    present: 94.2,
    absent: 4.5,
    tardy: 1.3,
  },
  {
    name: "Middle",
    present: 91.5,
    absent: 6.2,
    tardy: 2.3,
  },
  {
    name: "High",
    present: 89.7,
    absent: 7.8,
    tardy: 2.5,
  },
  {
    name: "Special Ed",
    present: 92.1,
    absent: 5.9,
    tardy: 2.0,
  },
]

/**
 * AttendanceChart component displays a stacked bar chart showing attendance metrics
 * (present, absent, tardy) across different school levels
 */
export function AttendanceChart() {
  return (
    <ChartContainer
      config={{
        present: {
          label: "Present",
          color: "hsl(var(--chart-2))",
        },
        absent: {
          label: "Absent",
          color: "hsl(var(--chart-3))",
        },
        tardy: {
          label: "Tardy",
          color: "hsl(var(--chart-4))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={attendanceData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="present" stackId="a" fill="var(--color-present)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" stackId="a" fill="var(--color-absent)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="tardy" stackId="a" fill="var(--color-tardy)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
} 