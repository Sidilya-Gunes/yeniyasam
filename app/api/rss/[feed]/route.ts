// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { getArticles } from '@/lib/strapi';

interface RouteContext {
  params: Promise<{ feed: string }>;
}

export async function GET(request: Request, { params }: RouteContext) {
  const { feed } = await params;
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 5, 1), 30) : 5;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yeniyasamgazetesi5.com';

  const categorySlug = feed === 'tum-haberler' ? undefined : (feed === 'yazarlar' ? 'makale' : feed);
  const articles = await getArticles({ categorySlug, limit });

  const feedTitle = feed === 'tum-haberler' ? 'Yeni Yaşam Gazetesi — Son 5 Haber' : `Yeni Yaşam Gazetesi — ${feed.toUpperCase()}`;

  const escapeXml = (unsafe: string) =>
    (unsafe || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const itemsXml = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${baseUrl}/haber/${escapeXml(a.slug)}</link>
      <guid>${baseUrl}/haber/${escapeXml(a.slug)}</guid>
      <description>${escapeXml(a.summary)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      ${a.author?.name ? `<author>${escapeXml(a.author.name)}</author>` : ''}
      ${a.category?.name ? `<category>${escapeXml(a.category.name)}</category>` : ''}
    </item>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss-style.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${baseUrl}</link>
    <description>Yeni Yaşam Gazetesi — Son 5 Haber</description>
    <language>tr-TR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss/${escapeXml(feed)}" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=300, stale-while-revalidate',
    },
  });
}
