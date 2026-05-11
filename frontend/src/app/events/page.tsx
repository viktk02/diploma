import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Події',
  description: 'Заходи та події організації Місто Сили.',
};

interface Event {
  id: number;
  title: string;
  slug: string;
  date: string;
  image: string | null;
}

async function getEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/v1/events/`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString('uk-UA', { day: 'numeric' }),
    month: date.toLocaleDateString('uk-UA', { month: 'long' }),
    isPast: date < new Date(),
  };
}

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter(e => !formatDate(e.date).isPast);
  const past     = events.filter(e => formatDate(e.date).isPast);

  return (
    <section className="section">
      <div className="container">

        <header style={{ marginBottom: '3rem' }}>
          <h1 className="section-title">Події</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--charcoal)', maxWidth: '600px' }}>
            Заходи, зустрічі та події організації Місто Сили.
          </p>
        </header>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--charcoal)' }}>
            <p style={{ fontSize: '1.25rem' }}>Подій поки немає.</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                  Найближчі події
                </h2>
                <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                  {upcoming.map((event, index) => (
                    <li key={event.id} style={{ display: 'flex' }}>
                      <EventCard event={event} index={index} />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
                  Минулі події
                </h2>
                <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                  {past.map((event, index) => (
                    <li key={event.id} style={{ display: 'flex' }}>
                      <EventCard event={event} index={index} muted />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .event-img:hover { transform: scale(1.04); }
        .event-title-link:hover { color: var(--teal) !important; }
        .event-more-link:hover { color: var(--teal-dark) !important; }
      `}</style>
    </section>
  );
}

function EventCard({ event, index, muted = false }: { event: Event; index: number; muted?: boolean }) {
  const date = formatDate(event.date);

  return (
    <article
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflow: 'hidden',
        opacity: muted ? 0.75 : 1,
      }}
    >
      <Link href={`/events/${event.slug}`} tabIndex={-1} aria-hidden="true"
            style={{
              display: 'block',
              position: 'relative',
              flexShrink: 0,
              height: 200,
              overflow: 'hidden',
              background: 'var(--light-gray)',
            }}>
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            style={{ objectFit: 'cover', objectPosition: 'center', transition: 'transform 0.4s ease' }}
            className="event-img"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={48} style={{ color: 'var(--border)' }} />
          </div>
        )}

        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          background: muted ? 'var(--charcoal)' : 'var(--teal)',
          color: '#fff', padding: '0.5rem 0.75rem', textAlign: 'center', minWidth: '52px',
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{date.day}</div>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{date.month.slice(0, 3)}</div>
        </div>
      </Link>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h2 style={{
          fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', lineHeight: 1.3,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          <Link href={`/events/${event.slug}`} className="event-title-link"
                style={{ color: 'var(--charcoal-dark)', textDecoration: 'none' }}>
            {event.title}
          </Link>
        </h2>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <Link href={`/events/${event.slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'var(--teal)', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                className="event-more-link">
            Детальніше <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}