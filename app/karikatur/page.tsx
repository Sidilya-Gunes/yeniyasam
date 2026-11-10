// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getKarikaturList } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Günün Karikatürü — Yeni Yaşam Gazetesi',
  description: 'Günün siyasi ve toplumsal olaylarına mizahi bakış, karikatür arşivi.',
};

export const revalidate = 60;

export default async function KarikaturPage() {
  const karikaturler = await getKarikaturList();
  const latest = karikaturler[0] || {
    id: 1,
    title: 'Günün Karikatürü',
    artist: 'Yeni Yaşam Mizah Kolektifi',
    publishDate: '29 Ekim 2026',
    image: '/assets/photos/karikatur.jpeg',
    description: 'Haftalık ve günlük siyasetin çizgilerle ifadesi.',
  };
  const previousCartoons = karikaturler.slice(1);

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <header className="archive-header" style={{ marginBottom: '2rem' }}>
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Günün Karikatürü</span>
        </nav>
        <h1 className="archive-title">{latest.title.toUpperCase()}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {latest.publishDate} · Çizen: {latest.artist}
        </p>
      </header>

      {/* Büyük Karikatür Görseli */}
      <section style={{ maxWidth: '820px', margin: '0 auto 3rem' }}>
        <div
          style={{
            backgroundColor: 'var(--surface)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
            textAlign: 'center',
          }}
        >
          <a href={latest.image} target="_blank" rel="noopener noreferrer">
            <img
              src={latest.image}
              alt={latest.title}
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', display: 'inline-block' }}
            />
          </a>
          {latest.description && (
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                "{latest.description}"
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Geçmiş Karikatürler */}
      {previousCartoons.length > 0 && (
        <section style={{ borderTop: '2px solid var(--border)', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '1.5rem' }}>
            GEÇMİŞ KARİKATÜRLER
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {previousCartoons.map((c, idx) => (
              <div
                key={c.id || idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '1rem',
                }}
              >
                <a href={c.image} target="_blank" rel="noopener noreferrer">
                  <img
                    src={c.image}
                    alt={c.title}
                    style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '0.75rem' }}
                  />
                </a>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.25rem' }}>
                  {c.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                  {c.publishDate} · {c.artist}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
