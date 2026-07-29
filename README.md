# MythStride website

Official static website for MythStride: a dark-fantasy running RPG preparing
for an Android closed beta.

The launch site supports Brazilian Portuguese, English and Spanish at stable,
server-rendered routes:

- `/pt-BR/`
- `/en/`
- `/es/`

The root route is an accessible language chooser for all three public locales.

## Stack

- Next.js 16 with App Router and static export
- React 19 and TypeScript
- Tailwind CSS 4 plus the MythStride design system
- Framer Motion for existing authenticated interfaces
- GitHub Pages deployment from `main`

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. To inspect the exact static artifact:

```bash
npm run build
npm run preview:static
```

The static preview is available at `http://127.0.0.1:4173`.

## Quality commands

```bash
npm audit --omit=dev
npm run lint
npm run typecheck
npm test
npm run validate:content
npm run build
npm run validate:build
npm run validate:links
```

`npm run assets:optimize` regenerates runtime WebP assets from the masters in
`assets/source/`. Source masters are deliberately outside `public/` so they are
not shipped in the static artifact.

## Content and legal safety

Product availability comes only from
`src/config/product-status.ts`. Legal owner-controlled values come only from
`src/config/legal.ts`. Draft legal and support pages visibly identify
themselves as drafts and are emitted with `noindex,nofollow`.

Do not add active download, store, purchase, deletion or support actions until
the corresponding product and operational dependencies are approved.

See:

- `WEBSITE_ARCHITECTURE.md`
- `WEBSITE_CONTENT_STATUS.md`
- `WEBSITE_LEGAL_PLACEHOLDERS.md`
- `WEBSITE_SCREENSHOT_REQUIREMENTS.md`
- `WEBSITE_RELEASE_CHECKLIST.md`
- `WEBSITE_IMPLEMENTATION_REPORT.md`
