"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/components/schedule/schedule-store"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { addDays, format, isSameDay, startOfWeek } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeeklyViewProps {
  events: Event[]
  dateRange: DateRange | undefined
  onDateSelect: (date: Date) => void
}

export function WeeklyView({ events, dateRange, onDateSelect }: WeeklyViewProps) {
  // Get the start of the week from the dateRange
  const startDate = dateRange?.from || new Date()

  // Memoize these calculations to prevent unnecessary re-renders
  const { weekStart, weekDays, hours, eventsByDay } = useMemo(() => {
    const weekStart = startOfWeek(startDate, { weekStartsOn: 0 }) // 0 = Sunday

    // Generate array of days for the week
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    // Hours for the time slots (7 AM to 7 PM)
    const hours = Array.from({ length: 13 }, (_, i) => i + 7)

    // Filter events for the current week
    const weekEvents = events.filter((event) => {
      const eventDate = new Date(event.startTime)
      return weekDays.some((day) => isSameDay(day, eventDate))
    })

    // Group events by day
    const eventsByDay = weekDays.map((day) => {
      return {
        date: day,
        events: weekEvents.filter((event) => isSameDay(day, new Date(event.startTime))),
      }
    })

    return { weekStart, weekDays, hours, eventsByDay }
  }, [startDate, events]) // Only recalculate when these dependencies change

  // Function to position an event in the grid - memoize if used multiple times
  const getEventPosition = (event: Event) => {
    const startHour = new Date(event.startTime).getHours()
    const startMinute = new Date(event.startTime).getMinutes()
    const endHour = new Date(event.endTime).getHours()
    const endMinute = new Date(event.endTime).getMinutes()

    // Calculate top position (relative to 7 AM)
    const top = (startHour - 7) * 60 + startMinute

    // Calculate height (duration in minutes)
    const height = (endHour - startHour) * 60 + (endMinute - startMinute)

    return { top, height }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>Week of {format(weekStart, "MMMM d, yyyy")}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-8 border-b">
          {/* Time column */}
          <div className="border-r py-2 text-center text-xs font-medium text-muted-foreground">Time</div>

          {/* Day columns */}
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="cursor-pointer border-r py-2 text-center last:border-r-0 hover:bg-muted"
              onClick={() => onDateSelect(day)}
            >
              <div className="text-xs font-medium">{format(day, "EEE")}</div>
              <div className="text-sm">{format(day, "d")}</div>
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-8">
          {/* Time slots */}
          <div className="border-r">
            {hours.map((hour) => (
              <div key={hour} className="relative h-20 border-b px-2 py-1 text-xs text-muted-foreground">
                {format(new Date().setHours(hour, 0, 0), "h a")}
              </div>
            ))}
          </div>

          {/* Day columns with events */}
          {eventsByDay.map((day, dayIndex) => (
            <div key={dayIndex} className="relative border-r last:border-r-0">
              {/* Hour grid lines */}
              {hours.map((hour) => (
                <div key={hour} className="h-20 border-b last:border-b-0" />
              ))}

              {/* Events */}
              {day.events.map((event) => {
                const { top, height } = getEventPosition(event)
                return (
                  <TooltipProvider key={event.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute left-0 right-0 mx-1 cursor-pointer rounded px-1 py-0.5 text-xs",
                            event.type === "duty" && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
                            event.type === "meeting" &&
                              "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                            event.type === "class" &&
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                            event.type === "personal" &&
                              "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                            event.type === "other" &&
                              "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
                            event.isPreferred && "border-2 border-yellow-400 dark:border-yellow-600",
                          )}
                          style={{
                            top: `${top}px`,
                            height: `${Math.max(height, 20)}px`,
                            overflow: "hidden",
                          }}
                          onClick={() => onDateSelect(day.date)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="truncate">
                            {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <div className="font-medium">{event.title}</div>
                          {event.description && <div>{event.description}</div>}
                          <div>
                            {format(new Date(event.startTime), "h:mm a")} - {format(new Date(event.endTime), "h:mm a")}
                          </div>
                          {event.location && <div>Location: {event.location}</div>}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{event.type}</Badge>
                            {event.isPreferred && (
                              <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                                Preferred
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created by: {event.createdBy.name} ({event.createdBy.role})
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 