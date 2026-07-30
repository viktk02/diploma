import Image from 'next/image';
import Link from 'next/link';
import { GallerySectionClient } from './GallerySection';
import { ArrowRight } from 'lucide-react';
import { fixMediaUrls } from '@/lib/utils';
import { resolveAltText } from '@/lib/seo';

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
      padding: 'clamp(3rem, 8vw, 6rem) 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {section.image && (
        <>
          <Image src={fixMediaUrls(section.image)} alt={resolveAltText(section.image_alt, section.title, section.subtitle, 'Зображення')} fill
                 style={{ objectFit: 'cover', opacity: 0.3 }} sizes="100vw" loading="eager" priority />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(30,30,30,0.9), rgba(78,153,128,0.6))' }} />
        </>
      )}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '700px' }}>
          {section.subtitle && (
            <span style={{ display: 'inline-block', background: 'var(--teal)', color: '#fff', padding: '0.375rem 1rem', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              {section.subtitle}
            </span>
          )}
          {section.title && (
            <h1 style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', color: '#fff' }}>
              {section.title}
            </h1>
          )}
          {section.content && (
            <div style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '2.5rem' }}
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
    <section className="section" style={{ padding: 'clamp(2.5rem, 5vw, 4rem) 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: hasImage ? '1fr 1fr' : '1fr', gap: '3rem', alignItems: 'center' }}>
          <div style={{ maxWidth: hasImage ? '100%' : '800px' }}>
            {section.title && <h2 className="section-title">{section.title}</h2>}
            {section.subtitle && (
              <p style={{ fontSize: '1rem', color: 'var(--teal)', fontWeight: 500, marginBottom: '1rem' }}>
                {section.subtitle}
              </p>
            )}
            {section.content && (
              <div className="cms-content" dangerouslySetInnerHTML={{ __html: fixMediaUrls(section.content) }} />
            )}
            {section.button_text && section.button_url && (
              <div style={{ marginTop: '1.5rem' }}>
                <Link href={section.button_url} className="btn-primary">
                  {section.button_text} <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
          {hasImage && (
            <div style={{ position: 'relative', height: 'clamp(280px, 40vw, 480px)', overflow: 'hidden' }}>
              <Image src={fixMediaUrls(section.image!)} alt={resolveAltText(section.image_alt, section.title, section.subtitle, 'Зображення')}
                     fill style={{ objectFit: 'cover' }} loading={isAboveFold ? 'eager' : 'lazy'} priority={isAboveFold} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function CTASection({ section }: { section: Section }) {
  return (
    <section style={{ background: 'var(--teal)', padding: 'clamp(3rem, 6vw, 4.5rem) 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {section.title && (
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.4vw, 2.6rem)', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem' }}>
            {section.subtitle}
          </p>
        )}
        {section.content && (
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginBottom: '1.5rem' }}
               dangerouslySetInnerHTML={{ __html: fixMediaUrls(section.content) }} />
        )}
        {section.button_text && section.button_url && (
          <Link href={section.button_url}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', background: '#fff', color: 'var(--teal)', fontFamily: 'var(--font-main)', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', textDecoration: 'none', transition: 'all 0.2s' }}>
            {section.button_text} <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </section>
  );
}

function ContactsSection({ section }: { section: Section }) {
  return (
    <section className="section" style={{ background: 'var(--off-white)', padding: 'clamp(2.5rem, 5vw, 4rem) 0' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        {section.title && <h2 className="section-title centered">{section.title}</h2>}
        {section.content && (
          <div className="cms-content" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}
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
    case 'gallery':  return <GallerySectionClient key={section.id} images={section.images} title={section.title} subtitle={section.subtitle} />;
    case 'cta':      return <CTASection      key={section.id} section={section} />;
    case 'contacts': return <ContactsSection key={section.id} section={section} />;
    default:         return null;
  }
}

export function PageRenderer({ sections }: { sections: Section[] }) {
  const sortedSections = [...sections].filter(s => s).sort((a, b) => a.order - b.order);
  
  return (
    <>
      {sortedSections.map((section, index) => renderSection(section, index))}

      <style dangerouslySetInnerHTML={{ __html: `
        .cms-content {
          font-family: var(--font-main);
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--charcoal);
        }
        /* H1 в контенті - менший за глобальний h1 */
        .cms-content h1 {
          font-size: clamp(1.5rem, 3vw, 2.4rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 1.5rem 0 0.75rem;
        }
        /* H2 в контенті - менший за глобальний h2 */
        .cms-content h2 {
          font-size: clamp(1.3rem, 2.6vw, 1.95rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 1.25rem 0 0.75rem;
        }
        /* H3 в контенті - менший за глобальний h3 */
        .cms-content h3 {
          font-size: clamp(1.05rem, 1.9vw, 1.35rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 1rem 0 0.5rem;
        }
        /* H4 в контенті - менший за глобальний h4 */
        .cms-content h4 {
          font-size: clamp(0.95rem, 1.6vw, 1.15rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 0.75rem 0 0.5rem;
        }
        .cms-content h5, .cms-content h6 {
          font-size: clamp(0.9rem, 1.4vw, 1rem);
          font-weight: 700;
          color: var(--charcoal-dark);
          margin: 0.5rem 0 0.5rem;
        }
        .cms-content p {
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
        }
        .cms-content ul, .cms-content ol {
          font-size: 0.95rem;
          padding-left: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .cms-content li {
          margin-bottom: 0.3rem;
        }
        .cms-content a {
          color: var(--teal);
          font-size: 0.95rem;
        }
        .cms-content img {
          max-width: 100%;
          height: auto;
          margin: 1.25rem auto;
          display: block;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          cursor: zoom-in;
          width: auto !important;
          max-width: 100% !important;
        }
        .cms-content figure {
          margin: 1.25rem 0;
          text-align: center;
        }
        .cms-content figcaption {
          font-size: 0.9rem;
          color: var(--charcoal);
          margin-top: 0.4rem;
          font-style: italic;
        }
        .cms-content .image-style-align-left {
          float: left;
          margin: 0 1.5rem 0.75rem 0;
          max-width: 45%;
        }
        .cms-content .image-style-align-left img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .cms-content .image-style-align-right {
          float: right;
          margin: 0 0 0.75rem 1.5rem;
          max-width: 45%;
        }
        .cms-content .image-style-align-right img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .cms-content .image-style-align-center {
          margin: 1.25rem auto;
          display: block;
          max-width: 100%;
        }
        .cms-content .image-style-align-center img {
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
        }
        .cms-content::after {
          content: '';
          display: table;
          clear: both;
        }
        .cms-content blockquote {
          border-left: 4px solid var(--teal);
          padding: 0.6rem 1.2rem;
          margin: 1rem 0;
          background: var(--off-white);
          font-style: italic;
          font-size: 0.95rem;
        }
        .cms-content table {
          border-collapse: collapse;
          width: 100%;
          font-size: 0.85rem;
          margin: 1.25rem 0;
        }
        .cms-content td, .cms-content th {
          border: 1px solid var(--border);
          padding: 0.5rem 0.8rem;
          text-align: left;
        }
        .cms-content th {
          background: var(--off-white);
          font-weight: 700;
        }

        /* Зменшені відступи для .section-title */
        .section-title {
          margin-bottom: 2rem;
        }
        .section-title::after {
          margin-top: 0.75rem;
        }
        .section-title.centered::after {
          margin: 0.75rem auto 0;
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .cms-content {
            font-size: 0.9rem;
          }
          .cms-content h1 {
            font-size: clamp(1.35rem, 4.5vw, 1.8rem);
          }
          .cms-content h2 {
            font-size: clamp(1.2rem, 3.5vw, 1.6rem);
          }
          .cms-content h3 {
            font-size: clamp(1rem, 2.8vw, 1.2rem);
          }
          .cms-content p {
            font-size: 0.9rem;
            margin-bottom: 0.6rem;
          }
          .cms-content ul, .cms-content ol {
            font-size: 0.9rem;
            margin-bottom: 0.6rem;
          }
          .cms-content .image-style-align-left,
          .cms-content .image-style-align-right {
            float: none;
            max-width: 100% !important;
            margin: 0.75rem auto;
            display: block;
          }
          .cms-content .image-style-align-left img,
          .cms-content .image-style-align-right img,
          .cms-content .image-style-align-center img,
          .cms-content img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            margin: 0.75rem auto;
          }
          .cms-content figure img {
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
          }
          .cms-content figure {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0.75rem 0;
          }
          .cms-content table {
            font-size: 0.8rem;
            display: block;
            overflow-x: auto;
            white-space: nowrap;
            margin: 0.75rem 0;
          }
          .cms-content td, .cms-content th {
            padding: 0.3rem 0.5rem;
          }
          .cms-content blockquote {
            font-size: 0.9rem;
            padding: 0.5rem 0.8rem;
            margin: 0.75rem 0;
          }
          .cms-content figcaption {
            font-size: 0.8rem;
            margin-top: 0.3rem;
          }
          .section-title {
            margin-bottom: 1.5rem;
          }
          .section-title::after {
            margin-top: 0.5rem;
            width: 3rem;
          }
        }
      ` }} />
    </>
  );
}