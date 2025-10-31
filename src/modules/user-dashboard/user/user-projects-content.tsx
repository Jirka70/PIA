import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import { User } from "better-auth"
import { ProjectListSkeleton } from "../project-list-skeleton"
import { UserProject } from "./user-project"

interface UserProjectsProps {
    user: User
}

export const UserProjectsContent = ({ user } : UserProjectsProps) => {    
    const trpc = useTRPC()
    const { data, isLoading, isError, isFetching, error } = useQuery({
        ...trpc.projects.getManyAsUser.queryOptions({
            userId: user.id,
        }),
        
        staleTime: 60_000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: false,
    });

    if (isLoading || !data) {
        return <ProjectListSkeleton />;
    }

    if (isError) {
        return (
            <div className="text-sm text-red-600">
                Projects could not be loaded: {error.message}
            </div>
        );
    }

    const projects = data?.projects
        ? data?.projects 
        : []

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