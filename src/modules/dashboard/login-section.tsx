import { Button } from "@/components/ui/button"
import Link from "next/link"

export const LoginSection = () => {
    return <>
        <Button variant="ghost" size="sm" asChild className="text-sm lg:text-base">
            <Link href="/sign-in">Log in</Link>
        </Button>
        <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm lg:text-base"
            size="sm"
        >
            <Link href="/sign-up">Get Started</Link>
        </Button>
    </>
}