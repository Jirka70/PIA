"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: number
  text: string
  sender: "user" | "other"
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Ahoj! Jak se máš?",
    sender: "other",
    timestamp: "13:53",
  },
  {
    id: 2,
    text: "Skvěle, díky! A ty?",
    sender: "user",
    timestamp: "13:54",
  },
  {
    id: 3,
    text: "Taky dobře! Pracuješ na něčem zajímavém?",
    sender: "other",
    timestamp: "13:54",
  },
  {
    id: 4,
    text: "Ano, dělám novou chat aplikaci. Vypadá to docela dobře!",
    sender: "user",
    timestamp: "13:55",
  },
]

export function ChatDialog() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? "instant" : "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        scrollToBottom(true)
      })
    }
  }, [open])

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputValue,
        sender: "user",
        timestamp: new Date().toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages([...messages, newMessage])
      setInputValue("")

      // Simulace odpovědi
      setTimeout(() => {
        const responseMessage: Message = {
          id: messages.length + 2,
          text: "To zní skvěle! Těším se na to.",
          sender: "other",
          timestamp: new Date().toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" }),
        }
        setMessages((prev) => [...prev, responseMessage])
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-orange-500 hover:bg-orange-700 text-white">
          <MessageCircle className="h-2 w-2" />
          Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[85vh] max-h-[600px] p-0 gap-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-card shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/abstract-profile.png" />
              <AvatarFallback className="bg-primary text-primary-foreground">KD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-base">Kamarád</DialogTitle>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full px-6 py-4">
            <div className="space-y-4 pb-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  {message.sender === "other" && (
                    <Avatar className="h-8 w-8 mt-1 shrink-0">
                      <AvatarImage src="/abstract-profile.png" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">KD</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "flex flex-col gap-1 max-w-[70%]",
                      message.sender === "user" ? "items-end" : "items-start",
                    )}
                  >
                    <div
                        className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words",
                            message.sender === "user"
                            ? "bg-primary text-white rounded-br-sm" // <--- upraveno
                            : "bg-secondary text-secondary-foreground rounded-bl-sm",
                        )}
                        >
                        {message.text}
                    </div>
                    <span className="text-xs text-muted-foreground px-1">{message.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t bg-card shrink-0">
          <div className="flex gap-2">
            <Input
              placeholder="Napište zprávu..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
