import type { MetadataRoute } from 'next';
import { apiUrl } from '@/lib/api';
import { siteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const RESERVED_KEYS = new Set(['home', 'reports', 'events', 'contacts', 'pages', 'api', 'admin', 'auth', 'search']);

interface PageItem {
  key: string;
  updated_at?: string;
}

interface ReportItem {
  slug: string;
  date_published?: string;
}

interface EventItem {
  slug: string;
  date?: string;
}

async function fetchList<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(apiUrl(path), { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, reports, events] = await Promise.all([
    fetchList<PageItem>('/api/v1/pages/'),
    fetchList<ReportItem>('/api/v1/reports/'),
    fetchList<EventItem>('/api/v1/events/'),
  ]);

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl('/'),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: siteUrl('/contacts'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: siteUrl('/reports'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: siteUrl('/events'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  for (const page of pages) {
    if (!page.key || RESERVED_KEYS.has(page.key)) continue;
    entries.push({
      url: siteUrl(`/${page.key}`),
      lastModified: page.updated_at ? new Date(page.updated_at) : undefined,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const report of reports) {
    if (!report.slug) continue;
    entries.push({
      url: siteUrl(`/reports/${report.slug}`),
      lastModified: report.date_published ? new Date(report.date_published) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  for (const event of events) {
    if (!event.slug) continue;
    entries.push({
      url: siteUrl(`/events/${event.slug}`),
      lastModified: event.date ? new Date(event.date) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
