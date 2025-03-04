import * as React from "react"

/**
 * ChartConfig type defines the configuration for chart colors and labels
 */
export interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

/**
 * Context for sharing chart configuration between components
 */
const ChartContext = React.createContext<ChartConfig | null>(null)

/**
 * Hook to access chart context
 */
function useChartContext() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChartContext must be used within a ChartContainer")
  }
  return context
}

/**
 * Props for the ChartContainer component
 */
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

/**
 * ChartContainer component provides configuration context for charts
 */
function ChartContainer({ config, children, className, ...props }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={className}
        style={
          {
            "--color-chart-0": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-1": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-2": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-3": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-4": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-5": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-6": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-7": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-8": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-9": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-10": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-11": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-12": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-13": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-14": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-15": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-16": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-17": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-18": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-19": "hsl(222.2, 84%, 4.9%)",
            "--color-chart-20": "hsl(222.2, 84%, 4.9%)",
            ...Object.entries(config).reduce(
              (acc, [key, value], index) => {
                acc[`--color-${key}`] = value.color
                acc[`--color-chart-${index}`] = value.color
                return acc
              },
              {} as Record<string, string>,
            ),
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

/**
 * Options for the ChartTooltip component
 */
interface ChartTooltipOptions {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, unknown>
  }>
}

/**
 * Props for the ChartTooltip component
 */
interface ChartTooltipProps extends ChartTooltipOptions {
  content?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * ChartTooltip component displays tooltip for chart data points
 */
function ChartTooltip({ active, payload, content, ...props }: ChartTooltipProps) {
  if (content) {
    return <>{content}</>
  }

  if (active && payload?.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm" {...props}>
        <div className="grid gap-2">
          {payload.map((data, i) => (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: `var(--color-chart-${i})`,
                  }}
                />
                <span className="text-xs text-muted-foreground">{data.name}</span>
              </div>
              <span className="text-xs font-medium">{data.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

/**
 * Props for the ChartTooltipContent component
 */
interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, unknown>
  }>
}

/**
 * ChartTooltipContent component displays formatted tooltip content for chart data points
 */
function ChartTooltipContent({ active, payload, ...props }: ChartTooltipContentProps) {
  const config = useChartContext()

  if (!(active && payload?.length)) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm" {...props}>
      <div className="grid gap-2">
        {payload.map((data, i) => {
          const name = Object.keys(config).find((key) => key === data.name)
          const color = name ? config[name].color : `var(--color-chart-${i})`
          const label = name ? config[name].label : data.name

          return (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: color,
                  }}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <span className="text-xs font-medium">{data.value}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { ChartContainer, ChartTooltip, ChartTooltipContent } 