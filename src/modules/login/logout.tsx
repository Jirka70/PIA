"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { LogOutIcon } from "lucide-react"

export const Logout = () => {
    const handleLogout = async () => {
        await authClient.signOut()
    }

    return <Button variant="outline" onClick={handleLogout}>
        Logout <LogOutIcon className="size-4" />
    </Button>
}