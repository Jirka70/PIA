import { ProjectCardSkeleton } from "./project-card-skeleton";

const NUMBER_OF_PROJECTS = 6;

export function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: NUMBER_OF_PROJECTS }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  )
}