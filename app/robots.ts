import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yeniyasamgazetesi5.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/giris', '/abone/sonuc'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
