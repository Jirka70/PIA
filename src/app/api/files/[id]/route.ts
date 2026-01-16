import { getDb } from "@/db/drizzle"
import { eq } from "drizzle-orm"
import { ProjectFile } from "@/db/schema"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import fs from "fs/promises"

export const runtime = "nodejs"
const db = getDb();

const UPLOAD_DIR = path.join(process.cwd(), "uploads")

export async function GET(
    _req: NextRequest,
    { params } : { params: Promise<{ id: string }> }) {
    
    const { id } = await params

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        return new NextResponse("Unauthorized", {
            status: 400
        })
    }

    const [meta] = await db
        .select()
        .from(ProjectFile)
        .where(eq(ProjectFile.id, await id))
        .limit(1)

    if (!meta) {
        return new NextResponse("Not found", {
            status: 400
        })
    }

    const absPath = path.join(UPLOAD_DIR, meta.storageKey);
    try {
        const stat = await fs.stat(absPath);
        const file = await fs.readFile(absPath)

        return new NextResponse(new Uint8Array(file), {
            headers: {
                "Content-Type": meta.contentType,
                "Content-Length": String(stat.size),
                "Content-Disposition": `inline; filename="${encodeURIComponent(meta.fileName)}"`,
                "Cache-Control": "private, max-age=0, no-store"
            },
        })
    } catch {
        return new NextResponse("File missing", {
            status: 410
        })
    }

    
}
