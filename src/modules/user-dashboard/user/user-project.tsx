import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProjectType } from "@/db/schema"
import { ProjectBadge } from "./project-badge"
import { Clock, TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserProjectProps {
  project: ProjectType
}

export const UserProject = ({ project }: UserProjectProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-emerald-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 25) return "bg-amber-500"
    return "bg-slate-400"
  }

  const progressColor = getProgressColor(project.progressPercent)

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors truncate">
              {project.name}
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm sm:text-base line-clamp-2">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex-shrink-0 self-start">
            <ProjectBadge projectProgress={project.progressPercent} projectStatus={project.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Progress</span>
            </div>
            <span className="font-bold text-base tabular-nums">{project.progressPercent}%</span>
          </div>

          <div className="relative w-full bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`${progressColor} rounded-full h-full transition-all duration-500 ease-out relative overflow-hidden`}
              style={{ width: `${project.progressPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
        {(project.sourceFileId || project.translatedFileId) && (
          <div className="flex flex-wrap gap-2 pt-6 border-t border-border/50">
            {project.sourceFileId && (
              <Button variant="outline" size="sm" className="flex min-w-[140px] gap-2 bg-transparent" asChild>
                <a href={project.sourceFileId} download>
                  <Download className="w-4 h-4" />
                  <span>Source File</span>
                </a>
              </Button>
            )}
            
            {project.translatedFileId && project.status === "DONE" && (
              <Button variant="default" size="sm" className="flex-1 min-w-[140px] gap-2" asChild>
                <a href={project.translatedFileId} download>
                  <Download className="w-4 h-4" />
                  <span>Přeložený soubor</span>
                </a>
              </Button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </div>
          <div className="text-xs font-medium text-muted-foreground">
            {project.progressPercent < 100 ? (
              <span>{100 - project.progressPercent}% remaining</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">✓ Complete</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
