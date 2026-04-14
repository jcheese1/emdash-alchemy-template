# Welcome to React Router!

[![Deployed with Alchemy](https://alchemy.run/alchemy-badge.svg)](https://alchemy.run)

A highly opinionated, modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
bun install
```

### Development

Start the development server with HMR:

```bash
bun run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
bun preview
```

## Building for Production

Create a production build:

```bash
bun build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
bun deploy
```

To deploy a preview URL:

```sh
bunx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
bunx wrangler versions deploy
```

## CI

```bash
ALCHEMY_PASSWORD=your-encryption-password
ALCHEMY_STATE_TOKEN=your-state-token
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_EMAIL=your-cloudflare-email
```

in Settings -> Secrets -> Actions -> New repository secret.

```sh
# add environment secrets to github
gh secret set -f .env.example (--env production | --env staging)

# add repository secrets to github
gh secret set -f .env.example
```

Now add 'production' and 'staging' environments in github as well, by going to Settings -> Environments -> New environment. Add secrets there. You will no longer manage secrets in the workers dashboard, it will all be consolidated here.

Make sure to add the secrets to deploy.yml as well.

all preview environments (PRs) will use the staging environment variable.

Now add the newly added secrets to the github actions workflow under `env`.

PUBLIC_ secrets are meant to be public, so you can just hardcode them in alchemy.run.ts

# Add Secrets

Secrets will no longer be managed in the workers dashboard, it will all be consolidated here.

- Add a secret to `.env`
- Add a the secret with a placeholder value in `.env.example`
- Add the newly added secret under `ReactRouter`s `bindings` in `alchemy.run.ts`. If its a secret, use `alchemy.secret(process.env.SECRET)`. If its a public value, use `process.env.PUBLIC_VALUE` with a default value.
- Add the newly added secret under `deploy.yml` under `env`.
- Lastly, add the newly added secret to both `staging` and `production` environments in github.

## AI (optional)
- Uses opencode as the AI agent. Make sure to have the opencode CLI installed with opencode zen.
- Open opencode from the root of the project, and run `/scaffold {description of the project}` to have it create a base UI for the project.
- Ralph scripts are under `/scripts`. If you plan to use it, make sure that `plans/prd.json` is filled in with the project's PRD.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.


## Lint/Format

```sh
bunx ultracite init # install ultracite
```

and follow the prompts.

---

Built with ❤️ using React Router.
