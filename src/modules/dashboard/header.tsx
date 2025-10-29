import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { HeaderClient } from "./header-client"
import { User } from "better-auth";

export async function Header() {
  const sesh = await auth.api.getSession({ headers: await headers() });
  const user = sesh?.user

  return (
    <HeaderClient user={user as User}/>
  )
}
