// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { searchArticles, getStrapiMedia } from '@/lib/strapi';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" için arama sonuçları — Yeni Yaşam` : 'Arama — Yeni Yaşam',
  };
}

export default async function AramaPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <div className="section-title-bar" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          {q ? `"${q}" İÇİN ARAMA SONUÇLARI` : 'SİTEDE ARA'}
        </h1>
      </div>

      <form action="/arama" method="get" style={{ maxWidth: '640px', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Haber, yazar veya konu arayın..."
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              backgroundColor: 'var(--surface)',
              color: 'var(--text)',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Ara
          </button>
        </div>
      </form>

      {q && results.length === 0 ? (
        <p className="page-placeholder">
          Aradığınız kriterlere uygun sonuç bulunamadı. Lütfen farklı anahtar kelimeler deneyin.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {results.map((item) => (
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
      )}
    </main>
  );
}
