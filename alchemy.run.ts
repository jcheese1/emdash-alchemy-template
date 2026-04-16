/// <reference types="@types/bun" />

import alchemy, { Scope } from "alchemy";
import { Astro,R2Bucket, D1Database } from "alchemy/cloudflare";
import { CloudflareStateStore, FileSystemStateStore } from "alchemy/state";
import { GitHubComment } from "alchemy/github";

const stage = process.env.STAGE ?? "dev";

const fileStateStore = (scope: Scope) => new FileSystemStateStore(scope);

const cloudflareStateStore = (scope: Scope) => new CloudflareStateStore(scope, {
  stateToken: alchemy.secret(process.env.ALCHEMY_STATE_TOKEN),
  scriptName: `react-router-alchemy-cloudflare-app-state-service-${stage === "prod" ? "prod" : "dev"}`
});

const app = await alchemy("react-router-alchemy-cloudflare-app", {
  stage,
  password: process.env.ALCHEMY_PASSWORD ?? "password",
  stateStore: stage === "dev" ? fileStateStore : cloudflareStateStore,
});

const media = await R2Bucket("media", {
  delete: false,
  // dev: {
  //   remote: true
  // }
});

const db = await D1Database("db", {
  adopt: true,
})

export const worker = await Astro("website", {
  adopt: true,
  compatibilityFlags: ['nodejs_compat'],
  compatibilityDate: "2026-04-04",
  entrypoint: "dist/server/entry.mjs",
  assets: "dist/client",
  bindings: {
    PUBLIC_VALUE_FROM_CLOUDFLARE: process.env.PUBLIC_VALUE_FROM_CLOUDFLARE || "value1",
    // SECRET: alchemy.secret(process.env.SECRET),
    MEDIA: media,
    DB: db,
  },
  // Workaround: alchemy sets main to the build output path, but
  // @astrojs/cloudflare v13 needs a resolvable module (not a file path)
  // for dev mode. Use the adapter's entrypoint and strip assets.
  // Remove once https://github.com/alchemy-run/alchemy/pull/1358 lands.
  wrangler: {
    transform: (spec) => {
      spec.main = "@astrojs/cloudflare/entrypoints/server";
      delete spec.assets;
      return spec;
    },
  },
});


if (process.env.PULL_REQUEST) {
  // if this is a PR, add a comment to the PR with the preview URL
  // it will auto-update with each push
  await GitHubComment("preview-comment", {
    owner: process.env.GITHUB_REPOSITORY_OWNER || "your-username",
    repository: process.env.GITHUB_REPOSITORY_NAME || "your-repo",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `
     ## 🚀 Preview Deployed

     Your changes have been deployed to a preview environment:

     **🌐 Website:** ${worker.url}

     Built from commit ${process.env.GITHUB_SHA?.slice(0, 7)}

     ---
     <sub>🤖 This comment updates automatically with each push.</sub>`,
  });
}

// types
export type CloudflareEnv = typeof worker.Env;

export type Env = {
  [K in keyof CloudflareEnv as CloudflareEnv[K] extends string
    ? K
    : never]: CloudflareEnv[K];
};

console.log({
  url: worker.url,
  name: app.name
});

await app.finalize();

