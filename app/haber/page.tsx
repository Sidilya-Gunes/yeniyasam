// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getStrapiMedia } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Tüm Haberler — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi güncel gelişmeler, analizler ve haber arşivi.',
};

export default async function HaberlerArchivePage() {
  const articles = await getArticles({ limit: 24 });

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <div className="section-title-bar" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          TÜM HABERLER
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {articles.map((item) => (
          <article className="news-card" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
            <Link href={`/haber/${item.slug}`} className="news-card-img">
              <img src={getStrapiMedia(item.coverImage)} alt={item.title} />
            </Link>
            {item.category && (
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                  marginTop: '0.75rem',
                }}
              >
                {item.category.name}
              </span>
            )}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0', lineHeight: 1.35 }}>
              <Link href={`/haber/${item.slug}`}>{item.title}</Link>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
              {item.summary}
            </p>
            <span className="news-date" style={{ marginTop: '0.75rem' }}>
              {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
            </span>
          </article>
        ))}
      </div>
    </main>
  );
}
