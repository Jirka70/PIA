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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, UserPlus, Shield, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTRPC } from "@/trpc/client"
import { useQuery } from "@tanstack/react-query"
import UserShimmer from "./users-shimmer"
import UsersNotFound from "./users-not-found"
import { useRouter } from "next/navigation"

const initialUsers = [
  {
    id: "1",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    role: "translator",
    status: "active",
    projects: 23,
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "user",
    status: "active",
    projects: 5,
  },
  {
    id: "3",
    name: "Sophie Chen",
    email: "sophie.chen@example.com",
    role: "translator",
    status: "active",
    projects: 31,
  },
  {
    id: "4",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    role: "user",
    status: "active",
    projects: 8,
  },
  {
    id: "5",
    name: "Elena Popov",
    email: "elena.popov@example.com",
    role: "translator",
    status: "inactive",
    projects: 12,
  },
]

export function UsersManagement() {
  const [selectedUser, setSelectedUser] = useState(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("user")

  const trpc = useTRPC();
  const { data, isPending } = useQuery(trpc.users.getMany.queryOptions())
  const router = useRouter();

  const handleRoleChange = () => {
    /*if (selectedUser) {
      setUsers(users.map((user) => (user.id === selectedUser.id ? { ...user, role: newRole } : user)))
      setIsRoleDialogOpen(false)
      setSelectedUser(null)
    }*/
  }

  const openRoleDialog = (user: any) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setIsRoleDialogOpen(true)
  }

  if (isPending) {
    return <UserShimmer />
  }

  const users = data?.users;


  if (!users) {
    return <UsersNotFound />
  }


  const viewProjects = (userId: string, role: string) => {
    router.push(`${role}/${userId}`)
  }

  const manageTranslator = (id: string) => {
    router.push(`manage/${id}`)
  }

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-md border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage translators and customers</CardDescription>
            </div>
            <Button size="sm">
              <UserPlus className="mr-2 size-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Active Projects</TableHead>
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
                      <Badge variant={user.role === "translator" ? "default" : "secondary"} className="gap-1">
                        {user.role === "translator" ? <Shield className="size-3" /> : <User className="size-3" />}
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={"default"}
                        /*variant={user.status === "active" ? "default" : "outline"}*/
                        /*className={
                          user.status === "active"
                            ? "bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                            : ""
                        }*/
                       className={"bg-green-500/10 text-green-700 hover:bg-green-500/20 dark:text-green-400"}
                      >
                        {/*user.status*/ "active"}
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openRoleDialog(user)}>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => viewProjects(user.id, user.role)}>View Projects</DropdownMenuItem>
                          {user.role === "translator" && <DropdownMenuItem onClick={() => manageTranslator(user.id)}>Manage Translator</DropdownMenuItem>}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">Ban User</DropdownMenuItem>
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

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>Update the role for TODO fill user-name</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">New Role</Label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Customer</SelectItem>
                  <SelectItem value="translator">Translator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
