"use client"
import { Badge } from "@/components/ui/badge"
import { ProjectStatusType } from "@/db/schema"
import { AlertCircle, Archive, CheckCircle2, Clock, Eye, Languages, Pause } from "lucide-react"

export function StatusBadge({ status }: { status: ProjectStatusType }) {
  const cfg = getStatusConfig(status)
  return cfg.badge
}

export function getStatusConfig(status: ProjectStatusType) {
  switch (status) {
    case "NEW":
      return {
        badge: (
          <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            New
          </Badge>
        ),
        icon: AlertCircle,
        color: "text-blue-500",
      }
    case "ASSIGNED":
      return {
        badge: (
          <Badge className="bg-teal-500/10 text-teal-500 border-teal-500/20">
            <Languages className="h-3 w-3 mr-1" />
            Translator Assigned
          </Badge>
        ),
        icon: Languages,
        color: "text-teal-500",
      }
    case "IN_PROGRESS":
      return {
        badge: (
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        ),
        icon: Clock,
        color: "text-yellow-500",
      }
    case "QA":
      return {
        badge: (
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            <Eye className="h-3 w-3 mr-1" />
            QA Review
          </Badge>
        ),
        icon: Eye,
        color: "text-purple-500",
      }
    case "BLOCKED":
      return {
        badge: (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
            <Pause className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        ),
        icon: Pause,
        color: "text-red-500",
      }
    case "DONE":
      return {
        badge: (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Done
          </Badge>
        ),
        icon: CheckCircle2,
        color: "text-green-500",
      }
    case "CLOSED":
      return {
        badge: (
          <Badge className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <Archive className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        ),
        icon: Archive,
        color: "text-gray-500",
      }
    default:
      return {
        badge: <Badge variant="outline">{status}</Badge>,
        icon: AlertCircle,
        color: "text-muted-foreground",
      }
  }
}
