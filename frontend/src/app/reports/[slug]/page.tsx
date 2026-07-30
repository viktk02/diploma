import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import { fetchLive } from '@/lib/api';
import { fixMediaUrls } from '@/lib/utils';
import ContentRenderer from '@/components/ContentRenderer';
import { buildArticleSchema, buildBreadcrumbs, excerptFromHtml, mediaUrl, siteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

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
    const res = await fetchLive(`/api/v1/reports/${slug}/`);
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
  const description = excerptFromHtml(report.content) || report.title;
  const image = mediaUrl(report.image) || siteUrl('/images/logo.png');
  const url = siteUrl(`/reports/${slug}`);
  return {
    title: report.title,
    description,
    alternates: {
      canonical: `/reports/${slug}`,
    },
    openGraph: {
      title: report.title,
      description,
      url,
      type: 'article',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      images: [image],
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
  const description = excerptFromHtml(report.content) || report.title;
  const image = mediaUrl(report.image) || siteUrl('/images/logo.png');
  const articleSchema = buildArticleSchema({
    headline: report.title,
    description,
    url: `/reports/${slug}`,
    image,
    datePublished: report.date_published,
    dateModified: report.date_published,
    authorName: 'Місто Сили',
  });
  const breadcrumbSchema = buildBreadcrumbs([
    { name: 'Головна', url: '/' },
    { name: 'Звіти', url: '/reports' },
    { name: report.title, url: `/reports/${slug}` },
  ]);

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <style>{`
        .report-content {
          font-family: var(--font-main);
          font-size: 1rem;
          line-height: 1.7;
          color: var(--charcoal);
          width: 100%;
        }
        .report-content h1 {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 2rem 0 1rem;
        }
        .report-content h2 {
          font-size: clamp(1.25rem, 2.5vw, 1.75rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 2rem 0 1rem;
        }
        .report-content h3 {
          font-size: clamp(1.1rem, 2vw, 1.375rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 1.5rem 0 0.75rem;
        }
        .report-content p {
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .report-content ul, .report-content ol {
          font-size: 1rem;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .report-content li {
          margin-bottom: 0.4rem;
        }
        .report-content figure.table {
          margin: 1.5rem auto;
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .report-content figure.table table {
          border-collapse: collapse;
          width: auto;
          font-size: 0.9rem;
        }
        .report-content td, .report-content th {
          border: 1px solid var(--border);
          padding: 0.6rem 0.9rem;
          text-align: left;
        }
        .report-content th {
          background: var(--off-white);
          font-weight: 700;
        }
        .report-content a {
          color: var(--teal);
          text-decoration: underline;
          font-size: 1rem;
        }
        .report-content figure {
          margin: 1.5rem auto;
          text-align: center;
          display: block;
          width: 100%;
        }
        .report-content figure img {
          margin: 0 auto;
          display: block;
        }
        .report-content img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          cursor: zoom-in;
          transition: opacity 0.2s;
          /* Примусово забираємо обмеження розміру від редактора */
          width: auto !important;
          max-width: 100% !important;
        }
        .report-content img:hover {
          opacity: 0.9;
        }
        .report-content figcaption {
          font-size: 0.9rem;
          color: var(--charcoal);
          margin-top: 0.5rem;
          font-style: italic;
        }
        .report-content .image-style-align-left {
          float: left;
          margin: 0 1.5rem 1rem 0;
          max-width: 45%;
        }
        .report-content .image-style-align-left img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .report-content .image-style-align-right {
          float: right;
          margin: 0 0 1rem 1.5rem;
          max-width: 45%;
        }
        .report-content .image-style-align-right img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .report-content .image-style-align-center {
          margin: 1.5rem auto;
          display: block;
          max-width: 100%;
        }
        .report-content .image-style-align-center img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .report-content::after {
          content: '';
          display: table;
          clear: both;
        }
        .report-content blockquote {
          border-left: 4px solid var(--teal);
          padding: 0.8rem 1.2rem;
          margin: 1.2rem 0;
          background: var(--off-white);
          font-style: italic;
          font-size: 1rem;
        }
        /* Мобільна адаптація */
        @media (max-width: 640px) {
          .report-content {
            font-size: 0.95rem;
          }
          .report-content p {
            font-size: 0.95rem;
          }
          .report-content ul, .report-content ol {
            font-size: 0.95rem;
          }
          .report-content .image-style-align-left,
          .report-content .image-style-align-right {
            float: none;
            max-width: 100% !important;
            margin: 1rem auto;
            display: block;
          }
          .report-content .image-style-align-left img,
          .report-content .image-style-align-right img,
          .report-content .image-style-align-center img,
          .report-content img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 1rem auto;
          }
          /* Додатково перезаписуємо будь-які inline стилі */
          .report-content figure img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
          }
          .report-content figure {
            width: 100% !important;
            max-width: 100% !important;
          }
          .report-content figure.table {
            overflow-x: auto;
            justify-content: flex-start;
          }
          .report-content figure.table table {
            width: 100%;
            font-size: 0.8rem;
          }
          .report-content figure.table td,
          .report-content figure.table th {
            padding: 0.4rem 0.6rem;
            white-space: nowrap;
          }
          .report-content blockquote {
            font-size: 0.95rem;
            padding: 0.6rem 1rem;
          }
          .report-content figcaption {
            font-size: 0.85rem;
          }
        }
      `}</style>

      {report.image && (
        <div style={{ position: 'relative', width: '100%', height: 'clamp(240px, 40vw, 480px)', overflow: 'hidden', background: 'var(--charcoal-dark)' }}>
          <Image
            src={report.image}
            alt={report.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', opacity: 0.85 }}
            loading="eager"
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
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
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

        <ContentRenderer
          html={fixMediaUrls(report.content)}
          className="report-content"
          style={{ width: '100%' }}
        />

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
          <Link href="/reports" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={16} />
            Усі звіти
          </Link>
        </div>
      </div>
    </article>
  );
}