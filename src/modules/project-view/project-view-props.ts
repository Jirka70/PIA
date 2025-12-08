import { CompanyReviewType, ProjectFileType, ProjectStatusType, ProjectType, TranslatorReviewType } from "@/db/schema";

export interface SingleProjectViewProps {
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
    onStatusUpdate: (newStatus: ProjectStatusType) => Promise<void>
}

export interface UserProjectViewProps {
    project: ProjectType,
    sourceFile: ProjectFileType | null,
    targetFile: ProjectFileType | null,
    translatorReview: TranslatorReviewType | null,
    companyReview: CompanyReviewType | null
}
