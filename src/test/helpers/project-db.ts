import { Project } from "@/db/schema";

type InsertCall = { table: any, values: any }

export function makeProjectCreateDb(opts: {
    suitableTranslatorRow?: any | null,
    returnedProjectRow?: any
} = {}) {
    const calls = {
        select: [] as any,
        insert: [] as InsertCall[]
    }

    const suitableTranslatorRow = opts.suitableTranslatorRow ?? null;

    const returnedProjectRow = opts.returnedProjectRow ?? ({
        id: "project-1",
        name: "Project A",
        clientId: "client-1",
        translatorId: "translator-1"
    } as any)

    return {
        calls,
        select(_projection?: any) {
            calls.select.push({ projection: _projection })

            return {
                from(_table: any) {
                    return {
                        innerJoin(_joinTable: any, _on: any) {
                            return {
                                where(_cond: any) {
                                    return suitableTranslatorRow 
                                        ? [suitableTranslatorRow]
                                        : []
                                }
                            }
                        },
                        where(_cond: any) {
                            return []
                        }
                    }
                }
            }
        },
        insert(table: any) {
            return {
                values(values: any) {
                    calls.insert.push({ table, values })

                    return {
                        returning() {
                            if (table === Project) return [returnedProjectRow]
                            return [{}]
                        }
                    }
                }
            }
        }
    }
}