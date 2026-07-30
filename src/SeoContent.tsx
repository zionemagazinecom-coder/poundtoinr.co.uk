/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import { CookieConsent } from './components/CookieConsent';

const siteUrl = 'https://poundtoinr.co.uk';
const siteName = 'PoundToINR.co.uk';
const contactEmail = 'zionemagazine.com@gmail.com';

export type SeoPage = {
  blocks: Array<{ heading: string; paragraphs: string[] }>;
  description: string;
  eyebrow: string;
  intro: string;
  path: string;
  schemaType?: 'Article' | 'AboutPage' | 'ContactPage' | 'WebPage';
  title: string;
  updated: string;
};

export const seoPages: Record<string, SeoPage> = {
  '/about': {
    blocks: [
      {
        heading: 'What this site does',
        paragraphs: [
          'PoundToINR.co.uk is an independent information site for people checking the British pound to Indian rupee exchange rate. The site is built around a simple idea: users should see the mid-market reference rate first, then understand why the amount quoted by a bank or transfer provider may be different.',
          'We focus on currency education, transfer-cost explanations, historical GBP/INR context and practical notes for people moving money between the United Kingdom and India.',
        ],
      },
      {
        heading: 'Site ownership and contact',
        paragraphs: [
          `The site is operated as an independent editorial project for PoundToINR.co.uk. The confirmed owner/contact email for site questions is ${contactEmail}.`,
          'The site does not operate as a bank, broker, remittance service or transfer provider. We publish reference-rate data, CMS-published guides and educational notes only.',
        ],
      },
      {
        heading: 'How we stay independent',
        paragraphs: [
          'We are not a bank, broker, remittance company or financial adviser. We do not hold customer money and we do not process transfers. Any provider, bank or service mentioned on the site is discussed for educational comparison only.',
          'If the site later uses advertising or affiliate links, those commercial relationships will be labelled clearly and will not change the way editorial explanations are written.',
        ],
      },
      {
        heading: 'Who the site is for',
        paragraphs: [
          'The site is written for UK residents sending money to India, NRIs managing family transfers, students comparing fees, small businesses invoicing across currencies and travellers budgeting a trip.',
          'The language is intentionally plain. Currency pages can become confusing quickly, so we explain fees, margins and rate movement in terms a normal reader can act on.',
        ],
      },
    ],
    description: 'Learn about PoundToINR.co.uk, an independent GBP to INR exchange-rate and money-transfer information site for UK and India readers.',
    eyebrow: 'About',
    intro: 'Independent GBP to INR data, transfer education and clear currency explainers for people moving money between Britain and India.',
    path: '/about',
    schemaType: 'AboutPage',
    title: 'About PoundToINR.co.uk',
    updated: '2026-07-26',
  },
  '/contact': {
    blocks: [
      {
        heading: 'How to contact us',
        paragraphs: [
          `For editorial questions, corrections, partnership queries or feedback about a GBP to INR page, contact the PoundToINR.co.uk team by email at ${contactEmail}.`,
          'Please do not send bank details, transfer receipts, passport information, one-time passwords or other sensitive personal documents. We cannot access or resolve transfers made through third-party providers.',
        ],
      },
      {
        heading: 'Real site details',
        paragraphs: [
          `Website: ${siteName}`,
          `Primary contact email: ${contactEmail}`,
          'Public service area: United Kingdom and India currency readers.',
        ],
      },
      {
        heading: 'Corrections and data questions',
        paragraphs: [
          'If you believe a rate, date, calculation or explanation is incorrect, include the page URL, the specific sentence or figure and the source you are comparing it with. We review correction requests carefully and update pages where the evidence supports a change.',
        ],
      },
      {
        heading: 'Response expectations',
        paragraphs: [
          'This is a small editorial site. We aim to review genuine messages as quickly as possible, but we cannot provide individual financial advice, transfer instructions or provider support.',
        ],
      },
    ],
    description: 'Contact PoundToINR.co.uk for editorial questions, corrections and feedback about GBP to INR exchange-rate pages.',
    eyebrow: 'Contact',
    intro: 'Reach the editorial team for corrections, feedback and site questions.',
    path: '/contact',
    schemaType: 'ContactPage',
    title: 'Contact PoundToINR.co.uk',
    updated: '2026-07-26',
  },
  '/editorial-policy': {
    blocks: [
      {
        heading: 'Editorial principles',
        paragraphs: [
          'PoundToINR.co.uk publishes currency and transfer information for education. Our editorial standard is to explain what a number means, where uncertainty exists and which assumptions sit behind a calculation.',
          'We avoid presenting exchange-rate movement as a guaranteed forecast. Currency prices can move quickly, and readers should confirm live provider quotes before making a transfer.',
        ],
      },
      {
        heading: 'Sources and updates',
        paragraphs: [
          'Rate pages are based on reference-rate architecture and clearly labelled timestamps. Market notes may refer to public economic information, central-bank activity, inflation data, commodity movement and transfer-cost research where relevant.',
          'When a page is updated, we aim to keep the visible date accurate so readers can judge freshness before relying on the information.',
        ],
      },
      {
        heading: 'Commercial separation',
        paragraphs: [
          'Advertising, sponsorship or affiliate relationships must not control editorial conclusions. If commercial links are added in the future, they will be disclosed and reviewed separately from the educational content.',
        ],
      },
    ],
    description: 'Read the PoundToINR.co.uk editorial policy for GBP to INR rates, transfer guides, corrections, sources and commercial separation.',
    eyebrow: 'Editorial policy',
    intro: 'How we write, update and correct currency content for UK and India readers.',
    path: '/editorial-policy',
    schemaType: 'WebPage',
    title: 'Editorial Policy',
    updated: '2026-07-26',
  },
  '/privacy-policy': {
    blocks: [
      {
        heading: 'Information we collect',
        paragraphs: [
          'PoundToINR.co.uk is designed to be usable without creating an account. If you use the converter, the amounts and currencies are processed in your browser to show a result. If analytics, forms or advertising are enabled, limited technical information such as device type, page views, approximate region and referral source may be processed.',
          'If you contact us by email, we receive the information you choose to send, such as your email address, message and any page details included in the request.',
        ],
      },
      {
        heading: 'Cookies, analytics and advertising',
        paragraphs: [
          'The site may use essential cookies for basic operation and may later use analytics or advertising cookies to measure audience behaviour and support the site. If Google AdSense or similar advertising is enabled, third-party vendors may use cookies or similar technologies to serve and measure ads.',
          'Users can control cookies through browser settings. Where a consent tool is required by law, it should be shown before optional advertising or analytics cookies are used.',
        ],
      },
      {
        heading: 'How information is used',
        paragraphs: [
          'Information may be used to operate the website, improve content, understand which pages are useful, respond to messages, protect the site from abuse and comply with legal obligations.',
          'We do not sell personal information and we do not ask users to submit banking credentials, transfer authorisation codes or payment-card details.',
        ],
      },
      {
        heading: 'Your choices',
        paragraphs: [
          'You may request correction or deletion of personal information you have sent directly to us, subject to reasonable verification and legal retention requirements. You may also block cookies, disable JavaScript or use privacy tools, although some site features may work less smoothly.',
        ],
      },
    ],
    description: 'Privacy Policy for PoundToINR.co.uk, including cookies, analytics, advertising, contact messages and user choices.',
    eyebrow: 'Privacy',
    intro: 'How PoundToINR.co.uk handles privacy, cookies, analytics and advertising-related data.',
    path: '/privacy-policy',
    schemaType: 'WebPage',
    title: 'Privacy Policy',
    updated: '2026-07-26',
  },
  '/terms-and-conditions': {
    blocks: [
      {
        heading: 'Use of this website',
        paragraphs: [
          'By using PoundToINR.co.uk, you agree to use the site for lawful, informational purposes. You must not attempt to disrupt the site, scrape it aggressively, misrepresent its content or use it to support fraud or harmful activity.',
          'The site may change, pause or remove features, pages or data displays without notice.',
        ],
      },
      {
        heading: 'Information only',
        paragraphs: [
          'The content is provided for general education and should not be treated as financial, legal, tax or investment advice. Exchange rates, transfer fees and provider terms change frequently. Always confirm the final quote directly with your chosen bank or transfer provider before sending money.',
        ],
      },
      {
        heading: 'Liability and third parties',
        paragraphs: [
          'We try to keep information accurate and useful, but we cannot guarantee that all data is complete, current or error-free. PoundToINR.co.uk is not responsible for losses caused by reliance on the site or by actions taken with third-party providers.',
          'Links to external websites are provided for convenience and do not mean we control or endorse those websites.',
        ],
      },
    ],
    description: 'Terms and Conditions for using PoundToINR.co.uk, including informational-use limits and third-party provider disclaimers.',
    eyebrow: 'Terms',
    intro: 'The rules and limitations that apply when using this GBP to INR information site.',
    path: '/terms-and-conditions',
    schemaType: 'WebPage',
    title: 'Terms and Conditions',
    updated: '2026-07-26',
  },
  '/disclaimer': {
    blocks: [
      {
        heading: 'Currency information disclaimer',
        paragraphs: [
          'PoundToINR.co.uk publishes GBP to INR reference information for education. The rates shown on the site are not guaranteed transaction rates and may differ from quotes offered by banks, brokers, card networks or money-transfer providers.',
          'A provider quote may include a spread, transfer fee, card fee, receiving-bank fee or other charge. The final rupee amount can also change because of rate movement, compliance checks, payment method and delivery timing.',
        ],
      },
      {
        heading: 'No financial advice',
        paragraphs: [
          'Nothing on this website is personal financial advice. We do not know your full circumstances, tax position, urgency, provider eligibility or risk tolerance. Speak to a regulated professional if you need advice for a specific decision.',
        ],
      },
      {
        heading: 'Accuracy and availability',
        paragraphs: [
          'We work to keep pages clear and current, but errors and delays can happen. You should verify important figures directly with the relevant provider before acting.',
        ],
      },
    ],
    description: 'Financial and exchange-rate disclaimer for PoundToINR.co.uk. Rates are informational and not guaranteed provider quotes.',
    eyebrow: 'Disclaimer',
    intro: 'Important limits on GBP to INR data, transfer explanations and financial information.',
    path: '/disclaimer',
    schemaType: 'WebPage',
    title: 'Disclaimer',
    updated: '2026-07-26',
  },
  '/cookie-policy': {
    blocks: [
      {
        heading: 'What cookies are',
        paragraphs: [
          'Cookies are small files stored by your browser. They can help a website remember settings, measure traffic, protect forms and support advertising or analytics features.',
        ],
      },
      {
        heading: 'How this site may use cookies',
        paragraphs: [
          'PoundToINR.co.uk may use essential cookies for basic site operation. If analytics or advertising are enabled, optional cookies may help measure page performance, understand visitor behaviour and serve relevant ads.',
          'If Google advertising is used, Google and its partners may use cookies or similar technologies to personalise or measure ads depending on user consent, location and applicable law.',
        ],
      },
      {
        heading: 'Managing cookies',
        paragraphs: [
          'You can block or delete cookies in your browser. Some features may not remember your preferences if cookies are disabled. Where required, a cookie consent tool should allow visitors to accept, reject or manage optional cookies.',
        ],
      },
    ],
    description: 'Cookie Policy for PoundToINR.co.uk, covering essential cookies, analytics, advertising cookies and user controls.',
    eyebrow: 'Cookies',
    intro: 'How cookies may be used for site operation, analytics and advertising.',
    path: '/cookie-policy',
    schemaType: 'WebPage',
    title: 'Cookie Policy',
    updated: '2026-07-26',
  },
  '/guides': {
    blocks: [
      {
        heading: 'What a 3% margin really costs on a GBP2,000 transfer',
        paragraphs: [
          'A transfer provider can advertise a low fee while making money inside the exchange rate. For example, if a provider gives a rate 3% below the current mid-market feed, that hidden margin can cost more than the visible flat fee. Always compare the final rupees received, not only the advertised fee.',
          'The clean way to compare providers is to ignore slogans and calculate the final rupees received. Use the mid-market rate as a reference, subtract all fees and compare the delivered amount for the same payment method and speed.',
        ],
      },
      {
        heading: 'NRE vs NRO accounts for money sent from the UK',
        paragraphs: [
          'An NRE account is generally used for foreign income remitted to India and is designed for repatriability. An NRO account is generally used for income earned in India and can have different tax and repatriation rules. The right receiving account depends on the source and intended use of funds.',
          'Before sending a large amount, check the account type, bank requirements, purpose code and documentation expected by the receiving bank.',
        ],
      },
      {
        heading: 'How to compare a transfer quote',
        paragraphs: [
          'Write down four numbers: the mid-market rate, the provider rate, the stated fee and the final INR delivered. A quote that looks cheap on fees can still be expensive if the exchange-rate margin is wide.',
          'Also compare delivery speed, refund rules, identity checks, customer support and receiving-bank charges. The best transfer is not always the one with the biggest headline rate.',
        ],
      },
    ],
    description: 'GBP to INR transfer guides explaining provider margins, NRE/NRO accounts, fees and how to compare UK to India money-transfer quotes.',
    eyebrow: 'Guides',
    intro: 'Practical GBP to INR guides for people sending money from the UK to India.',
    path: '/guides',
    schemaType: 'Article',
    title: 'GBP to INR Money Transfer Guides',
    updated: '2026-07-26',
  },
  '/news': {
    blocks: [
      {
        heading: 'What is moving GBP to INR right now',
        paragraphs: [
          'GBP/INR is influenced by both sides of the pair. UK inflation, Bank of England rate expectations, Indian rupee liquidity, Reserve Bank of India intervention, oil prices and global risk sentiment can all affect the rate.',
          'A short-term move does not always mean the transfer market has changed permanently. For normal users, the practical question is whether the provider quote has improved enough to justify sending now rather than waiting.',
        ],
      },
      {
        heading: 'Why oil matters for the rupee',
        paragraphs: [
          'India imports a large share of its crude oil. When oil prices rise sharply, the import bill can put pressure on the rupee, especially if the US dollar is also strong. That pressure may show up in GBP/INR even when the pound itself is not moving much against other currencies.',
        ],
      },
      {
        heading: 'Why provider rates can lag the market',
        paragraphs: [
          'Retail transfer quotes may update on a different schedule from interbank reference prices. Some providers adjust quickly; others hold wider buffers during volatile sessions. That is why comparing final rupees received matters more than watching a single chart point.',
        ],
      },
    ],
    description: 'GBP to INR market notes explaining UK rates, rupee pressure, oil prices, provider margins and transfer quote movement.',
    eyebrow: 'Market notes',
    intro: 'Plain-English notes on what can move the pound to rupee rate.',
    path: '/news',
    schemaType: 'Article',
    title: 'GBP to INR News and Market Notes',
    updated: '2026-07-26',
  },
};

export const homeSeo = {
  description: 'Convert pound to INR with transparent mid-market reference rates, historical pound to rupee charts, GBP/INR data and UK to India money guides.',
  path: '/',
  title: 'Pound to INR Currency Converter | Pound to Rupee Rate Today',
};

export function usePageSeo({
  description,
  noindex = false,
  path,
  schema,
  title,
}: {
  description: string;
  noindex?: boolean;
  path: string;
  schema?: object;
  title: string;
}) {
  useEffect(() => {
    const canonicalUrl = `${siteUrl}${path === '/' ? '' : path}`;
    document.title = title;
    upsertMeta('description', description);
    upsertMeta('robots', noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    upsertProperty('og:title', title);
    upsertProperty('og:description', description);
    upsertProperty('og:url', canonicalUrl);
    upsertProperty('og:type', schema && 'headline' in schema ? 'article' : 'website');
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertLink('canonical', canonicalUrl);
    upsertJsonLd('site-schema', buildWebsiteSchema());
    if (schema) {
      upsertJsonLd('page-schema', schema);
    }
    return () => undefined;
  }, [description, noindex, path, schema, title]);
}

export function SeoRoutePage({ page }: { page: SeoPage }) {
  usePageSeo({
    description: page.description,
    path: page.path,
    schema: buildPageSchema(page),
    title: `${page.title} | ${siteName}`,
  });

  return (
    <div className="site-shell content-shell">
      <SiteHeader />
      <main id="main" className="content-main">
        <article className="content-article">
          <p className="content-eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="content-intro">{page.intro}</p>
          <p className="content-updated">Last updated: {formatDate(page.updated)}</p>
          {page.blocks.map((block) => (
            <section key={block.heading}>
              <h2>{block.heading}</h2>
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
        <aside className="content-aside" aria-label="Related pages">
          <h2>Useful pages</h2>
          <a href="/gbp-to-inr">Pound to INR converter</a>
          <a href="/guides">Transfer guides</a>
          <a href="/news">Market notes</a>
          <a href="/privacy-policy">Privacy policy</a>
          <a href="/disclaimer">Disclaimer</a>
        </aside>
      </main>
      <SiteFooter />
      <CookieConsent />
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="topbar">
      <nav className="nav-wrap">
        <a className="brand" href="/">
          <span>{'\u00a3'}</span>
          <strong>
            Pound<em>ToINR</em>
          </strong>
        </a>
        <div className="nav-links">
          <a href="/gbp-to-inr">Converter</a>
          <a href="/guides">Guides</a>
          <a href="/news">News</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
        <a className="nav-cta" href="/#converter">
          Convert now
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div>
        <a className="footer-brand" href="/">
          Pound<em>ToINR</em>
        </a>
        <p>Independent pound to INR exchange rate data, GBP/INR research and plain-English finance explainers for people moving money between Britain and India.</p>
        <small>Mid-market reference rates are informational only. We are not a money-transfer provider and do not hold client funds.</small>
      </div>
      <div>
        <h3>Convert</h3>
        <a href="/gbp-to-inr">Pound to INR converter</a>
        <a href="/guides">Currency & transfer guides</a>
        <a href="/news">Exchange rate news</a>
      </div>
      <div>
        <h3>Company</h3>
        <a href="/about">About us</a>
        <a href="/contact">Contact</a>
        <a href="/editorial-policy">Editorial policy</a>
      </div>
      <div>
        <h3>Legal</h3>
        <a href="/privacy-policy">Privacy policy</a>
        <a href="/terms-and-conditions">Terms & conditions</a>
        <a href="/disclaimer">Disclaimer</a>
        <a href="/cookie-policy">Cookie policy</a>
      </div>
    </footer>
  );
}

export function buildHomeSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebsiteSchema(),
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The pound to INR rate shown is an indicative mid-market reference rate. Banks and transfer providers may quote a different customer rate.',
            },
            name: 'What is the pound to INR exchange rate today?',
          },
          {
            '@type': 'Question',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Provider rates can be lower than the mid-market rate because of exchange-rate margins, flat fees, card costs and receiving-bank charges.',
            },
            name: 'Why is the rate my bank offers lower than the one shown here?',
          },
        ],
      },
      {
        '@type': 'WebApplication',
        applicationCategory: 'FinanceApplication',
        name: 'Pound to INR Currency Converter',
        operatingSystem: 'Web',
        url: siteUrl,
      },
    ],
  };
}

function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    description: homeSeo.description,
    inLanguage: 'en-GB',
    name: siteName,
    publisher: {
      '@type': 'Organization',
      email: contactEmail,
      name: siteName,
      url: siteUrl,
    },
    url: siteUrl,
  };
}

function buildPageSchema(page: SeoPage) {
  const pageUrl = `${siteUrl}${page.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': page.schemaType ?? 'WebPage',
    dateModified: page.updated,
    datePublished: '2026-07-26',
    description: page.description,
    headline: page.title,
    inLanguage: 'en-GB',
    mainEntityOfPage: pageUrl,
    name: page.title,
    publisher: {
      '@type': 'Organization',
      email: contactEmail,
      name: siteName,
      url: siteUrl,
    },
    url: pageUrl,
  };
}

function upsertMeta(name: string, content: string) {
  const selector = `meta[name="${name}"]`;
  const tag = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta');
  tag.name = name;
  tag.content = content;
  if (!tag.parentNode) {
    document.head.appendChild(tag);
  }
}

function upsertProperty(property: string, content: string) {
  const selector = `meta[property="${property}"]`;
  const tag = document.querySelector<HTMLMetaElement>(selector) ?? document.createElement('meta');
  tag.setAttribute('property', property);
  tag.content = content;
  if (!tag.parentNode) {
    document.head.appendChild(tag);
  }
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  const tag = document.querySelector<HTMLLinkElement>(selector) ?? document.createElement('link');
  tag.rel = rel;
  tag.href = href;
  if (!tag.parentNode) {
    document.head.appendChild(tag);
  }
}

function upsertJsonLd(id: string, schema: object) {
  const tag = document.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`) ?? document.createElement('script');
  tag.type = 'application/ld+json';
  tag.dataset.seo = id;
  tag.textContent = JSON.stringify(schema);
  if (!tag.parentNode) {
    document.head.appendChild(tag);
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00Z`));
}
