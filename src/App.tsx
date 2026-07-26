import { BarChart3, BriefcaseBusiness, GraduationCap, Plane, ShieldCheck, Wallet, WalletCards, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState, type PointerEvent } from 'react';
import { AdminAuthGate, AdminAuthPage } from './AdminAuthGate';
import { AdminEditor } from './AdminEditor';
import { Converter } from './components/Converter';
import { SeoRoutePage, buildHomeSchema, homeSeo, seoPages, usePageSeo } from './SeoContent';
import { exchangeRateProvider, type NormalisedRate } from './lib/exchangeRateProvider';
import { getPublishedPosts, getRealRateSnapshots, type PublishedPost, type RateSnapshot } from './lib/liveContent';

const trustCards: Array<[string, string, LucideIcon]> = [
  ['Independent data', 'Every figure on this page is pulled from reference-rate architecture, so you are never reading a stale number without a label.', ShieldCheck],
  ['Margins made visible', 'We publish the mid-market rate first and explain the provider margin second. If we later earn commission, it will be stated on the page.', Wallet],
  ['Five years of context', 'A single rate tells you little. The chart shows where today sits against the recent range so users can decide whether to send now or wait.', BarChart3],
  ['Written for both sides', 'Guides cover UK-side paperwork and India-side account rules because a transfer only works if both ends do.', WalletCards],
];

const audience: Array<[string, LucideIcon]> = [
  ['NRIs sending money home', WalletCards],
  ['Students paying UK fees', GraduationCap],
  ['Travellers budgeting a trip', Plane],
  ['Businesses invoicing in INR', BriefcaseBusiness],
];

const faqs = [
  ['What is the GBP to INR exchange rate today?', 'The figure at the top of this page is an indicative mid-market reference rate. Your bank or transfer provider may quote a different rate.'],
  ['Why is the rate my bank offers lower than the one shown here?', 'Banks and transfer companies usually add a margin to the mid-market rate, and some also add a flat fee on top.'],
  ['When is the best time to send money from the UK to India?', 'There is no guaranteed best moment. Compare the provider quote, visible fee and total rupees received before sending.'],
  ['How much money can I send from the UK to India?', 'Limits depend on your provider, payment method, identity checks and receiving account. Always confirm with your chosen provider.'],
];

const conversionAmounts = [1, 10, 50, 100, 500, 1000];

export function App() {
  const path = normalizePath(window.location.pathname);
  if (path === '/admin') {
    return (
      <AdminAuthGate>
        {({ admin, signOut }) => <AdminEditor adminEmail={admin.email} adminRole={admin.role} onSignOut={signOut} />}
      </AdminAuthGate>
    );
  }
  if (path === '/auth') {
    return <AdminAuthPage />;
  }
  if (seoPages[path]) {
    return <SeoRoutePage page={seoPages[path]} />;
  }
  return <PublicApp path={path} />;
}

function PublicApp({ path }: { path: string }) {
  usePageSeo({
    description: homeSeo.description,
    path: path === '/gbp-to-inr' ? '/gbp-to-inr' : '/',
    schema: buildHomeSchema(),
    title: homeSeo.title,
  });

  const [liveRate, setLiveRate] = useState<NormalisedRate | null>(null);
  const [rateError, setRateError] = useState('');
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [snapshots, setSnapshots] = useState<RateSnapshot[]>([]);

  useEffect(() => {
    let active = true;

    exchangeRateProvider
      .getCurrentRate('GBP', 'INR')
      .then((rate) => {
        if (active) setLiveRate(rate);
      })
      .catch(() => {
        if (active) setRateError('Live GBP/INR rate is unavailable right now.');
      });

    getPublishedPosts().then((nextPosts) => {
      if (active) setPosts(nextPosts);
    });

    getRealRateSnapshots().then((nextSnapshots) => {
      if (active) setSnapshots(nextSnapshots);
    });

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(() => buildSnapshotChart(snapshots), [snapshots]);
  const historyMetrics = useMemo(() => buildHistoryMetrics(snapshots), [snapshots]);
  const guidePosts = useMemo(() => posts.filter(isGuidePost).slice(0, 3), [posts]);
  const marketPosts = useMemo(() => posts.filter(isMarketPost).slice(0, 3), [posts]);
  const stats = useMemo(() => [
    ['Live rate', liveRate ? formatRate(liveRate.rate) : rateError ? 'Unavailable' : 'Loading'],
    ['History points', String(snapshots.length)],
    ['Content source', posts.length ? 'Supabase' : 'CMS ready'],
  ], [liveRate, posts.length, rateError, snapshots.length]);
  const rateStamp = liveRate ? formatDateTime(liveRate.fetchedAt) : rateError || 'Loading live rate';
  const heroRateText = liveRate ? `₹${formatRate(liveRate.rate)}` : rateError ? 'unavailable' : 'loading';

  function updateCardLight(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="topbar">
        <nav className="nav-wrap">
          <a className="brand" href="/">
            <span>{'\u00a3'}</span>
            <strong>Pound<em>ToINR</em></strong>
          </a>
          <div className="nav-links">
            <a className="active" href="/gbp-to-inr">Converter</a>
            <a href="/guides">Guides</a>
            <a href="/news">News</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
          <a className="nav-cta" href="#converter">Convert now</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero-section">
          <div className="hero-glow" />
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="rate-pill"><i /> Updated {rateStamp} - ExchangeRate-API reference rate</p>
              <h1>Convert British Pounds to <span>Indian Rupees</span> instantly</h1>
              <p className="hero-text">
                One pound is worth <strong>{heroRateText}</strong> on the latest available mid-market feed. We only show live API data here; if history or articles are not in Supabase yet, fake placeholders stay hidden.
              </p>
              <div className="hero-actions">
                <a className="primary-btn" href="#converter">Convert an amount <span>{' ->'}</span></a>
                <a className="ghost-btn" href="#chart">View real history</a>
              </div>
              <div className="stat-row">
                {stats.map(([label, value]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div id="converter">
              <Converter />
            </div>
          </div>
        </section>

        <section className="history-section" id="chart" aria-labelledby="chart-title">
          <div className="history-card">
            <div className="history-head">
              <div>
                <h2 id="chart-title">GBP to INR history</h2>
                <p>Only stored GBP/INR snapshots from Supabase are shown here.</p>
              </div>
              <div className="range-tabs" aria-label="Chart source">
                <button className="active" type="button">Real data</button>
              </div>
            </div>
            <div className="history-metrics">
              <div><span>Stored points</span><strong>{snapshots.length}</strong></div>
              <div><span>Period high</span><strong>{historyMetrics.high}</strong></div>
              <div><span>Period low</span><strong>{historyMetrics.low}</strong></div>
            </div>
            {chartData ? (
              <svg viewBox="0 0 1100 330" role="img" aria-label="Real GBP to INR stored snapshot chart">
                <defs>
                  <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2ee6bd" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#2ee6bd" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className="axis-labels">
                  {chartData.yLabels.map((label, index) => (
                    <text key={label} x="18" y={70 + index * 80}>{label}</text>
                  ))}
                </g>
                <path className="gridline" d="M70 70 H1080 M70 150 H1080 M70 230 H1080" />
                <path className="chart-area" d={chartData.area} />
                <path className="chart-line" d={chartData.line} />
                <g className="x-axis-labels">
                  {chartData.labels.map((label) => (
                    <text key={`${label.x}-${label.text}`} x={label.x} y="318">{label.text}</text>
                  ))}
                </g>
              </svg>
            ) : (
              <div className="history-empty">
                <strong>{snapshots.length ? `${snapshots.length} real snapshot stored` : 'No real history stored yet'}</strong>
                <p>{snapshots.length ? 'The chart line will appear after at least two real GBP/INR snapshots are saved.' : 'Live GBP/INR is working from the API, but historical chart points will appear only after real snapshots are saved in Supabase.'}</p>
              </div>
            )}
            <div className="chart-footer">
              <span>Reference rate, not a guaranteed provider quote</span>
              <span>Fake chart data disabled</span>
            </div>
          </div>
        </section>

        <section className="trust-section">
          <div className="section-heading left">
            <p>Why people use this site</p>
            <h2>Rate data you can act on, not just look at</h2>
          </div>
          <div className="trust-grid">
            {trustCards.map(([title, body, Icon]) => (
              <article key={String(title)} className="glass-card hover-card" onPointerMove={updateCardLight}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <div className="audience-row">
            {audience.map(([label, Icon]) => (
              <span key={String(label)}><Icon size={16} />{label}</span>
            ))}
          </div>
        </section>

        <section className="conversions-section">
          <div className="section-heading left">
            <p>Popular conversions</p>
            <h2>Common GBP to INR amounts</h2>
          </div>
          <div className="conversion-grid">
            {conversionAmounts.map((amount) => (
              <article key={amount} className="hover-card" onPointerMove={updateCardLight}>
                <span>{'\u00a3'}{amount.toLocaleString('en-GB')}</span>
                <strong>{liveRate ? `₹${(amount * liveRate.rate).toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : 'Live rate needed'}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="guides-section">
          <div className="section-heading left">
            <p>Guides</p>
            <h2>Understand the transfer before you make it</h2>
          </div>
          <div className="guide-grid">
            {guidePosts.length ? guidePosts.map((post) => (
              <article key={post.slug} className="guide-card hover-card" onPointerMove={updateCardLight}>
                <span>{post.categories[0] ?? 'Guide'}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt || 'Published from the CMS.'}</p>
                <a href="/guides">Read the guide <b>{'->'}</b></a>
              </article>
            )) : <EmptyContentCard message="No published guide posts yet. Publish from /admin and they will appear here." />}
          </div>
        </section>

        <section className="notes-section">
          <div className="notes-title">
            <h2>What's moving the rate</h2>
            <a href="/news">All market notes {'->'}</a>
          </div>
          <div className="notes-grid">
            {marketPosts.length ? marketPosts.map((post) => (
              <article key={post.slug} className="news-card hover-card" onPointerMove={updateCardLight}>
                <span>{post.publishedAt ? formatDate(post.publishedAt) : 'Published'}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt || 'Published from the CMS.'}</p>
              </article>
            )) : <EmptyContentCard message="No published market notes yet. Static market notes are disabled." />}
          </div>
        </section>

        <section className="faq-section">
          <div className="section-heading">
            <p>FAQ</p>
            <h2>Questions people actually ask us</h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index < 2}>
                <summary>{question}<span>{index < 2 ? 'x' : '+'}</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="newsletter">
          <h2>Watch GBP/INR without refreshing the chart all day</h2>
          <p>Email alerts are not connected yet, so this site is not collecting addresses until a real email provider is added.</p>
        </section>
      </main>

      <footer className="footer">
        <div>
          <a className="footer-brand" href="/">Pound<em>ToINR</em></a>
          <p>Independent GBP to INR exchange rate data, transfer research and plain-English finance explainers for people moving money between Britain and India.</p>
          <small>Mid-market reference rates are informational only. We are not a money-transfer provider and do not hold client funds.</small>
        </div>
        <div>
          <h3>Convert</h3>
          <a href="/gbp-to-inr">GBP to INR converter</a>
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
    </div>
  );
}

function EmptyContentCard({ message }: { message: string }) {
  return (
    <article className="guide-card empty-content-card">
      <span>CMS</span>
      <h3>Waiting for real content</h3>
      <p>{message}</p>
    </article>
  );
}

function isGuidePost(post: PublishedPost) {
  const tags = post.categories.map((category) => category.toLowerCase());
  return tags.some((tag) => tag.includes('guide') || tag.includes('transfer') || tag.includes('nri'));
}

function isMarketPost(post: PublishedPost) {
  const tags = post.categories.map((category) => category.toLowerCase());
  return tags.some((tag) => tag.includes('news') || tag.includes('market notes'));
}

function buildHistoryMetrics(points: RateSnapshot[]) {
  if (!points.length) {
    return { high: 'Not stored', low: 'Not stored' };
  }

  const rates = points.map((point) => point.rate);
  return {
    high: `₹${formatRate(Math.max(...rates))}`,
    low: `₹${formatRate(Math.min(...rates))}`,
  };
}

function buildSnapshotChart(points: RateSnapshot[]) {
  if (points.length < 2) return null;

  const width = 1010;
  const left = 70;
  const top = 45;
  const height = 235;
  const rates = points.map((point) => point.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;
  const coords = points.map((point, index) => {
    const x = left + (index / Math.max(points.length - 1, 1)) * width;
    const y = top + ((max - point.rate) / range) * height;
    return { x, y, point };
  });

  const line = coords.map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x.toFixed(1)} ${coord.y.toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1].x.toFixed(1)} 288 L${coords[0].x.toFixed(1)} 288 Z`;
  const labelIndexes = [0, Math.floor((points.length - 1) / 2), points.length - 1];

  return {
    area,
    labels: labelIndexes.map((index) => ({
      text: formatShortDate(coords[index].point.fetchedAt),
      x: coords[index].x.toFixed(0),
    })),
    line,
    yLabels: [max, min + range / 2, min].map((value) => formatRate(value)),
  };
}

function formatRate(rate: number) {
  return new Intl.NumberFormat('en-GB', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 2,
  }).format(rate);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    timeZoneName: 'short',
  }).format(new Date(value));
}

function normalizePath(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/converter') {
    return '/gbp-to-inr';
  }
  return path;
}
