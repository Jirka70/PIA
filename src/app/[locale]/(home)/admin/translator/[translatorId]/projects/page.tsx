import { requireAdmin } from "@/lib/auth-utils";
import { UserProjects } from "@/modules/project-view/user-projects";

interface Props {
    params: {
        translatorId: string
    }
}

export default async function TranslatorProjectsPage({ params } : Props) {
    await requireAdmin()
    const { translatorId } = await params;

    return (
        <UserProjects userRole="translator" userId={translatorId} />
    )
}