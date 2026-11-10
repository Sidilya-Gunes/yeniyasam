// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const price = searchParams.get('price');
  const currency = searchParams.get('currency');
  const message = searchParams.get('message');

  const isSuccess = status === 'success';

  const currencySymbol = currency === 'EUR' ? '€' : '₺';

  return (
    <div
      style={{
        maxWidth: '640px',
        margin: '3rem auto',
        padding: '2.5rem',
        borderRadius: '12px',
        backgroundColor: 'var(--surface)',
        border: `1px solid ${isSuccess ? '#10b981' : '#ef4444'}`,
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        textAlign: 'center',
      }}
    >
      {isSuccess ? (
        <>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.4rem',
              margin: '0 auto 1.5rem',
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Aboneliğiniz Başarıyla Başlatıldı!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Yeni Yaşam Gazetesi bağımsız habercilik mücadelesine sunduğunuz değerli dayanışma için sonsuz teşekkür ederiz.
          </p>

          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '2rem',
              textAlign: 'left',
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {orderId && (
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>İşlem Referans No:</strong>{' '}
                <span style={{ fontFamily: 'monospace' }}>{orderId}</span>
              </div>
            )}
            {price && (
              <div>
                <strong style={{ color: 'var(--text-muted)' }}>Ödenen Tutar:</strong>{' '}
                <span>{currencySymbol}{price}</span>
              </div>
            )}
            <div>
              <strong style={{ color: 'var(--text-muted)' }}>Erişim Durumu:</strong>{' '}
              <span style={{ color: '#059669', fontWeight: 700 }}>Aktif (Tüm Dijital Arşiv & PDF Açık)</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Ana Sayfaya Dön
            </Link>
            <Link
              href="/manset"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '6px',
                backgroundColor: 'var(--surface-variant)',
                color: 'var(--text-main)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Günün Gazetesini Oku
            </Link>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.4rem',
              margin: '0 auto 1.5rem',
            }}
          >
            ✕
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            Ödeme Tamamlanamadı
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {message ? decodeURIComponent(message) : 'Ödeme sırasında bankanızdan onay alınamadı veya işlem iptal edildi.'}
          </p>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Kartınızın internet alışverişine açık olduğundan ve limitinizin yeterli olduğundan emin olarak tekrar deneyebilirsiniz.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              href="/abone"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary)',
                color: '#fff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Tekrar Dene
            </Link>
            <Link
              href="/iletisim"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                borderRadius: '6px',
                backgroundColor: 'var(--surface-variant)',
                color: 'var(--text-main)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Destek Al
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <main className="container" style={{ padding: '3rem 1rem' }}>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Yükleniyor...</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}
