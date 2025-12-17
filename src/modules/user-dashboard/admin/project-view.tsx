import { Button } from "@/components/ui/button"
import { CompanyReviewType, ProjectFileType, ProjectStatusType, ProjectType, TranslatorReviewType } from "@/db/schema"
import { ProjectAdminViewWrapper } from "@/modules/project-view/project-admin-view-wrapper"
import { SingleProjectViewProps } from "@/modules/project-view/project-view-props"
import { SingleProjectView } from "@/modules/project-view/single-project-view"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProjectViewProps {
    project: ProjectType,
    clientName?: string,
    clientEmail?: string,
    translatorName?: string,
    translatorEmail?: string,
    sourceFile: ProjectFileType | null,
    translatedFile?: ProjectFileType | null,
    translatorReview?: TranslatorReviewType | null,
    companyReview?: CompanyReviewType | null,
    isStatusUpdating: boolean,
    onStatusUpdate: (newStatus: ProjectStatusType) => Promise<void>,
    backButtonLink: string,
    backButtonText: string
}

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
    backButtonLink,
    backButtonText
} : ProjectViewProps) => {

    return (
        <ProjectAdminViewWrapper title="Project Details" description="">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={backButtonLink} className="inline-flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span>{backButtonText}</span>
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
