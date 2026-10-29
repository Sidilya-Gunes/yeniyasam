// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reklam ve İş Birliği | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi basılı ve dijital reklam seçenekleri ve sponsorluk.',
};

export default function ReklamPage() {
  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>Reklam</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            Reklam ve Tanıtım
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Yeni Yaşam Gazetesi basılı nüsha ve dijital mecralarında yerinizi alın.
          </p>
        </header>

        <div style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, #e5e7eb)',
          borderRadius: '8px',
          padding: '2.5rem',
          lineHeight: 1.85,
          color: 'var(--text-primary)',
          fontSize: '1rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent)' }}>
            Reklam Alanları ve Modelleri
          </h2>
          <p>
            Yeni Yaşam Gazetesi; kitapseverler, sivil toplum örgütleri, meslek odaları, kültür-sanat kurumları ve bağımsız üreticiler için hedef kitleye doğrudan ulaşan reklam çözümleri sunar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ padding: '1.25rem', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Basılı Gazete</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Tam sayfa, yarım sayfa, çeyrek sayfa ve sürmanşet bant reklamları.
              </p>
            </div>
            <div style={{ padding: '1.25rem', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dijital Web & Mobil</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Ana sayfa tepe banner, haber içi kule banner ve bülten sponsorlukları.
              </p>
            </div>
            <div style={{ padding: '1.25rem', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '6px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Jin Dergi Eki</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Her pazar yayınlanan Jin Dergi sayfa içi ve arka kapak ilanları.
              </p>
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            Rezervasyon & Bilgi Talebi
          </h2>
          <p>
            Fiyat tarifesi ve teknik ölçüler için reklam servisimiz ile irtibata geçebilirsiniz:
          </p>
          <p style={{ fontWeight: 600 }}>
            E-posta: <a href="mailto:yeniyasamgazetesi@gmail.com" style={{ color: 'var(--accent)' }}>yeniyasamgazetesi@gmail.com</a>
          </p>
        </div>
      </div>
    </main>
  );
}
