import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/admin/', '/auth/', '/ckeditor5/', '/nested_admin/'],
      },
    ],
    sitemap: siteUrl('/sitemap.xml'),
  };
}
