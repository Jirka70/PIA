import { z } from "zod"

export const uploadedFileMeta = z.object({
    fileId: z.string(),
    fileName: z.string()
        .min(2, { message: "File name needs to be at least 2 characters long"})
        .max(512, { message: "File name cannot be longer than 512 characters"}),
    contentType: z.string(),
    size: z.number()
        .int({ message: "File size (in B) needs to be in range 1 - 20 MB"})
        .max(20 * 1024 * 1024, { message: "File size cannot to be higher than 20 MB"})
        .min(1, { message: "File size needs to be at least 1 B"})
        .positive({ message: "File size (in B) needs to be positive number"}),
    storageKey: z.string().min(1),
    url: z.url(), 
}, {
    message: "Upload a file to translate with a valid extension (.PDF, .DOC, .DOCX or .TXT) with max size of 20MB"
})

export type UploadedFileMeta = z.infer<typeof uploadedFileMeta>