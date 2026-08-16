import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const templatePath = path.join(distDir, 'index.html');
const siteUrl = 'https://poundtoinr.co.uk';
const siteName = 'PoundToINR.co.uk';
const contactEmail = 'zionemagazine.com@gmail.com';

const baseTemplate = fs.readFileSync(templatePath, 'utf8');

const staticPages = [
  {
    path: '/gbp-to-inr',
    title: 'Pound to INR Converter and Live GBP/INR Rate',
    description: 'Convert pound to INR with the latest GBP/INR reference rate, clear calculations and practical guidance for comparing UK to India transfer quotes.',
    eyebrow: 'Live converter',
    intro: 'Convert British pounds to Indian rupees using the latest available reference rate.',
    tool: 'forward-converter',
    sections: [
      ['How to use the converter', 'Enter a pound amount to estimate its value in Indian rupees. The live result is a reference calculation, so compare it with the final rupee amount offered by a bank or transfer provider.'],
      ['Why provider quotes differ', 'Banks and transfer services may include an exchange-rate margin, transfer fee, payment-method charge or receiving fee. Compare the complete quote before sending money.'],
    ],
  },
  {
    path: '/about',
    title: 'About PoundToINR.co.uk',
    description: 'Learn about PoundToINR.co.uk, an independent pound to INR exchange-rate and money-transfer information site for UK and India readers.',
    eyebrow: 'About',
    intro: 'Independent pound to INR data, GBP/INR education and clear currency explainers for people moving money between Britain and India.',
    sections: [
      ['What this site does', 'PoundToINR.co.uk is an independent information site for people checking the British pound to Indian rupee exchange rate. The site shows the mid-market reference rate first, then explains why a bank or transfer provider quote may be different.'],
      ['Site ownership and contact', `The site is operated as an independent editorial project for PoundToINR.co.uk. The confirmed owner and contact email for site questions is ${contactEmail}.`],
      ['How we stay independent', 'We are not a bank, broker, remittance company or financial adviser. We publish reference-rate data, CMS-published guides and educational notes only.'],
    ],
  },
  {
    path: '/contact',
    title: 'Contact PoundToINR.co.uk',
    description: 'Contact PoundToINR.co.uk for editorial questions, corrections and feedback about pound to INR exchange-rate pages.',
    eyebrow: 'Contact',
    intro: 'Reach the editorial team for corrections, feedback and site questions.',
    sections: [
      ['How to contact us', `For editorial questions, corrections, partnership queries or feedback about a pound to INR page, contact the PoundToINR.co.uk team by email at ${contactEmail}.`],
      ['Real site details', `Website: ${siteName}. Primary contact email: ${contactEmail}. Public service area: United Kingdom and India currency readers.`],
    ],
  },
  {
    path: '/guides',
    title: 'Pound to INR Money Transfer Guides',
    description: 'Pound to INR transfer guides explaining provider margins, NRE/NRO accounts, fees and how to compare UK to India money-transfer quotes.',
    eyebrow: 'Guides',
    intro: 'Practical pound to INR guides for people sending money from the UK to India.',
    sections: [
      ['How to compare transfer costs', 'A provider can advertise a low fee while making money inside the exchange rate. Always compare the final rupees received, not only the advertised fee.'],
      ['Useful guide pages', 'Read our guides on comparing GBP to INR transfer quotes, NRI banking checks and why provider rates differ from live reference rates.'],
    ],
  },
  {
    path: '/news',
    title: 'Pound to INR News and Market Notes',
    description: 'Pound to INR market notes explaining UK rates, rupee pressure, oil prices, provider margins and transfer quote movement.',
    eyebrow: 'Market notes',
    intro: 'Plain-English notes on what can move the pound to rupee rate.',
    sections: [
      ['What moves pound to INR', 'GBP/INR is influenced by UK inflation, Bank of England expectations, Indian rupee liquidity, RBI activity, oil prices and global risk sentiment.'],
      ['Why provider rates can lag', 'Retail transfer quotes may update on a different schedule from interbank reference prices. Compare final rupees received, not only the headline rate.'],
    ],
  },
  {
    path: '/editorial-policy',
    title: 'Editorial Policy',
    description: 'Read the PoundToINR.co.uk editorial policy for pound to INR rates, transfer guides, corrections, sources and commercial separation.',
    eyebrow: 'Editorial policy',
    intro: 'How we write, update and correct currency content for UK and India readers.',
    sections: [
      ['Editorial principles', 'PoundToINR.co.uk publishes currency and transfer information for education. We explain what a number means, where uncertainty exists and which assumptions sit behind a calculation.'],
      ['Sources and updates', 'Rate pages are based on reference-rate architecture and clearly labelled timestamps. Market notes may refer to public economic information where relevant.'],
    ],
  },
  {
    path: '/privacy-policy',
    title: 'Privacy Policy',
    description: 'Privacy Policy for PoundToINR.co.uk, including cookies, analytics, advertising, contact messages and user choices.',
    eyebrow: 'Privacy',
    intro: 'How PoundToINR.co.uk handles privacy, cookies, analytics and advertising-related data.',
    sections: [
      ['Information we collect', 'PoundToINR.co.uk is designed to be usable without creating an account. If you contact us by email, we receive the information you choose to send.'],
      ['Cookies and advertising', 'The site may use essential cookies for basic operation and may later use analytics or advertising cookies to support the site.'],
    ],
  },
  {
    path: '/terms-and-conditions',
    title: 'Terms and Conditions',
    description: 'Terms and Conditions for using PoundToINR.co.uk, including informational-use limits and third-party provider disclaimers.',
    eyebrow: 'Terms',
    intro: 'The rules and limitations that apply when using this pound to INR information site.',
    sections: [
      ['Use of this website', 'By using PoundToINR.co.uk, you agree to use the site for lawful, informational purposes.'],
      ['Information only', 'The content is provided for general education and should not be treated as financial, legal, tax or investment advice.'],
    ],
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer',
    description: 'Financial and exchange-rate disclaimer for PoundToINR.co.uk. Rates are informational and not guaranteed provider quotes.',
    eyebrow: 'Disclaimer',
    intro: 'Important limits on pound to INR data, transfer explanations and financial information.',
    sections: [
      ['Currency information disclaimer', 'PoundToINR.co.uk publishes GBP to INR reference information for education. Rates shown on the site are not guaranteed transaction rates.'],
      ['No financial advice', 'Nothing on this website is personal financial advice. Confirm important figures directly with your chosen provider before acting.'],
    ],
  },
  {
    path: '/cookie-policy',
    title: 'Cookie Policy',
    description: 'Cookie Policy for PoundToINR.co.uk, covering essential cookies, analytics, advertising cookies and user controls.',
    eyebrow: 'Cookies',
    intro: 'How cookies may be used for site operation, analytics and advertising.',
    sections: [
      ['What cookies are', 'Cookies are small files stored by your browser. They can help a website remember settings, measure traffic, protect forms and support advertising or analytics features.'],
      ['Managing cookies', 'You can block or delete cookies in your browser. Some features may not remember your preferences if cookies are disabled.'],
    ],
  },
  {
    path: '/guides/compare-gbp-to-inr-transfer-quotes',
    title: 'How to Compare GBP to INR Transfer Quotes',
    description: 'Learn how to compare a GBP to INR transfer quote with the live reference rate, visible fees and provider margins before sending money.',
    eyebrow: 'Money transfer guide',
    intro: 'A practical checklist for comparing pound to INR transfer quotes.',
    sections: [
      ['Start with the live reference rate', 'Use the pound to INR converter as a benchmark before comparing a bank, app or money-transfer quote.'],
      ['Compare the final INR amount', 'A provider may include a margin inside its exchange rate as well as a visible fee. Compare how many rupees arrive for the same pound amount, speed and payment method.'],
    ],
  },
  {
    path: '/guides/nri-banking-checklist-gbp-to-inr',
    title: 'NRI Banking Checklist for GBP to INR Transfers',
    description: 'Check account type, purpose code and documentation before sending pound to INR transfers into an Indian bank account.',
    eyebrow: 'NRI banking guide',
    intro: 'A plain-English receiving-account checklist for sending pounds to India.',
    sections: [
      ['Use the right receiving account', 'Confirm whether the Indian account is suitable for overseas income, local income or family support before sending money.'],
      ['Check transfer requirements', 'For a large transfer, confirm the account type, purpose code, documentation and repatriation rules with the receiving bank or a qualified adviser.'],
    ],
  },
  {
    path: '/guides/why-gbp-to-inr-provider-rates-differ',
    title: 'Why GBP to INR Provider Rates Differ',
    description: 'Understand why pound to INR provider quotes differ from the live reference rate and how to compare the final rupee amount.',
    eyebrow: 'Exchange-rate guide',
    intro: 'Why a bank or transfer app can show a different pound to INR rate.',
    sections: [
      ['Why provider rates differ', 'The live rate is a reference rate, not a guaranteed transfer quote. Providers may apply a margin, flat fee, speed-based price or payment-method charge.'],
      ['Make a fair comparison', 'Compare the final INR amount received for the same GBP amount, transfer speed and payment method.'],
    ],
  },
  {
    path: '/news/gbp-to-inr-live-rate-source-policy',
    title: 'GBP to INR Live Rate Source and Data Policy',
    description: 'Learn how PoundToINR sources its live GBP to INR rate, editorial market notes and real historical snapshots.',
    eyebrow: 'Data policy',
    intro: 'How live reference data and historical rate snapshots are handled on this site.',
    sections: [
      ['What the rate page shows', 'The homepage separates live reference data from editorial notes. The displayed rate is loaded from the exchange-rate feed.'],
      ['Real history only', 'Historical chart points appear only after real snapshots are saved. Missing history is not backfilled with invented rates.'],
    ],
  },
  {
    path: '/news/how-gbp-to-inr-history-chart-fills',
    title: 'How the GBP to INR History Chart Fills',
    description: 'The GBP to INR history chart uses real saved snapshots instead of invented backfilled exchange rates.',
    eyebrow: 'History data',
    intro: 'Why the public history chart grows only from real saved rate snapshots.',
    sections: [
      ['How the chart fills', 'The chart is built from real snapshots saved by the site. A missing day remains missing instead of being filled with an invented rate.'],
      ['Why this matters', 'The chart may grow slowly at first, but every displayed point remains traceable to stored rate data.'],
    ],
  },
  {
    path: '/news/gbp-to-inr-reference-rate-vs-provider-quote',
    title: 'GBP to INR Reference Rate vs Provider Quote',
    description: 'Understand why a GBP to INR reference rate is not the same as a guaranteed bank or money-transfer provider quote.',
    eyebrow: 'Transfer costs',
    intro: 'The difference between a public reference rate and the rate offered for a real transfer.',
    sections: [
      ['Reference rate, not a provider quote', 'The number on this site is a reference rate. A bank or transfer provider may quote differently because of margins, fees, speed or payment method.'],
      ['Check the actual payout', 'For a real transfer decision, compare the final INR amount received after every fee and margin is included.'],
    ],
  },
];

const postFiles = [
  {
    file: 'content/posts/pound-to-inr-today.md',
    path: '/news/pound-to-inr-today',
    title: 'Pound to INR Today: Live GBP/INR Rate and Daily Update',
    description: 'Pound to INR today with live GBP/INR rate, simple conversion examples, market drivers and transfer tips. Learn what the rate means before sending.',
    eyebrow: 'Exchange rates',
  },
  {
    file: 'content/posts/gbp-to-inr-today.md',
    path: '/news/gbp-to-inr-today',
    title: 'GBP to INR Today: Live Pound Rate in India',
    description: 'GBP to INR today with live pound rate in India, examples, market notes and transfer checks. Learn how to read the rate before converting.',
    eyebrow: 'Exchange rates',
  },
  {
    file: 'content/posts/1-pound-in-indian-rupees-today.md',
    path: '/guides/1-pound-in-indian-rupees-today',
    title: '1 Pound in Indian Rupees Today: Live GBP to INR Conversion',
    description: '1 pound in Indian rupees today with live GBP to INR conversion, formula, examples and transfer checks. Learn the current value.',
    eyebrow: 'Guides',
  },
  {
    file: 'content/posts/100-pounds-in-indian-rupees.md',
    path: '/guides/100-pounds-in-indian-rupees',
    title: '100 Pounds in Indian Rupees: Live Conversion Guide',
    description: 'Convert 100 pounds in Indian rupees with the latest GBP to INR reference rate, clear formula, fee checks and practical examples. Calculate now.',
    eyebrow: 'Guides',
    image: '/images/100-pounds-in-indian-rupees.webp',
  },
  {
    file: 'content/posts/1000-pounds-in-indian-rupees.md',
    path: '/guides/1000-pounds-in-indian-rupees',
    title: '1000 Pounds in Indian Rupees: Live Conversion Guide',
    description: 'Convert 1000 pounds in Indian rupees with the latest GBP to INR reference rate, fee examples and transfer checks. See the calculation and compare costs.',
    eyebrow: 'Guides',
    image: '/images/1000-pounds-in-indian-rupees.webp',
  },
  {
    file: 'content/posts/500-pounds-in-indian-rupees.md',
    path: '/guides/500-pounds-in-indian-rupees',
    title: '500 Pounds in Indian Rupees: Live Conversion Guide',
    description: 'Convert 500 pounds in Indian rupees using the latest reference rate, practical examples and clear fee checks. See the live GBP to INR value now.',
    eyebrow: 'Guides',
    image: '/images/500-pounds-in-indian-rupees.webp',
  },
  {
    file: 'content/posts/2000-pounds-in-indian-rupees.md',
    path: '/guides/2000-pounds-in-indian-rupees',
    title: '2000 Pounds in Indian Rupees: Live Conversion Guide',
    description: 'Convert 2000 pounds in Indian rupees with the latest reference rate, fee examples and transfer checks. Calculate the live GBP to INR value now.',
    eyebrow: 'Guides',
    image: '/images/2000-pounds-in-indian-rupees.webp',
  },
  {
    file: 'content/posts/5000-pounds-in-indian-rupees.md',
    path: '/guides/5000-pounds-in-indian-rupees',
    title: '5000 Pounds in Indian Rupees: Live Conversion Guide',
    description: 'Convert 5000 pounds in Indian rupees with the latest reference rate, fee examples and transfer checks. Calculate the live GBP to INR value now.',
    eyebrow: 'Guides',
    image: '/images/5000-pounds-in-indian-rupees.webp',
  },
  {
    file: 'content/posts/10000-pounds-in-indian-rupees.md',
    path: '/guides/10000-pounds-in-indian-rupees',
    title: '10000 Pounds in Indian Rupees: Live Conversion Guide',
    description: 'Convert 10000 pounds in Indian rupees with the latest reference rate, fee examples and large-transfer checks. See the live GBP to INR value.',
    eyebrow: 'Guides',
    image: '/images/10000-pounds-in-indian-rupees.webp',
  },
  {
    file: 'content/posts/1-lakh-in-pounds.md',
    path: '/guides/1-lakh-in-pounds',
    title: '1 Lakh in Pounds: Live INR to GBP Conversion',
    description: 'Convert 1 lakh in pounds with the latest INR to GBP reference rate, clear formula and fee examples. Check how much ₹1,00,000 is worth now.',
    eyebrow: 'Reverse conversion',
    image: '/images/1-lakh-in-pounds.webp',
    tool: 'reverse-converter',
  },
  {
    file: 'content/posts/inr-to-gbp-converter.md',
    path: '/guides/inr-to-gbp-converter',
    title: 'INR to GBP Converter: Indian Rupees to Pounds',
    description: 'Use the live INR to GBP converter to turn Indian rupees into British pounds. Check the formula, current reference rate, examples and provider costs.',
    eyebrow: 'Reverse conversion',
    image: '/images/inr-to-gbp-converter.webp',
    tool: 'reverse-converter',
  },
  {
    file: 'content/posts/pound-to-rupee-calculator.md',
    path: '/guides/pound-to-rupee-calculator',
    title: 'Pound to Rupee Calculator with Live Rate',
    description: 'Use our pound to rupee calculator for a live GBP to INR estimate. Check the formula, fees and practical examples before converting your money.',
    eyebrow: 'Tools',
    image: '/images/pound-to-rupee-calculator.webp',
    tool: 'forward-converter',
  },
  {
    file: 'content/posts/gbp-to-inr-calculator.md',
    path: '/guides/gbp-to-inr-calculator',
    title: 'GBP to INR Calculator: Convert Pounds to Rupees',
    description: 'Use the GBP to INR calculator to convert pounds into Indian rupees with a current reference rate, clear formula, examples and practical fee checks.',
    eyebrow: 'Tools',
    image: '/images/gbp-to-inr-calculator.webp',
    tool: 'forward-converter',
  },
  {
    file: 'content/posts/pound-to-inr-historical-chart.md',
    path: '/guides/pound-to-inr-historical-chart',
    title: 'Pound to INR Historical Chart: How to Read GBP/INR Moves',
    description: 'Learn how to read a pound to INR historical chart, compare real rate points and avoid misleading trends when GBP/INR history is incomplete or limited.',
    eyebrow: 'History',
    image: '/images/pound-to-inr-historical-chart.webp',
  },
  {
    file: 'content/posts/gbp-inr-history.md',
    path: '/guides/gbp-inr-history',
    title: 'GBP INR History: Recent Pound to Rupee Rate Moves',
    description: 'Explore GBP INR history responsibly, compare dated pound-to-rupee rates and learn how data coverage, fees and market events affect conclusions.',
    eyebrow: 'History',
    image: '/images/gbp-inr-history.webp',
  },
  {
    file: 'content/posts/pound-to-inr-forecast.md',
    path: '/guides/pound-to-inr-forecast',
    title: 'Pound to INR Forecast: What Can Move GBP/INR Next',
    description: 'Read a balanced pound to INR forecast with upside, base and downside scenarios, key GBP/INR drivers and practical checks before converting money.',
    eyebrow: 'Forecast',
    image: '/images/pound-to-inr-forecast.webp',
  },
  {
    file: 'content/posts/gbp-to-inr-forecast-this-week.md',
    path: '/news/gbp-to-inr-forecast-this-week',
    title: 'GBP to INR Forecast This Week: Key Events to Watch',
    description: 'Follow the GBP to INR forecast this week with the 17–23 August 2026 event calendar, balanced scenarios and practical transfer-rate checks now.',
    eyebrow: 'Weekly outlook',
    image: '/images/gbp-to-inr-forecast-this-week.webp',
  },
];

const pages = [
  ...staticPages.map((page) => ({
    ...page,
    html: renderStaticSections(page),
  })),
  ...postFiles.map((post) => ({
    ...post,
    html: markdownArticleToHtml(readArticleMarkdown(post.file)),
  })),
];

for (const page of pages) {
  writeRouteHtml(page);
}

console.log(`SEO prerendered ${pages.length} routes.`);

function writeRouteHtml(page) {
  const canonicalUrl = `${siteUrl}${canonicalPath(page.path)}`;
  const title = `${page.title} | ${siteName}`;
  const schema = buildSchema(page, canonicalUrl);
  const html = injectSeo(baseTemplate, {
    body: renderBody(page, canonicalUrl),
    canonicalUrl,
    description: page.description,
    schema,
    title,
    image: page.image ? `${siteUrl}${page.image}` : '',
  });
  const outputDir = path.join(distDir, page.path.replace(/^\/+/, ''));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
}

function injectSeo(template, { body, canonicalUrl, description, image, schema, title }) {
  let html = template;
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
  if (image) {
    html = html.replace('<meta name="twitter:card" content="summary_large_image" />', `<meta property="og:image" content="${image}" /><meta name="twitter:image" content="${image}" /><meta name="twitter:card" content="summary_large_image" />`);
  }
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div><script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  return html;
}

function renderBody(page, canonicalUrl) {
  return normalizeInternalLinks([
    '<main class="content-main seo-prerender">',
    '<article class="content-article">',
    `<p class="content-eyebrow">${escapeHtml(page.eyebrow)}</p>`,
    `<h1>${escapeHtml(page.title)}</h1>`,
    `<p class="content-intro">${escapeHtml(page.description)}</p>`,
    page.tool === 'reverse-converter' ? renderReverseConverter() : '',
    page.tool === 'forward-converter' ? renderForwardConverter() : '',
    page.html,
    '</article>',
    '<aside class="content-aside" aria-label="Related pages">',
    '<h2>Useful pages</h2>',
    '<a href="/gbp-to-inr">Pound to INR converter</a>',
    '<a href="/guides">Transfer guides</a>',
    '<a href="/news">Market notes</a>',
    '<a href="/contact">Contact</a>',
    '</aside>',
    '</main>',
    renderFooter(),
    `<link rel="alternate" href="${canonicalUrl}" />`,
  ].join(''));
}

function renderReverseConverter() {
  return [
    '<section class="reverse-converter" aria-labelledby="reverse-converter-title">',
    '<div class="reverse-converter__head"><div><span>Live reference tool</span><h2 id="reverse-converter-title">INR to GBP converter</h2></div><strong>Loading</strong></div>',
    '<div class="reverse-converter__fields">',
    '<label><span>Indian rupees</span><div><b>₹</b><input aria-label="Indian rupee amount" inputmode="decimal" min="0" type="number" value="100000" /><em>INR</em></div></label>',
    '<span aria-hidden="true">→</span>',
    '<label><span>British pounds</span><div><b>£</b><input aria-label="British pound result" readonly value="779.71" /><em>GBP</em></div></label>',
    '</div>',
    '<p class="reverse-converter__rate">Reference example: 1 INR = <strong>0.007797 GBP</strong><span>Live result loads in the browser. Provider quotes may differ.</span></p>',
    '</section>',
  ].join('');
}

function renderForwardConverter() {
  return [
    '<section class="converter-card" aria-labelledby="forward-converter-title">',
    '<div class="converter-head"><div><span class="eyebrow">Live reference tool</span><h2 id="forward-converter-title">Pound to INR converter</h2></div></div>',
    '<div class="converter-grid">',
    '<label><span>You send</span><input aria-label="British pound amount" inputmode="decimal" min="0" type="number" value="1000" /><strong>GBP</strong></label>',
    '<label><span>Estimated result</span><input aria-label="Indian rupee result" readonly value="128308.40" /><strong>INR</strong></label>',
    '</div>',
    '<p class="rate-line">Reference example: 1 GBP = <strong>128.3084 INR</strong>. Live result loads in the browser; provider quotes may differ.</p>',
    '</section>',
  ].join('');
}

function renderFooter() {
  return [
    '<footer class="footer">',
    '<div>',
    '<a class="footer-brand" href="/">Pound<em>ToINR</em></a>',
    '<p>Independent pound to INR exchange rate data, GBP/INR research and plain-English finance explainers for people moving money between Britain and India.</p>',
    '<small>Mid-market reference rates are informational only. We are not a money-transfer provider and do not hold client funds.</small>',
    '</div>',
    '<div><h3>Convert</h3><a href="/gbp-to-inr">Pound to INR converter</a><a href="/guides">Currency &amp; transfer guides</a><a href="/news">Exchange rate news</a></div>',
    '<div><h3>Company</h3><a href="/about">About us</a><a href="/contact">Contact</a><a href="/editorial-policy">Editorial policy</a></div>',
    '<div><h3>Legal</h3><a href="/privacy-policy">Privacy policy</a><a href="/terms-and-conditions">Terms &amp; conditions</a><a href="/disclaimer">Disclaimer</a><a href="/cookie-policy">Cookie policy</a></div>',
    '</footer>',
  ].join('');
}

function renderStaticSections(page) {
  return page.sections
    .map(([heading, paragraph]) => `<section><h2>${escapeHtml(heading)}</h2><p>${protectEmail(escapeHtml(paragraph))}</p></section>`)
    .join('');
}

function canonicalPath(routePath) {
  if (routePath === '/') return '/';
  return `${routePath.replace(/\/+$/, '')}/`;
}

function normalizeInternalLinks(html) {
  return html.replace(/href="(\/(?!\/|#)[^"?#]*?)([?#][^"]*)?"/g, (_match, routePath, suffix = '') => {
    if (routePath === '/' || /\.[a-z0-9]+$/i.test(routePath)) return `href="${routePath}${suffix}"`;
    return `href="${canonicalPath(routePath)}${suffix}"`;
  });
}

function protectEmail(html) {
  return html.replaceAll(contactEmail, `<!--email_off--><a href="mailto:${contactEmail}">${contactEmail}</a><!--/email_off-->`);
}

function readArticleMarkdown(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const articleIndex = source.indexOf('## Article');
  return articleIndex >= 0 ? source.slice(articleIndex + '## Article'.length) : source;
}

function markdownArticleToHtml(markdown) {
  const lines = markdown
    .replace(/<figure>[\s\S]*?<\/figure>/gi, '')
    .replace(/<img\b[^>]*>/gi, '')
    .split(/\r?\n/);
  const out = [];
  let paragraph = [];

  const flush = () => {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (/^#{1,4}\s+/.test(line)) {
      flush();
      const level = Math.min(line.match(/^#+/)?.[0].length ?? 2, 3);
      const text = line.replace(/^#{1,4}\s+/, '');
      if (level === 1) continue;
      out.push(`<h${level}>${inlineMarkdown(text)}</h${level}>`);
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return out.join('');
}

function inlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/&lt;a href=&quot;([^&]+)&quot; target=&quot;_blank&quot; rel=&quot;nofollow noopener&quot;&gt;([\s\S]*?)&lt;\/a&gt;/g, '<a href="$1" target="_blank" rel="nofollow noopener">$2</a>')
    .replace(/&lt;a href=&quot;([^&]+)&quot;&gt;([\s\S]*?)&lt;\/a&gt;/g, '<a href="$1">$2</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function buildSchema(page, canonicalUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': page.path.startsWith('/news/') || page.path.startsWith('/guides/') ? 'Article' : 'WebPage',
    dateModified: page.path.includes('pound-to-inr-forecast') || page.path.includes('gbp-to-inr-forecast-this-week') ? '2026-08-15' : page.path.includes('pound-to-inr-historical-chart') || page.path.includes('gbp-inr-history') ? '2026-08-13' : page.path.includes('pound-to-rupee-calculator') || page.path.includes('gbp-to-inr-calculator') ? '2026-08-10' : page.path.includes('1-lakh-in-pounds') || page.path.includes('inr-to-gbp-converter') ? '2026-08-09' : page.path.includes('5000-pounds') || page.path.includes('10000-pounds') ? '2026-08-08' : '2026-08-02',
    description: page.description,
    headline: page.title,
    ...(page.image ? { image: `${siteUrl}${page.image}` } : {}),
    inLanguage: 'en-GB',
    mainEntityOfPage: canonicalUrl,
    name: page.title,
    publisher: {
      '@type': 'Organization',
      email: contactEmail,
      name: siteName,
      url: siteUrl,
    },
    url: canonicalUrl,
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
