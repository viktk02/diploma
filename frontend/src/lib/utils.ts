const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mistosyly.org';

export function fixMediaUrls(html: string): string {
    if (!html) return '';
  
  return html.replace(/src="\/media\//g, `src="${API_URL}/media/`);
}