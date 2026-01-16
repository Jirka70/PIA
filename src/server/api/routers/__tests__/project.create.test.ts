import { Project, ProjectFile, translatorLanguage, user } from "@/db/schema";
import { makeTestCtx } from "@/test/helpers/ctx";
import { makeFakeDb } from "@/test/helpers/db";
import { makeCreateProjectDb } from "@/test/helpers/db-create-project";
import { expectTrpcError } from "@/test/helpers/expect-trpc-error";
import { validCreateProjectInput } from "@/test/helpers/factories";
import { makeProjectCreateDb } from "@/test/helpers/project-db";
import { projectRouter } from "@/trpc/routers/project-router";
import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

describe("projectRouter.create", () => {
    it("throws NOT_FOUND when no suitable translator exists", async() => {
        const db = makeProjectCreateDb({
            suitableTranslatorRow: null
        })

        const ctx = makeTestCtx({
            db,
            user: {
                id: "client-1",
                name: "Roman",
                role: "user"
            },
            session: {
                userId: "client-1"
            }
        })

        const caller = projectRouter.createCaller(ctx);
        await expectTrpcError(
            caller.create(validCreateProjectInput({ targetLanguage: "cs", sourceLanguage: "en" })),
            {
                code: "NOT_FOUND",
                messageIncludes: "Suitable translator"
            }
        )

        expect(db.calls.insert).toHaveLength(0); // no inserts
    }),

    it("creates project + file + activity on happy path", async() => {
        const db = makeProjectCreateDb({
            suitableTranslatorRow: {
                user: {
                    id: "translator-1",
                    name: "Roman Pejs"
                }
            },
            returnedProjectRow: {
                id: "project-123"
            }
        })

        const ctx = makeTestCtx({
            db,
            user: {
                id: "client-1",
                name: "Roman",
                role: "user"
            },
            session: {
                userId: "client-1"
            }
        })

        const caller = projectRouter.createCaller(ctx)

        const input = validCreateProjectInput({
            name: "Project A",
            sourceLanguage: "en",
            targetLanguage: "cs",
            dueAt: null
        })

        const res = await caller.create(input)

        expect(res).toMatchObject({
            project: {
                id: "project-123"
            }
        })

        const projectInsert = db.calls.insert.find((c) => c.table === Project)
        expect(projectInsert).toBeTruthy()
        expect(projectInsert!.values).toMatchObject({
            name: "Project A",
            description: input.description,
            sourceLanguage: "en",
            targetLanguage: "cs",
            clientId: "client-1",
            translatorId: "translator-1",
            dueAt: null
        })

        const fileInsert = db.calls.insert.find((c) => c.table === ProjectFile)
        expect(fileInsert).toBeTruthy()
        expect(fileInsert!.values).toMatchObject({
            id: input.file.fileId,
            projectId: "project-123",
            fileName: input.file.fileName,
            contentType: input.file.contentType,
            size: input.file.size,
            storageKey: input.file.storageKey,
            fileType: "SOURCE",
            url: input.file.url
        })

        // activity insert won't be tested, because is irrelevant for this purpose
    })

    it("maps dueAt to Date when provided", async () => {
        const db = makeProjectCreateDb({
            suitableTranslatorRow: {
                user: {
                    id: "translator-1",
                    name: "Roman pejs"
                }
            }, returnedProjectRow: {
                id: "project-xyz"
            }
        })

        const ctx = makeTestCtx({
            db,
            user: {
                id: "client-1",
                name: "Roman",
                role: "user"
            },
            session: {
                userId: "client-1"
            }
        })

        const caller = projectRouter.createCaller(ctx);

        const dueAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const input = validCreateProjectInput({ dueAt })

        await caller.create(input)

        const projectInsert = db.calls.insert.find((c) => c.table === Project)

        expect(projectInsert?.values.dueAt).toBeInstanceOf(Date)
        expect((projectInsert?.values.dueAt as Date).toISOString()).toBe(dueAt.toISOString())
    })
})
