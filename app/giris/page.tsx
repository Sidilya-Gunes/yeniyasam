// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GirisPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Giriş sistemi Strapi Auth ile entegre edilecektir.');
  };

  return (
    <main className="site-main container" style={{ padding: '3rem 1rem', minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/assets/img/yy-logo.png"
            alt="Yeni Yaşam"
            style={{ height: '36px', margin: '0 auto 1rem', display: 'block' }}
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--heading)' }}>
            Okur Girişi
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Abonelik ve arşiv erişimi için giriş yapın
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label htmlFor="loginEmail" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.4rem' }}>
              E-posta Adresi
            </label>
            <input
              id="loginEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ornek@domain.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-soft)',
                color: 'var(--text)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label htmlFor="loginPassword" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--heading)' }}>
                Şifre
              </label>
              <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>
                Şifremi unuttum
              </a>
            </div>
            <input
              id="loginPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-soft)',
                color: 'var(--text)',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <button
            type="submit"
            className="error-btn error-btn--primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '12px' }}
          >
            Giriş Yap
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
          Henüz hesabınız yok mu?{' '}
          <Link href="/abone" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Abone Olun
          </Link>
        </div>
      </div>
    </main>
  );
}
