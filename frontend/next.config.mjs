/** @type {import('next').NextConfig} */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const API_ORIGIN = new URL(
  IS_PRODUCTION
    ? (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'https://api.mistosyly.org')
    : (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://127.0.0.1:8000')
).origin;

const nextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mistosyly.org',
        pathname: '/media/**',      
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: false, 
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=(), payment=(), usb=(), magnetometer=()' },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://*.cloudflareinsights.com",
          "script-src-elem 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://*.cloudflareinsights.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          `img-src 'self' data: blob: ${API_ORIGIN} https:`,
          `connect-src 'self' ${API_ORIGIN} https://cloudflareinsights.com https://*.cloudflareinsights.com`,
          "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.instagram.com https://www.facebook.com",
          "frame-ancestors 'self'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
    ];

    if (IS_PRODUCTION) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;