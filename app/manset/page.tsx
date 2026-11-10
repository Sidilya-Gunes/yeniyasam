// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getMansetList } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Günün Manşeti — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi günlük basılı manşeti, birinci sayfa arşivi ve e-gazete.',
};

export const revalidate = 60;

export default async function MansetPage() {
  const mansetler = await getMansetList();
  const latest = mansetler[0] || {
    id: 1,
    issueNumber: '3556',
    issueDate: '29 Ekim 2026',
    coverImage: '/assets/photos/yy.jpg',
    pdfFile: '/assets/photos/yy.jpg',
    description: 'Günlük Siyasi Gazete',
  };
  const pastIssues = mansetler.slice(1);

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
              Sayı: {latest.issueNumber || '—'} · {latest.issueDate || ''} · {latest.description || 'Günlük Siyasi Gazete'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://eyeniyasam.com/kategori/arsiv/"
              target="_blank"
              rel="noopener noreferrer"
              className="error-btn error-btn--secondary"
              style={{ fontSize: '0.8rem', padding: '10px 18px', textDecoration: 'none' }}
            >
              Tüm Gazete Arşivi (2018-2026) ›
            </a>
            <a
              href={latest.coverImage}
              target="_blank"
              rel="noopener noreferrer"
              className="error-btn error-btn--primary"
              style={{ fontSize: '0.8rem', padding: '10px 18px' }}
            >
              Tam Boyut İncele
            </a>
            {latest.pdfFile && (
              <a
                href={latest.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                download={`yeni-yasam-${latest.issueNumber || 'manset'}.pdf`}
                className="error-btn error-btn--secondary"
                style={{ fontSize: '0.8rem', padding: '10px 18px' }}
              >
                PDF İndir
              </a>
            )}
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
            src={latest.coverImage}
            alt={`Yeni Yaşam Gazetesi Sayı ${latest.issueNumber || ''}`}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }}
          />
        </div>
      </section>

      {/* Önceki Günlerin Manşetleri */}
      {pastIssues.length > 0 && (
        <section style={{ borderTop: '2px solid var(--border)', paddingTop: '2.5rem' }}>
          <div className="section-title-bar" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--heading)' }}>
              ÖNCEKİ SAYILARIN MANŞETLERİ
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {pastIssues.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                }}
              >
                <a href={item.coverImage} target="_blank" rel="noopener noreferrer">
                  <img
                    src={item.coverImage}
                    alt={item.issueDate || `Sayı ${item.issueNumber}`}
                    style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '0.75rem' }}
                  />
                </a>
                <span style={{ display: 'block', fontWeight: 700, color: 'var(--heading)', fontSize: '0.9rem' }}>
                  {item.issueDate}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                  Sayı: {item.issueNumber}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
