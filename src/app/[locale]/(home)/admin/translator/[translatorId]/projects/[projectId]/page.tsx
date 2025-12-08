import { requireAdmin } from "@/lib/auth-utils";

interface Props {
    params: {
        translatorId: string,
        projectId: string
    }
}

export default async function TranslatorProjectPage({ params } : Props) {
    await requireAdmin();

    const { translatorId, projectId } = params;

    return (
    <div>
      Translator: {translatorId}<br />
      Project: {projectId}
    </div>
  )
}