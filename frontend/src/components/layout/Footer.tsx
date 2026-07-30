import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FooterNav, FooterSocials } from './FooterClient';

interface ContactInfo {
  organization_name: string;
  email: string;
  phone: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  telegram_url: string;
  youtube_url: string;
}

async function getContacts(): Promise<ContactInfo | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/contacts/`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const PARTNER_LOGO_HEIGHT = 52;

const PARTNER_LOGOS = [
  { src: '/images/de_logo.png',      alt: 'Співпраця з Німеччиною' },
  { src: '/images/eu_logo.png',      alt: 'Співфінансується Європейським Союзом' },
  { src: '/images/giz_logo.png',     alt: 'GIZ — Deutsche Gesellschaft für Internationale Zusammenarbeit' },
  { src: '/images/empower_logo.png', alt: 'Empower' },
];

export default async function Footer() {
  const contacts = await getContacts();

  return (
    <footer style={{ background: 'var(--light-gray)', color: 'var(--charcoal-dark)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">

        {/* Основна сітка */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(58,57,57,0.12)' }}>

          <div>
            <Link href="/" aria-label="Місто Сили — головна">
              <Image
                src="/images/logo.png"
                alt="Місто Сили"
                width={160}
                height={54}
                style={{ objectFit: 'contain', height: '48px', width: 'auto' }}
              />
            </Link>
            <p style={{ marginTop: '1rem', fontSize: '1rem', color: 'var(--charcoal)', lineHeight: 1.7 }}>
              Громадська організація, що об'єднує людей для розбудови сильних спільнот.
            </p>
            <FooterSocials
              facebook={contacts?.facebook_url}
              instagram={contacts?.instagram_url}
              youtube={contacts?.youtube_url}
              telegram={contacts?.telegram_url}
            />
          </div>

          <nav aria-label="Навігація в футері">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              Навігація
            </h3>
            <FooterNav />
          </nav>

          <address style={{ fontStyle: 'normal' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              Контакти
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: 0, margin: 0 }}>
              
              {contacts?.email && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', flexShrink: 0 }}>
                    <Mail size={18} style={{ color: 'var(--teal)' }} />
                  </div>
                  <a href={`mailto:${contacts.email}`} className="footer-link" style={{ color: 'var(--charcoal)', fontSize: '1rem', textDecoration: 'none', lineHeight: '1.2' }}>
                    {contacts.email}
                  </a>
                </li>
              )}
              
              {contacts?.phone && (
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', flexShrink: 0 }}>
                    <Phone size={18} style={{ color: 'var(--teal)' }} />
                  </div>
                  <a href={`tel:${contacts.phone}`} className="footer-link" style={{ color: 'var(--charcoal)', fontSize: '1rem', textDecoration: 'none', lineHeight: '1.2' }}>
                    {contacts.phone}
                  </a>
                </li>
              )}
              
              {contacts?.address && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '24px', flexShrink: 0 }}>
                    <MapPin size={18} style={{ color: 'var(--teal)' }} />
                  </div>
                  <span style={{ color: 'var(--charcoal)', fontSize: '1rem', lineHeight: '1.5' }}>
                    {contacts.address}
                  </span>
                </li>
              )}
              
            </ul>
          </address>
        </div>

        <div style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(58,57,57,0.12)',
        }}
          className="footer-partner-logos"
        >
          {PARTNER_LOGOS.map(logo => (
            <div key={logo.src} className="footer-partner-logo-item">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="(max-width: 640px) 45vw, 180px"
                style={{ objectFit: 'contain', opacity: 0.85 }}
              />
            </div>
          ))}
          <div className="footer-partner-logo-item footer-partner-logo-item--last">
            <Image
              src="/images/logo.png"
              alt="Місто Сили"
              fill
              sizes="(max-width: 640px) 45vw, 180px"
              style={{ objectFit: 'contain', opacity: 0.85 }}
            />
          </div>
        </div>

        <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '1rem', color: 'var(--charcoal)' }}>
            © {new Date().getFullYear()} {contacts?.organization_name || 'Місто Сили'}. Всі права захищено.
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--charcoal)' }}>
            Громадська організація
          </p>
        </div>
      </div>

      <style>{`
        .footer-partner-logos {
          --partner-logo-h: ${PARTNER_LOGO_HEIGHT}px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .footer-partner-logo-item {
          position: relative;
          height: var(--partner-logo-h);
          width: 180px;
          max-width: 100%;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .footer-partner-logos {
            --partner-logo-h: 44px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem 1rem;
            justify-items: center;
            align-items: center;
          }

          .footer-partner-logo-item {
            width: 100%;
            max-width: 150px;
            padding: 0.25rem 0.5rem;
          }

          .footer-partner-logo-item--last {
            grid-column: 1 / -1;
            padding-top: 0.5rem;
          }
        }
      `}</style>
    </footer>
  );
}