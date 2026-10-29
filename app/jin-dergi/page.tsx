// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Jin Dergi — Yeni Yaşam Gazetesi',
  description: 'Jin Dergi haftalık kadın eki, makaleler, söyleşiler ve arşiv.',
};

export default function JinDergiPage() {
  const articlesInThisIssue = [
    { title: 'Özgürlük neden önce ilişkilerde başlar?', author: 'Nimet Sevim', cat: 'Kadın' },
    { title: 'Kadın kooperatifleri ve dayanışma ekonomisinin geleceği', author: 'Nezahat Doğan', cat: 'Ekonomi' },
    { title: 'Toplumsal hafızada kadın direnişi', author: 'Zehra Doğan', cat: 'Kültür' },
    { title: 'Ekolojik mücadelede öncü kadın deneyimleri', author: 'Evin Çiftçi', cat: 'Ekoloji' },
  ];

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <header className="archive-header" style={{ marginBottom: '2rem' }}>
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Jin Dergi</span>
        </nav>
        <h1 className="archive-title">JIN DERGİ</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Haftalık Kadın Eki · Sayı: 114 · "Kadın, Yaşam, Özgürlük"
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
        {/* Kapak Görseli */}
        <div>
          <div
            style={{
              backgroundColor: 'var(--surface)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            }}
          >
            <img
              src="/assets/photos/jin.jpeg"
              alt="Jin Dergi Kapağı"
              style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
            />
          </div>
        </div>

        {/* Bu Sayının İçeriği */}
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '1rem', borderBottom: '2px solid var(--cat-kadin)', paddingBottom: '0.5rem' }}>
            BU SAYIDA NELER VAR?
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '1rem' }}>
            Jin Dergi’nin 114. sayısında kadınların toplumsal alandaki özne olma mücadelesini, ilişkilerdeki tahakküm mekanizmalarını ve dayanışma ağlarının dönüştürücü potansiyelini masaya yatırıyoruz.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {articlesInThisIssue.map((art, idx) => (
              <li
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cat-kadin)' }}>
                  {art.cat}
                </span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.25rem 0 0.25rem', color: 'var(--heading)' }}>
                  {art.title}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                  Yazar: {art.author}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#" className="error-btn error-btn--primary">
              PDF Olarak Oku
            </a>
            <Link href="/abone" className="error-btn error-btn--secondary">
              Abone Ol
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
