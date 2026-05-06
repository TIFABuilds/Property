import { locations } from '../data/locations.js';
import { site } from '../data/site.js';

const staticPaths = [
  '/',
  '/about/',
  '/solutions/',
  '/why-choose-us/',
  '/supported-accommodation/',
  '/areas/',
  '/contact/',
];

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    ...staticPaths.map((p) => ({ loc: site.baseUrl + p, priority: p === '/' ? '1.0' : '0.8' })),
    ...locations.map((l) => ({ loc: `${site.baseUrl}/property-management/${l.slug}/`, priority: '0.7' })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
