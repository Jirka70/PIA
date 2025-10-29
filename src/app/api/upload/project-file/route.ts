import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"
import { nanoid } from "nanoid"
import { ALLOWED_EXT, ALLOWED_MIME } from "@/lib/uploaded-file/allowed-file-constraints"

const MAX_BYTES = 20 * 1024 * 1024
const UPLOAD_DIR = path.join(process.cwd(), "uploads")



function sanitizeBaseName(name: string) {
    return name.replace(/[\/\\<>:"|?*\x00-\x1F]/g, "_").slice(0, 200)
}

function getFileExtension(name: string) {
    return (name.split(".").pop() ?? "").toLowerCase()
}

function isAllowedExtension(ext: string) {
    return ALLOWED_EXT.has(ext)
}

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        return NextResponse.json({
            error: "User not authorized"
        }, {
            status: 400
        })
    }

    const form = await req.formData()
    const file = form.get("file") as File | null;
    if (!file) {
        return NextResponse.json({
            error: "Missing file"
        }, {
            status: 400
        })
    }

    if (!ALLOWED_MIME.has(file.type)) {
        return NextResponse.json({ error: "Unsupported content type" }, { status: 400 })
    }

    if (file.size < 1 || file.size > MAX_BYTES) {
        return NextResponse.json({
            error: "Invalid file size"
        }, {
            status: 400
        })
    }

    await fs.mkdir(UPLOAD_DIR, {
        recursive: true
    })

    const origName = sanitizeBaseName(file.name)
    const ext = "." + getFileExtension(origName)

    if (!isAllowedExtension(ext)) {
        return NextResponse.json({ error: "Unsupported extension" }, { status: 400 })
    }

    const id = nanoid()
    const storageKey = `projects/${id}${ext}`
    const absPath = path.join(UPLOAD_DIR, storageKey)

    const absDir = path.dirname(absPath)
    if (!absDir.startsWith(UPLOAD_DIR)) {
        return NextResponse.json({ error: "Bad path" }, { status: 400 })
    }

    await fs.mkdir(absDir, {
        recursive: true
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(absPath, buffer)

    const publicBase = process.env.NEXT_PUBLIC_APP_URL ?? ""
    const url = `${publicBase}/api/files/${id}`

    return NextResponse.json({
        storageKey,
        url,
        fileName: origName,
        contentType: file.type,
        size: file.size
    })
}