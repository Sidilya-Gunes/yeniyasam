// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getJinDergiList } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Jin Dergi — Yeni Yaşam Gazetesi',
  description: 'Jin Dergi haftalık kadın eki, makaleler, söyleşiler ve arşiv.',
};

export const revalidate = 60;

export default async function JinDergiPage() {
  const dergiList = await getJinDergiList();
  const latest = dergiList[0] || {
    id: 1,
    issueNumber: '114',
    title: 'Kadın, Yaşam, Özgürlük',
    issueDate: '29 Ekim 2026',
    coverImage: '/assets/photos/jin.jpeg',
    pdfFile: '/assets/photos/jin.jpeg',
    description: '',
    sectionTitle: '',
    highlightArticles: '',
  };

  // Strapi'deki highlightArticles (Soru / Cevap / Başlık) listesini çözümle
  const rawHighlights = latest.highlightArticles
    ? latest.highlightArticles.split('\n').map((s) => s.trim()).filter(Boolean)
    : [];

  const parsedItems = rawHighlights.map((line) => {
    const delimiterIdx = line.indexOf(':') !== -1 ? line.indexOf(':') : line.indexOf('|');
    if (delimiterIdx > 0 && delimiterIdx < 30) {
      return {
        tag: line.substring(0, delimiterIdx).trim(),
        text: line.substring(delimiterIdx + 1).trim(),
      };
    }
    if (line.endsWith('?')) {
      return { tag: 'SORU', text: line };
    }
    return { tag: '', text: line };
  });

  const headingTitle = latest.sectionTitle || (parsedItems.length > 0 || latest.description ? 'BU SAYIDA NELER VAR?' : '');

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
          Haftalık Kadın Eki{latest.issueNumber ? ` · Sayı: ${latest.issueNumber}` : ''}{latest.title ? ` · "${latest.title}"` : ''}{latest.issueDate ? ` · ${latest.issueDate}` : ''}
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
            <a href={latest.coverImage} target="_blank" rel="noopener noreferrer">
              <img
                src={latest.coverImage}
                alt={`Jin Dergi Sayı ${latest.issueNumber || ''}`}
                style={{ width: '100%', height: 'auto', borderRadius: '4px', display: 'block' }}
              />
            </a>
          </div>
        </div>

        {/* Sağ Blok: Açıklama, Sorular/Başlıklar ve Butonlar */}
        <div>
          {headingTitle && (
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '1rem', borderBottom: '2px solid var(--cat-kadin)', paddingBottom: '0.5rem' }}>
              {headingTitle}
            </h2>
          )}

          {/* Strapi'den girilen açıklama yazısı (varsa görünür, yoksa otomatik yazı basmaz) */}
          {latest.description && (
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {latest.description}
            </p>
          )}

          {/* Soru / Cevap / Dosya kutucukları (Strapi'den girildiyse görünür, girilmediyse hiç çıkmaz) */}
          {parsedItems.length > 0 && (
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {parsedItems.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: '1rem',
                    borderRadius: '6px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {item.tag && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--cat-kadin)', display: 'block', marginBottom: '0.25rem' }}>
                      {item.tag}
                    </span>
                  )}
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--heading)' }}>
                    {item.text}
                  </h3>
                </li>
              ))}
            </ul>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {latest.pdfFile && (
              <a
                href={latest.pdfFile}
                target="_blank"
                rel="noopener noreferrer"
                className="error-btn error-btn--primary"
              >
                PDF Olarak Oku / İndir
              </a>
            )}
            <Link href="/abone" className="error-btn error-btn--secondary">
              Abone Ol
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
