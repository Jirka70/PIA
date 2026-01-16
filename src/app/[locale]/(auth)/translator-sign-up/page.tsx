import { auth } from "@/lib/auth";
import { TranslatorSignupForm } from "@/modules/login/forms/translator-sign-up-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Translator sign-up page – guards against authenticated users landing here
export default async function Home() {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  const user = session?.user

  if (user) {
    redirect("/")
  }

  return <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <TranslatorSignupForm />
    </div>
  </div>
}
