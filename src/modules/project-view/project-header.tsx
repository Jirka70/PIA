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
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectLanguagesSkeleton } from "../manage-translator/edit-languages-dialog"
import { ProjectStatusType, ProjectType } from "@/db/schema"

export function ProjectHeader({
  project,
  isOverdue,
  isUrgent,
  isStatusDialogOpen,
  setIsStatusDialogOpen,
  isUpdatingStatus,
}: {
  project: ProjectType
  isOverdue: boolean
  isUrgent: boolean
  isStatusDialogOpen: boolean
  setIsStatusDialogOpen: (open: boolean) => void
  isUpdatingStatus: boolean
}) {
  const [projectStatus, setProjectStatus] = useState<ProjectStatusType | undefined>(
    project.status
  )

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const updateStatusMutation = useMutation(trpc.projects.changeProjectStatus.mutationOptions({
    onSuccess: () => {
      toast.success("Status changed")
    },
    onError: (error) => {
      toast.error(error?.message || "Status cannot be changed")
    }
  }))

  const statusesQuery = useQuery(trpc.projects.getProjectStatuses.queryOptions());


  const updateStatus = async () => {
    if (!projectStatus) {
      toast.error("No status was selected. Select one")
      return;
    }
    
    await updateStatusMutation.mutateAsync({
      projectId: project.id,
      projectStatus: projectStatus
    })

    queryClient.invalidateQueries(trpc.users.getTranslatorInfo.queryOptions({
      id: project.translatorId!
    }))
    queryClient.invalidateQueries(trpc.projects.getProjectById.queryOptions({
      id: project.id
    }))


    setIsStatusDialogOpen(false)
  
  }

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
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={projectStatus} onValueChange={(value) => setProjectStatus(value as ProjectStatusType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusesQuery.data
                      ? statusesQuery.data?.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))
                      : <SelectLanguagesSkeleton />}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  Cancel
                </Button>
                <Button disabled={updateStatusMutation.isPending} onClick={async () => { await updateStatus() }}>{updateStatusMutation.isPending ? "Updating..." : "Update status"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  )
}
