# Thanaphat Khunphet — Portfolio

A single-page portfolio built with React 19, Vite 8, and plain CSS. It introduces Thanaphat, showcases DGKeys, co-board, and Community Land Management, and provides skills and contact information.

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
- `src/App.jsx`: page sections, project links, skills data, theme and navigation state. `EMAIL` in `src/translations.js` controls the displayed email, mail links, and copy action.
- `src/projectDetails.js`: bilingual case studies, evidence links, and screenshot galleries.
- `src/projectExperiences.js`: three-step demo guides and source-backed system architecture in English and Thai.
- `src/components/`: case study dialog, image viewer, and copy feedback controls.
- `src/hooks/useCaseStudyRoute.js`: case study URLs and browser history handling.
- `src/index.css`: styling, themes, animations, and responsive layouts.
- `public/`: profile image, local project screenshots, and the social preview image. `share-preview.svg` is the editable source for `share-preview.jpg`.
- `vercel.json`: SPA fallback configuration for Vercel.

## Features

- Home, Work, Experience, Skills, and Contact sections with scroll-aware navigation.
- English and Thai content, light and dark themes, and saved language/theme preferences.
- Case studies for all three projects, with technical decisions, source evidence, and documented limitations.
- Three-step demo walkthroughs with screenshots, expected results, and Previous/Next controls for each project.
- Interactive system architecture in case studies. Select a component to read its role, with source links and optional services shown separately.
- Screenshot galleries with an image viewer, arrow-key navigation, and focus restoration.
- Shareable case study links such as `/#case-study-co-board`. Back/Forward updates the dialog; closing a direct link returns to its project.
- Copy email and copy case study link actions with accessible success/error feedback.
- Open Graph and Twitter preview metadata, canonical URL, and profile structured data.
- Categorized skill cards with keyboard-accessible filters and responsive layouts.
- Vercel Web Analytics.

Content is maintained in the source code. This repository has no backend, database, or required environment variables. Case study hashes are client-side routes; social previews use the main portfolio preview rather than a separate preview for each project.

## Demo verification

On 10 October 2026, the hosted co-board frontend bundles matched a production build of repository commit `c7f03e7eb06dbc88626909ec325b2c4210a6d7b6` with its public API/WebSocket URLs. Its Render backend did not respond to read-only health requests, and guest entry remained on “Preparing your board…”. The portfolio currently displays this availability limitation. Remove the demo note in both languages after guest entry, task creation, a Table-to-Kanban status change, and cross-tab sync have been verified on the hosted service.

## Deployment

On Vercel, use the Vite framework preset, build command `npm run build`, and output directory `dist`.

The production URL in `index.html` currently matches the website URL listed in the GitHub repository: `https://portfolio-sing198s-projects.vercel.app/`. Update the canonical URL, social image URLs, and structured data together when changing domains. The deployed page and preview image must be publicly readable for external link previews to load; the listed URL currently redirects unauthenticated requests to Vercel sign-in.
