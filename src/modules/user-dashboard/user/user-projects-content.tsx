import { UserProject } from "./user-project"
import { ProjectType } from "@/db/schema"

interface UserProjectsProps {
    projects: ProjectType[],
    isFetching: boolean,
}

export const UserProjectsContent = ({ projects, isFetching } : UserProjectsProps) => {    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                {isFetching && (
                <span className="text-xs text-muted-foreground animate-pulse">
                    Updating...
                </span>
                )}
            </div>
            {projects.length === 0 
                ? (
                    <div className="text-sm text-muted-foreground">
                        Currently, you have no created projects
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {projects.map((project) => (
                            <UserProject 
                                key={project.id}
                                project={project}
                            />
                        ))}
                    </div>
                )}
        </div>
    )
}