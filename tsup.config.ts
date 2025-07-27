import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/rules/index.ts",
    "src/testing/index.ts",
    "src/adapters/prisma.ts",
    "src/adapters/memory.ts",
    "src/cli/index.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  shims: true,
  banner: {
    js: "#!/usr/bin/env node", // Only for CLI entry
  },
});
