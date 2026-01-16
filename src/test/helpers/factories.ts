import { Project, ProjectFile } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type FileType = InferSelectModel<typeof ProjectFile>
export type ProjectType = InferSelectModel<typeof Project>


export function validCreateProjectInput(overrides: Partial<any> = {}, fileOverrides: Partial<any> = {}) {
  return {
    name: "My project",
    description: "Short desc",
    targetLanguage: "cs",
    sourceLanguage: "en",
    dueAt: new Date(),
    file: {
        fileId: "file",
        fileName: "test.pdf",
        "contentType": "abcd",
        size: 69,
        storageKey: "piko",
        url: "https://www.google.com",
        ...fileOverrides
    },
    ...overrides
  };
}