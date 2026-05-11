import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Місто Сили',
    template: '%s | Місто Сили',
  },
  description: 'Громадська організація Місто Сили — об\'єднуємо людей для розбудови сильних спільнот.',
  keywords: ['громадська організація', 'місто сили', 'спільнота', 'волонтери'],
  authors: [{ name: 'Місто Сили' }],
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    siteName: 'Місто Сили',
  },
};

interface PageNav {
  key: string;
  title: string;
}

const pages = await getPages();
console.log('Pages from API:', pages);

async function getPages(): Promise<PageNav[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/pages/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pages = await getPages();

  return (
    <html lang="uk" data-scroll-behavior="smooth">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header pages={pages} />
        <main id="main-content" style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}