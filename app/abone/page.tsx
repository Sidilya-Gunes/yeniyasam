// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Yeni Yaşam'a Abone Ol — Bağımsız Haberciliğe Güç Kat",
  description: 'Yeni Yaşam Gazetesi dijital ve basılı abonelik paketleri.',
};

export default function AbonePage() {
  const plans = [
    {
      name: 'Dijital Abonelik',
      price: '₺75',
      period: '/ ay',
      desc: 'Tüm haberlere, analizlere ve dijital arşive sınırsız erişim.',
      features: [
        'Web sitesi ve mobil uygulamada reklamsız deneyim',
        'Her sabah e-gazete PDF baskısına erişim',
        'Özel dosya haberler ve köşe yazılarına öncelikli okuma',
        'Jin Dergi haftalık ekine tam erişim',
      ],
      cta: 'Dijital Abone Ol',
      featured: false,
    },
    {
      name: 'Dayanışma Paketi',
      price: '₺200',
      period: '/ ay',
      desc: 'Özgür basını ve bağımsız haberciliği büyütmek için dayanışma katkısı.',
      features: [
        'Tüm Dijital Abonelik hakları',
        'Öğrenci ve cezaevleri için askıda gazete desteği',
        'Yeni Yaşam kitap ve bülten seçkisi',
        'Editörlerle aylık çevrim içi değerlendirme toplantıları',
      ],
      cta: 'Dayanışmaya Katıl',
      featured: true,
    },
    {
      name: 'Basılı Gazete',
      price: '₺350',
      period: '/ ay',
      desc: 'Her gün basılı gazeteniz kapınıza veya iş yerinize gelsin.',
      features: [
        'Adresinize günlük fiziki gazete teslimatı',
        'Haftalık Jin Dergi eki dahil',
        'Tam dijital e-gazete erişimi',
        'Yıllık abonelerde özel arşiv dergisi hediyesi',
      ],
      cta: 'Basılı Abone Ol',
      featured: false,
    },
  ];

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <header className="archive-header" style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3rem' }}>
        <span style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem' }}>
          BAĞIMSIZ HABERCİLİK İÇİN
        </span>
        <h1 className="archive-title" style={{ fontSize: '2.4rem', margin: '0.5rem 0 1rem' }}>
          Yeni Yaşam'a Abone Ol
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Hakikatin sesi olmak, sansüre karşı halkın haber alma hakkını savunmak için Yeni Yaşam’a abone olun; özgür basına güç katın.
        </p>
      </header>

      {/* Paket Kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {plans.map((plan, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: 'var(--surface)',
              borderRadius: '10px',
              border: plan.featured ? '2px solid var(--primary)' : '1px solid var(--border)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              boxShadow: plan.featured ? '0 10px 30px rgba(204, 0, 0, 0.12)' : 'none',
            }}
          >
            {plan.featured && (
              <span
                style={{
                  position: 'absolute',
                  top: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                }}
              >
                En Çok Tercih Edilen
              </span>
            )}

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '0.5rem' }}>
              {plan.name}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', minHeight: '44px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {plan.desc}
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--heading)' }}>
                {plan.price}
              </span>
              <span style={{ color: 'var(--text-soft)', marginLeft: '6px', fontSize: '0.95rem' }}>
                {plan.period}
              </span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {plan.features.map((feat, fIdx) => (
                <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text)' }}>
                  <span style={{ color: 'var(--cat-ekoloji)', fontWeight: 800 }}>✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`error-btn ${plan.featured ? 'error-btn--primary' : 'error-btn--secondary'}`}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* SSS ve Destek */}
      <section style={{ maxWidth: '780px', margin: '0 auto', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '1.5rem', textAlign: 'center' }}>
          Sıkça Sorulan Sorular
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.5rem' }}>
              Aboneliğimi istediğim zaman iptal edebilir miyim?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Evet, dilediğiniz zaman profil ayarlarınızdan veya destek hattımızla iletişime geçerek aboneliğinizi sonlandırabilirsiniz.
            </p>
          </div>
          <div style={{ backgroundColor: 'var(--surface)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.5rem' }}>
              E-Gazete PDF baskısını nasıl okuyabilirim?
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Dijital veya basılı abone olan tüm okurlarımız, her sabah saat 06:00 itibarıyla site üzerinden günün gazetesini tam sayfa PDF formatında görüntüleyebilir ve indirebilir.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
