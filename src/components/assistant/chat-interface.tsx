import { useState, useRef, useEffect } from "react"
import { Send, PlusCircle, BookOpen, BarChart, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatMessage } from "@/components/assistant/chat-message"
import { SuggestedPrompt } from "@/components/assistant/suggested-prompt"

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hi there! I'm your Pathway AI assistant. How can I help you today? You can ask me about lesson planning, student performance, or content creation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
]

const suggestedPrompts = [
  {
    id: "1",
    icon: <BookOpen className="h-4 w-4" />,
    title: "Create a lesson plan",
    description: "Generate a detailed lesson plan for any subject and grade level",
    prompt: "Create a lesson plan for 9th grade biology about cell division.",
  },
  {
    id: "2",
    icon: <BarChart className="h-4 w-4" />,
    title: "Analyze test results",
    description: "Get insights on student performance based on test scores",
    prompt:
      "Can you analyze these test scores and identify struggling students? 85, 92, 67, 45, 88, 72, 63, 91, 55, 79",
  },
  {
    id: "3",
    icon: <Wand2 className="h-4 w-4" />,
    title: "Generate a quiz",
    description: "Create a quiz with specific criteria for any subject",
    prompt: "Generate a 10-question quiz for 7th grade history about Ancient Rome.",
  },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: String(messages.length + 1),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const botResponse = generateDummyResponse()
      const assistantMessage: Message = {
        id: String(messages.length + 2),
        role: "assistant",
        content: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handlePromptClick = (promptText: string) => {
    setInput(promptText)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="chat" className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start h-12 bg-transparent">
              <TabsTrigger value="chat" className="data-[state=active]:bg-transparent">
                Chat
              </TabsTrigger>
              <TabsTrigger value="prompts" className="data-[state=active]:bg-transparent">
                Suggested Prompts
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="chat" className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full pr-4">
              <div className="flex flex-col space-y-4">
                {messages.map((message) => (
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
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="prompts" className="flex-1 overflow-hidden p-4">
            <ScrollArea className="h-full pr-4">
              <div className="grid gap-4 md:grid-cols-2">
                {suggestedPrompts.map((prompt) => (
                  <SuggestedPrompt
                    key={prompt.id}
                    icon={prompt.icon}
                    title={prompt.title}
                    description={prompt.description}
                    prompt={prompt.prompt}
                    onClick={handlePromptClick}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex space-x-2"
        >
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="shrink-0"
            onClick={() => {
              // Handle new chat
            }}
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">New Chat</span>
          </Button>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

function generateDummyResponse(): string {
  const responses = [
    "I've created a detailed lesson plan for you. It includes objectives, materials needed, and a step-by-step guide for the class period.",
    "Based on the test scores you provided, I can see that there are a few students who might need additional support. The average score is 73.7, with 3 students scoring below 60.",
    "Here's a 10-question quiz on the requested topic. Each question includes multiple-choice options and an answer key.",
    "I've analyzed the data and created a visualization that shows the trends you're interested in. There's a clear pattern emerging in the second quarter.",
    "I've drafted an email template for you. Feel free to modify it as needed before sending it to parents.",
  ]
  return responses[Math.floor(Math.random() * responses.length)]
} 