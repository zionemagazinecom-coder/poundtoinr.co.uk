type PagesFunctionContext = {
  request: Request;
  env: {
    EXCHANGE_RATE_API_KEY?: string;
    EXCHANGE_RATE_API_BASE_URL?: string;
    EXCHANGE_RATE_CACHE_TTL_SECONDS?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    SUPABASE_URL?: string;
    VITE_SUPABASE_URL?: string;
  };
};

const supportedCurrencies = new Set(['GBP', 'INR', 'USD', 'EUR', 'AED', 'CAD', 'AUD', 'SGD', 'NZD', 'CHF', 'JPY', 'PKR']);

export async function onRequestGet(context: PagesFunctionContext): Promise<Response> {
  const url = new URL(context.request.url);
  const base = normaliseCurrency(url.searchParams.get('base') ?? 'GBP');
  const quote = normaliseCurrency(url.searchParams.get('quote') ?? 'INR');
  const ttl = Number(context.env.EXCHANGE_RATE_CACHE_TTL_SECONDS ?? 3600);

  if (!base || !quote) {
    return json({ error: 'Unsupported currency pair.' }, 400, ttl);
  }

  const apiKey = context.env.EXCHANGE_RATE_API_KEY;
  if (!apiKey) {
    return json({ error: 'Exchange-rate API key is not configured.' }, 503, ttl);
  }

  const endpoint = `${context.env.EXCHANGE_RATE_API_BASE_URL ?? 'https://v6.exchangerate-api.com/v6'}/${apiKey}/pair/${base}/${quote}`;
  const fetchedAt = new Date().toISOString();

  try {
    const providerResponse = await fetch(endpoint, {
      headers: { accept: 'application/json' },
      cf: { cacheTtl: ttl, cacheEverything: true },
    });

    if (!providerResponse.ok) {
      return json({ error: 'Exchange-rate provider is unavailable.' }, 502, ttl);
    }

    const providerPayload = await providerResponse.json<Record<string, unknown>>();
    if (providerPayload.result !== 'success' || typeof providerPayload.conversion_rate !== 'number') {
      return json({ error: 'Exchange-rate provider returned an invalid response.' }, 502, ttl);
    }

    const payload = {
      base,
      quote,
      rate: providerPayload.conversion_rate,
      providerName: 'ExchangeRate-API',
      providerTimestamp: providerPayload.time_last_update_utc ?? fetchedAt,
      fetchedAt,
      status: 'delayed',
    };

    const snapshotSaved = await saveRateSnapshot(context.env, payload);

    return json({
      ...payload,
      snapshotSaved,
    }, 200, ttl);
  } catch {
    return json({ error: 'Exchange-rate request failed.' }, 502, ttl);
  }
}

async function saveRateSnapshot(
  env: PagesFunctionContext['env'],
  rate: {
    base: string;
    fetchedAt: string;
    providerName: string;
    providerTimestamp: unknown;
    quote: string;
    rate: number;
    status: 'delayed';
  },
): Promise<boolean> {
  const supabaseUrl = env.SUPABASE_URL ?? env.VITE_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return false;
  }

  const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/exchange_rate_snapshots`, {
    body: JSON.stringify({
      base_currency: rate.base,
      data_status: rate.status,
      fetched_at: rate.fetchedAt,
      provider_name: rate.providerName,
      provider_timestamp: parseProviderTimestamp(rate.providerTimestamp),
      quote_currency: rate.quote,
      rate: rate.rate,
    }),
    headers: {
      apikey: serviceRoleKey,
      authorization: `Bearer ${serviceRoleKey}`,
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    method: 'POST',
  });

  return response.ok;
}

function parseProviderTimestamp(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function normaliseCurrency(value: string): string | null {
  const code = value.toUpperCase();
  return supportedCurrencies.has(code) ? code : null;
}

function json(body: unknown, status: number, ttl: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? `public, max-age=${ttl}` : 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
