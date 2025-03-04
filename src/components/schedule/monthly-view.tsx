"use client"

import { useState, useCallback } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/components/schedule/schedule-store"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

interface MonthlyViewProps {
  events: Event[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  dateRange: DateRange | undefined
  setDateRange: (range: DateRange | undefined) => void
}

export function MonthlyView({ events, selectedDate, onDateSelect, dateRange, setDateRange }: MonthlyViewProps) {
  const [month, setMonth] = useState<Date>(new Date())

  // Group events by date - memoize this computation to prevent unnecessary recalculations
  const eventsByDate = events.reduce(
    (acc, event) => {
      const dateStr = new Date(event.startTime).toDateString()
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(event)
      return acc
    },
    {} as Record<string, Event[]>,
  )

  // Use useCallback to memoize the renderDay function
  const renderDay = useCallback(
    (day: Date) => {
      const dateStr = day.toDateString()
      const dayEvents = eventsByDate[dateStr] || []
      const hasEvents = dayEvents.length > 0

      // Group events by type for the badges
      const eventTypes = dayEvents.reduce((types, event) => {
        if (!types.includes(event.type)) {
          types.push(event.type)
        }
        return types
      }, [] as string[])

      return (
        <div className="relative h-full w-full p-2">
          <time
            dateTime={format(day, "yyyy-MM-dd")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              selectedDate.toDateString() === dateStr && "bg-primary text-primary-foreground",
            )}
          >
            {format(day, "d")}
          </time>
          {hasEvents && (
            <div className="mt-1 flex flex-wrap gap-1">
              {eventTypes.map((type) => (
                <div
                  key={type}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    type === "duty" && "bg-red-500",
                    type === "meeting" && "bg-blue-500",
                    type === "class" && "bg-green-500",
                    type === "personal" && "bg-purple-500",
                    type === "other" && "bg-gray-500",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )
    },
    [eventsByDate, selectedDate],
  ) // Add dependencies

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-7 md:grid-rows-[auto_1fr]">
        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && onDateSelect(date)}
                month={month}
                onMonthChange={setMonth}
                className="w-full"
                components={{
                  Day: ({ date, ...props }) => (
                    <button
                      {...props}
                      className={cn(
                        props.className,
                        "h-14 w-full p-0",
                        date?.toDateString() === selectedDate.toDateString() && "bg-muted",
                      )}
                    >
                      {date ? renderDay(date) : null}
                    </button>
                  ),
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 md:row-span-2">
          <Card className="h-full">
            <CardContent className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{format(selectedDate, "MMMM d, yyyy")}</h3>
                <p className="text-sm text-muted-foreground">
                  {eventsByDate[selectedDate.toDateString()]?.length || 0} events
                </p>
              </div>

              <div className="space-y-2">
                {eventsByDate[selectedDate.toDateString()]?.map((event) => (
                  <div key={event.id} className="rounded-md border p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{event.title}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          event.type === "duty" && "border-red-500 text-red-500",
                          event.type === "meeting" && "border-blue-500 text-blue-500",
                          event.type === "class" && "border-green-500 text-green-500",
                          event.type === "personal" && "border-purple-500 text-purple-500",
                          event.type === "other" && "border-gray-500 text-gray-500",
                        )}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                    </div>
                    {event.location && <div className="mt-1 text-xs">Location: {event.location}</div>}
                  </div>
                ))}

                {(!eventsByDate[selectedDate.toDateString()] ||
                  eventsByDate[selectedDate.toDateString()]?.length === 0) && (
                  <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No events scheduled for this day
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-2 text-lg font-semibold">Event Legend</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Duty</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Class</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Personal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-gray-500" />
                  <span className="text-sm">Other</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 