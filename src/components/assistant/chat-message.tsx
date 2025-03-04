import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    timestamp: Date
  }
  isLoading?: boolean
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-start space-x-3",
        message.role === "user" ? "justify-end space-x-reverse" : "justify-start",
      )}
    >
      {message.role === "assistant" && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
          isLoading && "animate-pulse",
        )}
      >
        <div className="prose prose-sm dark:prose-invert break-words">{message.content}</div>
        <div
          className={cn(
            "text-xs mt-1",
            message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </div>
      </div>

      {message.role === "user" && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
} 