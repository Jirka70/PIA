import type { Context } from "@/trpc/init";

/**
 * ===== USER (ctx.user) =====
 */
type CtxUser = NonNullable<Context["user"]>;

type UserInput =
  Pick<CtxUser, "id" | "name" | "role"> &
  Partial<CtxUser>;

function buildTestUser(input: UserInput): CtxUser {
  const now = new Date();

  return {
    id: input.id,
    name: input.name,
    role: input.role,

    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,

    email: input.email ?? "test@example.com",
    emailVerified: input.emailVerified ?? true,
    image: input.image ?? null,

    banned: input.banned ?? false,
    banReason: input.banReason ?? null,
    banExpires: input.banExpires ?? null,

    ...(input as any),
  } as CtxUser;
}

/**
 * ===== SESSION (ctx.session) =====
 * Tvar je: { session: {...}, user: {...} }
 */
type CtxSessionWrapper = NonNullable<Context["session"]>;
type InnerSession = CtxSessionWrapper["session"];
type SessionUser = CtxSessionWrapper["user"];

/**
 * V testech chceme psát jen userId a případně override pár polí.
 */
type SessionInput =
  Pick<InnerSession, "userId"> &
  Partial<InnerSession>;

/**
 * Session wrapper user je často stejný typ jako ctx.user (ne vždy),
 * takže ho postavíme z buildTestUser a přecastujeme.
 */
function buildTestSession(
  input: SessionInput,
  user: CtxUser
): CtxSessionWrapper {
  const now = new Date();

  const session: InnerSession = {
    id: input.id ?? "sess-1",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
    userId: input.userId,
    expiresAt: input.expiresAt ?? new Date(Date.now() + 60 * 60 * 1000),
    token: input.token ?? "test-token",

    ipAddress: input.ipAddress ?? null,
    userAgent: input.userAgent ?? null,
    impersonatedBy: input.impersonatedBy ?? null,
  };

  // wrapper vyžaduje i user
  const sessionUser = user as unknown as SessionUser;

  return { session, user: sessionUser };
}

/**
 * ===== CTX =====
 */
type MakeTestCtxInput = {
  db: unknown;

  /**
   * ctx.user (používá se ve tvých procedurách)
   */
  user: UserInput;

  /**
   * ctx.session wrapper (Better Auth payload)
   * - když nedáš → null
   * - když dáš { userId } → doplní se automaticky
   */
  session?: SessionInput | null;

  auth?: Context["auth"];
  [k: string]: any;
};

export function makeTestCtx(input: MakeTestCtxInput): Context {
  const builtUser = buildTestUser(input.user);

  return {
    ...(input as any),

    db: input.db as Context["db"],
    user: builtUser,

    session:
      input.session === undefined
        ? null
        : input.session === null
          ? null
          : buildTestSession(input.session, builtUser),

    auth: typeof input.auth === "undefined" ? null : input.auth,
  } as Context;
}
