'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { resolveAltText } from '@/lib/seo';

interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex);

  const prev = () => setCurrent(i => (i > 0 ? i - 1 : images.length - 1));
  const next = () => setCurrent(i => (i < images.length - 1 ? i + 1 : 0));

  // Окремий useEffect для глобальних подій клавіатури
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
    // Додаємо залежності, щоб події завжди бачили актуальний стан функцій prev та next
  }, [images.length, onClose]); 

  // Окремий useEffect для блокування скролу сторінки під лайтбоксом
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', 
        inset: 0, 
        zIndex: 99999, // <--- Виставили максимальний z-index, щоб стрілки каруселі не пробивалися знизу
        background: 'rgba(0,0,0,0.95)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Закрити"
        style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'rgba(255,255,255,0.1)', border: 'none',
          color: '#fff', cursor: 'pointer', padding: '0.5rem',
          display: 'flex', alignItems: 'center', borderRadius: '2px',
          transition: 'background 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
      >
        <X size={28} />
      </button>

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev(); }}
          aria-label="Попереднє"
          style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: '#fff', cursor: 'pointer', padding: '0.75rem',
            display: 'flex', alignItems: 'center', borderRadius: '2px',
            zIndex: 10,
          }}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw', maxHeight: '85vh',
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '1rem',
        }}
      >
        <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '75vh', width: '100%', height: '75vh' }}>
          <Image
            src={images[current].src}
            alt={resolveAltText(images[current].alt, images[current].caption, 'Зображення')}
            fill
            style={{ objectFit: 'contain' }}
            sizes="90vw"
            priority
          />
        </div>

        {images[current].caption && (
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', textAlign: 'center', margin: '0 1rem', maxWidth: '600px', lineHeight: '1.4' }}>
            {images[current].caption}
          </p>
        )}

        {images.length > 1 && (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {current + 1} / {images.length}
          </p>
        )}
      </div>

      {images.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next(); }}
          aria-label="Наступне"
          style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)', border: 'none',
            color: '#fff', cursor: 'pointer', padding: '0.75rem',
            display: 'flex', alignItems: 'center', borderRadius: '2px',
            zIndex: 10,
          }}
        >
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  );
}