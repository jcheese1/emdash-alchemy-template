import cloudflare from "./src/cloudflare-adapter.ts";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";
import emdash from "emdash/astro";
import { d1, r2, sandbox } from "@emdash-cms/cloudflare";

export default defineConfig({
	output: "server",
	adapter: cloudflare({
		imageService: { build: 'compile', runtime: 'cloudflare-binding' },
	}),
	compressHTML: false,
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
		svgo: true,
		rustCompiler: true,
		queuedRendering: {
			enabled: true,
			contentCache: true,
		},
	},
	prefetch: {
		defaultStrategy: "hover",
	},
	integrations: [sitemap(), react(), emdash({
    database: d1({ binding: "DB", session: "auto" }),
    storage: r2({ binding: "MEDIA" }),
    sandboxRunner: sandbox(),
    // auth: {
    //   selfSignup: {
    //     domains: ["ecu.co.jp"],
    //     defaultRole: "admin",
    //   },
    // }
  }),],
	devToolbar: {
		enabled: false,
	},
	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(
					browserslist([
						"> 0.5%",
						"last 2 versions",
						"Firefox ESR",
						"not dead",
						"cover 80% in CN",
						"unreleased versions",
					]),
				),
			},
		},
		build: {
			minify: false,
			cssMinify: false,
		},
		plugins: [tailwindcss()],
	},
});