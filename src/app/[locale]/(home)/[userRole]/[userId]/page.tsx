import { Role } from "@/db/schema";
import { auth } from "@/lib/auth";
import AccessDenied from "@/modules/error/access-denied";
import ProjectNotFound from "@/modules/project-view/project-not-found";
import { UserProjects } from "@/modules/project-view/user-projects";
import { headers } from "next/headers";

interface PageProps {
    params: {
        userRole: string,
        userId: string
    }
}

export default async function UserProjectsPage({ params } : PageProps) {
    const { userRole, userId } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session
        || !session.user
        || session.user.role !== "admin"
    ) {
        return <AccessDenied /> 
    }

    if (userRole !== "user"
        && userRole !== "translator") {
            return (
                <ProjectNotFound />
            )
        }
    
    const role = userRole as Role

    return (
        <UserProjects userRole={role} userId={userId} />
    )
}