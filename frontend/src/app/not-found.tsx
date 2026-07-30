import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>

        <div style={{
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 700,
          lineHeight: 1,
          color: 'var(--teal)',
          opacity: 0.15,
          fontFamily: 'var(--font-main)',
          userSelect: 'none',
          marginBottom: '-2rem',
        }}>
          404
        </div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'var(--charcoal-dark)', marginBottom: '1rem' }}>
          Сторінку не знайдено
        </h1>

        <p style={{ fontSize: '1.125rem', color: 'var(--charcoal)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Сторінка яку ви шукаєте не існує або була переміщена.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} />
            На головну
          </Link>
          <Link href="/reports" className="btn-outline">
            <Search size={16} />
            Переглянути звіти
          </Link>
        </div>
      </div>
    </section>
  );
}