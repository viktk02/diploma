'use client';

import { useEffect, useRef, useState } from 'react';
import { Lightbox } from './Lightbox';

interface ContentWithLightboxProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ContentWithLightbox({ html, className, style }: ContentWithLightboxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const styleImgs = () => {
      const imgs = Array.from(container.querySelectorAll('img'));
      imgs.forEach(img => { img.style.cursor = 'zoom-in'; });
      setLightboxImages(imgs.map(img => ({ src: img.src, alt: img.alt || '' })));
    };
    styleImgs();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        const imgs = Array.from(container.querySelectorAll('img'));
        const index = imgs.indexOf(target as HTMLImageElement);
        if (index !== -1) {
          setLightboxImages(imgs.map(img => ({ src: img.src, alt: img.alt || '' })));
          setLightboxIndex(index);
        }
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [html]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {lightboxIndex !== null && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}