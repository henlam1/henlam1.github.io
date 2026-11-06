# Portfolio

My personal portfolio site, built with [Astro](https://astro.build).

## Editing content

**All content lives in [`src/data/site.ts`](src/data/site.ts).** Search for `TODO` and replace each one:

- `profile`: name, tagline, about blurb, email, GitHub/LinkedIn links, status pill
- `projects`: one object per project. The first one with `featured: true` gets a full-width card
- `experience`, `education`, `skills`

Extras:

- **Resume:** put your PDF in `public/resume.pdf`.
- **Project screenshots:** put images in `public/projects/` and set `image: '/projects/name.png'` on the project. Without an image, the card shows a big project number.
- **Colors and fonts:** change the variables at the top of [`src/styles/global.css`](src/styles/global.css).

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Deploying (GitHub Pages)

1. Push this repo to GitHub. Naming it `<username>.github.io` gives you the cleanest URL.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. In `astro.config.mjs`, set `site` to your Pages URL. If the repo has any other name, also set `base: '/<repo-name>'`.
4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and publishes the site.
