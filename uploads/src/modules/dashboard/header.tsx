import { auth } from "@/lib/auth";
import { HeaderClient } from "./header-client"
import { headers } from "next/headers";
import { User } from "better-auth";

export async function Header() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  return (
    <HeaderClient user={user as User}/>
  )
}
