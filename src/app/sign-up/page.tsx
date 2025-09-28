import { SignupForm } from "@/modules/login/sign-up-form";

export default function Home() {
      return <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
}