// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SUBSCRIPTION_PRODUCTS, SubscriptionProduct } from '@/lib/subscription-products';
import SubscriptionModal from './SubscriptionModal';

export default function SubscriptionView() {
  const [activeTab, setActiveTab] = useState<'domestic' | 'international'>('domestic');
  const [selectedProduct, setSelectedProduct] = useState<SubscriptionProduct | null>(null);

  const products = SUBSCRIPTION_PRODUCTS.filter((p) => p.type === activeTab);
  const standardProducts = products.filter((p) => p.category === 'standard');
  const supportProducts = products.filter((p) => p.category === 'support');

  return (
    <div>
      {/* Tab Değiştirici */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '3rem',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '860px',
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
                boxShadow: p.popular ? '0 12px 30px rgba(185, 28, 28, 0.12)' : '0 4px 12px rgba(0,0,0,0.03)',
                transition: 'transform 0.2s ease',
              }}
            >
              {p.popular && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--primary, #b91c1c)',
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

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--heading, #0f172a)', marginBottom: '0.5rem' }}>
                {p.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', minHeight: '48px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                {p.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--heading, #0f172a)' }}>
                  {p.currencySymbol}{p.price.toLocaleString('tr-TR')}
                </span>
                <span style={{ fontSize: '1rem', color: 'var(--text-muted, #64748b)', marginLeft: '6px' }}>
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

              <button
                type="button"
                onClick={() => setSelectedProduct(p)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '6px',
                  backgroundColor: p.popular ? 'var(--primary, #b91c1c)' : 'var(--surface-variant, #f1f5f9)',
                  color: p.popular ? '#fff' : 'var(--text-main, #1e293b)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: p.popular ? 'none' : '1px solid var(--border, #cbd5e1)',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                Hemen Abone Ol
              </button>
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
            Bu paketler Yıllık Abonelik haklarının tamamını içerir. Ek bedeller doğrudan bağımsız halk haberciliği, askıda gazete fonu ve sansürsüz yayıncılık için kullanılmaktadır.
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

              <button
                type="button"
                onClick={() => setSelectedProduct(p)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--primary, #b91c1c)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                }}
              >
                Dayanışmaya Katıl
              </button>
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
            Ödemeleriniz BDDK ve TCMB lisanslı <strong>İyzico</strong> altyapısı ile 256-Bit SSL ve 3D Secure güvencesiyle doğrudan site içinde tamamlanır. Kredi kartı bilgileriniz sunucularımızda asla tutulmaz.
          </p>
        </div>

        <div>
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            📰 Gazeteye Nasıl Erişirim?
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted, #64748b)', lineHeight: 1.5 }}>
            Ödemeniz onaylandığı anda hesabınız otomatik olarak aktifleşir. Her sabah saat 06:00'da günün e-gazetesini PDF olarak indirebilir veya dijital arşivden tüm geçmiş sayılara ulaşabilirsiniz.
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

      {/* Ödeme Modalı */}
      <SubscriptionModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
