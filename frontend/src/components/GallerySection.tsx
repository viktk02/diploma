'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Lightbox } from './Lightbox';
import { fixMediaUrls } from '@/lib/utils';
import { resolveAltText } from '@/lib/seo';

interface SectionImage {
  id: number;
  image: string;
  alt: string;
  caption: string;
  order: number;
}

export function GallerySectionClient({ images, title, subtitle }: {
  images: SectionImage[];
  title?: string;
  subtitle?: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    align: 'start',
  });

  const lightboxImages = images.map(img => ({
    src: fixMediaUrls(img.image),
    alt: resolveAltText(img.alt, title, subtitle, img.caption),
    caption: img.caption || '',
  }));

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="section" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        {title && <h2 className="section-title centered">{title}</h2>}
        {subtitle && (
          <p style={{ textAlign: 'center', fontSize: '1.125rem', color: 'var(--charcoal)', marginBottom: '2rem', marginTop: '-1.5rem' }}>
            {subtitle}
          </p>
        )}

        <div style={{ position: 'relative', width: '100%' }}>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            
            <div
              className="gallery-carousel"
              ref={emblaRef}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', touchAction: 'pan-y pinch-zoom' }}>
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    style={{ flex: '0 0 100%', minWidth: 0, padding: '0 0.5rem', boxSizing: 'border-box' }}
                  >
                    <figure
                      onClick={() => setLightboxIndex(index)}
                      style={{
                        margin: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        aspectRatio: '16 / 10',
                        cursor: 'zoom-in',
                        borderRadius: '2px',
                        zIndex: 1,
                      }}
                    >
                      <Image
                        src={fixMediaUrls(img.image)}
                        alt={resolveAltText(img.alt, title, subtitle, img.caption)}
                        fill
                        style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        sizes="100vw"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        priority={index === 0}
                        className="gallery-img"
                      />
                      {img.caption && (
                        <figcaption style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          background: 'linear-gradient(to top, rgba(30,30,30,0.82), rgba(30,30,30,0.2))', color: '#fff',
                          padding: '0.75rem 1rem', fontSize: '1rem',
                          zIndex: 2,
                        }}>
                          {img.caption}
                        </figcaption>
                      )}
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label="Попереднє photo"
                  className="gallery-arrow gallery-arrow--left"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label="Наступне фото"
                  className="gallery-arrow gallery-arrow--right"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {images.map((img, index) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Перейти до фото ${index + 1}`}
                  style={{
                    width: selectedIndex === index ? '2rem' : '0.8rem',
                    height: '0.8rem',
                    borderRadius: '999px',
                    border: 'none',
                    background: selectedIndex === index ? 'var(--teal)' : 'rgba(78,153,128,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <style>{`
        .gallery-img:hover { transform: scale(1.04); }
        
        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50 !important;
          border: none;
          cursor: pointer;
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.92);
          color: var(--charcoal-dark);
          box-shadow: 0 8px 24px rgba(0,0,0,0.16);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        
        .gallery-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.06);
        }
        
        .gallery-arrow--left { left: 1rem; }
        .gallery-arrow--right { right: 1rem; }

        @media (max-width: 640px) {
          .gallery-arrow {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}