// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi web sitesi kullanım koşulları ve telif kuralları.',
};

export default function KullanimKosullariPage() {
  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>Kullanım Koşulları</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            Kullanım Koşulları
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Site kullanım ve içerik telif ilkeleri
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
            1. Telif Hakları ve Alıntı Şartları
          </h2>
          <p>
            Yeni Yaşam Gazetesi web sitesinde (yeniyasamgazetesi.com) yayınlanan tüm özel haberler, fotoğraflar, köşe yazıları ve karikatürler telif hakları ile korunmaktadır.
          </p>
          <p>
            Haberlerimiz ve içeriklerimiz, aktif kaynak bağlantısı verilmesi ve haber içeriğinin bağlamından koparılmaması koşuluyla alıntılanabilir. Ticari amaçlarla izin alınmaksızın çoğaltılamaz veya satılamaz.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            2. Yorum ve Okur Katkıları
          </h2>
          <p>
            Sitemizde veya sosyal medya sayfalarımızda yer alan yorumlarda nefret söylemi, ırkçılık, cinsiyetçilik veya suç unsuru teşkil eden ifadeler yer alamaz. Bu tür içerikler denetim esnasında kaldırılır.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            3. Değişiklik Hakkı
          </h2>
          <p>
            Yeni Yaşam Gazetesi, bu kullanım koşullarında önceden bildirmeksizin değişiklik yapma hakkını saklı tutar.
          </p>
        </div>
      </div>
    </main>
  );
}
