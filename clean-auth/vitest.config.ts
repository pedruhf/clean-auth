import { defineConfig } from 'vitest/config';
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/tests", replacement: resolve(__dirname, "tests") },
      { find: "@", replacement: resolve(__dirname, "src") }
    ],
  },
  test: {
    root: "<rootDir>/src",
    environment: "node",
    coverage: {
      reportsDirectory: "coverage",
    },
    passWithNoTests: true,
    globals: true,
  },
})
