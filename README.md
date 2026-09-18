# Thanaphat Khunphet — Portfolio

A single-page portfolio built with React 19, Vite 8, and plain CSS. It introduces Thanaphat, showcases DGKeys, Kanban Board, and ALRO Land, and provides skills and contact information.

## Development

Use Node.js 22.12+ and npm.

```sh
npm ci
npm run dev
```

## Checks and production build

```sh
npm run lint
npm run build
npm run preview
```

The production build is generated in `dist/`. `preview` serves that build locally.

## Project structure

- `src/main.jsx`: React entry point and global stylesheet import.
- `src/App.jsx`: page sections, project links, skills data, theme and navigation state. `EMAIL` controls both the displayed email and its link.
- `src/index.css`: styling, themes, animations, and responsive layouts.
- `public/`: profile image and local project screenshots. Some project screenshots load from GitHub.
- `vercel.json`: SPA fallback configuration for Vercel.

## Features

- Home, Work, Experience, Skills, and Contact sections with scroll-aware navigation.
- Light and dark themes, with a light default and the selected preference saved in localStorage.
- Categorized skill cards with keyboard-accessible filters and responsive layouts.
- Vercel Web Analytics.

Content is maintained in the source code. This repository has no backend, database, or required environment variables.

## Deployment

On Vercel, use the Vite framework preset, build command `npm run build`, and output directory `dist`.
