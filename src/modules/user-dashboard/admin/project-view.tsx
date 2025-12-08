import { Button } from "@/components/ui/button"
import { ProjectType } from "@/db/schema"
import { ProjectAdminViewWrapper } from "@/modules/project-view/project-admin-view-wrapper"
import { SingleProjectViewProps } from "@/modules/project-view/project-view-props"
import { SingleProjectView } from "@/modules/project-view/single-project-view"
import { ArrowLeft, Link } from "lucide-react"



export const ProjectView = ({ 
    project,
    clientName,
    clientEmail,
    translatorName,
    translatorEmail,
    sourceFile,
    translatedFile,
    translatorReview,
    companyReview,
    isStatusUpdating,
    onStatusUpdate,
} : SingleProjectViewProps) => {
    const MANAGE_TRANSLATOR_LINK = `/admin/translator/${project.translatorId}`

    return (
        <ProjectAdminViewWrapper title="Project Details" description="">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" asChild>
                <Link href={MANAGE_TRANSLATOR_LINK}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Manage Translator
                </Link>
                </Button>

                <SingleProjectView
                    project={project}
                    clientName={clientName}
                    clientEmail={clientEmail}
                    translatorEmail={translatorEmail}
                    translatorName={translatorName}
                    sourceFile={sourceFile}
                    translatedFile={translatedFile}
                    translatorReview={translatorReview}
                    companyReview={companyReview}
                    onStatusUpdate={onStatusUpdate}
                    isStatusUpdating={isStatusUpdating}
                />
            </div>
        </ProjectAdminViewWrapper>
    )
}