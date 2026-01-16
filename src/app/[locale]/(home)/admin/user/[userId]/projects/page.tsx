import { requireAdmin } from "@/lib/auth-utils";
import { UserProjects } from "@/modules/project-view/user-projects";

interface Props {
    params: Promise<{
        userId: string
    }>
}

export default async function UserProjectsPage({ params } : Props) {
    await requireAdmin()
    const { userId } = await params;

    return (
        <UserProjects userRole="user" userId={userId} />
    )
}