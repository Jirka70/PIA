import { requireAdmin } from "@/lib/auth-utils";
import { UserProjects } from "@/modules/project-view/user-projects";

interface Props {
    params: Promise<{
        translatorId: string
    }>
}

export default async function TranslatorProjectsPage({ params } : Props) {
    // Server-side guard to restrict admin-only translator project view
    await requireAdmin()
    const { translatorId } = await params;

    return (
        <UserProjects userRole="translator" userId={translatorId} />
    )
}
