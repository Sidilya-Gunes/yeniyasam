// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi kişisel verilerin korunması ve gizlilik politikası.',
};

export default function GizlilikPolitikasiPage() {
  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>Gizlilik Politikası</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            Gizlilik Politikası ve KVKK
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Son güncelleme: Ekim 2026
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
            1. Veri Sorumlusu ve Kapsam
          </h2>
          <p>
            Yeni Yaşam Gazetesi olarak okurlarımızın, bülten abonelerimizin ve web sitemizi ziyaret eden kullanıcılarımızın gizliliğine ve kişisel verilerinin güvenliğine en üst düzeyde önem vermekteyiz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca bilgilendirme amacıyla hazırlanmıştır.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            2. Toplanan Kişisel Veriler
          </h2>
          <p>
            Web sitemizi ziyaret ettiğinizde çerezler (cookies) aracılığıyla anonim kullanım istatistikleri, bültenimize abone olduğunuzda e-posta adresiniz, iletişim formunu doldurduğunuzda ise belirttiğiniz ad, e-posta ve mesaj içeriği işlenmektedir.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            3. Verilerin İşlenme Amacı ve Güvenliği
          </h2>
          <p>
            Toplanan veriler yalnızca yayınlarımız hakkında okurlarımızı bilgilendirmek, bültenlerimizi iletmek ve teknik site performansını iyileştirmek amacıyla kullanılır. Verileriniz hiçbir koşulda üçüncü şahıs veya ticari reklam kuruluşlarıyla paylaşılmaz ve satılmaz.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '1.75rem 0 0.75rem 0', color: 'var(--accent)' }}>
            4. İletişim ve Haklarınız
          </h2>
          <p>
            KVKK'nın 11. maddesi kapsamındaki haklarınız uyarınca verilerinizin silinmesini veya güncellenmesini talep etmek için <a href="mailto:yeniyasamgazetesi@gmail.com" style={{ color: 'var(--accent)' }}>yeniyasamgazetesi@gmail.com</a> adresi üzerinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </main>
  );
}
