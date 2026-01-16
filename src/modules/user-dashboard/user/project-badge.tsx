import { Badge } from "@/components/ui/badge"
import { ProjectStatusType } from "@/db/schema"

interface ProjectBadgeProps {
    projectProgress: number,
    projectStatus: string
}

export const ProjectBadge = ({ projectProgress, projectStatus } : ProjectBadgeProps) => {
    return (
        <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            In Progress
        </Badge>
    )
}