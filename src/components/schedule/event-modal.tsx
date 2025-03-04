"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { type Event, type EventType, useScheduleStore } from "@/components/schedule/schedule-store"
import { format, addHours } from "date-fns"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  event?: Event | null
}

export function EventModal({ isOpen, onClose, selectedDate, event }: EventModalProps) {
  const { addEvent, updateEvent } = useScheduleStore()

  // Default event time (9 AM to 10 AM on selected date)
  const defaultStartTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0)
  const defaultEndTime = addHours(defaultStartTime, 1)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState<Date>(defaultStartTime)
  const [endTime, setEndTime] = useState<Date>(defaultEndTime)
  const [type, setType] = useState<EventType>("meeting")
  const [location, setLocation] = useState("")
  const [isPreferred, setIsPreferred] = useState(false)

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Edit mode - populate form with event data
        setTitle(event.title)
        setDescription(event.description || "")
        setStartTime(new Date(event.startTime))
        setEndTime(new Date(event.endTime))
        setType(event.type)
        setLocation(event.location || "")
        setIsPreferred(event.isPreferred || false)
      } else {
        // Create mode - reset form
        setTitle("")
        setDescription("")
        // Create new Date objects to avoid reference issues
        const newStartTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0)
        const newEndTime = addHours(newStartTime, 1)

        setStartTime(newStartTime)
        setEndTime(newEndTime)
        setType("meeting")
        setLocation("")
        setIsPreferred(false)
      }
    }
  }, [isOpen, event, selectedDate]) // Only depend on these props, not on derived state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Sample user data (in a real app, this would come from auth)
    const currentUser = {
      id: "user-1",
      name: "Jane Doe",
      role: "educator" as const,
    }

    const eventData = {
      title,
      description: description || undefined,
      startTime,
      endTime,
      type,
      createdBy: currentUser,
      location: location || undefined,
      isPreferred: isPreferred || undefined,
    }

    if (event) {
      // Update existing event
      updateEvent(event.id, eventData)
    } else {
      // Create new event
      addEvent(eventData)
    }

    onClose()
  }

  // Format time for input fields
  const formatTimeForInput = (date: Date) => {
    return format(date, "HH:mm")
  }

  // Parse time from input fields
  const parseTimeFromInput = (timeString: string, baseDate: Date) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const newDate = new Date(baseDate)
    newDate.setHours(hours, minutes)
    return newDate
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(startTime, "yyyy-MM-dd")}
                onChange={(e) => {
                  const newDate = new Date(e.target.value)
                  const newStartTime = new Date(startTime)
                  newStartTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
                  setStartTime(newStartTime)

                  const newEndTime = new Date(endTime)
                  newEndTime.setFullYear(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())
                  setEndTime(newEndTime)
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Event Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as EventType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="duty">Duty</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={formatTimeForInput(startTime)}
                onChange={(e) => {
                  setStartTime(parseTimeFromInput(e.target.value, startTime))
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={formatTimeForInput(endTime)}
                onChange={(e) => {
                  setEndTime(parseTimeFromInput(e.target.value, endTime))
                }}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="preferred"
              checked={isPreferred}
              onCheckedChange={(checked) => setIsPreferred(checked as boolean)}
            />
            <Label htmlFor="preferred" className="text-sm font-normal">
              Mark as preferred duty time
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{event ? "Update Event" : "Create Event"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 