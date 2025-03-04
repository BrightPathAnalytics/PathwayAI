import { useState, useRef, useEffect } from "react"
import { Send, PlusCircle, BookOpen, BarChart, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatMessage } from "@/components/assistant/chat-message"
import { SuggestedPrompt } from "@/components/assistant/suggested-prompt"
import useWebSocket from "react-use-websocket"
import { LessonPlanCard, LessonPlan } from "@/components/assistant/lesson-plan"
import { getWebSocketUrl, formatMessage, parseWebSocketMessage } from "@/services/websocket-service"

// Define Message type
type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  lessonPlan?: LessonPlan // Add lessonPlan property to support structured data
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

  // Initialize WebSocket connection
  const { sendMessage } = useWebSocket(getWebSocketUrl(), {
    shouldReconnect: () => true,
    onMessage: (event) => {
      try {
        const data = parseWebSocketMessage(event.data)
        if (!data) return
        
        // Handle lesson plan data from WebSocket
        if (data.lesson_plan) {
          const assistantMessage: Message = {
            id: String(messages.length + 1),
            role: "assistant",
            content: "I've created a lesson plan for you:",
            timestamp: new Date(),
            lessonPlan: data.lesson_plan as LessonPlan
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        } 
        // Handle regular text messages
        else if (data.message) {
          const assistantMessage: Message = {
            id: String(messages.length + 1),
            role: "assistant",
            content: data.message as string,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error handling WebSocket message:", error)
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error("WebSocket error:", error)
      setIsLoading(false)
    }
  })

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

    // Send message to WebSocket API
    try {
      sendMessage(formatMessage(input))
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
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
                  <div key={message.id}>
                    <ChatMessage message={message} />
                    {message.lessonPlan && <LessonPlanCard plan={message.lessonPlan} />}
                  </div>
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
              // Handle new chat - reset messages to initial state
              setMessages(initialMessages)
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
          <Button type="submit" size="icon" className="shrink-0" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
} 