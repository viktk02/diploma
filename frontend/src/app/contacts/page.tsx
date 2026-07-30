import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';
import { siteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Контакти',
  description: 'Контактна інформація організації Місто Сили.',
  alternates: {
    canonical: '/contacts',
  },
  openGraph: {
    url: siteUrl('/contacts'),
    type: 'website',
  },
};

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

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.032 9.583c-.148.658-.538.818-1.09.508l-3.005-2.215-1.45 1.396c-.16.16-.295.295-.605.295l.215-3.054 5.562-5.025c.242-.215-.052-.334-.375-.12L7.14 14.6 4.18 13.68c-.65-.203-.663-.65.136-.962l10.9-4.202c.542-.195 1.015.133.843.962l-.497-.23z"/>
  </svg>
);

export default async function ContactsPage() {
  const contacts = await getContacts();

  const socials = [
    { url: contacts?.facebook_url,  Icon: FacebookIcon,  label: 'Facebook' },
    { url: contacts?.instagram_url, Icon: InstagramIcon, label: 'Instagram' },
    { url: contacts?.youtube_url,   Icon: YoutubeIcon,   label: 'YouTube' },
    { url: contacts?.telegram_url,  Icon: TelegramIcon,  label: 'Telegram' },
  ].filter(s => s.url);

  return (
    <section className="section">
      <div className="container">

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Контакти</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--charcoal)', maxWidth: '600px' }}>
            Зв'яжіться з нами — ми завжди раді відповісти на ваші запитання.
          </p>
        </header>

        <div className="contacts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          <div className="contacts-info">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--charcoal-dark)' }}>
              {contacts?.organization_name || 'Місто Сили'}
            </h2>

            <ul style={{ 
              listStyle: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem', 
              marginBottom: '2.5rem',
              padding: 0,
            }}>
              {contacts?.email && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--teal)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    // borderRadius: '4px',
                    marginTop: '0.1rem',
                  }}>
                    <Mail size={18} color="#fff" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: 'var(--charcoal)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                    }}>Email</span>
                    <a href={`mailto:${contacts.email}`} style={{ 
                      fontSize: '1rem', 
                      fontWeight: 500, 
                      color: 'var(--charcoal-dark)', 
                      textDecoration: 'none',
                      lineHeight: 1.3,
                      wordBreak: 'break-all',
                    }} className="contact-link">
                      {contacts.email}
                    </a>
                  </div>
                </li>
              )}

              {contacts?.phone && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--teal)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    // borderRadius: '4px',
                    marginTop: '0.1rem',
                  }}>
                    <Phone size={18} color="#fff" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: 'var(--charcoal)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                    }}>Телефон</span>
                    <a href={`tel:${contacts.phone}`} style={{ 
                      fontSize: '1rem', 
                      fontWeight: 500, 
                      color: 'var(--charcoal-dark)', 
                      textDecoration: 'none',
                      lineHeight: 1.3,
                    }} className="contact-link">
                      {contacts.phone}
                    </a>
                  </div>
                </li>
              )}

              {contacts?.address && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'var(--teal)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0,
                    // borderRadius: '4px',
                    marginTop: '0.1rem',
                  }}>
                    <MapPin size={18} color="#fff" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: 'var(--charcoal)', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      lineHeight: 1.2,
                    }}>Адреса</span>
                    <span style={{ 
                      fontSize: '1rem', 
                      fontWeight: 500, 
                      color: 'var(--charcoal-dark)', 
                      lineHeight: 1.3,
                    }}>
                      {contacts.address}
                    </span>
                  </div>
                </li>
              )}
            </ul>

            {socials.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--charcoal)', marginBottom: '1rem' }}>
                  Ми в соцмережах
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {socials.map(({ url, Icon, label }) => (
                    <a
                      key={label}
                      href={url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="social-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1rem',
                        border: '2px solid var(--teal)',
                        color: 'var(--teal)',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        transition: 'all 0.2s',
                        // borderRadius: '4px',
                      }}
                    >
                      <Icon />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="contacts-aside" style={{
            background: 'var(--off-white)',
            padding: '3rem',
            borderLeft: '4px solid var(--teal)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              background: 'var(--teal)',
              opacity: 0.08,
              // borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-40px',
              left: '-40px',
              width: '180px',
              height: '180px',
              background: 'var(--red)',
              opacity: 0.05,
              // borderRadius: '50%',
            }} />

            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--charcoal-dark)', marginBottom: '1rem', position: 'relative' }}>
              Маєте питання?
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--charcoal)', lineHeight: 1.7, marginBottom: '2rem', position: 'relative' }}>
              Ми відкриті до співпраці, партнерства та нових ідей. Напишіть або зателефонуйте нам.
            </p>

            {contacts?.founding_year && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', position: 'relative' }}>
                <span style={{ fontSize: '1rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Організація заснована у {contacts.founding_year} році
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .contact-link:hover { color: var(--teal) !important; }
        .social-btn:hover {
          background: var(--teal) !important;
          color: #fff !important;
        }
        @media (max-width: 768px) {
          .contacts-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .contacts-aside {
            padding: 2rem 1.5rem;
            border-left: none;
            border-top: 4px solid var(--teal);
          }
        }
      `}</style>
    </section>
  );
}