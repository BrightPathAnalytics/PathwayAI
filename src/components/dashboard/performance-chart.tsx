import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"

// Sample performance data showing weekly class performance metrics
const performanceData = [
  { name: "Week 1", average: 72, highest: 95, lowest: 45 },
  { name: "Week 2", average: 75, highest: 96, lowest: 48 },
  { name: "Week 3", average: 78, highest: 98, lowest: 52 },
  { name: "Week 4", average: 77, highest: 97, lowest: 55 },
  { name: "Week 5", average: 80, highest: 99, lowest: 57 },
  { name: "Week 6", average: 82, highest: 100, lowest: 60 },
  { name: "Week 7", average: 87, highest: 100, lowest: 68 },
  { name: "Week 8", average: 89, highest: 100, lowest: 71 },
]

/**
 * PerformanceChart component displays an area chart showing class performance metrics
 * (average, highest, and lowest scores) over time
 */
export function PerformanceChart() {
  return (
    <ChartContainer
      config={{
        average: {
          label: "Class Average",
          color: "hsl(var(--chart-1))",
        },
        highest: {
          label: "Highest Score",
          color: "hsl(var(--chart-2))",
        },
        lowest: {
          label: "Lowest Score",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={performanceData}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value}%`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="highest"
            stroke="var(--color-highest)"
            fill="var(--color-highest)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="average"
            stroke="var(--color-average)"
            fill="var(--color-average)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="lowest"
            stroke="var(--color-lowest)"
            fill="var(--color-lowest)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
} 