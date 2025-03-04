"use client"

import { useState } from "react"
import { BarChart, Download, FileText, Filter, PlusCircle, Search, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { FileUpload } from "../ui/file-upload"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"

/**
 * Report interface defining the structure of a report
 */
interface Report {
  id: string
  title: string
  category: string
  date: string
  type: "user" | "ai"
  status: "draft" | "completed" | "shared"
}

// Sample reports data
const reports: Report[] = [
  {
    id: "1",
    title: "End of Year Class Performance",
    category: "Performance",
    date: "May 15, 2024",
    type: "user",
    status: "completed",
  },
  {
    id: "2",
    title: "Student Growth Analysis",
    category: "Growth",
    date: "May 10, 2024",
    type: "ai",
    status: "completed",
  },
  {
    id: "3",
    title: "Math Quiz Results Breakdown",
    category: "Assessment",
    date: "May 5, 2024",
    type: "user",
    status: "completed",
  },
  {
    id: "4",
    title: "Reading Comprehension Trends",
    category: "Trends",
    date: "April 28, 2024",
    type: "ai",
    status: "shared",
  },
  {
    id: "5",
    title: "Science Fair Project Evaluations",
    category: "Projects",
    date: "April 15, 2024",
    type: "user",
    status: "completed",
  },
  {
    id: "6",
    title: "Behavioral Incidents Summary",
    category: "Behavior",
    date: "April 10, 2024",
    type: "ai",
    status: "draft",
  },
  {
    id: "7",
    title: "Parent-Teacher Conference Notes",
    category: "Communication",
    date: "March 25, 2024",
    type: "user",
    status: "shared",
  },
  {
    id: "8",
    title: "Curriculum Coverage Analysis",
    category: "Curriculum",
    date: "March 15, 2024",
    type: "ai",
    status: "completed",
  },
]

/**
 * Reports component for displaying and managing reports
 * Includes filtering, searching, and CRUD operations
 */
export function Reports() {
  const [searchText, setSearchText] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  // Filter reports based on search text, category, and type
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchText.toLowerCase())
    const matchesCategory = selectedCategory === "" || report.category === selectedCategory
    const matchesType =
      selectedType === "" ||
      (selectedType === "user" && report.type === "user") ||
      (selectedType === "ai" && report.type === "ai")

    return matchesSearch && matchesCategory && matchesType
  })

  // Handle select all reports checkbox
  const handleSelectAllReports = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([])
    } else {
      setSelectedReports(filteredReports.map((report) => report.id))
    }
  }

  // Handle individual report selection
  const handleSelectReport = (reportId: string) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter((id) => id !== reportId))
    } else {
      setSelectedReports([...selectedReports, reportId])
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and filter controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
                <SelectItem value="Growth">Growth</SelectItem>
                <SelectItem value="Assessment">Assessment</SelectItem>
                <SelectItem value="Trends">Trends</SelectItem>
                <SelectItem value="Projects">Projects</SelectItem>
                <SelectItem value="Behavior">Behavior</SelectItem>
                <SelectItem value="Communication">Communication</SelectItem>
                <SelectItem value="Curriculum">Curriculum</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="user">User Generated</SelectItem>
                <SelectItem value="ai">AI Generated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>Upload a report file or generate a new report using AI.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="upload">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload Report</TabsTrigger>
                  <TabsTrigger value="generate">Generate with AI</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Report Details</h3>
                    <Input placeholder="Report Title" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="assessment">Assessment</SelectItem>
                        <SelectItem value="trends">Trends</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="behavior">Behavior</SelectItem>
                        <SelectItem value="communication">Communication</SelectItem>
                        <SelectItem value="curriculum">Curriculum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Upload File</h3>
                    <FileUpload
                      acceptedFileTypes={[
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "text/csv",
                      ]}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="generate" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Report Type</h3>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Report Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="class-performance">Class Performance Analysis</SelectItem>
                        <SelectItem value="student-growth">Student Growth Tracking</SelectItem>
                        <SelectItem value="assessment-summary">Assessment Summary</SelectItem>
                        <SelectItem value="behavior-patterns">Behavior Patterns</SelectItem>
                        <SelectItem value="custom">Custom Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Source</h3>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Checkbox id="use-existing" />
                        <label
                          htmlFor="use-existing"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Use Existing Data
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <Checkbox id="upload-new" />
                        <label
                          htmlFor="upload-new"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Upload New Data
                        </label>
                      </div>
                    </div>
                    <div className="pt-2">
                      <FileUpload
                        acceptedFileTypes={[
                          "text/csv",
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        ]}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Report Instructions</h3>
                    <Input placeholder="Report Title" />
                    <textarea
                      className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add specific instructions for the AI (optional)"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Create Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" disabled={selectedReports.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="destructive" disabled={selectedReports.length === 0}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Reports table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>Manage your reports and analysis documents</CardDescription>
            </div>
            {selectedReports.length > 0 && <Badge variant="outline">{selectedReports.length} selected</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={filteredReports.length > 0 && selectedReports.length === filteredReports.length}
                    onCheckedChange={handleSelectAllReports}
                    aria-label="Select all reports"
                  />
                </TableHead>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedReports.includes(report.id)}
                      onCheckedChange={() => handleSelectReport(report.id)}
                      aria-label={`Select ${report.title}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      {report.title}
                    </div>
                  </TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={report.type === "ai" ? "border-blue-500 text-blue-500" : ""}>
                      {report.type === "ai" ? (
                        <BarChart className="mr-1 h-3 w-3" />
                      ) : (
                        <FileText className="mr-1 h-3 w-3" />
                      )}
                      {report.type === "ai" ? "AI Generated" : "User Created"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        report.status === "draft" ? "outline" : report.status === "shared" ? "secondary" : "default"
                      }
                    >
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    <div className="py-8 text-muted-foreground">
                      No reports found. Try adjusting your filters or create a new report.
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 