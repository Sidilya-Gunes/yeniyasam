// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Çerez Politikası | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi çerez kullanım politikası ve tercihleri.',
};

export default function CerezPolitikasiPage() {
  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>Çerez Politikası</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            Çerez (Cookie) Politikası
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Kullanıcı deneyimi ve tercihlerin yönetimi hakkında bilgiler
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
            Çerez Nedir?
          </h2>
          <p>
            Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin daha verimli çalışmasını sağlamak, koyu/açık tema tercihleriniz gibi ayarlarınızı hatırlamak amacıyla kullanılır.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            Kullandığımız Çerez Türleri
          </h2>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Zorunlu Çerezler:</strong> Web sitesinin temel fonksiyonlarının düzgün çalışması için gereklidir (örneğin oturum yönetimi ve güvenlik).
            </li>
            <li>
              <strong>Tercih Çerezleri:</strong> Gece modu / gündüz modu ve yazı boyutu gibi kişisel ayarlarınızı hatırlar.
            </li>
            <li>
              <strong>İstatistiksel Çerezler:</strong> Ziyaretçi sayılarını ve popüler haberleri anonim olarak analiz etmemizi sağlar.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            Çerezleri Nasıl Yönetebilirsiniz?
          </h2>
          <p>
            Tarayıcınızın ayarlarından dilediğiniz zaman çerezleri silebilir veya çerez kullanımını engelleyebilirsiniz. Ancak zorunlu çerezleri devre dışı bırakmanız halinde sitemizin bazı fonksiyonları düzgün çalışmayabilir.
          </p>
        </div>
      </div>
    </main>
  );
}
