import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { fixMediaUrls } from '@/lib/utils';

interface Report {
  id: number;
  title: string;
  slug: string;
  content: string;
  date_published: string;
  image: string | null;
}

async function getReport(slug: string): Promise<Report | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/reports/${slug}/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const report = await getReport(slug);
  if (!report) return { title: 'Звіт не знайдено' };
  return {
    title: report.title,
    openGraph: {
      title: report.title,
      images: report.image ? [report.image] : [],
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function ReportDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = await getReport(slug);
  if (!report) notFound();

  return (
    <article>
      <style>{`
        .report-content {
          font-family: var(--font-main);
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--charcoal);
        }
        .report-content h1, .report-content h2, .report-content h3 {
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 2rem 0 1rem;
        }
        .report-content h2 { font-size: 1.75rem; }
        .report-content h3 { font-size: 1.375rem; }
        .report-content p { margin-bottom: 1.25rem; }
        .report-content ul, .report-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .report-content li { margin-bottom: 0.5rem; }
        .report-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          display: block;
        }
        .report-content td, .report-content th {
          border: 1px solid var(--border);
          padding: 0.75rem 1rem;
          white-space: nowrap;
        }
        .report-content th {
          background: var(--off-white);
          font-weight: 700;
        }
        .report-content a { color: var(--teal); text-decoration: underline; }
        .report-content figure { margin: 2rem 0; text-align: center; }
        .report-content img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .report-content figcaption {
          font-size: 0.875rem;
          color: var(--charcoal);
          margin-top: 0.5rem;
          font-style: italic;
        }
        .report-content .image-style-align-left {
          float: left;
          margin: 0 1.5rem 1rem 0;
          max-width: 50%;
        }
        .report-content .image-style-align-right {
          float: right;
          margin: 0 0 1rem 1.5rem;
          max-width: 50%;
        }
        .report-content .image-style-align-center {
          margin: 1.5rem auto;
          display: block;
        }
        .report-content::after {
          content: '';
          display: table;
          clear: both;
        }
        .report-content blockquote {
          border-left: 4px solid var(--teal);
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background: var(--off-white);
          font-style: italic;
        }

        @media (max-width: 640px) {
          .report-content .image-style-align-left,
          .report-content .image-style-align-right {
            float: none;
            max-width: 100%;
            margin: 1rem 0;
          }
        }
      `}</style>

      {report.image && (
        <div style={{ position: 'relative', width: '100%', height: 'clamp(240px, 40vw, 480px)', overflow: 'hidden', background: 'var(--charcoal-dark)' }}>
          <Image
            src={report.image}
            alt={report.title}
            fill
            style={{ objectFit: 'cover', opacity: 0.85 }}
            priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(30,30,30,0.8) 100%)' }} />
          <div className="container" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2rem 1.5rem' }}>
            {report.date_published && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Calendar size={15} style={{ color: 'var(--teal-light)' }} />
                <time dateTime={report.date_published} style={{ fontSize: '0.9rem', color: 'var(--teal-light)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {formatDate(report.date_published)}
                </time>
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, maxWidth: '800px' }}>
              {report.title}
            </h1>
          </div>
        </div>
      )}

      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        {!report.image && (
          <header style={{ marginBottom: '2.5rem' }}>
            {report.date_published && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Calendar size={15} style={{ color: 'var(--teal)' }} />
                <time dateTime={report.date_published} style={{ fontSize: '0.9rem', color: 'var(--teal)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {formatDate(report.date_published)}
                </time>
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: 'var(--charcoal-dark)' }}>
              {report.title}
            </h1>
          </header>
        )}

        <div
          style={{ maxWidth: '800px' }}
          className="report-content"
          dangerouslySetInnerHTML={{ __html: fixMediaUrls(report.content) }}
        />

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', maxWidth: '800px' }}>
          <Link href="/reports" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            Усі звіти
          </Link>
        </div>
      </div>
    </article>
  );
}