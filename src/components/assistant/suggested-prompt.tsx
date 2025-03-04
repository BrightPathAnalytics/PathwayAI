import React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SuggestedPromptProps {
  icon: React.ReactNode
  title: string
  description: string
  prompt: string
  onClick: (prompt: string) => void
}

export function SuggestedPrompt({
  icon,
  title,
  description,
  prompt,
  onClick,
}: SuggestedPromptProps) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => onClick(prompt)}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center space-x-2">
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
        <div>
          <CardTitle className="text-sm">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
} 