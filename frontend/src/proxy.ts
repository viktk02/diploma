import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  buildRedirectLookup,
  resolveRedirect,
  toRedirectUrl,
  type RedirectRule,
} from '@/lib/redirects';

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://127.0.0.1:8000';

let cachedLookup: ReturnType<typeof buildRedirectLookup> | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 60_000;

async function getRedirectLookup() {
  const now = Date.now();
  if (cachedLookup && now < cacheExpiresAt) {
    return cachedLookup;
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/redirects/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return cachedLookup ?? new Map();
    const rules = (await res.json()) as RedirectRule[];
    cachedLookup = buildRedirectLookup(rules);
    cacheExpiresAt = now + CACHE_TTL_MS;
    return cachedLookup;
  } catch {
    return cachedLookup ?? new Map();
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lookup = await getRedirectLookup();
  const hit = resolveRedirect(pathname, lookup);

  if (!hit) {
    return NextResponse.next();
  }

  const destination = toRedirectUrl(hit.to_url, request.nextUrl.origin);
  return NextResponse.redirect(destination, hit.status_code);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
