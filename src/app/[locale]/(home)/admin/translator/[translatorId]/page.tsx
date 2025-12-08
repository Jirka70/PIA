import { requireAdmin } from "@/lib/auth-utils";
import TranslatorDetailPage from "@/modules/manage-translator/translator-detail";

interface Props {
    params: {
        translatorId: string
    }
}

export default async function TranslatorInfoPage({ params } : Props) {
    await requireAdmin()
    const { translatorId } = params;

    return (
        <TranslatorDetailPage id={translatorId} />
    )
}