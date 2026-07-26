import { supabase } from './supabaseClient';

export type PublishedPost = {
  categories: string[];
  createdAt: string;
  excerpt: string;
  featuredImageUrl: string | null;
  publishedAt: string | null;
  slug: string;
  title: string;
};

export type RateSnapshot = {
  fetchedAt: string;
  providerTimestamp: string | null;
  rate: number;
};

type PostRow = {
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
    categories: post.categories ?? [],
    createdAt: post.created_at,
    excerpt: post.excerpt ?? '',
    featuredImageUrl: post.featured_image_url,
    publishedAt: post.published_at,
    slug: post.slug,
    title: post.title,
  }));
}

export async function getRealRateSnapshots(limit = 90): Promise<RateSnapshot[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('exchange_rate_snapshots')
    .select('rate, fetched_at, provider_timestamp')
    .eq('base_currency', 'GBP')
    .eq('quote_currency', 'INR')
    .in('data_status', ['live', 'delayed', 'cached'])
    .order('fetched_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as SnapshotRow[])
    .map((point) => ({
      fetchedAt: point.fetched_at,
      providerTimestamp: point.provider_timestamp,
      rate: Number(point.rate),
    }))
    .filter((point) => Number.isFinite(point.rate) && point.rate > 0)
    .reverse();
}
