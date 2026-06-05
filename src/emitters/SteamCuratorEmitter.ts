import path from "node:path"
import fs from "node:fs/promises"
import type { QuartzEmitterPlugin, BuildCtx, FilePath, FullSlug } from "@quartz-community/types"
import { joinSegments } from "@quartz-community/types"

interface Options {
  curatorId: string
}

const write = async (
  ctx: BuildCtx,
  slug: FullSlug,
  ext: string,
  content: string,
): Promise<FilePath> => {
  const pathToPage = joinSegments(ctx.argv.output, slug + ext) as FilePath
  const dir = path.dirname(pathToPage)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(pathToPage, content)
  return pathToPage
}

export const SteamCuratorEmitter: QuartzEmitterPlugin<Options> = (opts) => ({
  name: "SteamCuratorEmitter",

  async *emit(ctx) {
    let followers = 0

    try {
      const res = await fetch(
        `https://store.steampowered.com/curator/${opts?.curatorId}/`
      )
      const html = await res.text()
      const match = html.match(/class="num_followers"[^>]*>(\d[\d,.]+)</)
      followers = match ? parseInt(match[1].replace(/[,.]/g, "")) : 0
    } catch (e) {
      console.warn("[SteamCuratorEmitter] Falha ao buscar seguidores:", e)
    }

    yield write(
      ctx,
      "static/curator-stats" as FullSlug,
      ".json",
      JSON.stringify({ followers, updatedAt: new Date().toISOString() }),
    )
  },

  async *partialEmit() {},
})
