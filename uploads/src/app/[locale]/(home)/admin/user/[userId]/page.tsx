import { requireAdmin } from "@/lib/auth-utils"
import UserDetail from "@/modules/manage-user/user-detail";

interface UserProjectsProps {
    params: {
        userId: string
    }
}

export default async function UserProjectsPage({ params } : UserProjectsProps) {
    
    await requireAdmin()
    const { userId } = await params;

    return (
        <UserDetail id={userId} />
    )
}