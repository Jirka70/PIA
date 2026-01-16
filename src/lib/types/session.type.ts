import { auth } from "../auth";

export type SessionType = Awaited<ReturnType<typeof auth.api.getSession>>