import { requireAdmin } from "@/lib/auth-utils"
import { ProjectAdminView } from "@/modules/project-view/project-admin-view";

export default async function ProjectViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    await requireAdmin()
    const {id} = await params;


    return (
        <ProjectAdminView id={id} />
    );
}