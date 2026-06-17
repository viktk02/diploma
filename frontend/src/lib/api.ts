const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000';

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${normalized}`;
}

/** Події, звіти — без кешу, щоб зміни з адмінки були одразу на сайті. */
export function fetchLive(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), { ...init, cache: 'no-store' });
}

/** Сторінки, контакти — ISR з revalidate. */
export function fetchCached(path: string, revalidate = 300, init?: RequestInit) {
  return fetch(apiUrl(path), { ...init, next: { revalidate } });
}
