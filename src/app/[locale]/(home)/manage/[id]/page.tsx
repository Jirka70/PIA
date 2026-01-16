import { requireAdmin } from "@/lib/auth-utils";
import TranslatorDetail from "@/modules/manage-translator/translator-detail";

export default async function ManageTranslatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    // Restrict manage-translator page to admins on the server
    await requireAdmin()
    const { id } = await params;

    return (
        <TranslatorDetail id={id} />
    )
}
