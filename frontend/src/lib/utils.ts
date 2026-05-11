export function fixMediaUrls(html: string): string {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    return html.replace(/src="\/media\//g, `src="${apiUrl}/media/`);
  }