// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthorBySlug, getArticles, getStrapiMedia } from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: 'Yazar Bulunamadı' };
  }

  return {
    title: `${author.name} Yazıları — Yeni Yaşam Gazetesi`,
    description: author.bio || `${author.name} köşe yazıları ve makaleleri.`,
  };
}

export default async function YazarDetayPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const allArticles = await getArticles({ limit: 20 });
  const authorArticles = allArticles.filter(
    (a) => a.author?.slug === author.slug || a.author?.name === author.name
  );

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      {/* Yazar Bilgi Kartı */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          marginBottom: '3rem',
          flexWrap: 'wrap',
        }}
      >
        <img
          src={getStrapiMedia(author.avatar)}
          alt={author.name}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--primary)',
          }}
        />
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '0.25rem' }}>
            {author.name}
          </h1>
          <span style={{ color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
            {author.role || 'Yazar'}
          </span>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
            {author.bio}
          </p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--heading)' }}>
        {author.name} TARAFINDAN YAZILANLAR
      </h2>

      {authorArticles.length === 0 ? (
        <p className="page-placeholder">Bu yazara ait henüz makale listelenmemiştir.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {authorArticles.map((item) => (
            <article className="news-card" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/haber/${item.slug}`} className="news-card-img">
                <img src={getStrapiMedia(item.coverImage)} alt={item.title} />
              </Link>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.75rem 0 0.5rem', lineHeight: 1.35 }}>
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
