// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/types/strapi';

export default function IletisimPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });

  useEffect(() => {
    fetch('/api/site-settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.twitter) setSettings(data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '', honeypot: '' });
      } else {
        setError(data.error || 'Mesajınız iletilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
      }
    } catch {
      setError('Bağlantı hatası oluştu. Lütfen doğrudan e-posta adresimiz üzerinden bizimle iletişime geçin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>İletişim</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            İletişim
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Haber ihbarı, öneri, telif ve kurumsal talepleriniz için bize ulaşın.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Info Card */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '2rem',
            lineHeight: 1.8,
            color: 'var(--text-primary)'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--heading)' }}>
              Yeni Yaşam Gazetesi
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>ADRES</div>
              <p style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>Kocatepe Mah. Receppaşa Cad. ATA-KAR İş Merkezi No:5/5 Beyoğlu / İstanbul</p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>TELEFON</div>
              <p style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>+90 530 153 64 49</p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>E-POSTA</div>
              <p style={{ margin: '0.25rem 0' }}>
                <a href={`mailto:${settings.email}`} style={{ color: 'var(--accent)' }}>
                  {settings.email}
                </a>
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>HABER İHBAR & DİJİTAL SERVİS</div>
              <p style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>haber@yeniyasamgazetesi.com</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>SOSYAL MEDYA HESAPLARIMIZ</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {settings.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    𝕏 (Twitter)
                  </a>
                )}
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    Facebook
                  </a>
                )}
                {settings.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    YouTube
                  </a>
                )}
                {settings.bluesky && (
                  <a href={settings.bluesky} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    Bluesky
                  </a>
                )}
                {settings.telegram && (
                  <a href={settings.telegram} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    Telegram
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    TikTok
                  </a>
                )}
                {settings.whatsapp && (
                  <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    WhatsApp
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.65rem', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '0.85rem', color: 'var(--text-primary)', textDecoration: 'none', border: '1px solid var(--border-color)' }}>
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '2rem',
            color: 'var(--text-primary)'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--heading)' }}>
              Mesaj Gönderin
            </h2>

            {sent ? (
              <div style={{
                padding: '1.5rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: '#10b981',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>✓ Mesajınız Alındı!</h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem' }}>
                  Mesajınız gazete merkezimize başarıyla iletildi. En kısa sürede tarafınıza geri dönüş yapılacaktır.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {error && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    color: '#dc2626',
                    fontSize: '0.88rem'
                  }}>
                    {error}
                  </div>
                )}

                {/* Honeypot Spam Koruması */}
                <div style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="company_input">Şirket Adı</label>
                  <input
                    id="company_input"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.honeypot}
                    onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--heading)' }}>
                    Adınız Soyadınız <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--heading)' }}>
                    E-Posta Adresiniz <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={loading}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--heading)' }}>
                    Konu <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={loading}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--heading)' }}>
                    Mesajınız <span style={{ color: 'var(--accent)' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    disabled={loading}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '0.85rem 1.5rem',
                    background: loading ? '#9ca3af' : 'var(--accent, #dc2626)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '0.5rem',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {loading ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
