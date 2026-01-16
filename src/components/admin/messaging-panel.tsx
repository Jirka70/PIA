"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send } from "lucide-react"
import { toast } from "sonner"

export function MessagingPanel() {
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (!recipient || !message) {
      toast.error("Select a recipient and enter a message")
      return
    }

    toast.success(`Your message has been sent to ${recipient}`)

    setRecipient("")
    setMessage("")
  }

  return (
    <Card className="bg-card/50 backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle>Send Message</CardTitle>
        <CardDescription>Communicate with users and translators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient</Label>
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger id="recipient">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maria">Maria Garcia (Translator)</SelectItem>
              <SelectItem value="john">John Smith (Customer)</SelectItem>
              <SelectItem value="sophie">Sophie Chen (Translator)</SelectItem>
              <SelectItem value="ahmed">Ahmed Hassan (Customer)</SelectItem>
              <SelectItem value="elena">Elena Popov (Translator)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        <Button onClick={handleSendMessage} className="w-full">
          <Send className="mr-2 size-4" />
          Send Message
        </Button>
      </CardContent>
    </Card>
  )
}
