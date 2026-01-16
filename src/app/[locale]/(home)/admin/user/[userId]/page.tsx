import { requireAdmin } from "@/lib/auth-utils"
import UserDetail from "@/modules/manage-user/user-detail";

interface UserProjectsProps {
    params: Promise<{
        userId: string
    }>
}

export default async function UserProjectsPage({ params } : UserProjectsProps) {
    // Admin-only user detail page (SSR guard)
    await requireAdmin()
    const { userId } = await params;

    return (
        <UserDetail id={userId} />
    )
}
