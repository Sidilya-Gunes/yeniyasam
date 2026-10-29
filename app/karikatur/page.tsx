// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Günün Karikatürü — Yeni Yaşam Gazetesi',
  description: 'Günün siyasi ve toplumsal olaylarına mizahi bakış, karikatür arşivi.',
};

export default function KarikaturPage() {
  const previousCartoons = [
    { title: 'Bütçe görüşmeleri ve halkın sofrası', date: '28 Ekim 2026', artist: 'Yeni Yaşam Mizah' },
    { title: 'Diplomatik temaslar ve masadaki gerçekler', date: '27 Ekim 2026', artist: 'Yeni Yaşam Mizah' },
    { title: 'Ekoloji ve ranta karşı direniş', date: '26 Ekim 2026', artist: 'Yeni Yaşam Mizah' },
  ];

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <header className="archive-header" style={{ marginBottom: '2rem' }}>
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Günün Karikatürü</span>
        </nav>
        <h1 className="archive-title">GÜNÜN KARİKATÜRÜ</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          29 Ekim 2026 · Çizen: Yeni Yaşam Mizah Kolektifi
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
          <img
            src="/assets/photos/karikatur.jpeg"
            alt="Günün Karikatürü"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', display: 'inline-block' }}
          />
          <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              "Haftalık ve günlük siyasetin çizgilerle ifadesi."
            </span>
          </div>
        </div>
      </section>

      {/* Geçmiş Karikatürler */}
      <section style={{ borderTop: '2px solid var(--border)', paddingTop: '2rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '1.5rem' }}>
          GEÇMİŞ KARİKATÜRLER
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {previousCartoons.map((c, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '1rem',
              }}
            >
              <img
                src="/assets/photos/karikatur.jpeg"
                alt={c.title}
                style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '0.75rem' }}
              />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.25rem' }}>
                {c.title}
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                {c.date} · {c.artist}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
