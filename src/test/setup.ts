import { defineConfig } from "vitest/config";

process.env.DATABASE_URL ??= "postgres://user:pass@localhost:5432/testdb";

export default defineConfig({
  test: {
    setupFiles: ["src/test/setup.ts"],
    environment: "node"
  }
});
