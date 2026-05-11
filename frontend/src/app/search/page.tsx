import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, FileText, Layout, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Пошук',
  description: 'Пошук по сайту організації Місто Сили.',
  robots: 'noindex',
};

interface SearchResult {
  type: 'report' | 'event' | 'page';
  id: number;
  title: string;
  slug?: string;
  key?: string;
  preview?: string;
  description?: string;
  meta_description?: string;
  date_published?: string;
  date?: string;
  image?: string | null;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  error?: string;
}

async function search(query: string, type?: string): Promise<SearchResponse> {
  if (!query || query.length < 2) {
    return { query, results: [], total: 0 };
  }
  try {
    const params = new URLSearchParams({ q: query });
    if (type) params.set('type', type);
    const res = await fetch(
      `${process.env.API_URL}/api/v1/search/?${params}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { query, results: [], total: 0 };
    return res.json();
  } catch {
    return { query, results: [], total: 0 };
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function getResultHref(result: SearchResult): string {
  if (result.type === 'report') return `/reports/${result.slug}`;
  if (result.type === 'event')  return `/events/${result.slug}`;
  if (result.type === 'page')   return `/${result.key}`;
  return '/';
}

function getResultDate(result: SearchResult): string | null {
  if (result.date_published) return formatDate(result.date_published);
  if (result.date)           return formatDate(result.date);
  return null;
}

function getResultPreview(result: SearchResult): string {
  return result.preview || result.description || result.meta_description || '';
}

function TypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; color: string; Icon: React.ComponentType<{ size?: number }> }> = {
    report: { label: 'Звіт',     color: 'var(--teal)',     Icon: FileText },
    event:  { label: 'Подія',    color: 'var(--red)',      Icon: Calendar },
    page:   { label: 'Сторінка', color: 'var(--charcoal)', Icon: Layout },
  };
  const c = config[type] || config.page;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.625rem',
      background: c.color, color: '#fff',
      fontSize: '0.75rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.05em',
      flexShrink: 0,
    }}>
      <c.Icon size={11} />
      {c.label}
    </span>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q = '', type } = await searchParams;
  const data = await search(q, type);

  const FILTER_TYPES = [
    { value: '',       label: 'Все' },
    { value: 'report', label: 'Звіти' },
    { value: 'event',  label: 'Події' },
    { value: 'page',   label: 'Сторінки' },
  ];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: '1200px' }}>

        <header style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">Пошук</h1>
        </header>

        <form method="get" action="/search" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--charcoal)', pointerEvents: 'none' }} />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Введіть запит..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  fontSize: '1.125rem',
                  fontFamily: 'var(--font-main)',
                  border: '2px solid var(--border)',
                  outline: 'none',
                  color: 'var(--charcoal-dark)',
                  background: '#fff',
                  boxSizing: 'border-box',
                }}
              />
              {type && <input type="hidden" name="type" value={type} />}
            </div>
            <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Шукати
            </button>
          </div>
        </form>

        {q && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {FILTER_TYPES.map(f => {
              const isActive = type === f.value || (!type && !f.value);
              return (
                <Link
                  key={f.value}
                  href={f.value ? `/search?q=${encodeURIComponent(q)}&type=${f.value}` : `/search?q=${encodeURIComponent(q)}`}
                  style={{
                    padding: '0.375rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-main)',
                    textDecoration: 'none',
                    border: '2px solid',
                    borderColor: isActive ? 'var(--teal)' : 'var(--border)',
                    color: isActive ? 'var(--teal)' : 'var(--charcoal)',
                    background: isActive ? 'rgba(78,153,128,0.08)' : 'transparent',
                  }}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        )}

        {q.length < 2 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--charcoal)' }}>
            <Search size={48} style={{ color: 'var(--border)', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.125rem' }}>Введіть мінімум 2 символи для пошуку.</p>
          </div>
        ) : data.total === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--charcoal-dark)' }}>
              Нічого не знайдено
            </p>
            <p style={{ fontSize: '1rem', color: 'var(--charcoal)' }}>
              За запитом «{q}» результатів немає. Спробуйте інші слова.
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.95rem', color: 'var(--charcoal)', marginBottom: '1.5rem' }}>
              Знайдено <strong>{data.total}</strong> результат{data.total === 1 ? '' : data.total < 5 ? 'и' : 'ів'} за запитом «{q}»
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.results.map((result) => {
                const href    = getResultHref(result);
                const date    = getResultDate(result);
                const preview = getResultPreview(result);

                return (
                  <li key={`${result.type}-${result.id}`}>
                    <article className="card" style={{
                      display: 'grid',
                      gridTemplateColumns: result.image ? '200px 1fr' : '1fr',
                      overflow: 'hidden',
                      alignItems: 'stretch',
                    }}>
                      {result.image && (
                        <Link href={href} tabIndex={-1} aria-hidden="true"
                              style={{ display: 'block', position: 'relative', overflow: 'hidden', minHeight: '100px' }}>
                          <Image src={result.image} alt={result.title} fill
                                 sizes="200px" style={{ objectFit: 'cover' }} />
                        </Link>
                      )}
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                          <TypeBadge type={result.type} />
                          {date && (
                            <time style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 500 }}>
                              {date}
                            </time>
                          )}
                        </div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
                          <Link href={href} style={{ color: 'var(--charcoal-dark)', textDecoration: 'none' }} className="search-link">
                            {result.title}
                          </Link>
                        </h2>
                        {preview && (
                          <p style={{ fontSize: '0.95rem', color: 'var(--charcoal)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                            {preview}
                          </p>
                        )}
                        <Link href={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--teal)', fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 'auto' }}
                              className="search-more">
                          Перейти <ArrowRight size={13} />
                        </Link>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      <style>{`
        .search-link:hover { color: var(--teal) !important; }
        .search-more:hover { color: var(--teal-dark) !important; }
        @media (max-width: 640px) {
          article[style*="120px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}