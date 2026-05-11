import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Звіти',
  description: 'Звіти про діяльність організації Місто Сили.',
};

interface Report {
  id: number;
  title: string;
  slug: string;
  preview: string;
  date_published: string;
  image: string | null;
}

async function getReports(): Promise<Report[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/reports/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const CARD_HEIGHT = 220;

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <section className="section">
      <div className="container">

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Звіти</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--charcoal)', maxWidth: '600px' }}>
            Звіти про діяльність, проекти та результати роботи організації.
          </p>
        </header>

        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--charcoal)' }}>
            <p style={{ fontSize: '1.25rem' }}>Звітів поки немає.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {reports.map((report, index) => (
              <li key={report.id}>
                <article
                  className="card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: report.image ? '280px 1fr' : '1fr',
                    height: `${CARD_HEIGHT}px`,
                    overflow: 'hidden',
                  }}
                >
                  {report.image && (
                    <Link
                      href={`/reports/${report.slug}`}
                      tabIndex={-1}
                      aria-hidden="true"
                      style={{ display: 'block', overflow: 'hidden', height: `${CARD_HEIGHT}px`, flexShrink: 0 }}
                    >
                      <Image
                        src={report.image}
                        alt={report.title}
                        width={280}
                        height={CARD_HEIGHT}
                        priority={index === 0}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        className="report-img"
                      />
                    </Link>
                  )}

                  <div style={{
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    overflow: 'hidden',
                    minWidth: 0,
                  }}>
                    <div>
                      {report.date_published && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Calendar size={14} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                          <time
                            dateTime={report.date_published}
                            style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                          >
                            {formatDate(report.date_published)}
                          </time>
                        </div>
                      )}

                      <h2 style={{
                        fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                        fontWeight: 700,
                        lineHeight: 1.3,
                        marginBottom: '0.625rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        <Link
                          href={`/reports/${report.slug}`}
                          style={{ color: 'var(--charcoal-dark)', textDecoration: 'none' }}
                          className="report-title-link"
                        >
                          {report.title}
                        </Link>
                      </h2>

                      <p style={{
                        fontSize: '0.95rem',
                        color: 'var(--charcoal)',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {report.preview}
                      </p>
                    </div>

                    <div>
                      <Link
                        href={`/reports/${report.slug}`}
                        className="btn-outline"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 1.125rem' }}
                      >
                        Читати далі
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        .report-img:hover { transform: scale(1.04); }
        .report-title-link:hover { color: var(--teal) !important; }

        @media (max-width: 640px) {
          article[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            height: auto !important;
          }
          article[style*="grid-template-columns"] a[style*="height"] {
            height: 180px !important;
          }
        }
      `}</style>
    </section>
  );
}