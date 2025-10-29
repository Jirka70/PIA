import { auth } from "@/lib/auth";
import { SignupForm } from "@/modules/login/forms/sign-up-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
      <SignupForm />
    </div>
  </div>
}