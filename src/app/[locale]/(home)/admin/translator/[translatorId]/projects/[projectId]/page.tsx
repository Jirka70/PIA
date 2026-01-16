import { requireAdmin } from "@/lib/auth-utils";
import { TranslatorProject } from "@/modules/user-dashboard/admin/translator-project";

interface Props {
    params: Promise<{
        translatorId: string,
        projectId: string
    }>
}

export default async function TranslatorProjectPage({ params } : Props) {
    // Admin-only view of a specific translator’s project (SSR guard)
    await requireAdmin();

    const { translatorId, projectId } = await params;

    return (
        <TranslatorProject translatorId={translatorId} projectId={projectId} />
    )
}
