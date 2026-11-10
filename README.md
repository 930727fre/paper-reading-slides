**👉 Browse all slides on GitHub Pages: https://930727fre.github.io/paper-reading-slides/**

> This repo only holds the source files (Markdown, images, build script). View the slides, with speaker notes, on the site above.

# Paper Reading Slides

Slides for my biweekly paper-reading meetings.

## How it works

```text
slides/<date-name>/*.md ──(Marp)──> HTML ──(GitHub Actions)──> GitHub Pages
```

- **Marp** turns Markdown into slides. `build.mjs` renders each `.md` with `@marp-team/marp-core`, applies the `theme.css` theme from the same folder, and shows the `<!-- -->` speaker notes next to each slide.
- **Index page**: `build.mjs` reads `title` and `description` from each deck's front matter and fills them into `index.template.html`.
- **GitHub Actions** runs `node build.mjs` on every push to `main` and writes the result to `_site/`.
- **GitHub Pages** publishes `_site/` as the website linked above.

## Adding a slide deck

1. Create `slides/YYYYMMDD-name/` containing `YYYYMMDD-name.md`, `theme.css`, and any images. The folder name must match the `.md` file name.
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

3. Start the deck with a cover slide (see [Cover slide format](#cover-slide-format)).
4. Push, wait for Actions to finish, and the new deck appears on the index page.

## Cover slide format

The first slide of every deck is a cover. Use this template:

```markdown
<!-- _class: cover -->
<!-- _paginate: false -->

# Full paper title

`Institution` `Venue Year` `arXiv 1234.56789`

Author 1, Author 2, Author 3

報告人：莊翔鈞

<!--
Speaker notes: who wrote it, where it was published, and the problem it tackles.
-->
```

| Line | Content |
|---|---|
| `# Title` | Full paper title, same as `title` in the front matter |
| Tag line | One backtick tag per item, in this order: institution(s), venue + year, then `arXiv <id>` |
| Authors | Comma-separated, in paper order |
| `報告人` | Presenter |

Rules for the tag line:

- Add the `arXiv` tag only if the paper has an arXiv version. Write the bare ID with no version suffix, e.g. `arXiv 2503.18599`.
- Skip it for papers that have none (theses, conference-only papers). Don't leave an empty tag.

## Local preview

```bash
cd slides/20261013-HiKV/
marp -p --theme theme.css 20261013-HiKV.md   # preview window
node build.mjs                                                        # full build into _site/
```