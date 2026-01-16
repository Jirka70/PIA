"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { LogOut, User as UserIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserMenuProps {
    username: string
}

export const UserSectionDropdownMenu = ({ username } : UserMenuProps) => {
    const router = useRouter()
    const t = useTranslations("nav")

    const logout = async () => {
        await authClient.signOut();
        router.refresh()
    }


    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <UserIcon className="h-4 w-4" />
            <span className="text-sm lg:text-base">{username}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t("myAccount")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
            <Link href="/user-dashboard">{t("dashboard")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href="/projects">{t("myProjects")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href="/settings">{t("settings")}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            {t("logout")}
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}
