import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageRenderer } from '@/components/PageRenderer';

interface PageData {
  key: string;
  title: string;
  meta_title: string;
  meta_description: string;
  og_image: string | null;
  robots: string;
  sections: any[];
}

const RESERVED_KEYS = ['reports', 'events', 'contacts', 'pages', 'api', 'admin', 'auth', 'search'];

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

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  if (RESERVED_KEYS.includes(key)) return { title: 'Сторінку не знайдено' };
  const page = await getPage(key);
  if (!page) return { title: 'Сторінку не знайдено' };
  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    robots: page.robots,
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description,
      images: page.og_image ? [page.og_image] : [],
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  if (RESERVED_KEYS.includes(key)) notFound();

  const page = await getPage(key);
  if (!page) notFound();

  return (
    <main>
      {page.sections?.length > 0 ? (
        <PageRenderer sections={page.sections} />
      ) : (
        <section className="section">
          <div className="container">
            <h1 className="section-title">{page.title}</h1>
            <p style={{ color: 'var(--charcoal)', fontSize: '1.125rem' }}>
              Сторінка поки не має контенту.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}