"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Search, MessageSquare } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/assistant/chat-message"

export function Help() {
  const [searchQuery, setSearchQuery] = useState("")
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; role: "user" | "assistant"; content: string; timestamp: Date }>
  >([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your Pathway AI support assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackName, setFeedbackName] = useState("")
  const [feedbackEmail, setFeedbackEmail] = useState("")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: generateHelpResponse(chatInput),
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the feedback to a server
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackName("")
      setFeedbackEmail("")
      setFeedbackMessage("")
      setFeedbackSubmitted(false)
    }, 3000)
  }

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Tabs defaultValue="faq" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="faq">FAQ</TabsTrigger>
        <TabsTrigger value="chat">Chat Support</TabsTrigger>
        <TabsTrigger value="feedback">Feedback</TabsTrigger>
      </TabsList>

      <TabsContent value="faq" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Find answers to common questions about Pathway AI.</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm dark:prose-invert">{faq.answer}</div>
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="py-4 text-center text-muted-foreground">No FAQs found matching your search.</div>
                )}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="chat" className="space-y-4">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Chat with Support</CardTitle>
            <CardDescription>Get real-time help from our AI support assistant.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 pb-4">
                {chatMessages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <ChatMessage
                    message={{
                      id: "loading",
                      role: "assistant",
                      content: "Thinking...",
                      timestamp: new Date(),
                    }}
                    isLoading
                  />
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
              <Input
                placeholder="Type your question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!chatInput.trim() || isLoading}>
                <MessageSquare className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="feedback" className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>Share your thoughts, suggestions, or report issues with Pathway AI.</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackSubmitted ? (
              <div className="rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <p className="text-center font-medium">Thank you for your feedback!</p>
                <p className="text-center text-sm">We appreciate your input and will review it shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" value={feedbackName} onChange={(e) => setFeedbackName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Feedback
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Helper function to generate responses
function generateHelpResponse(input: string): string {
  // This is a simple mock response generator
  // In a real app, this would analyze the input and provide relevant responses
  console.log(`User asked: ${input}`); // Log the input to show it's being used
  
  const responses = [
    "To solve this issue, you can navigate to Settings and select the option to reset your preferences.",
    "This feature is available in the Schedule section. Click on the 'Add Event' button to create a new event.",
    "You can export your data from the Reports page by clicking the Export button in the top-right corner.",
    "To share content with other teachers, use the Share button available on each item in the Sheets section.",
    "Your account settings can be accessed by clicking on your profile picture in the sidebar and selecting 'Profile'.",
    "The system automatically saves your work every few minutes, but you can also manually save by pressing Ctrl+S or Cmd+S.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Sample FAQ data
const faqs = [
  {
    question: "How do I create a new event in the Schedule?",
    answer:
      "To create a new event in the Schedule, navigate to the Schedule page and click the 'Add Event' button in the top-right corner. Fill in the event details in the form that appears, including title, description, date, time, and event type. You can also mark it as a preferred duty time if applicable. Click 'Create Event' to save it to your schedule.",
  },
  {
    question: "Can I export my reports to share with administrators?",
    answer:
      "Yes, you can export your reports to share with administrators. On the Reports page, select the reports you want to export by checking the boxes next to them, then click the 'Export' button in the top-right corner. You can choose to export as PDF, Excel, or CSV format depending on your needs.",
  },
  {
    question: "How do I upload worksheets to the Sheets section?",
    answer:
      "To upload worksheets to the Sheets section, go to the Sheets page and click the 'Upload' button. You can either drag and drop files or click to browse your computer. Select the files you want to upload and click 'Open'. You can upload various file types including PDFs, Word documents, Excel spreadsheets, and images.",
  },
  {
    question: "Can I collaborate with other teachers on worksheets?",
    answer:
      "Yes, you can collaborate with other teachers on worksheets. In the Sheets section, select the worksheet you want to share, then click the 'Share' button. Enter the email addresses of the teachers you want to collaborate with and set their permission level (view only or edit). They will receive an email notification with a link to access the worksheet.",
  },
  {
    question: "How do I view student performance data?",
    answer:
      "To view student performance data, go to the Reports section and select 'Student Performance' from the dropdown menu. You can filter the data by class, subject, time period, and individual student. The system will display charts and tables showing grades, attendance, assignment completion rates, and other key metrics to help you track student progress.",
  },
  {
    question: "Is my data secure on Pathway AI?",
    answer:
      "Yes, your data is secure on Pathway AI. We use industry-standard encryption for all data in transit and at rest. Our platform complies with FERPA and other educational privacy regulations. We never share your data with third parties without your explicit consent, and you retain ownership of all content you create or upload to the platform.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "To reset your password, click on the 'Forgot Password' link on the login page. Enter the email address associated with your account and click 'Send Reset Link'. You'll receive an email with a link to reset your password. Click the link and enter your new password twice to confirm. For security reasons, the reset link expires after 24 hours.",
  },
  {
    question: "Can I access Pathway AI on mobile devices?",
    answer:
      "Yes, you can access Pathway AI on mobile devices. Our platform is fully responsive and works on smartphones and tablets. You can download our mobile app from the App Store or Google Play Store for an optimized mobile experience. The mobile version includes all core features available in the desktop version.",
  },
] 