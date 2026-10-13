**👉 Browse all slides on GitHub Pages: https://930727fre.github.io/paper-reading-slides/**

> This repo only holds the source files (Markdown, images, build script). View the slides, with speaker notes, on the site above.

# Paper Reading Slides

Slides for my biweekly paper-reading meetings.

## How it works

```text
slides/<date-name>/*.md ──(Marp)──> HTML ──(GitHub Actions)──> GitHub Pages
```

- **Marp** turns Markdown into slides. `build.mjs` renders each `.md` with `@marp-team/marp-core`, applies the `gh-readme.css` theme from the same folder, and shows the `<!-- -->` speaker notes next to each slide.
- **Index page**: `build.mjs` reads `title` and `description` from each deck's front matter and fills them into `index.template.html`.
- **GitHub Actions** runs `node build.mjs` on every push to `main` and writes the result to `_site/`.
- **GitHub Pages** publishes `_site/` as the website linked above.

## Adding a slide deck

1. Create `slides/YYYYMMDD-name/` containing `YYYYMMDD-name.md`, `gh-readme.css`, and any images. The folder name must match the `.md` file name.
2. Add `title` (full title) and `description` (one-line summary) to the front matter. The index page shows them directly:

   ```markdown
   ---
   marp: true
   theme: gh-readme
   paginate: true
   header: '# Short paper name'
   title: 'Full title'
   description: 'One-line summary'
   ---
   ```

3. Push, wait for Actions to finish, and the new deck appears on the index page.

## Local preview

```bash
marp -p --theme gh-readme.css slides/20261013-HiKV/20261013-HiKV.md   # preview window
node build.mjs                                                        # full build into _site/
```
