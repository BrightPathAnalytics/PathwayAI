"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/components/schedule/schedule-store"
import { cn } from "@/lib/utils"
import { format, addDays, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EventModal } from "@/components/schedule/event-modal"
import { useScheduleStore } from "@/components/schedule/schedule-store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DailyViewProps {
  events: Event[]
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

export function DailyView({ events, selectedDate, setSelectedDate }: DailyViewProps) {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const { deleteEvent } = useScheduleStore()

  // Sort events by start time - memoize this to prevent unnecessary recalculations
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [events])

  const handlePreviousDay = () => {
    setSelectedDate(subDays(selectedDate, 1))
  }

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1))
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
  }

  // Generate time slots for the day (7 AM to 7 PM)
  const timeSlots = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => i + 7)
  }, [])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePreviousDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-1">
              {timeSlots.map((hour) => {
                const hourEvents = sortedEvents.filter((event) => {
                  const eventHour = new Date(event.startTime).getHours()
                  return eventHour === hour
                })

                return (
                  <div key={hour} className="grid grid-cols-[80px_1fr] gap-2">
                    <div className="py-2 text-sm text-muted-foreground">
                      {format(new Date().setHours(hour, 0, 0), "h:mm a")}
                    </div>
                    <div className="space-y-2 py-2">
                      {hourEvents.length > 0 ? (
                        hourEvents.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "relative rounded-md border p-2",
                              event.type === "duty" &&
                                "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20",
                              event.type === "meeting" &&
                                "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20",
                              event.type === "class" &&
                                "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20",
                              event.type === "personal" &&
                                "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20",
                              event.type === "other" &&
                                "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/20",
                              event.isPreferred && "border-l-4 border-l-yellow-400",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{event.title}</h4>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditEvent(event)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteEvent(event.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="mt-1 text-sm">
                              {format(new Date(event.startTime), "h:mm a")} -{" "}
                              {format(new Date(event.endTime), "h:mm a")}
                            </div>
                            {event.location && <div className="mt-1 text-sm">Location: {event.location}</div>}
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className={cn(
                                  event.type === "duty" && "border-red-500 text-red-700 dark:text-red-400",
                                  event.type === "meeting" && "border-blue-500 text-blue-700 dark:text-blue-400",
                                  event.type === "class" && "border-green-500 text-green-700 dark:text-green-400",
                                  event.type === "personal" && "border-purple-500 text-purple-700 dark:text-purple-400",
                                  event.type === "other" && "border-gray-500 text-gray-700 dark:text-gray-400",
                                )}
                              >
                                {event.type}
                              </Badge>
                              {event.isPreferred && (
                                <Badge
                                  variant="outline"
                                  className="border-yellow-400 text-yellow-700 dark:text-yellow-400"
                                >
                                  Preferred
                                </Badge>
                              )}
                              <Badge variant="outline" className="border-gray-400 text-gray-700 dark:text-gray-400">
                                {event.createdBy.role}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-md border border-dashed p-2 text-center text-sm text-muted-foreground">
                          No events scheduled
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false)
          setSelectedEvent(null)
        }}
        selectedDate={selectedDate}
        event={selectedEvent}
      />
    </div>
  )
} 