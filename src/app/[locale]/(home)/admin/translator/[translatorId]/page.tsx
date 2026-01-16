import { requireAdmin } from "@/lib/auth-utils";
import TranslatorDetail from "@/modules/manage-translator/translator-detail";

interface Props {
    params: Promise<{
        translatorId: string
    }>
}

export default async function TranslatorInfoPage({ params } : Props) {
    await requireAdmin()
    const { translatorId } = await params;

    return (
        <TranslatorDetail id={translatorId} />
    )
}
