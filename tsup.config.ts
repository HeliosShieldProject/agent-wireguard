import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "esnext",
  outDir: "dist",
  onSuccess: "node dist/index.js",
});
