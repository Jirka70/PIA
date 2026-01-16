import { requireAdmin } from "@/lib/auth-utils";
import { ProjectView } from "@/modules/user-dashboard/admin/project-view";
import { TranslatorProject } from "@/modules/user-dashboard/admin/translator-project";

interface Props {
    params: {
        translatorId: string,
        projectId: string
    }
}

export default async function TranslatorProjectPage({ params } : Props) {
    await requireAdmin();

    const { translatorId, projectId } = await params;

    return (
        <TranslatorProject translatorId={translatorId} projectId={projectId} />
    )
}