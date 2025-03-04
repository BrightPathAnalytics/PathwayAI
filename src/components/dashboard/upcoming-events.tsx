import { Calendar, Clock, Users } from "lucide-react"
import { cn } from "../../lib/utils"

/**
 * EventType type for different types of events
 */
type EventType = "meeting" | "deadline" | "event"

/**
 * Event interface defining the structure of an event
 */
interface Event {
  id: string
  title: string
  date: string
  type: EventType
}

/**
 * Props for the UpcomingEvents component
 */
interface UpcomingEventsProps {
  events: Event[]
}

/**
 * UpcomingEvents component displays a list of upcoming events with visual indicators
 * for different event types (meetings, deadlines, events)
 */
export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event.id}
            className={cn(
              "flex items-start space-x-3 rounded-md border p-3",
              event.type === "meeting" && "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40",
              event.type === "deadline" && "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40",
              event.type === "event" && "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40",
            )}
          >
            <div
              className={cn(
                "mt-0.5 rounded-full p-1",
                event.type === "meeting" && "bg-blue-500 text-white",
                event.type === "deadline" && "bg-red-500 text-white",
                event.type === "event" && "bg-green-500 text-white",
              )}
            >
              {event.type === "meeting" && <Users className="h-4 w-4" />}
              {event.type === "deadline" && <Clock className="h-4 w-4" />}
              {event.type === "event" && <Calendar className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-medium leading-none">{event.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{event.date}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
} 