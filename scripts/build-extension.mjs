import { mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import esbuild from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "extension/dist");

await mkdir(dist, { recursive: true });

await esbuild.build({
  absWorkingDir: root,
  entryPoints: [
    "extension/src/content.ts",
    "extension/src/background.ts"
  ],
  outdir: "extension/dist",
  bundle: true,
  format: "esm",
  sourcemap: true,
  target: "chrome120"
});

await copyFile(resolve(root, "extension/public/manifest.json"), resolve(dist, "manifest.json"));
await copyFile(resolve(root, "extension/src/content.css"), resolve(dist, "content.css"));
