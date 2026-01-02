import { z } from "zod";
import { uploadedFileMeta } from "@/lib/validators/uploaded-file-meta";

export const uploadTranslatedFileInput = z.object({
    file: uploadedFileMeta,
    projectId: z.string(),
    setProgressTo100: z.boolean(),
    setQAState: z.boolean(),
    setWaitingForApprovalAcceptState: z.boolean()
});
