# sito-studio (Studio Website)

Professional, bilingual website for a tax and fiscal consulting studio. The application presents the studio's services, pricing and team, publishes news and fiscal deadlines, collects contact requests, and provides an AI-assisted chat experience.

The frontend is built with React 18 and React Router v6, while Netlify provides hosting, form handling, continuous deployment, and serverless backend functions. Content is available in Italian (`it`) and English (`en`).

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Prerequisites and Requirements](#prerequisites-and-requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Project Structure and File Organization](#project-structure-and-file-organization)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Deployment to Netlify](#deployment-to-netlify)
- [Content Management](#content-management)
- [Admin Panel Usage](#admin-panel-usage)
- [Netlify Functions](#netlify-functions)
- [Multi-language Support](#multi-language-support)
- [SEO and Performance](#seo-and-performance)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact and Support](#contact-and-support)

## Project Description

`sito-studio` is the public website and content platform for a professional tax consulting studio. It is designed to make complex fiscal information approachable for clients while giving the studio practical tools for maintaining time-sensitive content.

Visitors can explore consulting services, pricing, activity areas, team information, news, and fiscal deadlines. They can contact the studio through a Netlify-enabled form, share articles on social networks, or ask general questions through the chat assistant. Editors can manage localized content through the custom admin area and the JSON-based CMS.

### Technology stack

- React 18 and Create React App
- React Router v6 for client-side routing
- Netlify for hosting, forms, serverless functions, and continuous deployment
- JSON files for localized and CMS-managed content
- Framer Motion and responsive CSS for presentation and animation

## Features

- **Italian and English content:** a lightweight React context exposes the active language and localized dictionary.
- **Dynamic news and deadlines:** articles and fiscal deadlines are loaded from localized JSON datasets, cached locally, and displayed in list and detail routes.
- **Content management:** a protected custom admin panel manages news, deadlines, images, and GitHub commits; a CMS interface manages the wider site content.
- **Chat assistant:** a client-facing assistant sends queries through a Netlify Function so the provider API key remains server-side.
- **Services and pricing:** dedicated service listings and detail pages explain the studio's tax, accounting, corporate, and related professional offerings.
- **Studio and team showcase:** Works, About, and activity-area sections introduce the practice, its expertise, and its people.
- **Contact forms:** Netlify Forms handles submissions, with an email-client fallback when a request cannot be submitted.
- **Social integrations:** news and deadline sharing is supported through `react-share` and `react-mobile-share`; deployment automation can refresh Meta/Facebook link previews.
- **Responsive UI:** reusable components, mobile navigation, responsive layouts, reveal effects, and Framer Motion animations support desktop and mobile devices.
- **SEO:** `react-helmet-async`, route-aware metadata, `robots.txt`, `sitemap.xml`, and generated article share pages improve discovery and social previews.
- **PWA foundation:** `public/manifest.json` and installable-app icons are included. See [PWA status](#pwa-status) for the current service-worker status.
- **Serverless backend:** Netlify Functions provide admin authentication, AI chat requests, and post-deployment social-preview refreshes.

### Highlighted dependencies

| Package | Purpose |
| --- | --- |
| `react-router-dom` | Application routes and detail-page parameters |
| `react-helmet-async` | Per-page title, description, canonical, and social metadata |
| `framer-motion` | UI and page animations |
| `react-quill` / `quill` | Rich-text editing in administrative interfaces |
| `react-share` | Desktop social-sharing controls |
| `react-mobile-share` | Native-style mobile sharing |
| `netlify-cli` | Local Netlify development and deployment workflows |
| `react-xmas-tree` | Seasonal UI decoration |
| `react-popup` | Popup UI support |

## Prerequisites and Requirements

- [Node.js](https://nodejs.org/) 20.x is recommended and matches `netlify.toml`.
- npm, included with Node.js.
- Git for version control and CMS publishing.
- A Netlify account for production deployment, Functions, and form handling.
- A GitHub repository and a fine-grained personal access token with **Contents: Read and write** permission when publishing through the custom admin panel.
- An OpenAI API key if the chat assistant is enabled.

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Installation

Clone the repository and install the locked dependency tree:

```bash
git clone <repository-url>
cd sito-studio
npm ci --legacy-peer-deps
```

`--legacy-peer-deps` matches the Netlify build configuration and avoids peer-dependency resolution conflicts among older UI/editor packages. For exploratory dependency changes, use `npm install --legacy-peer-deps` instead.

Create an optional local environment file in the project root:

```dotenv
REACT_APP_MOCK_ADMIN_PASSWORD=local-only-password
REACT_APP_ADMIN_TIMEOUT_MIN=30
```

Do not commit `.env` files or real credentials.

## Getting Started

### Run the React frontend

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The development server reloads after source changes.

This mode is sufficient for most frontend and content work. When `REACT_APP_MOCK_ADMIN_PASSWORD` is set, `/login` can use local mock authentication on `localhost` in development only.

### Run the full Netlify environment

Use this mode to test Netlify Functions, redirects, and form behavior:

```bash
npx netlify login
npx netlify link
npx netlify dev
```

Netlify CLI reports the local URL, commonly `http://localhost:8888`. Add server-side environment variables through the linked Netlify site or a local Netlify-compatible environment configuration.

## Project Structure and File Organization

```text
sito-studio/
├── src/                         # Main React application source
│   ├── components/              # Reusable UI components
│   │   ├── admin/               # Admin-specific editors
│   │   ├── icons/               # React icon components
│   │   └── script/              # Navigation/scroll helpers
│   ├── pages/                   # Route-level page components
│   │   └── __tests__/           # Admin and upload tests
│   ├── content/                 # Localized JSON and content adapters
│   ├── hooks/                   # useNews, useScadenze, reveal hooks
│   ├── App.js                   # Main layout and route definitions
│   ├── data.js                  # News/deadline loading and browser cache
│   ├── auth.js                  # Admin session helpers
│   ├── adminTestMode.js         # Local-only mock authentication
│   └── i18n.js                  # Language context and dictionaries
├── public/                      # Static assets and public configuration
│   ├── assets/                  # Images, news, and deadline datasets
│   ├── admin/                   # CMS configuration and UI
│   ├── manifest.json            # PWA/web app metadata
│   ├── robots.txt               # Crawler directives
│   └── sitemap.xml              # Search-engine route index
├── build/                       # Generated production output
├── netlify/functions/           # Serverless backend functions
│   ├── adminAuth.js             # Password verification
│   ├── chatAssistant.js         # Chat provider proxy
│   └── deploy-succeeded-background.js
├── scripts/
│   └── generate-share-pages.js  # Static social-preview page generation
├── netlify.toml                 # Netlify build and Functions configuration
└── package.json                 # Dependencies and npm scripts
```

Important routes include `/`, `/servizi`, `/servizi/:slug`, `/news`, `/news/:slug`, `/scadenze/:slug`, `/chi-siamo`, `/aree-di-attivita`, `/privacy`, `/login`, and the protected `/admin` page.

## Configuration

### Environment variables

| Variable | Scope | Required | Description |
| --- | --- | --- | --- |
| `ADMIN_PASSWORD` | Server | Production admin | Preferred password used by `adminAuth` |
| `OPENAI_API_KEY` | Server | Chat only | API key used by `chatAssistant`; keep server-side |
| `REACT_APP_MOCK_ADMIN_PASSWORD` | Client/dev | No | Enables mock admin login only on local development hosts |
| `REACT_APP_ADMIN_TIMEOUT_MIN` | Client | No | Admin session duration in minutes; defaults to 30 |
| `REACT_APP_APP_VERSION` | Build | Automatic | Cache version; Netlify sets it to `$COMMIT_REF` |
| `REACT_APP_VERSION` | Build | No | Fallback cache version when `REACT_APP_APP_VERSION` is absent |
| `SITE_URL` | Function | No | Canonical site URL for deployment-time link refresh |
| `FACEBOOK_ACCESS_TOKEN` | Function | No | Enables Meta/Facebook share-preview pre-scraping |
| `FACEBOOK_SCRAPE_LIMIT` | Function | No | Maximum preview URLs processed; defaults to 10 |

The functions also recognize legacy `VITE_*` and `REACT_APP_*` variants for admin and OpenAI credentials. In production, prefer `ADMIN_PASSWORD` and `OPENAI_API_KEY`: variables beginning with `REACT_APP_` can be embedded into the browser bundle when referenced by frontend code.

Set production values in **Netlify → Site configuration → Environment variables**, then trigger a new deployment. Never store API keys or production passwords in source control.

### Site settings

Shared contact details, social links, map settings, and related global values live in `src/content/siteSettings.json`. Update this file or use the CMS before deploying a new studio address, telephone number, email address, or social account.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the Create React App development server |
| `npm run build` | Creates an optimized build and then generates static share pages |
| `npm test` | Starts the Jest/React Testing Library runner in watch mode |
| `npm test -- --watchAll=false` | Runs the test suite once, useful in CI |
| `npm run eject` | Permanently exposes Create React App configuration; generally avoid |

Production output is written to `build/`. Do not edit generated files directly.

## Deployment to Netlify

The repository includes the required configuration:

```toml
[build]
  command = "REACT_APP_APP_VERSION=$COMMIT_REF npm run build"
  publish = "build"

[functions]
  directory = "netlify/functions"
```

### Continuous deployment

1. Push the repository to GitHub.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Select the repository and production branch (normally `main`).
4. Confirm the build command and `build` publish directory; Netlify reads them from `netlify.toml`.
5. Add `ADMIN_PASSWORD` and, when needed, `OPENAI_API_KEY` and `FACEBOOK_ACCESS_TOKEN`.
6. Deploy the site and test routes, the contact form, `/login`, and the chat assistant.

The build uses Node 20, `npm --legacy-peer-deps`, and `CI=false`. SPA navigation is supported by `public/_redirects`.

### Manual deployment

```bash
npm run build
npx netlify deploy --dir=build
npx netlify deploy --dir=build --prod
```

The first deploy creates a preview; the second publishes to production. Ensure Functions are deployed through the linked site workflow when testing backend changes.

## Content Management

### News

Localized news datasets are stored at:

- `public/assets/news.it.json`
- `public/assets/news.en.json`

A typical entry resembles:

```json
{
  "slug": "nuova-scadenza-fiscale",
  "title": "Nuova scadenza fiscale",
  "image": "/assets/news/nuova-scadenza-fiscale.jpg",
  "excerpt": "Sintesi breve per la pagina news.",
  "content": "Contenuto completo dell'articolo."
}
```

Use a unique, URL-safe `slug`; provide localized title, excerpt, and body; place associated images in `public/assets/news/`; and update both languages where appropriate.

### Fiscal deadlines

Localized deadline datasets are stored at:

- `public/assets/scadenze.it.json`
- `public/assets/scadenze.en.json`

Images belong in `public/assets/scadenze/`. Because fiscal dates and obligations are time-sensitive, verify publication dates, affected taxpayers, legal references, and translations with a qualified studio professional before publishing.

### Services, pages, and shared content

- Services: `src/content/services.it.json` and `services.en.json`
- Home: `src/content/home.it.json` and `home.en.json`
- About/team: `src/content/about.it.json` and `about.en.json`
- Activity areas: `src/content/activities.it.json` and `activities.en.json`
- News page labels: `src/content/newsPage.it.json` and `newsPage.en.json`
- Privacy: `src/content/privacy.it.json` and `privacy.en.json`
- Popups: `src/content/popups.json`
- Global settings: `src/content/siteSettings.json`

The non-suffixed JSON files provide combined or legacy-compatible content. Prefer updating content through the CMS so the related structure stays consistent.

After manual changes, run:

```bash
npm test -- --watchAll=false
npm run build
```

## Admin Panel Usage

### Custom news and deadline editor

1. Configure `ADMIN_PASSWORD` on Netlify, or `REACT_APP_MOCK_ADMIN_PASSWORD` for local development.
2. Visit `/login` and authenticate.
3. Open `/admin` and select the dataset and language.
4. Add or edit the slug, title, image, excerpt, and rich content.
5. Save the browser draft and preview the result.
6. To publish, provide a fine-grained GitHub personal access token with **Contents: Read and write** access to the configured repository.
7. Verify the repository and branch displayed by the panel, then commit the localized JSON and pending image uploads.

Draft data and the GitHub token are stored in the current browser's `localStorage`. Use the panel only on a trusted device, remove the token after publishing, and never paste a token into screenshots or support messages. Authentication expires after 30 minutes by default, but this client-side gate is not a replacement for Netlify/GitHub access controls.

Repository publishing values are currently defined in `GIT_CFG` near the top of `src/pages/AdminPage.jsx`. Update the owner, repository, branch, committer identity, and optional Netlify deploy hook when forking the project.

### JSON CMS

The admin page links to `/admin/CMS/`. Its configuration is in `public/admin/CMS/config.yml`; a parallel configuration also exists at `public/admin/config.yml`. The CMS manages localized pages, services, popup notices, and shared settings through Git-backed JSON files.

For local CMS development, `local_backend: true` is enabled. Run the React/Netlify development environment together with the CMS proxy workflow required by your selected Git-based CMS. Confirm the `backend` repository and branch values before publishing.

## API and Backend

Netlify exposes functions under `/.netlify/functions/<function-name>`.

### `adminAuth`

`POST /.netlify/functions/adminAuth`

```json
{
  "password": "admin-password"
}
```

Returns HTTP `200` for a matching password and `401` otherwise. Only `POST` is accepted. The production password should be stored as `ADMIN_PASSWORD` on Netlify.

### `chatAssistant`

`POST /.netlify/functions/chatAssistant`

```json
{
  "messages": [
    { "role": "user", "content": "Quali servizi fiscali offre lo studio?" }
  ]
}
```

The function validates the payload, forwards it to the configured AI model, and returns:

```json
{
  "reply": "..."
}
```

The assistant is informational. Its UI prompt directs uncertain queries to the studio, but tax advice and deadlines should always be confirmed by a qualified professional. Consider adding rate limiting, abuse protection, message-length limits, and monitoring before high-traffic production use.

### `deploy-succeeded-background`

After deployment, this background function reads recent localized news and deadlines and asks Meta's Graph API to refresh their link previews. Without `FACEBOOK_ACCESS_TOKEN`, it exits successfully without performing the refresh.

## Multi-language Support

`src/i18n.js` defines `I18nProvider` and `useI18n()`. Italian is the initial language, and changing the language also updates the document's `lang` attribute.

Use the hook in a component:

```jsx
import { useI18n } from '../i18n';

export default function Example() {
  const { lang, setLang, dict } = useI18n();

  return (
    <section>
      <h1>{dict.hero.title}</h1>
      <button onClick={() => setLang(lang === 'it' ? 'en' : 'it')}>
        {lang === 'it' ? 'English' : 'Italiano'}
      </button>
    </section>
  );
}
```

When adding a field, keep the Italian and English JSON schemas aligned. Use the same keys and data types in both files, translate user-facing metadata as well as body content, and test both language states. If a translation is unavailable, the provider falls back to Italian for the main home dictionary.

News and deadlines are loaded separately by `useNews(lang)` and `useScadenze(lang)`. `src/data.js` uses an application-version-aware browser cache, allowing new deployments to invalidate stale fiscal content.

## SEO and Performance

- `src/components/Seo.jsx` manages route-level titles, descriptions, canonical URLs, Open Graph data, and Twitter metadata through `react-helmet-async`.
- `scripts/generate-share-pages.js` runs after every production build to generate static social-preview pages for news and deadline detail routes.
- `public/sitemap.xml` and `public/robots.txt` support indexing. Update the sitemap whenever public routes or the production domain change.
- Route-friendly SPA redirects are defined in `public/_redirects`.
- Images should be resized and compressed before being added. Prefer modern formats where social-platform compatibility permits and provide meaningful alternative text in content models that support it.
- `reportWebVitals` is available in `src/index.js`; pass a reporting callback to collect Core Web Vitals.

### PWA status

`public/manifest.json`, `logo192.png`, and `logo512.png` provide web app identity and install metadata. A service worker is **not currently registered** in `src/index.js`, so offline caching and update lifecycle behavior are not active yet.

To provide full PWA behavior, add and test a service worker (for example with Workbox), register it only in production, define safe caching rules for frequently changing fiscal content, and document how users receive updates. Tax deadlines should not be served indefinitely from a stale offline cache.

## Contributing

1. Create a branch from the latest `main`:

   ```bash
   git switch -c feature/short-description
   ```

2. Keep changes focused and follow the existing component and CSS organization.
3. Maintain matching `it` and `en` content structures.
4. Do not commit `.env` files, GitHub tokens, API keys, passwords, or client data.
5. Add or update tests for behavioral changes.
6. Run the verification commands:

   ```bash
   npm test -- --watchAll=false
   npm run build
   ```

7. Open a pull request describing the user impact, affected routes, content/schema changes, and manual checks. Include responsive screenshots for visual changes.

All fiscal, legal, privacy, and pricing content must be reviewed by an authorized studio representative before publication.

## Troubleshooting

### Dependency installation fails

Use the Node version configured for deployment and the repository's peer-dependency setting:

```bash
node --version
npm ci --legacy-peer-deps
```

### Direct links return 404

Confirm that `public/_redirects` is included in the deployed `build/` directory and that Netlify publishes `build`. React Router routes require an SPA fallback to `index.html`.

### Admin login always fails

- In production, verify that `ADMIN_PASSWORD` exists in Netlify and redeploy after changing it.
- Locally with `npm start`, set `REACT_APP_MOCK_ADMIN_PASSWORD`, restart the development server, and use `localhost` or `127.0.0.1`.
- To test the real function locally, use `netlify dev` and inspect the function logs.
- Whitespace is trimmed from both the configured and submitted passwords.

### Admin publish or GitHub test fails

- Confirm the `GIT_CFG` owner, repository, and branch in `src/pages/AdminPage.jsx`.
- Use a fine-grained token authorized for that repository with Contents read/write permission.
- Check that the JSON path and pending image paths are valid and that the branch is not protected against direct commits.

### Chat assistant reports “Server not configured”

Set `OPENAI_API_KEY` in the Netlify environment, redeploy, and check the `chatAssistant` function logs. Do not solve this by placing the production key in frontend source or a committed `.env` file.

### News or deadlines appear stale

The application caches datasets in `localStorage`. A Netlify build sets `REACT_APP_APP_VERSION` to the commit reference, which should invalidate the cache after deployment. During development, clear the site's local storage or use the reset controls in the admin panel, then reload.

### Contact form falls back to email

Netlify detects forms from the built HTML. Test the deployed site or `netlify dev`, confirm the form named `contatti` appears in Netlify Forms, and review spam filtering and submission logs. Plain `npm start` does not reproduce every Netlify form behavior.

### Social previews show old content

Confirm canonical metadata and generated share pages, then check `FACEBOOK_ACCESS_TOKEN`, `SITE_URL`, and function logs. Social networks may continue to cache previews after a successful deployment.

## License

No license file is currently included. The project should therefore be treated as proprietary/all rights reserved unless the repository owner adds an explicit license. Do not copy, redistribute, or reuse the code or studio content without permission.

If the project is intended for open-source use, add a `LICENSE` file and update this section with the selected license and copyright holder.

## Contact and Support

For website content, fiscal information, appointments, or professional support, use the contact form and contact details configured in `src/content/siteSettings.json` and displayed on the deployed website.

For technical issues, open a repository issue with:

- a concise description and reproduction steps;
- the affected route and language;
- browser, device, and Node version;
- relevant console or Netlify Function logs with secrets removed;
- screenshots when the issue is visual.

Do not include taxpayer information, personal data, passwords, access tokens, or API keys in issues or support requests.
