const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistosyly.org';
const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:8000';

const PLACEHOLDER_ALT_PATTERN = /^(?:foto|photo|image|img|pic|picture|placeholder|фото|зображення|знимка)(?:[-_\s]*\d+)?$/i;

export function siteUrl(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, SITE_URL).toString();
}

export function mediaUrl(path?: string | null): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/media/')) return new URL(path, API_URL).toString();
  return siteUrl(path);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export function excerptText(value: string, maxLength = 160): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function excerptFromHtml(html?: string | null, maxLength = 160): string {
  if (!html) return '';
  return excerptText(stripHtml(html), maxLength);
}

function normalizeAlt(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function resolveAltText(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    if (!value) continue;
    const normalized = normalizeAlt(value);
    if (!normalized) continue;
    if (PLACEHOLDER_ALT_PATTERN.test(normalized)) continue;
    return normalized;
  }
  return '';
}

export function buildBreadcrumbs(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: siteUrl(item.url),
    })),
  };
}

export function buildArticleSchema(params: {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string | null;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: params.headline,
    description: params.description,
    url: siteUrl(params.url),
    image: [params.image],
    datePublished: params.datePublished,
    dateModified: params.dateModified || params.datePublished,
    author: {
      '@type': 'Organization',
      name: params.authorName || 'Місто Сили',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Місто Сили',
      logo: {
        '@type': 'ImageObject',
        url: siteUrl('/images/logo.png'),
      },
    },
    mainEntityOfPage: siteUrl(params.url),
  };
}
