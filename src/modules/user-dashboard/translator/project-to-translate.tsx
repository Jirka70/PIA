"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ProjectFileType, ProjectType } from "@/db/schema"
import { performDownload, performPreview } from "@/lib/utils"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Calendar, Clock, Languages, MessageSquare, Send, CheckCircle2, Eye, Download } from "lucide-react"
import { useState } from "react"

type ProjectStatus = "NEW" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED" | "CANCELLED" | "DONE" | "CLOSED"


interface ProjectToTranslateProps {
  project: ProjectType
  onUpdateProgress?: () => void
  onCompleteProject?: () => void
}

export const ProjectToTranslate = ({ project, onUpdateProgress, onCompleteProject }: ProjectToTranslateProps) => {
  const [isProgressDialogOpen, setIsProgressDialogOpen] = useState(false)
  const [progress, setProgress] = useState(project.progressPercent)
  const [message, setMessage] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  async function handleUpdateProgress(progress: number) {
    
  }


  const previewFileMutation = useMutation({
    mutationFn: viewFile
  })

  async function viewFile()  {
      const data = getFileToDownloadQuery.data;
      if (!data) {
        throw new Error("No data provided") // TODO create better error handling
      }

      const projectFile: ProjectFileType = data.projectFile

      await performPreview(projectFile)
  }

  async function handleViewFile() {
    await previewFileMutation.mutateAsync()
  }

  const trpc = useTRPC()

  const getFileToDownloadQuery = useQuery(trpc.projects.getSourceProjectFile.queryOptions({
    projectId: project.id
  }))

  async function download() {
    const data = getFileToDownloadQuery.data;
    if (!data) {
      throw new Error("No data provided") // TODO create better error handling
    }

    const projectFile: ProjectFileType = data.projectFile
    await performDownload(projectFile);
  }

  const downloadMutation = useMutation({
    mutationFn: download,
  });
  
  const handleDownloadFile = async () => {
      downloadMutation.mutate();
  }

  const handleMarkCompleted = () => {
    console.log("[v0] Marking project as completed")
    if (onCompleteProject) {
      onCompleteProject()
    }
  }

  const handleContactCustomer = () => {
    console.log("[v0] Contacting customer")
    if (onUpdateProgress) {
      onUpdateProgress()
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">New Assignment</Badge>
      case "IN_PROGRESS":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">In Progress</Badge>
      case "UNDER_REVIEW":
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">Under Review</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return "No deadline"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysUntilDue = (dueDate: Date | null) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysUntilDue = getDaysUntilDue(project.dueAt)
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0

  return (
    <Card className={isOverdue ? "border-red-500/50" : isUrgent ? "border-yellow-500/50" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              {getStatusBadge(project.status)}
            </div>
            {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <Languages className="h-4 w-4" />
                <span className="font-medium">
                  {project.sourceLanguage.toUpperCase()} → {project.targetLanguage.toUpperCase()}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span
                  className={isOverdue ? "text-red-500 font-medium" : isUrgent ? "text-yellow-500 font-medium" : ""}
                >
                  {formatDate(project.dueAt)}
                  {daysUntilDue !== null && (
                    <span className="ml-1">
                      ({isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`})
                    </span>
                  )}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Translation Progress</span>
            <span className="font-bold text-lg">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 transition-all duration-500 rounded-full ${
                progress === 100
                  ? "bg-green-500"
                  : progress >= 75
                    ? "bg-blue-500"
                    : progress >= 50
                      ? "bg-yellow-500"
                      : "bg-orange-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {/* Update Progress Dialog */}
          <Dialog open={isProgressDialogOpen} onOpenChange={setIsProgressDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" disabled={project.status === "DONE" || project.status === "CLOSED"}>
                Update Progress
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Update Translation Progress</DialogTitle>
                <DialogDescription>Adjust the completion percentage for {project.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-base">Progress</Label>
                      <span className="text-2xl font-bold">{progress}%</span>
                    </div>
                    <Slider
                      value={[progress]}
                      onValueChange={(value) => setProgress(value[0])}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Not Started</span>
                      <span>In Progress</span>
                      <span>Complete</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsProgressDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateProgress(progress)} disabled={isSaving} className="min-w-[120px]">
                    {isSaving ? "Saving..." : "Save Progress"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Complete Project Button */}
          {project.status === "IN_PROGRESS" && progress === 100 && (
            <Button
              size="sm"
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleMarkCompleted}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}

          {/* Message Customer Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Send Message to Customer</DialogTitle>
                <DialogDescription>Communicate about project: {project.name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    This message will be sent to the customer regarding this project
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setMessage("")}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      console.log("[v0] Sending message:", message)
                      setMessage("")
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>  

          <Button variant="outline" size="sm" onClick={handleViewFile} disabled={!project.sourceFileId || previewFileMutation.isPending}>
            <Eye className="mr-2 h-4 w-4" />
            {previewFileMutation.isPending ? "Creating View..." : "View"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownloadFile} disabled={!project.sourceFileId || getFileToDownloadQuery.isLoading || downloadMutation.isPending}>
            <Download className="mr-2 h-4 w-4" />
              
              {downloadMutation.isPending ? "Waiting for start donwload..." : "Download"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
