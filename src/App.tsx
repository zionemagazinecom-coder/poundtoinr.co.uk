import { BarChart3, BriefcaseBusiness, GraduationCap, Plane, ShieldCheck, Wallet, WalletCards, type LucideIcon } from 'lucide-react';
import { useMemo, useState, type PointerEvent } from 'react';
import { AdminAuthGate, AdminAuthPage } from './AdminAuthGate';
import { AdminEditor } from './AdminEditor';
import { Converter } from './components/Converter';
import { SeoRoutePage, buildHomeSchema, homeSeo, seoPages, usePageSeo } from './SeoContent';

const stats = [
  ['Live rate', '128.66'],
  ['Years of history', '5'],
  ['Cost to use', 'Free'],
];

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

const notes = [
  ['This week', 'Sterling holds its range as UK inflation cools', 'Softer services inflation trimmed rate-cut expectations only slightly, leaving GBP/INR inside the band it has traded for most of the quarter.'],
  ['This month', 'RBI intervention keeps rupee volatility unusually low', 'Reserve Bank dollar sales around key levels have smoothed intraday swings, which shows up as flat stretches on the chart above.'],
  ['Ongoing', 'Remittance corridors get cheaper as digital providers scale', 'Average UK-India transfer costs continue to drift below the global average, though bank wire pricing has barely moved.'],
];

const guideCards = [
  ['Transfers', 'What a 3% margin really costs on a GBP2,000 transfer', 'Fee tables hide the real price. Here is how to work out the true cost of a transfer in under a minute, using nothing but the mid-market rate.'],
  ['NRI banking', 'NRE vs NRO accounts: which one should receive your pounds?', 'One is freely repatriable and tax-free on interest, the other is not. Choosing wrongly is expensive and annoying to unwind.'],
  ['Markets', 'Why the rupee moves when oil moves', 'India imports most of its crude. When Brent climbs, the import bill climbs with it, and the rupee usually softens against the pound.'],
];

const faqs = [
  ['What is the GBP to INR exchange rate today?', 'The figure at the top of this page is an indicative mid-market reference rate. Your bank or transfer provider may quote a different rate.'],
  ['Why is the rate my bank offers lower than the one shown here?', 'Banks and transfer companies usually add a margin to the mid-market rate, and some also add a flat fee on top.'],
  ['When is the best time to send money from the UK to India?', 'There is no guaranteed best moment. Compare the provider quote, visible fee and total rupees received before sending.'],
  ['How much money can I send from the UK to India?', 'Limits depend on your provider, payment method, identity checks and receiving account. Always confirm with your chosen provider.'],
];

const chartRanges = {
  '1M': {
    change: '+3.57%',
    high: 'Rs130.18',
    low: 'Rs124.22',
    markerDate: '2026-07-16',
    markerRate: 'Rs130.180',
    labels: [['80', '26 Jun'], ['250', '30 Jun'], ['390', '2 Jul'], ['540', '8 Jul'], ['690', '10 Jul'], ['830', '16 Jul'], ['970', '20 Jul'], ['1080', '24 Jul']],
    points: [
      { x: 58, y: 245, date: '2026-06-24', rate: 'Rs124.940' },
      { x: 164, y: 214, date: '2026-06-30', rate: 'Rs126.020' },
      { x: 284, y: 176, date: '2026-07-02', rate: 'Rs127.540' },
      { x: 530, y: 154, date: '2026-07-08', rate: 'Rs128.410' },
      { x: 718, y: 126, date: '2026-07-14', rate: 'Rs129.120' },
      { x: 824, y: 78, date: '2026-07-16', rate: 'Rs130.180' },
      { x: 942, y: 104, date: '2026-07-20', rate: 'Rs129.420' },
      { x: 1068, y: 134, date: '2026-07-24', rate: 'Rs128.660' },
    ],
    area: 'M58 245 L112 220 L164 214 L222 210 L284 176 L354 164 L420 160 L475 164 L530 154 L590 148 L660 146 L718 126 L770 120 L824 78 L878 112 L942 104 L996 122 L1068 134 L1068 288 L58 288 Z',
    line: 'M58 245 L112 220 L164 214 L222 210 L284 176 L354 164 L420 160 L475 164 L530 154 L590 148 L660 146 L718 126 L770 120 L824 78 L878 112 L942 104 L996 122 L1068 134',
    markerX: 824,
    markerY: 78,
  },
  '3M': {
    change: '+1.17%',
    high: 'Rs130.18',
    low: 'Rs124.22',
    markerDate: '2026-07-13',
    markerRate: 'Rs128.020',
    labels: [['70', '24 Apr'], ['158', '4 May'], ['258', '11 May'], ['386', '18 May'], ['500', '1 Jun'], ['620', '11 Jun'], ['742', '18 Jun'], ['820', '25 Jun'], ['914', '7 Jul'], ['1038', '17 Jul'], ['1080', '24 Jul']],
    points: [
      { x: 58, y: 174, date: '2026-04-24', rate: 'Rs127.420' },
      { x: 146, y: 124, date: '2026-05-04', rate: 'Rs128.760' },
      { x: 268, y: 73, date: '2026-05-11', rate: 'Rs130.020' },
      { x: 407, y: 76, date: '2026-05-18', rate: 'Rs129.940' },
      { x: 552, y: 96, date: '2026-06-01', rate: 'Rs129.120' },
      { x: 688, y: 194, date: '2026-06-11', rate: 'Rs126.180' },
      { x: 744, y: 252, date: '2026-06-19', rate: 'Rs124.830' },
      { x: 820, y: 272, date: '2026-06-25', rate: 'Rs124.220' },
      { x: 938, y: 170, date: '2026-07-09', rate: 'Rs127.780' },
      { x: 1012, y: 119, date: '2026-07-13', rate: 'Rs128.020' },
      { x: 1084, y: 72, date: '2026-07-24', rate: 'Rs128.660' },
    ],
    area: 'M58 174 L86 144 L112 158 L146 124 L204 108 L234 120 L268 73 L305 91 L338 84 L356 133 L407 76 L435 116 L466 100 L516 127 L552 96 L582 170 L618 176 L654 162 L688 194 L730 207 L744 252 L775 239 L820 272 L862 238 L902 224 L938 170 L980 151 L1012 119 L1036 60 L1062 88 L1084 72 L1084 288 L58 288 Z',
    line: 'M58 174 L86 144 L112 158 L146 124 L204 108 L234 120 L268 73 L305 91 L338 84 L356 133 L407 76 L435 116 L466 100 L516 127 L552 96 L582 170 L618 176 L654 162 L688 194 L730 207 L744 252 L775 239 L820 272 L862 238 L902 224 L938 170 L980 151 L1012 119 L1036 60 L1062 88 L1084 72',
    markerX: 938,
    markerY: 170,
  },
  '6M': {
    change: '+5.19%',
    high: 'Rs130.18',
    low: 'Rs122.31',
    markerDate: '2026-05-13',
    markerRate: 'Rs129.440',
    labels: [['78', '29 Jan'], ['188', '11 Feb'], ['300', '24 Feb'], ['420', '9 Mar'], ['520', '2 Apr'], ['620', '16 Apr'], ['740', '13 May'], ['858', '26 May'], ['944', '19 Jun'], ['1080', '24 Jul']],
    points: [
      { x: 58, y: 258, date: '2026-01-24', rate: 'Rs122.310' },
      { x: 96, y: 126, date: '2026-02-09', rate: 'Rs123.940' },
      { x: 206, y: 246, date: '2026-02-18', rate: 'Rs124.560' },
      { x: 354, y: 236, date: '2026-03-09', rate: 'Rs124.880' },
      { x: 476, y: 140, date: '2026-03-28', rate: 'Rs126.700' },
      { x: 572, y: 120, date: '2026-04-16', rate: 'Rs127.520' },
      { x: 690, y: 82, date: '2026-05-13', rate: 'Rs129.440' },
      { x: 806, y: 124, date: '2026-05-26', rate: 'Rs128.720' },
      { x: 950, y: 235, date: '2026-06-19', rate: 'Rs124.900' },
      { x: 1086, y: 112, date: '2026-07-24', rate: 'Rs128.660' },
    ],
    area: 'M58 258 L78 184 L96 126 L118 252 L152 226 L206 246 L272 238 L324 242 L354 236 L420 160 L476 140 L512 230 L572 120 L628 158 L690 82 L742 96 L806 124 L858 108 L922 172 L950 235 L984 216 L1018 142 L1064 76 L1086 112 L1086 288 L58 288 Z',
    line: 'M58 258 L78 184 L96 126 L118 252 L152 226 L206 246 L272 238 L324 242 L354 236 L420 160 L476 140 L512 230 L572 120 L628 158 L690 82 L742 96 L806 124 L858 108 L922 172 L950 235 L984 216 L1018 142 L1064 76 L1086 112',
    markerX: 690,
    markerY: 82,
  },
  '1Y': {
    change: '+7.84%',
    high: 'Rs131.05',
    low: 'Rs119.86',
    markerDate: '2026-03-04',
    markerRate: 'Rs126.420',
    labels: [['58', 'Aug'], ['205', 'Oct'], ['350', 'Dec'], ['505', 'Mar'], ['650', 'Apr'], ['780', 'May'], ['910', 'Jun'], ['1086', 'Jul']],
    points: [
      { x: 58, y: 270, date: '2025-08-01', rate: 'Rs119.860' },
      { x: 205, y: 232, date: '2025-10-09', rate: 'Rs122.780' },
      { x: 350, y: 188, date: '2025-12-12', rate: 'Rs124.910' },
      { x: 505, y: 168, date: '2026-03-04', rate: 'Rs126.420' },
      { x: 650, y: 162, date: '2026-04-21', rate: 'Rs127.010' },
      { x: 780, y: 78, date: '2026-05-19', rate: 'Rs131.050' },
      { x: 910, y: 104, date: '2026-06-18', rate: 'Rs129.620' },
      { x: 1086, y: 112, date: '2026-07-24', rate: 'Rs128.660' },
    ],
    area: 'M58 270 L130 246 L205 232 L276 220 L350 188 L420 208 L505 168 L584 132 L650 162 L718 118 L780 78 L842 126 L910 104 L980 80 L1086 112 L1086 288 L58 288 Z',
    line: 'M58 270 L130 246 L205 232 L276 220 L350 188 L420 208 L505 168 L584 132 L650 162 L718 118 L780 78 L842 126 L910 104 L980 80 L1086 112',
    markerX: 505,
    markerY: 168,
  },
  '5Y': {
    change: '+18.42%',
    high: 'Rs131.05',
    low: 'Rs94.12',
    markerDate: '2024-11-21',
    markerRate: 'Rs105.760',
    labels: [['58', '2021'], ['220', '2022'], ['392', '2023'], ['562', '2024'], ['736', '2025'], ['908', '2026'], ['1086', 'Jul']],
    points: [
      { x: 58, y: 276, date: '2021-07-24', rate: 'Rs94.120' },
      { x: 220, y: 248, date: '2022-07-24', rate: 'Rs98.650' },
      { x: 392, y: 210, date: '2023-07-24', rate: 'Rs103.420' },
      { x: 478, y: 190, date: '2024-11-21', rate: 'Rs105.760' },
      { x: 650, y: 150, date: '2025-07-24', rate: 'Rs114.820' },
      { x: 820, y: 142, date: '2026-02-24', rate: 'Rs119.300' },
      { x: 994, y: 92, date: '2026-06-24', rate: 'Rs127.990' },
      { x: 1086, y: 68, date: '2026-07-24', rate: 'Rs128.660' },
    ],
    area: 'M58 276 L140 258 L220 248 L306 230 L392 210 L478 190 L562 172 L650 150 L736 126 L820 142 L908 104 L994 92 L1086 68 L1086 288 L58 288 Z',
    line: 'M58 276 L140 258 L220 248 L306 230 L392 210 L478 190 L562 172 L650 150 L736 126 L820 142 L908 104 L994 92 L1086 68',
    markerX: 478,
    markerY: 190,
  },
} as const;

type ChartRange = keyof typeof chartRanges;

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

  const [selectedRange, setSelectedRange] = useState<ChartRange>('3M');
  const [hoverIndex, setHoverIndex] = useState(8);
  const activeChart = useMemo(() => chartRanges[selectedRange], [selectedRange]);
  const activePoint = activeChart.points[Math.min(hoverIndex, activeChart.points.length - 1)];

  function selectRange(range: ChartRange) {
    setSelectedRange(range);
    setHoverIndex(Math.max(0, Math.floor(chartRanges[range].points.length * 0.75)));
  }

  function updateChartHover(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 1100;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    activeChart.points.forEach((point, index) => {
      const distance = Math.abs(point.x - x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setHoverIndex(closestIndex);
  }

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
              <p className="rate-pill"><i /> Updated 2026-07-24 - mid-market reference rate</p>
              <h1>Convert British Pounds to <span>Indian Rupees</span> instantly</h1>
              <p className="hero-text">
                One pound is worth <strong>{'\u20b9'}128.66</strong> on the mid-market today. See what your transfer is actually worth, how the rate has moved over five years, and where providers quietly take their cut.
              </p>
              <div className="hero-actions">
                <a className="primary-btn" href="#converter">Convert an amount <span>{' ->'}</span></a>
                <a className="ghost-btn" href="#chart">View the 5-year chart</a>
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
                <p>Daily closes from the European Central Bank reference series.</p>
              </div>
              <div className="range-tabs" aria-label="Chart range">
                {(Object.keys(chartRanges) as ChartRange[]).map((range) => (
                  <button
                    className={selectedRange === range ? 'active' : ''}
                    key={range}
                    type="button"
                    onClick={() => selectRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="history-metrics">
              <div><span>Period change</span><strong>{activeChart.change}</strong></div>
              <div><span>Period high</span><strong>{activeChart.high}</strong></div>
              <div><span>Period low</span><strong>{activeChart.low}</strong></div>
            </div>
            <svg
              viewBox="0 0 1100 330"
              role="img"
              aria-label="GBP to INR reference rate line chart preview"
              onPointerMove={updateChartHover}
              onPointerLeave={() => setHoverIndex(activeChart.points.length - 2)}
            >
              <defs>
                <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2ee6bd" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#2ee6bd" stopOpacity="0" />
                </linearGradient>
              </defs>
              <g className="axis-labels">
                <text x="18" y="70">130.78</text>
                <text x="18" y="150">127.62</text>
                <text x="18" y="230">123.62</text>
              </g>
              <path className="gridline" d="M70 70 H1080 M70 150 H1080 M70 230 H1080" />
              <path className="chart-area" d={activeChart.area} />
              <path className="chart-line" d={activeChart.line} />
              <line className="hover-line" x1={activePoint.x} y1="32" x2={activePoint.x} y2="286" />
              <circle cx={activePoint.x} cy={activePoint.y} r="6" />
              <g className="tooltip">
                <rect x={tooltipPosition(activePoint.x).rectX} y={Math.max(activePoint.y - 82, 28)} width="142" height="66" rx="12" />
                <text x={tooltipPosition(activePoint.x).textX} y={Math.max(activePoint.y - 56, 54)}>{activePoint.date}</text>
                <text x={tooltipPosition(activePoint.x).textX} y={Math.max(activePoint.y - 32, 78)}>1 GBP: {activePoint.rate}</text>
              </g>
              <g className="x-axis-labels">
                {activeChart.labels.map(([x, label]) => (
                  <text key={`${selectedRange}-${x}-${label}`} x={x} y="318">{label}</text>
                ))}
              </g>
              <rect className="chart-hit-area" x="55" y="30" width="1035" height="292" />
            </svg>
            <div className="chart-footer">
              <span>Reference rate, not a guaranteed provider quote</span>
              <button type="button">Download CSV</button>
              <button type="button">Print chart</button>
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
            {[1, 10, 50, 100, 500, 1000].map((amount) => (
              <article key={amount} className="hover-card" onPointerMove={updateCardLight}>
                <span>{'\u00a3'}{amount.toLocaleString('en-GB')}</span>
                <strong>{'\u20b9'}{(amount * 128.66).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong>
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
            {guideCards.map(([category, title, body]) => (
              <article key={title} className="guide-card hover-card" onPointerMove={updateCardLight}>
                <span>{category}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <a href="/guides">Read the guide <b>{'->'}</b></a>
              </article>
            ))}
          </div>
        </section>

        <section className="notes-section">
          <div className="notes-title">
            <h2>What's moving the rate</h2>
            <a href="/news">All market notes {'->'}</a>
          </div>
          <div className="notes-grid">
            {notes.map(([kicker, title, body]) => (
              <article key={title} className="news-card hover-card" onPointerMove={updateCardLight}>
                <span>{kicker}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
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
          <p>Get rate alerts and plain-English currency notes when email delivery is configured.</p>
          <form>
            <input placeholder="you@example.com" aria-label="Email address" />
            <button type="button">Subscribe</button>
          </form>
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

function tooltipPosition(x: number) {
  if (x > 910) {
    return { rectX: x - 166, textX: x - 150 };
  }
  return { rectX: x + 24, textX: x + 40 };
}

function normalizePath(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/converter') {
    return '/gbp-to-inr';
  }
  return path;
}
