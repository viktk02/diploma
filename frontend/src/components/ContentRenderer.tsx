'use client';

import { useEffect, useRef, FC } from 'react';

interface ContentRendererProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}

const ContentRenderer: FC<ContentRendererProps> = ({ html, className, style }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let content = html || '';

    // Знаходимо всі oembed теги і замінюємо їх на iframe
    content = content.replace(
      /<figure class="media">\s*<oembed url="([^"]+)"\s*\/?>\s*<\/oembed>\s*<\/figure>/gi,
      (match: string, url: string) => {
        return getVideoHtml(url);
      }
    );

    // Також обробляємо окремі oembed теги
    content = content.replace(
      /<oembed url="([^"]+)"\s*\/?>\s*<\/oembed>/gi,
      (match: string, url: string) => {
        return getVideoHtml(url);
      }
    );

    containerRef.current.innerHTML = content;
    addVideoStyles();
  }, [html]);

  const getVideoHtml = (url: string): string => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
      }
      
      if (videoId) {
        return `
          <div class="video-container">
            <iframe
              src="https://www.youtube.com/embed/${videoId}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        `;
      }
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()?.split('?')[0] || '';
      if (videoId) {
        return `
          <div class="video-container">
            <iframe
              src="https://player.vimeo.com/video/${videoId}"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>
        `;
      }
    }

    // Якщо не вдалося розпізнати - показуємо посилання
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  };

  const addVideoStyles = (): void => {
    if (document.getElementById('video-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'video-styles';
    style.textContent = `
      .video-container {
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        margin: 1.5rem 0;
        border-radius: 8px;
        overflow: hidden;
        background: #000;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }
      .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
      }
    `;
    document.head.appendChild(style);
  };

  return <div ref={containerRef} className={className} style={style} />;
};

export default ContentRenderer;