import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft, Clock } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  image: string | null;
}

async function getEvent(slug: string): Promise<Event | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/events/${slug}/`, {
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
  const event = await getEvent(slug);
  if (!event) return { title: 'Подію не знайдено' };
  return {
    title: event.title,
    description: event.description.slice(0, 160),
    openGraph: {
      title: event.title,
      images: event.image ? [event.image] : [],
    },
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    full: date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }),
    time: date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    isPast: date < new Date(),
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const date = formatDate(event.date);

  return (
    <article>
      <style>{`
        .event-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 3rem;
          align-items: start;
          padding: 4rem 0;
        }
        .event-description { order: 1; }
        .event-aside {
          order: 2;
          background: var(--off-white);
          padding: 2rem;
          border-left: 4px solid var(--teal);
        }
        @media (max-width: 768px) {
          .event-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 2rem 0;
          }
          .event-description { order: 2; }
          .event-aside {
            order: 1;
            border-left: none;
            border-top: 4px solid var(--teal);
          }
        }
      `}</style>

      <div style={{ position: 'relative', width: '100%', height: 'clamp(280px, 40vw, 480px)', overflow: 'hidden', background: 'var(--charcoal-dark)' }}>
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', opacity: 0.8 }}
            priority
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--teal-dark), var(--charcoal-dark))' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(20,20,20,0.85) 100%)' }} />

        <div className="container" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2.5rem 1.5rem' }}>
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.875rem',
            background: date.isPast ? 'var(--charcoal)' : 'var(--teal)',
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
          }}>
            {date.isPast ? 'Завершено' : 'Майбутня подія'}
          </span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, maxWidth: '800px' }}>
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container">
        <div className="event-grid">
          <div className="event-description">
            <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: 'var(--charcoal)', whiteSpace: 'pre-line' }}>
              {event.description}
            </p>
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <Link href="/events" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} />
                Усі події
              </Link>
            </div>
          </div>

          <aside className="event-aside">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--teal)', marginBottom: '1.5rem' }}>
              Деталі події
            </h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <Calendar size={20} style={{ color: 'var(--teal)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Дата</div>
                  <time dateTime={event.date} style={{ fontWeight: 700, color: 'var(--charcoal-dark)' }}>{date.full}</time>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <Clock size={20} style={{ color: 'var(--teal)', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Час</div>
                  <span style={{ fontWeight: 700, color: 'var(--charcoal-dark)' }}>{date.time}</span>
                </div>
              </li>
              {event.location && (
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                  <MapPin size={20} style={{ color: 'var(--teal)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Місце</div>
                    <span style={{ fontWeight: 700, color: 'var(--charcoal-dark)' }}>{event.location}</span>
                  </div>
                </li>
              )}
            </ul>
          </aside>
        </div>
      </div>
    </article>
  );
}