import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  bundle: true,
  splitting: false,
  target: "es2022",
  platform: "browser",
  external: ["preact", "preact/jsx-runtime"],
  jsx: "automatic",
  jsxImportSource: "preact",
});
