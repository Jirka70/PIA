"use client"

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { User } from "better-auth"
import { ProjectToTranslate } from "./project-to-translate";
import { ProjectListSkeleton } from "../project-list-skeleton";

interface ProjectsContentProps {
    user: User
}

export const ProjectsContent = ( { user } : ProjectsContentProps) => {
    const trpc = useTRPC();
    const { data, isLoading, isError, isFetching, error } = useQuery({
        ...trpc.projects.getManyAsTranslator.queryOptions({
            translatorId: user.id,
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
                <h2 className="text-2xl font-bold">Assigned Projects</h2>
                {isFetching && (
                <span className="text-xs text-muted-foreground animate-pulse">
                    Updating...
                </span>
                )}
            </div>

            {projects.length === 0 
                ? (
                    <div className="text-sm text-muted-foreground">
                       Currently, you have no assigned projects
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {projects.map((project) => (
                            <ProjectToTranslate
                                key={project.id}
                                project={project}
                                onUpdateProgress={() => {}}
                                onCompleteProject={() => {}}
                            />
                        ))}
                    </div>
                )}
        </div>
    )

    /*return (
        <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Assigned Projects</h2>
              
            </div>

                {projects.map((project) => (
                    <ProjectToTranslate
                        key={project.id}
                        project={project}
                        onUpdateProgress={() => {}}
                        onCompleteProject={() => {}}
                    />
                ))}
        </>
    )*/
}