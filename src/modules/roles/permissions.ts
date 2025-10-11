import { Role } from "@/db/schema";
import { createAccessControl } from "better-auth/plugins/access";

const statement = {
    project: ["create", "update", "delete", "share"],
} as const;

const ac = createAccessControl(statement);

const user = ac.newRole({ 
    project: ["create"],
}); 

const admin = ac.newRole({ 
    project: ["create", "update", "delete", "share"], 
}); 

const owner = ac.newRole({ 
    project: ["create", "update", "delete", "share"], 
}); 

const translator = ac.newRole({
    project: ["create", "update"], 
}); 

export const hasAnyRole = (role: Role | undefined | null, allowed: Role[]) =>
  !!role && allowed.includes(role);

export const ADMIN_ROLES: Role[] = ["owner", "admin"];
export const TRANSLATOR_ROLES: Role[] = ["owner", "admin", "translator"];

export { statement, ac, user, admin, owner, translator }

