// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Günün Manşeti — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi günlük basılı manşeti, birinci sayfa arşivi ve e-gazete.',
};

export default function MansetPage() {
  const pastIssues = [
    { date: '28 Ekim 2026', issue: '3555', img: '/assets/photos/yy.jpg' },
    { date: '27 Ekim 2026', issue: '3554', img: '/assets/photos/yy.jpg' },
    { date: '26 Ekim 2026', issue: '3553', img: '/assets/photos/yy.jpg' },
    { date: '25 Ekim 2026', issue: '3552', img: '/assets/photos/yy.jpg' },
  ];

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <header className="archive-header" style={{ marginBottom: '2rem' }}>
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Günün Manşeti</span>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="archive-title" style={{ margin: 0 }}>Günün Manşeti</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Sayı: 3556 · 29 Ekim 2026 Perşembe · Günlük Siyasi Gazete
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a
              href="/assets/photos/yy.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="error-btn error-btn--primary"
              style={{ fontSize: '0.8rem', padding: '10px 18px' }}
            >
              Tam Boyut İncele
            </a>
            <a
              href="#"
              className="error-btn error-btn--secondary"
              style={{ fontSize: '0.8rem', padding: '10px 18px' }}
            >
              PDF İndir
            </a>
          </div>
        </div>
      </header>

      {/* Ana Manşet Görseli */}
      <section style={{ maxWidth: '880px', margin: '0 auto 3.5rem' }}>
        <div
          style={{
            backgroundColor: 'var(--surface)',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
          }}
        >
          <img
            src="/assets/photos/yy.jpg"
            alt="Yeni Yaşam Gazetesi 1. Sayfa"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
          />
        </div>
      </section>

      {/* Önceki Günlerin Manşetleri */}
      <section style={{ borderTop: '2px solid var(--border)', paddingTop: '2.5rem' }}>
        <div className="section-title-bar" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--heading)' }}>
            ÖNCEKİ SAYILARIN MANŞETLERİ
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          {pastIssues.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.75rem',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <img
                src={item.img}
                alt={item.date}
                style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '0.75rem' }}
              />
              <span style={{ display: 'block', fontWeight: 700, color: 'var(--heading)', fontSize: '0.9rem' }}>
                {item.date}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                Sayı: {item.issue}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
