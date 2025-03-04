"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DatePickerWithRange } from "@/components/schedule/date-range-picker"
import type { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

export function Schedule() {
  const [activeTab, setActiveTab] = useState("monthly")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const handleAddEvent = () => {
    // This will be implemented later
    alert("Add event functionality will be implemented soon.")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
        </div>
        <Button onClick={handleAddEvent}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="space-y-4">
          <div className="p-4 border rounded-md">
            <p className="text-center text-muted-foreground">Monthly view will be implemented soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="p-4 border rounded-md">
            <p className="text-center text-muted-foreground">Weekly view will be implemented soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="p-4 border rounded-md">
            <p className="text-center text-muted-foreground">Daily view will be implemented soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 