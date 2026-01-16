export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const DATABASE_URL = requireEnv("DATABASE_URL");
export const BETTER_AUTH_SECRET = requireEnv("BETTER_AUTH_SECRET");
