import { auth } from "@/lib/auth";
import { Logout } from "@/modules/login/logout";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/sign-in")
    }
    return <>
        <h1>Dashboard</h1>
        <Logout />
    </>
}