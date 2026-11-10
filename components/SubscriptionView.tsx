// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUBSCRIPTION_PRODUCTS } from '@/lib/subscription-products';

export default function SubscriptionView() {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');

  const products = SUBSCRIPTION_PRODUCTS.filter((p) => p.type === activeTab);
  const standardProducts = products.filter((p) => p.category === 'standard');
  const supportProducts = products.filter((p) => p.category === 'support');

  return (
    <div>
      {/* Hızlı Erişim & Bilgilendirme Kartları */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3rem',
        }}
      >
        <a
          href="https://eyeniyasam.com/urunler/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--primary, #b91c1c)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '1.5rem',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(185, 28, 28, 0.2)',
            transition: 'transform 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🛍️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: '#fff' }}>
              Abonelik Satın Al
            </h3>
            <p style={{ fontSize: '0.88rem', margin: 0, opacity: 0.9, lineHeight: 1.4 }}>
              1 Aylık, 3 Aylık, 6 Aylık, Yıllık veya Dayanışma paketlerini güvenli İyzico altyapısıyla satın alın.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Paketleri İncele & Satın Al <span>→</span>
          </div>
        </a>

        <a
          href="https://eyeniyasam.com/epanel/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--surface, #ffffff)',
            color: 'var(--text-main, #1e293b)',
            borderRadius: '12px',
            padding: '1.5rem',
            textDecoration: 'none',
            border: '1px solid var(--border, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📖</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--heading, #0f172a)' }}>
              Abone Girişi & E-Gazete
            </h3>
            <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-muted, #64748b)', lineHeight: 1.4 }}>
              Mevcut abonelerimiz e-Panel üzerinden her gün saat 06:00'da çıkan günün e-gazetesini okuyabilir veya PDF indirebilir.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary, #b91c1c)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            E-Panele Giriş Yap <span>→</span>
          </div>
        </a>

        <a
          href="https://eyeniyasam.com/kategori/arsiv/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: 'var(--surface, #ffffff)',
            color: 'var(--text-main, #1e293b)',
            borderRadius: '12px',
            padding: '1.5rem',
            textDecoration: 'none',
            border: '1px solid var(--border, #e2e8f0)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            transition: 'transform 0.15s ease',
          }}
        >
          <div>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🗄️</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--heading, #0f172a)' }}>
              Gazete Arşivi (2018-2026)
            </h3>
            <p style={{ fontSize: '0.88rem', margin: 0, color: 'var(--text-muted, #64748b)', lineHeight: 1.4 }}>
              Yeni Yaşam Gazetesi'nin 2018 yılından bugüne kadar yayınlanan binlerce sayılık dijital gazete arşivini tarayın.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary, #b91c1c)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Tüm Arşivi İncele <span>→</span>
          </div>
        </a>
      </div>

      {/* Tab Değiştirici */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('domestic')}
          style={{
            padding: '12px 28px',
            borderRadius: '30px',
            border: activeTab === 'domestic' ? '2px solid var(--primary, #b91c1c)' : '2px solid var(--border-color, #e2e8f0)',
            backgroundColor: activeTab === 'domestic' ? 'var(--primary, #b91c1c)' : 'var(--surface, #ffffff)',
            color: activeTab === 'domestic' ? '#ffffff' : 'var(--text-main, #1e293b)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'domestic' ? '0 4px 14px rgba(185, 28, 28, 0.25)' : 'none',
          }}
        >
          <span>🇹🇷</span>
          <span>Yurt İçi Abonelikler (₺)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('international')}
          style={{
            padding: '12px 28px',
            borderRadius: '30px',
            border: activeTab === 'international' ? '2px solid var(--primary, #b91c1c)' : '2px solid var(--border-color, #e2e8f0)',
            backgroundColor: activeTab === 'international' ? 'var(--primary, #b91c1c)' : 'var(--surface, #ffffff)',
            color: activeTab === 'international' ? '#ffffff' : 'var(--text-main, #1e293b)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: activeTab === 'international' ? '0 4px 14px rgba(185, 28, 28, 0.25)' : 'none',
          }}
        >
          <span>🌍</span>
          <span>Yurt Dışı Abonelikler (€)</span>
        </button>
      </div>

      {/* Standart E-Abonelik Paketleri */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--heading, #0f172a)' }}>
            Dijital E-Abonelik Paketleri
          </h2>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Her gün çıkan e-gazetenize ve geçmiş tüm arşive sınırsız erişin.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto',
          }}
        >
          {standardProducts.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: 'var(--surface, #ffffff)',
                borderRadius: '12px',
                border: p.popular ? '2px solid var(--primary, #b91c1c)' : '1px solid var(--border, #e2e8f0)',
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: p.popular ? '0 8px 24px rgba(185, 28, 28, 0.12)' : '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              {p.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    backgroundColor: 'var(--primary, #b91c1c)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  En Çok Tercih Edilen
                </div>
              )}

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--heading, #0f172a)', marginBottom: '0.5rem' }}>
                {p.name}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted, #64748b)', minHeight: '44px', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.75rem' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary, #b91c1c)' }}>
                  {p.currencySymbol}{p.price.toLocaleString('tr-TR')}
                </span>
                <span style={{ fontSize: '0.95rem', color: 'var(--text-muted, #64748b)', marginLeft: '6px' }}>
                  / {p.period}
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {p.features.map((feat, fIdx) => (
                  <li key={fIdx} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.4 }}>
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://eyeniyasam.com/urunler/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  backgroundColor: p.popular ? 'var(--primary, #b91c1c)' : 'var(--surface-variant, #f1f5f9)',
                  color: p.popular ? '#fff' : 'var(--text-main, #1e293b)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: p.popular ? 'none' : '1px solid var(--border, #cbd5e1)',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'opacity 0.2s',
                }}
              >
                Hemen Abone Ol (e-YeniYaşam) ›
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Yıllık Destek & Dayanışma Paketleri */}
      <div
        style={{
          backgroundColor: 'var(--bg-main, #f8fafc)',
          borderRadius: '16px',
          padding: '2.5rem 1.5rem',
          border: '1px solid var(--border, #e2e8f0)',
          marginBottom: '4rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2rem' }}>
          <span
            style={{
              color: 'var(--primary, #b91c1c)',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
            }}
          >
            ÖZGÜR BASININ YANINDA DUR
          </span>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, marginTop: '0.25rem', marginBottom: '0.5rem', color: 'var(--heading, #0f172a)' }}>
            Yıllık Destek ve Dayanışma Paketleri
          </h2>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Bu paketler Yıllık Abonelik haklarının tamamını içerir. Paketin amacı Yeni Yaşam Gazetesi ile dayanışmayı ve bağımsız haberciliği büyütmektir.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {supportProducts.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: 'var(--surface, #ffffff)',
                borderRadius: '10px',
                border: '1px solid var(--border, #e2e8f0)',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--heading, #0f172a)', marginBottom: '0.4rem' }}>
                {p.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', minHeight: '40px', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary, #b91c1c)' }}>
                  {p.currencySymbol}{p.price.toLocaleString('tr-TR')}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', marginLeft: '6px' }}>
                  / {p.period}
                </span>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {p.features.map((feat, fIdx) => (
                  <li key={fIdx} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.4 }}>
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://eyeniyasam.com/urunler/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary, #b91c1c)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'opacity 0.2s',
                }}
              >
                Dayanışmaya Katıl (e-YeniYaşam) ›
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* SSS & Güvenlik Bandı */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          borderTop: '1px solid var(--border, #e2e8f0)',
          paddingTop: '3rem',
          marginBottom: '3rem',
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            💳 Güvenli Ödeme Altyapısı
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
            Ödemeleriniz BDDK ve TCMB lisanslı <strong>İyzico</strong> altyapısı ile 256-Bit SSL ve 3D Secure güvencesiyle <strong>e-YeniYaşam (eyeniyasam.com)</strong> üzerinden gerçekleştirilir. Kredi kartı bilgileriniz sunucularda asla tutulmaz.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            📰 Gazeteye Nasıl Erişirim?
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
            Ödemeniz onaylandığı anda hesabınız otomatik olarak aktifleşir. Her sabah saat 06:00'da günün e-gazetesini PDF olarak indirebilir veya dijital arşivden (2018-2026) tüm geçmiş sayılara ulaşabilirsiniz.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            📞 Destek ve İletişim
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
            Abonelik süreci, kurumsal toplu abonelik veya fatura talepleriniz için{' '}
            <Link href="/iletisim" style={{ color: 'var(--primary, #b91c1c)', textDecoration: 'underline' }}>
              iletişim sayfamızdan
            </Link>{' '}
            bizimle dilediğiniz zaman irtibata geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}
