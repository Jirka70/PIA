"use client"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit } from "lucide-react"
import { useState } from "react"
import { StatusBadge } from "./status-badge"

export function ProjectHeader({
  project,
  isOverdue,
  isUrgent,
  isStatusDialogOpen,
  setIsStatusDialogOpen,
  isUpdatingStatus,
}: {
  project: any
  isOverdue: boolean
  isUrgent: boolean
  isStatusDialogOpen: boolean
  setIsStatusDialogOpen: (open: boolean) => void
  isUpdatingStatus: boolean
}) {
  const [projectStatus, setProjectStatus] = useState<string | undefined>(
    project?.status
  )

  return (
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <CardTitle className="text-2xl">{project.name}</CardTitle>
            <StatusBadge status={project.status} />
            {isOverdue && (
              <Badge variant="destructive" className="animate-pulse">
                Overdue
              </Badge>
            )}
            {isUrgent && (
              <Badge className="bg-yellow-500 text-white">Urgent</Badge>
            )}
          </div>

          {project.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Change Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Project Status</DialogTitle>
              <DialogDescription>
                Change the status of {project.name}
              </DialogDescription>
            </DialogHeader>
            <StatusDialogBody
              projectStatus={projectStatus}
              onChangeStatus={setProjectStatus}
              onClose={() => setIsStatusDialogOpen(false)}
              isUpdating={isUpdatingStatus}
            />
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  )
}

function StatusDialogBody({
  projectStatus,
  onChangeStatus,
  onClose,
  isUpdating,
}: {
  projectStatus?: string
  onChangeStatus: (v?: string) => void
  onClose: () => void
  isUpdating: boolean
}) {
  return (
    <div className="space-y-4 py-4">
      <StatusSelect value={projectStatus} onChange={onChangeStatus} />
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update Status</Button>
      </div>
    </div>
  )
}

function StatusSelect({
  value,
  onChange,
}: {
  value?: string
  onChange: (v?: string) => void
}) {
  const { Label } = require("@/components/ui/label")
  const { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } =
    require("@/components/ui/select")

  return (
    <div className="space-y-2">
      <Label>Status</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="QA">QA Review</SelectItem>
          <SelectItem value="BLOCKED">Blocked</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
          <SelectItem value="CLOSED">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
