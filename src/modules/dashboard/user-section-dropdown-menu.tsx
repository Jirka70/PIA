"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { logOutSignedUser } from "@/lib/utils"
import { User } from "better-auth"
import { LogOut, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"

interface UserMenuProps {
    user: User
}

export const UserSectionDropdownMenu = ({ user } : UserMenuProps) => {
    const router = useRouter()

    const logout = async () => {
        await logOutSignedUser()
        router.refresh()
    }


    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <UserIcon className="h-4 w-4" />
            <span className="text-sm lg:text-base">{user.name}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
            <Link href="/user-dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href="/projects">My Projects</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Log out
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
}