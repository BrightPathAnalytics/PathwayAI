import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import { addHours } from "date-fns"

export type EventType = "duty" | "meeting" | "class" | "personal" | "other"
export type UserRole = "administrator" | "educator"

export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: EventType
  createdBy: {
    id: string
    name: string
    role: UserRole
  }
  participants?: {
    id: string
    name: string
    role: UserRole
  }[]
  isPreferred?: boolean
  location?: string
}

interface ScheduleState {
  events: Event[]
  addEvent: (event: Omit<Event, "id">) => void
  updateEvent: (id: string, event: Partial<Omit<Event, "id">>) => void
  deleteEvent: (id: string) => void
}

// Sample user data
const currentUser = {
  id: "user-1",
  name: "Jane Doe",
  role: "educator" as UserRole,
}

const adminUser = {
  id: "admin-1",
  name: "Principal Smith",
  role: "administrator" as UserRole,
}

// Generate sample events
const generateSampleEvents = (): Event[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const events: Event[] = [
    {
      id: uuidv4(),
      title: "Morning Assembly Duty",
      description: "Supervise students during morning assembly",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
      type: "duty",
      createdBy: adminUser,
      participants: [currentUser],
      isPreferred: true,
      location: "Main Hall",
    },
    {
      id: uuidv4(),
      title: "Math Class - Algebra",
      description: "Teaching algebra to 9th grade",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
      type: "class",
      createdBy: currentUser,
      location: "Room 101",
    },
    {
      id: uuidv4(),
      title: "Lunch Duty",
      description: "Cafeteria supervision",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      type: "duty",
      createdBy: adminUser,
      participants: [currentUser],
      location: "Cafeteria",
    },
    {
      id: uuidv4(),
      title: "Department Meeting",
      description: "Weekly science department meeting",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 15, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 16, 0),
      type: "meeting",
      createdBy: adminUser,
      participants: [currentUser, adminUser],
      location: "Conference Room",
    },
    {
      id: uuidv4(),
      title: "Parent-Teacher Conference",
      description: "Meeting with parents of student John Smith",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0),
      type: "meeting",
      createdBy: currentUser,
      location: "Room 105",
    },
    {
      id: uuidv4(),
      title: "Staff Development Day",
      description: "Professional development workshop",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 9, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 16, 0),
      type: "other",
      createdBy: adminUser,
      participants: [currentUser, adminUser],
      location: "Auditorium",
    },
    {
      id: uuidv4(),
      title: "Science Lab Prep",
      description: "Prepare materials for next week's lab experiment",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 14, 0),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 15, 30),
      type: "personal",
      createdBy: currentUser,
      isPreferred: true,
      location: "Science Lab",
    },
    {
      id: uuidv4(),
      title: "Hallway Duty",
      description: "Monitor hallways during class changes",
      startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 10, 30),
      endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 11, 0),
      type: "duty",
      createdBy: adminUser,
      participants: [currentUser],
      location: "East Wing",
    },
  ]

  // Add more events for the next few weeks
  for (let i = 7; i < 30; i += 2) {
    const startTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + i,
      8 + Math.floor(Math.random() * 8),
      Math.random() > 0.5 ? 0 : 30,
    )
    const endTime = addHours(startTime, 1 + Math.floor(Math.random() * 2))

    const eventTypes: EventType[] = ["duty", "meeting", "class", "personal", "other"]
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)]

    events.push({
      id: uuidv4(),
      title: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} - ${i}`,
      description: `Auto-generated ${randomType} event`,
      startTime,
      endTime,
      type: randomType,
      createdBy: Math.random() > 0.5 ? currentUser : adminUser,
      participants: Math.random() > 0.7 ? [currentUser, adminUser] : undefined,
      isPreferred: Math.random() > 0.8,
      location: `Room ${100 + Math.floor(Math.random() * 20)}`,
    })
  }

  return events
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      events: generateSampleEvents(),

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: uuidv4() }],
        })),

      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) => (event.id === id ? { ...event, ...updatedEvent } : event)),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
    }),
    {
      name: "pathway-schedule-storage",
    },
  ),
) 