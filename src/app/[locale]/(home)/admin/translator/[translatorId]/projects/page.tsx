import { requireAdmin } from "@/lib/auth-utils";
import TranslatorDetailPage from "@/modules/manage-translator/translator-detail";
import { UserProjects } from "@/modules/project-view/user-projects";

interface Props {
    params: {
        translatorId: string
    }
}

export default async function TranslatorProjectsPage({ params } : Props) {
    await requireAdmin()
    const { translatorId } = params;

    return (
        <UserProjects userRole="translator" userId={translatorId} />
    )
}