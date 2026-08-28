import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
let html = await readFile(indexPath, "utf8");

const scriptMatch = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const styleMatch = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (!scriptMatch || !styleMatch) throw new Error("Unable to locate the Vite JavaScript and CSS bundles.");

const assetPath = (href) => path.join(distDir, href.replace(/^\.\//, ""));
const javascript = await readFile(assetPath(scriptMatch[1]), "utf8");
const stylesheet = (await readFile(assetPath(styleMatch[1]), "utf8"))
  .replace(/url\((['"]?)\.\//g, "url($1./assets/");

html = html
  .replace(/\s*<link rel="manifest"[^>]*>\s*/, "\n    ")
  .replace(styleMatch[0], () => `<style>${stylesheet.replace(/<\/style/gi, "<\\/style")}</style>`)
  .replace(scriptMatch[0], () => `<script type="module">${javascript.replace(/<\/script/gi, "<\\/script")}</script>`)
  .replace("<title>", "<!-- 双击本文件即可离线打开；请保留同级 assets 与 audio 文件夹。 --><title>");

await writeFile(path.join(distDir, "Dayend.html"), html, "utf8");
console.log("Created dist/Dayend.html for direct local use.");
