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

interface ContactInfo {
  organization_name: string;
  email: string;
  phone: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  telegram_url: string;
  youtube_url: string;
  founding_year: number | null;
}

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

async function getContacts(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/contacts/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function OrganizationSchema({ contacts }: { contacts: ContactInfo | null }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mistosyly.org';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NGO',
        '@id': `${siteUrl}/#organization`,
        name: contacts?.organization_name || 'Місто Сили',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/logo.png`,
        },
        ...(contacts?.email     && { email: contacts.email }),
        ...(contacts?.phone     && { telephone: contacts.phone }),
        ...(contacts?.address   && { address: { '@type': 'PostalAddress', streetAddress: contacts.address } }),
        ...(contacts?.facebook_url  && { sameAs: [contacts.facebook_url, contacts.instagram_url, contacts.youtube_url, contacts.telegram_url].filter(Boolean) }),
        ...(contacts?.founding_year && { foundingDate: String(contacts.founding_year) }),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: contacts?.organization_name || 'Місто Сили',
        publisher: { '@id': `${siteUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pages, contacts] = await Promise.all([
    getPages(),
    getContacts(),
  ]);

  return (
    <html lang="uk" data-scroll-behavior="smooth">
      <head>
        <OrganizationSchema contacts={contacts} />
      </head>
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