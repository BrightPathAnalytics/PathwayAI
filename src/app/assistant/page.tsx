import { ChatInterface } from "@/components/assistant/chat-interface"

export default function AssistantPage() {
  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">Ask questions or get help with your teaching tasks.</p>
      </div>

      <ChatInterface />
    </main>
  )
} 