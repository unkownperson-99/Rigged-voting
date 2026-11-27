// Renders static/index.html for a static host (GitHub Pages).
//
// The game server normally fills in the page's build and environment values
// (asset manifest, CDN base, environment name, keys) on every request. A static
// host can't do that, so this script runs the same renderer once at build time
// in its environment-only mode (perServer: false). Run it after `vite build`.
//
// Environment: GAME_ENV (prod for the live site), and optionally GIT_COMMIT,
// TURNSTILE_SITE_KEY and JWT_AUDIENCE, which the renderer reads.
import fs from "fs/promises";
import path from "path";
import { renderHtmlContent } from "../src/server/RenderHtml";

async function main() {
  const file = path.join(process.cwd(), "static", "index.html");
  const html = await renderHtmlContent(file, { perServer: false });
  await fs.writeFile(file, html, "utf8");
  console.log(`rendered ${file} (${html.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
