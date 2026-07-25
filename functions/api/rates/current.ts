type PagesFunctionContext = {
  request: Request;
  env: {
    EXCHANGE_RATE_API_KEY?: string;
    EXCHANGE_RATE_API_BASE_URL?: string;
    EXCHANGE_RATE_CACHE_TTL_SECONDS?: string;
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

    return json({
      base,
      quote,
      rate: providerPayload.conversion_rate,
      providerName: 'ExchangeRate-API',
      providerTimestamp: providerPayload.time_last_update_utc ?? fetchedAt,
      fetchedAt,
      status: 'delayed',
    }, 200, ttl);
  } catch {
    return json({ error: 'Exchange-rate request failed.' }, 502, ttl);
  }
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
