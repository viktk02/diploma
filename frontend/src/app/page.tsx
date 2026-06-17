import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { PageRenderer } from '@/components/PageRenderer';

interface PageData {
  key: string;
  title: string;
  meta_title: string;
  meta_description: string;
  sections: any[];
}

interface Report {
  id: number;
  title: string;
  slug: string;
  preview: string;
  date_published: string;
  image: string | null;
}

interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  image: string | null;
}

async function getPage(key: string): Promise<PageData | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/pages/${key}/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getLatestReports(): Promise<Report[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/reports/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch { return []; }
}

async function getLatestEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/events/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch { return []; }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage('home');
  return {
    title: page?.meta_title || 'Місто Сили',
    description: page?.meta_description || 'Громадська організація Місто Сили.',
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateParts(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('uk-UA', { day: 'numeric' }),
    month: date.toLocaleDateString('uk-UA', { month: 'long' }),
  };
}

export default async function HomePage() {
  const [page, reports, events] = await Promise.all([
    getPage('home'),
    getLatestReports(),
    getLatestEvents(),
  ]);

  return (
    <>
      <style>{`
        .home-link:hover { color: var(--teal) !important; }

        /* Звіти — десктоп: горизонтальні */
        .home-report-card {
          display: grid;
          grid-template-columns: 280px 1fr;
          height: 220px;
          overflow: hidden;
        }
        .home-report-card.no-image {
          grid-template-columns: 1fr;
          height: auto;
          min-height: 120px;
        }
        .home-report-photo {
          display: block;
          overflow: hidden;
          height: 220px;
          flex-shrink: 0;
          position: relative;
        }
        .home-report-photo img { transition: transform 0.4s ease; }
        .home-report-photo:hover img { transform: scale(1.04); }

        /* Звіти — мобільний: вертикальні */
        @media (max-width: 640px) {
          .home-report-card {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          .home-report-photo {
            height: 220px !important;
          }
        }
      `}</style>

      {page?.sections?.length ? (
        <PageRenderer sections={page.sections} />
      ) : (
        <section style={{
          background: 'linear-gradient(135deg, var(--charcoal-dark) 0%, #2a2a2a 60%, var(--teal-dark) 100%)',
          color: '#fff',
          padding: 'clamp(4rem, 10vw, 8rem) 0',
        }}>
          <div className="container">
            <div style={{ maxWidth: '700px' }}>
              <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                Місто <span style={{ color: 'var(--teal)' }}>Сили</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
                Громадська організація що об'єднує людей.
              </p>
              <Link href="/about" className="btn-primary">
                Про нас <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Останні звіти */}
      {reports.length > 0 && (
        <section className="section" style={{ background: 'var(--off-white)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Останні звіти</h2>
              <Link href="/reports" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal)', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Всі звіти <ArrowRight size={16} />
              </Link>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {reports.map((report, index) => (
                <li key={report.id}>
                  <article className={`card home-report-card${!report.image ? ' no-image' : ''}`}>
                    {report.image && (
                      <Link href={`/reports/${report.slug}`} tabIndex={-1} aria-hidden="true"
                            className="home-report-photo">
                        <Image
                          src={report.image}
                          alt={report.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 280px"
                          priority={index === 0}
                          style={{ objectFit: 'cover' }}
                        />
                      </Link>
                    )}
                    <div style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden', minWidth: 0 }}>
                      {report.date_published && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Calendar size={14} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                          <time style={{ fontSize: '1rem', color: 'var(--teal)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {formatDate(report.date_published)}
                          </time>
                        </div>
                      )}
                      <h3 style={{ fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.625rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        <Link href={`/reports/${report.slug}`} style={{ color: 'var(--charcoal-dark)', textDecoration: 'none' }} className="home-link">
                          {report.title}
                        </Link>
                      </h3>
                      <p style={{ fontSize: '1rem', color: 'var(--charcoal)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {report.preview}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Найближчі події */}
      {events.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Найближчі події</h2>
              <Link href="/events" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--teal)', fontWeight: 700, textDecoration: 'none', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Всі події <ArrowRight size={16} />
              </Link>
            </div>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
              {events.map((event, index) => {
                const dateParts = formatDateParts(event.date);
                return (
                  <li key={event.id} style={{ display: 'flex' }}>
                    <article className="card" style={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                      <Link href={`/events/${event.slug}`} tabIndex={-1} aria-hidden="true"
                            style={{ display: 'block', position: 'relative', flexShrink: 0, height: 200, overflow: 'hidden', background: 'var(--light-gray)' }}>
                        {event.image ? (
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 320px"
                            priority={index === 0}
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={48} style={{ color: 'var(--border)' }} />
                          </div>
                        )}
                        <div style={{
                          position: 'absolute', top: '1rem', left: '1rem',
                          background: 'var(--teal)', color: '#fff',
                          padding: '0.5rem 0.75rem', textAlign: 'center', minWidth: '52px',
                        }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{dateParts.day}</div>
                          <div style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dateParts.month.slice(0, 3)}</div>
                        </div>
                      </Link>
                      <div style={{ padding: '1.25rem', flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          <Link href={`/events/${event.slug}`} style={{ color: 'var(--charcoal-dark)', textDecoration: 'none' }} className="home-link">
                            {event.title}
                          </Link>
                        </h3>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}