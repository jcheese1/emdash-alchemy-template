import handler from "@astrojs/cloudflare/entrypoints/server";
export { PluginBridge } from "@emdash-cms/cloudflare/sandbox";
import type { CloudflareEnv } from "../alchemy.run";

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    return handler.fetch(request, env, ctx);
  },
};
