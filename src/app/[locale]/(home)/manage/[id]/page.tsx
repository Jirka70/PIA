import { requireAdmin } from "@/lib/auth-utils";

export default async function ManageTranslatorPage({
  params,
}: {
  params: { id: string };
}) {
    await requireAdmin()
    const { id } = await params;

    
}