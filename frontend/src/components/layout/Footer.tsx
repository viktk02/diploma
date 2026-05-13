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

export default async function Footer() {
  const contacts = await getContacts();

  return (
    <footer style={{ background: 'var(--charcoal-dark)', color: 'var(--white)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>

          <div>
            <Link href="/" aria-label="Місто Сили — головна">
              <Image
                src="/images/logo.png"
                alt="Місто Сили"
                width={160}
                height={54}
                style={{ objectFit: 'contain', height: '48px', width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p style={{ marginTop: '1rem', fontSize: '1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
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
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--teal-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              Навігація
            </h3>
            <FooterNav />
          </nav>

          <address style={{ fontStyle: 'normal' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--teal-light)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>
              Контакти
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contacts?.email && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Mail size={18} style={{ color: 'var(--teal-light)', marginTop: '2px', flexShrink: 0 }} />
                  <a href={`mailto:${contacts.email}`} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', textDecoration: 'none' }}>
                    {contacts.email}
                  </a>
                </li>
              )}
              {contacts?.phone && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--teal-light)', marginTop: '2px', flexShrink: 0 }} />
                  <a href={`tel:${contacts.phone}`} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', textDecoration: 'none' }}>
                    {contacts.phone}
                  </a>
                </li>
              )}
              {contacts?.address && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={18} style={{ color: 'var(--teal-light)', marginTop: '2px', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem' }}>{contacts.address}</span>
                </li>
              )}
            </ul>
          </address>
        </div>

        <div style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} {contacts?.organization_name || 'Місто Сили'}. Всі права захищено.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
            Громадська організація
          </p>
        </div>
      </div>
    </footer>
  );
}