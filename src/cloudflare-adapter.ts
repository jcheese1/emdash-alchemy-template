/**
 * Wraps @astrojs/cloudflare to read alchemy's local wrangler config.
 *
 * Bridges the gap between alchemy's .alchemy/local/wrangler.jsonc and
 * @astrojs/cloudflare v13's configPath-based API. This can be removed
 * once alchemy merges https://github.com/alchemy-run/alchemy/pull/1358
 */
import { existsSync } from "node:fs";
import path from "pathe";
import cloudflare, { type Options } from "@astrojs/cloudflare";
import type { AstroIntegration } from "astro";

const isAstroCheck =
  !!process.argv.find((arg) => arg.includes("astro")) &&
  process.argv.includes("check");

function getDefaultConfigPath(rootDir: string = process.cwd()) {
  return path.join(rootDir, ".alchemy", "local", "wrangler.jsonc");
}

function getDefaultPersistPath(rootDir: string = process.cwd()) {
  return path.join(rootDir, ".alchemy", "miniflare");
}

function validateConfigPath(configPath: string, throws = true) {
  if (!existsSync(configPath)) {
    const msg = `[alchemy] Wrangler config not found at "${configPath}". Run \`alchemy dev\` or \`alchemy deploy\` first.`;
    if (throws) throw new Error(msg);
    console.warn(msg);
  }
  return configPath;
}

export default function alchemyCloudflare(options?: Options): AstroIntegration {
  const configPath = validateConfigPath(
    options?.configPath ?? getDefaultConfigPath(),
    !isAstroCheck,
  );

  const integration = cloudflare({
    ...options,
    configPath,
    persistState: options?.persistState ?? { path: getDefaultPersistPath() },
  });

  const setup = integration.hooks["astro:config:setup"];
  integration.hooks["astro:config:setup"] = async (setupOptions) => {
    setupOptions.updateConfig({
      vite: {
        server: {
          watch: {
            ignored: ["**/.alchemy/**"],
          },
        },
      },
    });
    await setup?.(setupOptions);
  };

  return integration;
}
