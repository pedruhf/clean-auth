import { resolve } from "node:path";
import { defineConfig, UserConfig } from "vitest/config";

export const baseConfig: UserConfig = {
  resolve: {
    alias: {
      "@/tests": resolve(__dirname, "tests"),
      "@": resolve(__dirname, "src"),
    },
  },
  test: {
    root: resolve(__dirname, "tests"),
    globals: true,
    include: ["**/*.{spec,test}.ts"],
    coverage: {
      provider: "c8",
      reporter: ["text", "html"],
      exclude: [
        "**/node_modules/**",
        "**/tests/**",
        "**/dist/**",
        "**/coverage/**",
        "**/src/domain/**",
        "**/src/main/**",
        "**/application/errors/**",
        "**/src/infra/express/adapters/express-app.ts"
      ],
    },
    reporters: "verbose",
    exclude: ["**/node_modules/**", "**/dist/**", "./postgres-data"],
  },
};

export default defineConfig(baseConfig);
