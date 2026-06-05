// src/emitters/SteamCuratorEmitter.ts
import path from "path";
import fs from "fs/promises";
import { joinSegments } from "@quartz-community/types";
var write = async (ctx, slug, ext, content) => {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext);
  const dir = path.dirname(pathToPage);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(pathToPage, content);
  return pathToPage;
};
var SteamCuratorEmitter = (opts) => ({
  name: "SteamCuratorEmitter",
  async *emit(ctx) {
    let followers = 0;
    try {
      const res = await fetch(
        `https://store.steampowered.com/curator/${opts?.curatorId}/`
      );
      const html = await res.text();
      const match = html.match(/class="num_followers"[^>]*>(\d[\d,.]+)</);
      followers = match ? parseInt(match[1].replace(/[,.]/g, "")) : 0;
    } catch (e) {
      console.warn("[SteamCuratorEmitter] Falha ao buscar seguidores:", e);
    }
    yield write(
      ctx,
      "static/curator-stats",
      ".json",
      JSON.stringify({ followers, updatedAt: (/* @__PURE__ */ new Date()).toISOString() })
    );
  },
  async *partialEmit() {
  }
});
export {
  SteamCuratorEmitter
};
//# sourceMappingURL=index.js.map