import { requireAdmin } from "@/lib/auth-utils";
import { UserProject } from "@/modules/user-dashboard/admin/user-project";

interface UserProjectProps {
    params: Promise<{
        projectId: string
        userId: string
    }>
}

export default async function UserProjectPage({ params } : UserProjectProps) {
    await requireAdmin();
    const { projectId, userId } = await params;

    return (
        <UserProject userId={userId} projectId={projectId} />
    )
}