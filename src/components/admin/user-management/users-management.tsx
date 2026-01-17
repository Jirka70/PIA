"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Crown, MoreHorizontal, Shield, User } from "lucide-react"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import UserShimmer from "./users-shimmer"
import UsersNotFound from "./users-not-found"
import { useRouter } from "next/navigation"
import { SetRoleDialog } from "./set-role-dialog"
import { toast } from "sonner"
import { Role, userType } from "@/db/schema"
import { useTranslations } from "next-intl"

export function UsersManagement() {
  const t = useTranslations("UsersManagement")

  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("user")
  const [selectedUser, setSelectedUser] = useState<userType>()

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const { data, isPending } = useQuery(trpc.users.getMany.queryOptions())
  const router = useRouter()

  const { mutateAsync: changeRoleAsync } = useMutation(
    trpc.users.changeUserRole.mutationOptions({
      onSuccess: () => {
        toast.success(t("toasts.roleChanged"))
      },
      onError: (error) => {
        toast.error(error.message || t("toasts.cannotChangeRole"))
      }
    })
  )

  const handleRoleChange = async (userId: string, role: string) => {
    if (role === "undefined") {
      throw new Error(t("errors.invalidRole"))
    }

    await changeRoleAsync({
      id: userId,
      role: role as Role
    })

    queryClient.setQueryData(trpc.users.getMany.queryKey(), (cached) => {
      if (!cached || !cached.users) return cached

      return {
        ...cached,
        users: cached.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                role: role as Role
              }
            : user
        )
      }
    })
  }

  const openRoleDialog = (user: userType) => {
    setNewRole(user.role)
    setSelectedUser(user)
    setIsRoleDialogOpen(true)
  }

  if (isPending) {
    return <UserShimmer />
  }

  const users = data?.users

  if (!users) {
    return <UsersNotFound />
  }

  const viewProjects = (userId: string, role: string) => {
    router.push(`admin/${role}/${userId}/projects`)
  }

  const manageTranslator = (id: string) => {
    router.push(`admin/translator/${id}`)
  }

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-md border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("header.title")}</CardTitle>
              <CardDescription>{t("header.description")}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.user")}</TableHead>
                  <TableHead>{t("table.role")}</TableHead>
                  <TableHead className="text-right">{t("table.activeProjects")}</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarImage src={`/ceholder-svg-key-4500d.jpg?key=4500d&height=32&width=32`} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "outline" : user.role === "translator" ? "default" : "secondary"}
                        className={`gap-1 ${
                          user.role === "admin"
                            ? "bg-amber-500/15 text-amber-700 border-amber-300 hover:bg-amber-500/25 dark:text-amber-200 dark:border-amber-500/40"
                            : ""
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Crown className="size-3" />
                        ) : user.role === "translator" ? (
                          <Shield className="size-3" />
                        ) : (
                          <User className="size-3" />
                        )}
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">{user.numberOfOpenProjects}</TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t("menu.label")}</DropdownMenuLabel>

                          <DropdownMenuItem onClick={() => openRoleDialog(user)} disabled={user.role === "admin"}>
                            {t("menu.changeRole")}
                          </DropdownMenuItem>


                          <DropdownMenuItem onClick={() => viewProjects(user.id, user.role)}>
                            {t("menu.viewProjects")}
                          </DropdownMenuItem>

                          {user.role === "translator" && (
                            <DropdownMenuItem onClick={() => manageTranslator(user.id)}>
                              {t("menu.manageTranslator")}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedUser?.id && (
        <SetRoleDialog
          onOpenChange={setIsRoleDialogOpen}
          isOpen={isRoleDialogOpen}
          role={newRole}
          userId={selectedUser.id}
          onRoleChange={setNewRole}
          onDialogSubmitted={handleRoleChange}
        />
      )}
    </>
  )
}
