// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAuthors, getStrapiMedia } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Yazarlar — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi köşe yazarları ve analizleri.',
};

export default async function YazarlarPage() {
  const authors = await getAuthors();

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <div className="section-title-bar" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          YAZARLARIMIZ
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/yazar/${author.slug}`}
            style={{
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <img
              src={getStrapiMedia(author.avatar)}
              alt={author.name}
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: '1rem',
                border: '2px solid var(--border)',
              }}
            />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--heading)' }}>
              {author.name}
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', margin: '0.25rem 0 0.5rem' }}>
              {author.role || 'Yazar'}
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {author.bio}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
