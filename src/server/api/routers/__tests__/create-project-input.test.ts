import { createProjectInput } from "@/lib/validators/trpc/project/create";
import { validCreateProjectInput } from "@/test/helpers/factories";
import { describe, expect, it } from "vitest";



describe("createProjectInput", () => {
    it("accepts dueAt null", () => {
        const parsed = createProjectInput.parse(validCreateProjectInput({ dueAt: null }))
        expect(parsed.dueAt).toBeNull()
    })

    it("rejects targetLanguage not length 2 (ISO 639-1)", () => {
        const res = createProjectInput.safeParse(validCreateProjectInput({ targetLanguage: "cze" }))
        expect(res.success).toBe(false)
        if (!res.success) {
            expect(res.error.issues[0].message).contain("Invalid language specification")
        }
    })

    it("rejects dueAt in the past", () => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const res = createProjectInput.safeParse(validCreateProjectInput({
            dueAt: yesterday
        }))

        expect(res.success).toBe(false)

        if (!res.success) {
            // refine message
            expect(res.error.issues.map(i => i.message)).toContain("Deadline has to be in future")
        }
    })

    it("accepts dueAt today or future (by date)", () => {
        const today = new Date()
        today.setHours(12, 0, 0, 0)
        const res = createProjectInput.safeParse(validCreateProjectInput({ dueAt: today }))
        expect(res.success).toBe(true)
    })

    it("rejects uploaded file name shorter than 2 chars", () => {
        const name = "q"

        const res = createProjectInput.safeParse(validCreateProjectInput({}, { fileName: name }))
        expect(res.success).toBe(false)
    })

    it("rejects uploaded file's size greater than 20MB", () => {
        const greatSize = 50_000_000

        const res = createProjectInput.safeParse(validCreateProjectInput({}, { size: greatSize }))
        expect(res.success).toBe(false)
    })

    it("accepts uploaded file's size lower than 20MB", () => {
        const size = 19_000_000
        
        const res = createProjectInput.safeParse(validCreateProjectInput({}, { size }))
        expect(res.success).toBe(true)
    })
})
