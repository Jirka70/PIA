import { auth } from "@/lib/auth";
import { UserDashboard } from "@/modules/user-dashboard/user/user-dashboard";
import { User } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/db/schema"
import { TranslatorDashboard } from "@/modules/user-dashboard/translator/translator-dashboard";

export default async function UserDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const user = session?.user
    if (!user) {
        redirect("/sign-in")
    }

    const role : Role = user.role as Role;
    if (role === "translator") {
        return <TranslatorDashboard user={user as User} />
    }

    return <UserDashboard user={user as User}/>
}