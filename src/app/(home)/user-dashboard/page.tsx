import { auth } from "@/lib/auth";
import { UserDashboard } from "@/modules/user-dashboard/user-dashboard";
import { User } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user
    if (!user) {
        const currentUrl = "/user-dashboard"
        redirect(`/sign-in?callbackUrl=${encodeURIComponent(currentUrl)}`)
    }

    return <UserDashboard user={user as User}/>
}