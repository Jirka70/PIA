import { ProjectStatusType } from "@/db/schema";

export const isActive = (status: ProjectStatusType) => {
    return status === "IN_PROGRESS"
      || status === "QA"
      || status === "NEW"
      || status === "ASSIGNED"
}

export const isCompleted = (status: ProjectStatusType) => {
    return status === "DONE"
  }

export const isCancelled = (status: ProjectStatusType) => {
    return status === "CLOSED" 
      || status === "BLOCKED"
  }

export const isInWorkingState = (status: ProjectStatusType) => {
    return status === "IN_PROGRESS"
      || status === "NEW"
      || status === "ASSIGNED"
}