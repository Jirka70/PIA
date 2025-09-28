"use server";
import { auth } from "@/lib/auth"

export const signIn = async () => {
    await auth.api.signInEmail({
        body: {
            email: "user@email.com",
            password: "password",
        }
    })
}

export const signUp = async () => {
    await auth.api.signUpEmail({
        body: {
            email: "jiritresohlavy3@gmail.com",
            password: "password123",
            name: "Jirka"
        }
    })
}

