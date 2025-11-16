import { ProjectType } from "@/db/schema";

export interface SingleProjectViewProps {
    project: ProjectType,
    clientName?: string,
    clientEmail?: string,
    translatorName?: string,
    translatorEmail?: string
}