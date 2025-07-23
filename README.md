# Astro Starter Kit: Nekoweb

(Adapted from the Astro Basics template)

## Getting Started

Run this in a terminal to get started.

```sh
bun create astro@latest -- --template LelIllumina/Astro-Template
```

then to start a dev server

```sh
npx astro dev
```

If you are experienced with this and want to install more integrations alongside the base templaate, use the `--add` flag:

```sh
bun create astro@latest -- --template LelIllumina/Astro-Template --add svelte --add mdx --add sitemap
```

## Prerequisites

Note that you will need to have Node.js (or equivalant) installed to use bun and Astro.

To use [Deploy2Nekoweb](https://deploy.nekoweb.org/) you need to install Git on your system and then push your code to github.  
A github action is already configured in `/.github/workflows/deploy.yml` so you only need to follow the steps related to the api key on the D2N website to automatically upload your built site.

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Head.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`         | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |

## Want to learn more?

Feel free to check [Astro's documentation](https://docs.astro.build) or the Nekoweb [Discord server](https://discord.gg/hvfHKyVS6b).
