"use client"

import { Button } from "@/components/ui/button"
import { CompanyReviewType, ProjectFileType, ProjectStatusType, ProjectType, TranslatorReviewType } from "@/db/schema"
import { ProjectAdminViewWrapper } from "@/modules/project-view/project-admin-view-wrapper"
import { SingleProjectView } from "@/modules/project-view/single-project-view"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

interface ProjectViewProps {
  project: ProjectType
  clientName?: string
  clientEmail?: string
  translatorName?: string
  translatorEmail?: string
  sourceFile: ProjectFileType | null
  translatedFile?: ProjectFileType | null
  translatorReview?: TranslatorReviewType | null
  companyReview?: CompanyReviewType | null
  isStatusUpdating: boolean
  onStatusUpdate: (newStatus: ProjectStatusType) => Promise<void>
  backButtonLink: string
  backButtonText: string
  onClientClick?: (clientId: string) => Promise<void>
  onTranslatorClick?: (translatorId: string) => Promise<void>
  availableStatuses?: ProjectStatusType[]
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
  backButtonText,
  onClientClick,
  onTranslatorClick,
  availableStatuses
}: ProjectViewProps) => {
  const t = useTranslations("ProjectView")

  return (
    <ProjectAdminViewWrapper title={t("wrapper.title")} description={t("wrapper.description")}>
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
          onClientClick={onClientClick}
          onTranslatorClick={onTranslatorClick}
          availableStatuses={availableStatuses}
        />
      </div>
    </ProjectAdminViewWrapper>
  )
}
