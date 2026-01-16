"use client"

import { UserProjectViewProps } from "@/modules/project-view/project-view-props"
import { UserProject } from "./user-project"
import { CompanyFormData, TranslatorFormData } from "@/lib/validators/review-schemas"
import { useTranslations } from "next-intl"
import { ProjectType } from "@/lib/types/project.type"

interface UserProjectsProps {
  projects: UserProjectViewProps[]
  isFetching: boolean
  onTranslatorReviewSubmit: (data: TranslatorFormData, project: ProjectType) => Promise<void>
  onCompanyReviewSubmit: (data: CompanyFormData, project: ProjectType) => Promise<void>
}

export const UserProjectsContent = ({
  projects: projectsInfo,
  isFetching,
  onTranslatorReviewSubmit,
  onCompanyReviewSubmit
}: UserProjectsProps) => {
  const t = useTranslations("UserProjectsContent")

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {isFetching && (
          <span className="text-xs text-muted-foreground animate-pulse">
            {t("updating")}
          </span>
        )}
      </div>

      {projectsInfo.length === 0 ? (
        <div className="text-sm text-muted-foreground">{t("empty")}</div>
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
