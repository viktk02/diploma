import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fixMediaUrls } from '@/lib/utils';

interface SectionImage {
  id: number;
  image: string;
  alt: string;
  caption: string;
  order: number;
}

interface Section {
  id: number;
  section_type: 'hero' | 'text' | 'gallery' | 'contacts' | 'cta' | 'custom';
  title: string;
  subtitle: string;
  content: string;
  image: string | null;
  image_alt: string;
  button_text: string;
  button_url: string;
  extra_data: Record<string, unknown> | null;
  order: number;
  images: SectionImage[];
}

function HeroSection({ section }: { section: Section }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, var(--charcoal-dark) 0%, #2a2a2a 60%, var(--teal-dark) 100%)',
      color: '#fff',
      padding: 'clamp(4rem, 10vw, 8rem) 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {section.image && (
        <>
          <Image src={fixMediaUrls(section.image)} alt={section.image_alt || section.title} fill
                 style={{ objectFit: 'cover', opacity: 0.3 }} sizes="100vw" loading="eager" priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,30,30,0.9), rgba(78,153,128,0.6))' }} />
        </>
      )}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '700px' }}>
          {section.subtitle && (
            <span style={{ display: 'inline-block', background: 'var(--teal)', color: '#fff', padding: '0.375rem 1rem', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              {section.subtitle}
            </span>
          )}
          {section.title && (
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: '#fff' }}>
              {section.title}
            </h1>
          )}
          {section.content && (
            <div style={{ fontSize: 'clamp(1.125rem, 2vw, 1.375rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '2.5rem' }}
                 dangerouslySetInnerHTML={{ __html: fixMediaUrls(section.content) }} />
          )}
          {section.button_text && section.button_url && (
            <Link href={section.button_url} className="btn-primary">
              {section.button_text} <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function TextSection({ section, isAboveFold = false }: { section: Section; isAboveFold?: boolean }) {
  const hasImage = !!section.image;
  return (
    <section className="section">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: hasImage ? '1fr 1fr' : '1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ maxWidth: hasImage ? '100%' : '800px' }}>
            {section.title && <h2 className="section-title">{section.title}</h2>}
            {section.subtitle && (
              <p style={{ fontSize: '1.25rem', color: 'var(--teal)', fontWeight: 500, marginBottom: '1rem' }}>
                {section.subtitle}
              </p>
            )}
            {section.content && (
              <div className="cms-content" dangerouslySetInnerHTML={{ __html: fixMediaUrls(section.content) }} />
            )}
            {section.button_text && section.button_url && (
              <div style={{ marginTop: '2rem' }}>
                <Link href={section.button_url} className="btn-primary">
                  {section.button_text} <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
          {hasImage && (
            <div style={{ position: 'relative', height: 'clamp(280px, 40vw, 480px)', overflow: 'hidden' }}>
              <Image src={fixMediaUrls(section.image!)} alt={section.image_alt || section.title}
                     fill style={{ objectFit: 'cover' }} loading={isAboveFold ? 'eager' : 'lazy'} priority={isAboveFold} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ section, isAboveFold = false }: { section: Section; isAboveFold?: boolean }) {
  if (!section.images?.length) return null;
  return (
    <section className="section" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        {section.title && <h2 className="section-title centered">{section.title}</h2>}
        {section.subtitle && (
          <p style={{ textAlign: 'center', fontSize: '1.125rem', color: 'var(--charcoal)', marginBottom: '2rem', marginTop: '-1.5rem' }}>
            {section.subtitle}
          </p>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {section.images.map((img, index) => (
            <figure key={img.id} style={{ margin: 0, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              <Image
                src={fixMediaUrls(img.image)}
                alt={img.alt || ''}
                fill
                style={{ objectFit: 'cover' }}
                loading={isAboveFold && index === 0 ? 'eager' : 'lazy'}
                priority={isAboveFold && index === 0}
              />
              {img.caption && (
                <figcaption style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(30,30,30,0.7)', color: '#fff', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}>
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ section }: { section: Section }) {
  return (
    <section style={{ background: 'var(--teal)', padding: '5rem 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {section.title && (
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', marginBottom: '2rem' }}>
            {section.subtitle}
          </p>
        )}
        {section.content && (
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', marginBottom: '2rem' }}
               dangerouslySetInnerHTML={{ __html: fixMediaUrls(section.content) }} />
        )}
        {section.button_text && section.button_url && (
          <Link href={section.button_url}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#fff', color: 'var(--teal)', fontFamily: 'var(--font-main)', fontSize: '1.125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', transition: 'all 0.2s' }}>
            {section.button_text} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );
}

function ContactsSection({ section }: { section: Section }) {
  return (
    <section className="section" style={{ background: 'var(--off-white)' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {section.title && <h2 className="section-title centered">{section.title}</h2>}
        {section.content && (
          <div className="cms-content" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}
               dangerouslySetInnerHTML={{ __html: fixMediaUrls(section.content) }} />
        )}
        <Link href="/contacts" className="btn-primary">
          Зв'язатися з нами <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

export function renderSection(section: Section, index = 0) {
  const isAboveFold = index === 0;
  switch (section.section_type) {
    case 'hero':     return <HeroSection     key={section.id} section={section} />;
    case 'text':     return <TextSection     key={section.id} section={section} isAboveFold={isAboveFold} />;
    case 'gallery':  return <GallerySection  key={section.id} section={section} isAboveFold={isAboveFold} />;
    case 'cta':      return <CTASection      key={section.id} section={section} />;
    case 'contacts': return <ContactsSection key={section.id} section={section} />;
    default:         return null;
  }
}

export function PageRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections
        .filter(s => s)
        .sort((a, b) => a.order - b.order)
        .map((section, index) => renderSection(section, index))}

      <style>{`
        .cms-content {
          font-family: var(--font-main);
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--charcoal);
        }
        .cms-content h2, .cms-content h3 {
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 1.5rem 0 0.75rem;
        }
        .cms-content p { margin-bottom: 1.25rem; }
        .cms-content ul, .cms-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .cms-content a { color: var(--teal); }
        .cms-content img {
          max-width: 100%;
          height: auto;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .cms-content figure { margin: 2rem 0; text-align: center; }
        .cms-content figcaption {
          font-size: 0.875rem;
          color: var(--charcoal);
          margin-top: 0.5rem;
          font-style: italic;
        }
        .cms-content .image-style-align-left {
          float: left;
          margin: 0 1.5rem 1rem 0;
          max-width: 50%;
        }
        .cms-content .image-style-align-right {
          float: right;
          margin: 0 0 1rem 1.5rem;
          max-width: 50%;
        }
        .cms-content .image-style-align-center {
          margin: 1.5rem auto;
          display: block;
        }
        .cms-content::after {
          content: '';
          display: table;
          clear: both;
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .cms-content .image-style-align-left,
          .cms-content .image-style-align-right {
            float: none;
            max-width: 100%;
            margin: 1rem 0;
          }
        }
      `}</style>
    </>
  );
}