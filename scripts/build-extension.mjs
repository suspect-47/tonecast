import { mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";
import esbuild from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "extension/dist");

await mkdir(dist, { recursive: true });

const shared = {
  absWorkingDir: root,
  bundle: true,
  sourcemap: true,
  target: "chrome120",
  define: { "process.env.NODE_ENV": '"production"' }
};

// Content script is a classic (non-module) script -> IIFE. It bundles InboxSDK.
await esbuild.build({
  ...shared,
  entryPoints: ["extension/src/content.ts"],
  outfile: "extension/dist/content.js",
  format: "iife"
});

// Background is a module service worker (manifest: "type": "module").
await esbuild.build({
  ...shared,
  entryPoints: ["extension/src/background.ts"],
  outfile: "extension/dist/background.js",
  format: "esm"
});

await copyFile(resolve(root, "extension/public/manifest.json"), resolve(dist, "manifest.json"));
await copyFile(resolve(root, "extension/src/content.css"), resolve(dist, "content.css"));

// InboxSDK MV3: pageWorld.js must ship as a web-accessible resource and is
// injected into the page's MAIN world by the background worker.
await copyFile(
  resolve(root, "node_modules/@inboxsdk/core/pageWorld.js"),
  resolve(dist, "pageWorld.js")
);
