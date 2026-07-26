import { publicSupabasePublishableKey, publicSupabaseUrl, supabase } from './supabaseClient';

export type PublishedPost = {
  blocks?: PublishedPostBlock[];
  categories: string[];
  createdAt: string;
  excerpt: string;
  featuredImageUrl: string | null;
  publishedAt: string | null;
  slug: string;
  title: string;
};

export type PublishedPostBlock = {
  alt?: string;
  code?: string;
  html?: string;
  id: string;
  type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'list' | 'image' | 'html';
  url?: string;
};

export type RateSnapshot = {
  fetchedAt: string;
  providerTimestamp: string | null;
  rate: number;
};

type PostRow = {
  blocks?: PublishedPostBlock[] | null;
  categories: string[] | null;
  created_at: string;
  excerpt: string | null;
  featured_image_url: string | null;
  published_at: string | null;
  slug: string;
  title: string;
};

type SnapshotRow = {
  fetched_at: string;
  provider_timestamp: string | null;
  rate: number | string;
};

export async function getPublishedPosts(limit = 12): Promise<PublishedPost[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('posts')
    .select('title, slug, excerpt, categories, featured_image_url, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as PostRow[]).map((post) => ({
    blocks: post.blocks ?? undefined,
    categories: post.categories ?? [],
    createdAt: post.created_at,
    excerpt: post.excerpt ?? '',
    featuredImageUrl: post.featured_image_url,
    publishedAt: post.published_at,
    slug: post.slug,
    title: post.title,
  }));
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('posts')
    .select('title, slug, excerpt, categories, featured_image_url, published_at, created_at, blocks')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !data) return null;

  const post = data as PostRow;
  return {
    blocks: post.blocks ?? [],
    categories: post.categories ?? [],
    createdAt: post.created_at,
    excerpt: post.excerpt ?? '',
    featuredImageUrl: post.featured_image_url,
    publishedAt: post.published_at,
    slug: post.slug,
    title: post.title,
  };
}

export async function getRealRateSnapshots(limit = 90): Promise<RateSnapshot[]> {
  const serverSnapshots = await getRateSnapshotsViaServer();
  if (serverSnapshots.length) return serverSnapshots;

  if (!supabase) return getRateSnapshotsViaRest(limit);

  const { data, error } = await supabase
    .from('exchange_rate_snapshots')
    .select('rate, fetched_at, provider_timestamp')
    .eq('base_currency', 'GBP')
    .eq('quote_currency', 'INR')
    .in('data_status', ['live', 'delayed', 'cached'])
    .order('fetched_at', { ascending: false })
    .limit(limit);

  if (error || !data) return getRateSnapshotsViaRest(limit);

  const snapshots = mapSnapshotRows(data as SnapshotRow[]);
  return snapshots.length ? snapshots : getRateSnapshotsViaRest(limit);
}

async function getRateSnapshotsViaServer(): Promise<RateSnapshot[]> {
  try {
    const response = await fetch('/api/rates/history', {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return [];

    const payload = await response.json() as { snapshots?: SnapshotRow[] };
    return mapSnapshotRows(payload.snapshots ?? []);
  } catch {
    return [];
  }
}

async function getRateSnapshotsViaRest(limit: number): Promise<RateSnapshot[]> {
  if (!publicSupabaseUrl || !publicSupabasePublishableKey) return [];

  const params = new URLSearchParams({
    base_currency: 'eq.GBP',
    data_status: 'in.(live,delayed,cached)',
    limit: String(limit),
    order: 'fetched_at.desc',
    quote_currency: 'eq.INR',
    select: 'rate,fetched_at,provider_timestamp',
  });

  try {
    const response = await fetch(`${publicSupabaseUrl.replace(/\/+$/, '')}/rest/v1/exchange_rate_snapshots?${params}`, {
      headers: {
        apikey: publicSupabasePublishableKey,
        authorization: `Bearer ${publicSupabasePublishableKey}`,
      },
    });

    if (!response.ok) return [];
    return mapSnapshotRows(await response.json() as SnapshotRow[]);
  } catch {
    return [];
  }
}

function mapSnapshotRows(rows: SnapshotRow[]): RateSnapshot[] {
  return rows
    .map((point) => ({
      fetchedAt: point.fetched_at,
      providerTimestamp: point.provider_timestamp,
      rate: Number(point.rate),
    }))
    .filter((point) => Number.isFinite(point.rate) && point.rate > 0)
    .reverse();
}
