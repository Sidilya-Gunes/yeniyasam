// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'RSS Beslemeleri | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi RSS akışları.',
};

export default function RssPage() {
  const feeds = [
    { title: 'Tüm Son Haberler', url: '/api/rss/tum-haberler', desc: 'Sitede yayınlanan en son haberlerin tamamı.' },
    { title: 'Güncel', url: '/api/rss/guncel', desc: 'Güncel gelişmeler ve sıcak haber akışı.' },
    { title: 'Politika', url: '/api/rss/politika', desc: 'Meclis, siyaset ve diplomasi haberleri.' },
    { title: 'Kadın', url: '/api/rss/kadin', desc: 'Kadın mücadelesi ve kadın gündemi.' },
    { title: 'Ekoloji', url: '/api/rss/ekoloji', desc: 'Doğa, çevre ve ekoloji mücadeleleri.' },
    { title: 'Köşe Yazarları', url: '/api/rss/yazarlar', desc: 'Yazarlarımızın en yeni makaleleri.' },
  ];

  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>RSS</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            RSS Beslemeleri
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Haberlerimizi RSS okuyucunuz (Feedly, Inoreader vb.) üzerinden takip edin.
          </p>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {feeds.map((feed, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--border-color, #e5e7eb)',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.15rem', fontWeight: 700 }}>
                  {feed.title}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {feed.desc}
                </p>
              </div>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--accent, #dc2626)',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
                </svg>
                {feed.url}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
