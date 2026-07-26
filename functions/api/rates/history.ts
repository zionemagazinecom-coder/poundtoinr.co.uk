type PagesFunctionContext = {
  env: {
    SUPABASE_PUBLISHABLE_KEY?: string;
    SUPABASE_URL?: string;
    VITE_SUPABASE_PUBLISHABLE_KEY?: string;
    VITE_SUPABASE_URL?: string;
  };
};

export async function onRequestGet(context: PagesFunctionContext): Promise<Response> {
  const supabaseUrl = context.env.SUPABASE_URL ?? context.env.VITE_SUPABASE_URL;
  const publishableKey = context.env.SUPABASE_PUBLISHABLE_KEY ?? context.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return json({ snapshots: [] }, 200);
  }

  const params = new URLSearchParams({
    base_currency: 'eq.GBP',
    data_status: 'in.(live,delayed,cached)',
    limit: '90',
    order: 'fetched_at.desc',
    quote_currency: 'eq.INR',
    select: 'rate,fetched_at,provider_timestamp',
  });

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/exchange_rate_snapshots?${params}`, {
      headers: {
        apikey: publishableKey,
        authorization: `Bearer ${publishableKey}`,
      },
    });

    if (!response.ok) {
      return json({ snapshots: [] }, 200);
    }

    const snapshots = await response.json();
    return json({ snapshots }, 200);
  } catch {
    return json({ snapshots: [] }, 200);
  }
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    headers: {
      'cache-control': 'public, max-age=300',
      'content-type': 'application/json; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
    status,
  });
}
