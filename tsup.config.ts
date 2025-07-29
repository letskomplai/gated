import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	shims: true,
	banner: {
		js: "#!/usr/bin/env node", // Only for CLI entry
	},
});
