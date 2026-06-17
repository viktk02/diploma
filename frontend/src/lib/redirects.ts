export interface RedirectRule {
  from_path: string;
  to_url: string;
  status_code: number;
}

export type RedirectLookup = Map<string, { to_url: string; status_code: number }>;

function pathVariants(path: string): string[] {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const variants = new Set([normalized]);
  if (normalized.length > 1 && normalized.endsWith('/')) {
    variants.add(normalized.slice(0, -1));
  } else {
    variants.add(`${normalized}/`);
  }
  return [...variants];
}

export function buildRedirectLookup(rules: RedirectRule[]): RedirectLookup {
  const lookup: RedirectLookup = new Map();
  for (const rule of rules) {
    const target = { to_url: rule.to_url, status_code: rule.status_code };
    for (const variant of pathVariants(rule.from_path)) {
      lookup.set(variant, target);
    }
  }
  return lookup;
}

export function resolveRedirect(
  pathname: string,
  lookup: RedirectLookup,
): { to_url: string; status_code: number } | null {
  for (const candidate of pathVariants(pathname)) {
    const hit = lookup.get(candidate);
    if (hit) return hit;
  }
  return null;
}

export function toRedirectUrl(toUrl: string, origin: string): string {
  if (/^https?:\/\//i.test(toUrl)) return toUrl;
  return new URL(toUrl.startsWith('/') ? toUrl : `/${toUrl}`, origin).toString();
}
