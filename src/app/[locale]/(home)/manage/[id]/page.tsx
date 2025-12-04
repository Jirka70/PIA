import { requireAdmin } from "@/lib/auth-utils";
import TranslatorDetailPage from "@/modules/manage-translator/translator-detail";

export default async function ManageTranslatorPage({
  params,
}: {
  params: { id: string };
}) {
    await requireAdmin()
    const { id } = await params;

    return (
        <TranslatorDetailPage id={id} />
    )
}