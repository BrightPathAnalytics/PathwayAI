"use client"

import { useState } from "react"
import {
  FileText,
  Filter,
  FolderOpen,
  Grid,
  ImageIcon,
  ListFilter,
  PenSquare,
  PlusCircle,
  Search,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Sheet {
  id: string
  title: string
  type: "worksheet" | "bellringer" | "test" | "homework"
  subject: string
  date: string
  fileType: "pdf" | "docx" | "xlsx" | "image" | "other"
  isAIGenerated: boolean
}

// Sample data for demonstration purposes
const sheets: Sheet[] = [
  {
    id: "1",
    title: "Cell Division Worksheet",
    type: "worksheet",
    subject: "Biology",
    date: "May 12, 2024",
    fileType: "pdf",
    isAIGenerated: true,
  },
  {
    id: "2",
    title: "Algebra Equations Quiz",
    type: "test",
    subject: "Math",
    date: "May 10, 2024",
    fileType: "docx",
    isAIGenerated: false,
  },
  {
    id: "3",
    title: "Historical Events Timeline",
    type: "homework",
    subject: "History",
    date: "May 5, 2024",
    fileType: "pdf",
    isAIGenerated: false,
  },
  {
    id: "4",
    title: "Vocabulary Practice",
    type: "bellringer",
    subject: "English",
    date: "May 3, 2024",
    fileType: "docx",
    isAIGenerated: true,
  },
  {
    id: "5",
    title: "Chemical Reactions Lab",
    type: "worksheet",
    subject: "Chemistry",
    date: "April 28, 2024",
    fileType: "pdf",
    isAIGenerated: false,
  },
  {
    id: "6",
    title: "Poetry Analysis Exercise",
    type: "homework",
    subject: "English",
    date: "April 25, 2024",
    fileType: "docx",
    isAIGenerated: true,
  },
  {
    id: "7",
    title: "Earth Science Midterm",
    type: "test",
    subject: "Science",
    date: "April 20, 2024",
    fileType: "pdf",
    isAIGenerated: false,
  },
  {
    id: "8",
    title: "Math Problem of the Day",
    type: "bellringer",
    subject: "Math",
    date: "April 18, 2024",
    fileType: "image",
    isAIGenerated: true,
  },
  {
    id: "9",
    title: "Spanish Verb Conjugation",
    type: "worksheet",
    subject: "Language",
    date: "April 15, 2024",
    fileType: "docx",
    isAIGenerated: false,
  },
  {
    id: "10",
    title: "Art History Timeline",
    type: "homework",
    subject: "Art",
    date: "April 10, 2024",
    fileType: "pdf",
    isAIGenerated: true,
  },
  {
    id: "11",
    title: "Physical Education Assessment",
    type: "test",
    subject: "PE",
    date: "April 5, 2024",
    fileType: "xlsx",
    isAIGenerated: false,
  },
  {
    id: "12",
    title: "Daily Grammar Challenge",
    type: "bellringer",
    subject: "English",
    date: "April 3, 2024",
    fileType: "docx",
    isAIGenerated: true,
  },
]

export function Sheets() {
  const [searchText, setSearchText] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedSource, setSelectedSource] = useState<string>("")
  const [view, setView] = useState<"grid" | "list">("grid")

  // Filter sheets based on search text and selected filters
  const filteredSheets = sheets.filter((sheet) => {
    const matchesSearch = sheet.title.toLowerCase().includes(searchText.toLowerCase())
    const matchesType = selectedType === "" || sheet.type === selectedType
    const matchesSubject = selectedSubject === "" || sheet.subject === selectedSubject
    const matchesSource =
      selectedSource === "" ||
      (selectedSource === "ai" && sheet.isAIGenerated) ||
      (selectedSource === "user" && !sheet.isAIGenerated)

    return matchesSearch && matchesType && matchesSubject && matchesSource
  })

  // Helper function to get the appropriate icon for each file type
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-10 w-10 text-red-500" />
      case "docx":
        return <FileText className="h-10 w-10 text-blue-500" />
      case "xlsx":
        return <Grid className="h-10 w-10 text-green-500" />
      case "image":
        return <ImageIcon className="h-10 w-10 text-purple-500" />
      default:
        return <FileText className="h-10 w-10 text-gray-500" />
    }
  }

  // Helper function to get the appropriate color for each sheet type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "worksheet":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      case "test":
        return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
      case "homework":
        return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
      case "bellringer":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sheets..."
              className="pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="h-10 gap-1 px-3 lg:hidden"
            onClick={() => setView(view === "grid" ? "list" : "grid")}
          >
            {view === "grid" ? <ListFilter className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-1 px-3">
                <Filter className="h-4 w-4" />
                <span className="hidden md:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="mb-2">
                  <label className="text-xs font-medium">Type</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Types</SelectItem>
                      <SelectItem value="worksheet">Worksheets</SelectItem>
                      <SelectItem value="test">Tests</SelectItem>
                      <SelectItem value="homework">Homework</SelectItem>
                      <SelectItem value="bellringer">Bellringers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-2">
                  <label className="text-xs font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Subjects</SelectItem>
                      <SelectItem value="Math">Math</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Language">Language</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="PE">PE</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-2">
                  <label className="text-xs font-medium">Source</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger className="h-8 mt-1">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Sources</SelectItem>
                      <SelectItem value="ai">AI Generated</SelectItem>
                      <SelectItem value="user">User Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${view === "grid" ? "bg-muted" : ""}`}
              onClick={() => setView("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${view === "list" ? "bg-muted" : ""}`}
              onClick={() => setView("list")}
            >
              <ListFilter className="h-4 w-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1">
                <PlusCircle className="h-4 w-4" />
                <span>New Sheet</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <PenSquare className="mr-2 h-4 w-4" />
                <span>Create Manually</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Generate with AI</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FolderOpen className="mr-2 h-4 w-4" />
                <span>Upload File</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSheets.map((sheet) => (
            <Card key={sheet.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 text-base">{sheet.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-4">
                  {getFileIcon(sheet.fileType)}
                  <div className="space-y-1">
                    <Badge className={getTypeColor(sheet.type)} variant="secondary">
                      {sheet.type.charAt(0).toUpperCase() + sheet.type.slice(1)}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{sheet.subject}</div>
                    <div className="text-xs text-muted-foreground">{sheet.date}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    {sheet.isAIGenerated && (
                      <div className="flex items-center text-xs text-purple-500 dark:text-purple-400">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Generated
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border">
          <div className="grid grid-cols-1 divide-y">
            {filteredSheets.map((sheet) => (
              <div key={sheet.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {getFileIcon(sheet.fileType)}
                  <div>
                    <div className="font-medium">{sheet.title}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={getTypeColor(sheet.type)} variant="secondary">
                        {sheet.type.charAt(0).toUpperCase() + sheet.type.slice(1)}
                      </Badge>
                      <span>{sheet.subject}</span>
                      <span>•</span>
                      <span>{sheet.date}</span>
                      {sheet.isAIGenerated && (
                        <>
                          <span>•</span>
                          <div className="flex items-center text-purple-500 dark:text-purple-400">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Generated
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 