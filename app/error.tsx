'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Üretim ortamında loglama servisine aktarılabilir
    console.error('[Yasam Portal Error]', error);
  }, [error]);

  return (
    <main className="site-main container">
      <div className="error-page" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div className="error-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
          <span className="error-code" style={{ fontSize: '4.5rem', fontWeight: 900, color: 'var(--primary, #cc0000)' }}>
            500
          </span>
          <span className="error-divider" style={{ width: '2px', height: '60px', background: 'var(--border)' }} />
          <div style={{ textAlign: 'left' }}>
            <h1 className="error-title" style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--heading)' }}>
              Beklenmeyen Bir Hata Oluştu
            </h1>
            <p className="error-desc" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
              Sayfa yüklenirken geçici bir sorun meydana geldi. Lütfen tekrar deneyiniz.
            </p>
          </div>
        </div>

        <div className="error-actions" style={{ display: 'flex', gap: '14px', justifyContent: 'center', marginTop: '28px' }}>
          <button
            type="button"
            onClick={() => reset()}
            className="error-btn error-btn--primary"
            style={{
              background: 'var(--primary, #cc0000)',
              color: '#fff',
              border: 'none',
              padding: '10px 24px',
              borderRadius: '4px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'opacity 0.2s',
            }}
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="error-btn error-btn--secondary"
            style={{
              background: 'var(--surface, #fff)',
              color: 'var(--heading)',
              border: '1px solid var(--border)',
              padding: '10px 24px',
              borderRadius: '4px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
