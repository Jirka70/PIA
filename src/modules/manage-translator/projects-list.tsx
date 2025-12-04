import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { ProjectStatusType, ProjectType } from "@/db/schema"
import { ProjectBadge } from "../user-dashboard/user/project-badge"
import { StatusBadge } from "../project-view/status-badge"


interface ProjectsListProps {
  projects: ProjectType[]
}

export function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        Žádné projekty
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id}>
          <Link href={`/project-view/${project.id}`}>
            <Card className="p-4 transition-all hover:shadow-md cursor-pointer group">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {project.name}
                      </h4>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {project.dueAt?.toLocaleDateString('cs-CZ') || "No deadline"}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Průběh</span>
                    <span className="font-medium text-foreground">{project.progressPercent}%</span>
                  </div>
                  <Progress value={project.progressPercent} className="h-2" />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      ))}
    </div>
  )
}
