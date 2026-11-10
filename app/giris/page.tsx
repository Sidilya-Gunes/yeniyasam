// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function GirisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/';
  // Güvenli yönlendirme doğrulaması: Yalnızca dahili göreli (relative) rotalara izin ver
  const redirectUrl =
    rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') && !rawRedirect.includes('\\')
      ? rawRedirect
      : '/';

  const { user, login, logout, forgotPassword, isLoading: isAuthLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Forgot password mode
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(identifier.trim(), password);
      if (res.success) {
        setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          router.push(redirectUrl);
          router.refresh();
        }, 800);
      } else {
        setErrorMessage(res.error || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch {
      setErrorMessage('Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotStatus(null);
    setIsSubmitting(true);

    const res = await forgotPassword(forgotEmail.trim());
    setIsSubmitting(false);
    setForgotStatus({
      message: res.message,
      isError: !res.success,
    });
  };

  // If already logged in
  if (!isAuthLoading && user) {
    return (
      <main
        className="site-main container"
        style={{
          padding: '3rem 1rem',
          minHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '440px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '2.5rem 2rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.12)',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--heading)', marginBottom: '0.5rem' }}>
            Oturum Açık
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            <strong>{user.username || user.email}</strong> olarak giriş yapmış durumdasınız.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link
              href="/"
              className="error-btn error-btn--primary"
              style={{ justifyContent: 'center', padding: '11px', textDecoration: 'none' }}
            >
              Ana Sayfaya Dön
            </Link>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--heading)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Farklı Bir Hesapla Giriş Yap (Çıkış)
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="site-main container"
      style={{
        padding: '3rem 1rem',
        minHeight: '65vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <img
            src="/assets/img/yy-logo.png"
            alt="Yeni Yaşam"
            style={{ height: '36px', margin: '0 auto 1rem', display: 'block' }}
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--heading)' }}>
            {isForgotMode ? 'Şifre Sıfırlama' : 'Okur Girişi'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            {isForgotMode
              ? 'Hesabınıza kayıtlı e-posta adresinizi girin'
              : 'Abonelik ve arşiv erişimi için giriş yapın'}
          </p>
        </div>

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#dc2626',
              fontSize: '0.88rem',
              lineHeight: 1.4,
            }}
          >
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#16a34a',
              fontSize: '0.88rem',
              lineHeight: 1.4,
            }}
          >
            {successMessage}
          </div>
        )}

        {/* Forgot Password Mode */}
        {isForgotMode ? (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {forgotStatus && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: forgotStatus.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  border: `1px solid ${forgotStatus.isError ? 'rgba(239, 68, 68, 0.25)' : 'rgba(34, 197, 94, 0.25)'}`,
                  color: forgotStatus.isError ? '#dc2626' : '#16a34a',
                  fontSize: '0.88rem',
                }}
              >
                {forgotStatus.message}
              </div>
            )}

            <div>
              <label
                htmlFor="forgotEmail"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.4rem' }}
              >
                Kayıtlı E-posta Adresi
              </label>
              <input
                id="forgotEmail"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
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
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="error-btn error-btn--primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsForgotMode(false);
                setForgotStatus(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'center',
                marginTop: '0.25rem',
              }}
            >
              ← Giriş Ekranına Dön
            </button>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                htmlFor="loginIdentifier"
                style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--heading)', marginBottom: '0.4rem' }}
              >
                E-posta veya Kullanıcı Adı
              </label>
              <input
                id="loginIdentifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
                placeholder="ornek@domain.com veya kullanıcı adı"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-soft)',
                  color: 'var(--text)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label
                  htmlFor="loginPassword"
                  style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--heading)' }}
                >
                  Şifre
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setForgotEmail(identifier.includes('@') ? identifier : '');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.8rem',
                    color: 'var(--primary)',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Şifremi unuttum
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="loginPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.5rem 0.75rem 1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--bg-soft)',
                    color: 'var(--text)',
                    fontSize: '0.95rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="error-btn error-btn--primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.5rem',
                padding: '12px',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: '2rem',
            textAlign: 'center',
            fontSize: '0.88rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '1.5rem',
          }}
        >
          Henüz hesabınız yok mu?{' '}
          <Link href="/abone" style={{ color: 'var(--primary)', fontWeight: 700 }}>
            Abone Olun
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function GirisPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Yükleniyor...</div>
        </div>
      }
    >
      <GirisContent />
    </Suspense>
  );
}
