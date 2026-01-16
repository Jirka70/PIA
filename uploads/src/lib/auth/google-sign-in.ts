import { authClient } from "../auth-client";

export async function googleSignIn() {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/user-dashboard"
    })
}