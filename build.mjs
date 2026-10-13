import fs from 'node:fs';
import path from 'node:path';
import { Marp } from '@marp-team/marp-core';
import * as cheerio from 'cheerio';

const SRC = 'slides', OUT = '_site';

// 讀 front matter 的 title / description（單行純量：'單引號'、"雙引號" 或無引號都可）
function readMeta(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : '';
  const get = (key) => {
    const mm = fm.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));
    if (!mm) return '';
    let v = mm[1].trim();
    if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    else if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/\\"/g, '"');
    return v;
  };
  return { title: get('title'), description: get('description') };
}
fs.rmSync(OUT, { recursive: true, force: true });
const entries = [];

for (const dir of fs.readdirSync(SRC, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  const name = dir.name;
  const dirPath = path.join(SRC, name);
  const mdPath = path.join(dirPath, `${name}.md`);
  if (!fs.existsSync(mdPath)) {
    console.warn(`略過 ${name}：找不到 ${name}.md`);
    continue;
  }

  // 每個資料夾獨立的 Marp 實例，載入該資料夾內所有 css
  const marp = new Marp({ html: true });
  for (const f of fs.readdirSync(dirPath)) {
    if (f.endsWith('.css')) {
      marp.themeSet.add(fs.readFileSync(path.join(dirPath, f), 'utf8'));
    }
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const meta = readMeta(md);
  const title = meta.title || name;
  const { html, css, comments } = marp.render(md);

  const $ = cheerio.load(html);
    const rows = $('div.marpit > svg').map((i, el) => {
    const note = (comments[i] || []).join('\n\n');
    return `<section class="row">
        <div class="slide"><div class="marpit">${$.html(el)}</div></div>
        <div class="note">${note ? escapeHtml(note).replace(/\n/g, '<br>') : '<em>（無逐字稿）</em>'}</div>
    </section>`;
    }).get().join('\n');

  const page = `<!doctype html><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>${css}
body{margin:0;font-family:system-ui,sans-serif;background:#f4f4f4}
.row{display:grid;grid-template-columns:3fr 2fr;gap:1.5rem;max-width:1400px;margin:1.5rem auto;padding:0 1rem}
.slide svg{width:100%;height:auto;box-shadow:0 2px 8px #0003;background:#fff}
.note{line-height:1.7}
@media(max-width:800px){.row{grid-template-columns:1fr}}
</style>
<p style="max-width:1400px;margin:1rem auto;padding:0 1rem"><a href="../">← 返回列表</a></p>
${rows}`;

    const outDir = path.join(OUT, name);
    fs.cpSync(dirPath, outDir, { recursive: true });
    fs.rmSync(path.join(outDir, path.basename(mdPath)));   // 只刪 _site 裡的複製品
    for (const f of fs.readdirSync(outDir)) {
    if (f.endsWith('.css')) fs.rmSync(path.join(outDir, f));
    }
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  entries.push({ name, title, description: meta.description });
}

const rowsHtml = entries.sort((a, b) => b.name.localeCompare(a.name))
  .map(e => `<tr>
    <td class="date">${escapeHtml(e.name)}</td>
    <td><a href="${e.name}/">${escapeHtml(e.title)}</a></td>
    <td>${escapeHtml(e.description)}</td></tr>`).join('');
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'),
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Paper Reading Slides</title>
<style>
body{font-family:system-ui;max-width:1000px;margin:3rem auto;padding:0 1rem;color:#1f2328}
table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:.6rem .8rem;border-bottom:1px solid #d1d9e0;vertical-align:top;line-height:1.5}
th{background:#eef1f4;color:#59636e;font-size:.85em}
td.date{font:13px ui-monospace,monospace;color:#59636e;white-space:nowrap}
a{color:#0969da;text-decoration:none;font-weight:600}
</style>
<h1>Paper Reading Slides</h1>
<table><thead><tr><th>資料夾</th><th>標題</th><th>簡介</th></tr></thead><tbody>${rowsHtml}</tbody></table>`);

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}