# Portfolio

**Live site: [henlam1.github.io](https://henlam1.github.io/)**

- [Home](https://henlam1.github.io/): intro, art viewer, about, projects, experience
- [Gallery](https://henlam1.github.io/gallery/): all my art, with a lightbox
- [ASCII renderer](https://henlam1.github.io/lab/): try the renderer on my pieces or your own image

Built with [Astro](https://astro.build). Black and white, "ink and code": my drawings, re-drawn as text by an ASCII renderer I wrote.

## Editing content

**All content lives in [`src/data/site.ts`](src/data/site.ts):**

- `profile`: name, tagline, about text, email, links, resume path
- `projects`: one entry per project, in the order they appear
- `art`: every piece in the gallery. Optional fields:
  - `featured: true` shows it in the homepage viewer
  - `frames` and `fps` for sprite sheets (frames side by side in one row)
  - `invert: true` for dark art on light paper
- `experience`, `education`, `skills`

Images go in `public/art/`, and the resume PDF in `public/`. Colors, fonts and sizes are the variables at the top of [`src/styles/global.css`](src/styles/global.css).

## The ASCII renderer

The renderer is in [`src/lib`](src/lib), following [Alex Harri's article on ASCII rendering](https://alexharri.com/blog/ascii-rendering):

- [`index.ts`](src/lib/index.ts): `toAscii()`, which converts an image into rows of characters
- [`sampling.ts`](src/lib/sampling.ts): sampling each cell in circles (Vogel-spiral points), plus directional and global contrast
- [`characters.ts`](src/lib/characters.ts): measuring the shape of each of the 95 printable characters, and finding the closest match

It's used by the homepage viewer ([`ArtViewer.astro`](src/components/ArtViewer.astro)) and the [renderer page](src/pages/lab.astro). Tags `v1-brightness` to `v5-directional` mark each stage of building it.

## Running locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Deploying

Every push to `main` builds and publishes the site to GitHub Pages, using [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It can also be run by hand from the repo's **Actions** tab. The live site updates a minute or two after a push.
