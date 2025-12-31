import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {

    const cks = await cookies()
    cks.set("pending_role", "translator", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 120
    })

    return NextResponse.json({ ok: true })
}