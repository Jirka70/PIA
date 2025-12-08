import { UserProjectViewProps } from "@/modules/project-view/project-view-props"
import { UserProject } from "./user-project"
import { CompanyFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { ProjectType } from "@/db/schema"

interface UserProjectsProps {
    projects: UserProjectViewProps[],
    isFetching: boolean,
    onTranslatorReviewSubmit: (data: TranslatorFormData, project: ProjectType) => Promise<void>,
    onCompanyReviewSubmit: (data: CompanyFormData, project: ProjectType) => Promise<void>,
}

export const UserProjectsContent = ({ projects: projectsInfo, 
    isFetching, 
    onTranslatorReviewSubmit, 
    onCompanyReviewSubmit } : UserProjectsProps) => {   

    console.log(projectsInfo)
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                {isFetching && (
                <span className="text-xs text-muted-foreground animate-pulse">
                    Updating...
                </span>
                )}
            </div>
            {projectsInfo.length === 0 
                ? (
                    <div className="text-sm text-muted-foreground">
                        Currently, you have no created projects
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {projectsInfo.map((projectInfo) => (
                            <UserProject 
                                key={projectInfo.project.id}
                                projectInfo={projectInfo}
                                onTranslatorReviewSubmit={onTranslatorReviewSubmit}
                                onCompanyReviewSubmit={onCompanyReviewSubmit}
                            />
                        ))}
                    </div>
                )}
        </div>
    )
}