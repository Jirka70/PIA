import { requireAdmin } from "@/lib/auth-utils";
import TranslatorDetail from "@/modules/manage-translator/translator-detail";

export default async function ManageTranslatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    await requireAdmin()
    const { id } = await params;

    return (
        <TranslatorDetail id={id} />
    )
}