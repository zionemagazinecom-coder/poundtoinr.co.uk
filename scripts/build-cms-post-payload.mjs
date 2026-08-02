import fs from 'node:fs';
import path from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) throw new Error('Pass an article markdown file.');

const source = fs.readFileSync(inputPath, 'utf8');
const [front, article = ''] = source.split('## Article');
const field = (label) => front.match(new RegExp(`^${label}:\\s*(.+)$`, 'mi'))?.[1].trim() ?? '';
const links = (label) => field(label).split(',').map((value) => value.trim()).filter(Boolean);
const blocks = [];
let paragraph = [];

const inline = (value) => value
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

const flush = () => {
  if (!paragraph.length) return;
  blocks.push({ id: `import-${blocks.length + 1}`, type: 'paragraph', html: inline(paragraph.join(' ')) });
  paragraph = [];
};

for (const rawLine of article.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line) {
    flush();
    continue;
  }
  const heading = line.match(/^(#{1,4})\s+(.+)$/);
  if (heading) {
    flush();
    if (heading[1].length === 1) continue;
    blocks.push({ id: `import-${blocks.length + 1}`, type: `h${Math.min(heading[1].length, 4)}`, html: inline(heading[2]) });
    continue;
  }
  paragraph.push(line);
}
flush();

const payload = {
  title: source.match(/^#\s+(.+)$/m)?.[1].trim() ?? '',
  slug: field('Slug').replace(/^\//, ''),
  excerpt: field('Excerpt'),
  categories: links('Category'),
  featured_image_url: field('Featured image'),
  blocks,
  seo_title: field('SEO title'),
  meta_description: field('Meta description'),
  focus_keyword: field('Focus keyword'),
  internal_links: links('Internal links'),
  external_links: links('External link'),
};

const outputPath = path.join(path.dirname(inputPath), 'post-cms-payload.json');
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(outputPath);
