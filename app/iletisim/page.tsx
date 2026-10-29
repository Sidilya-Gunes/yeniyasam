// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function IletisimPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
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
            background: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '8px',
            padding: '2rem',
            lineHeight: 1.8
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Yeni Yaşam Gazetesi
            </h2>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>ADRES</div>
              <p style={{ margin: '0.25rem 0' }}>Cağaloğlu, Mollafenari Mah. Babıali Cad. No: 18 Fatih / İstanbul</p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>E-POSTA</div>
              <p style={{ margin: '0.25rem 0' }}>
                <a href="mailto:yeniyasamgazetesi@gmail.com" style={{ color: 'var(--accent)' }}>
                  yeniyasamgazetesi@gmail.com
                </a>
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>HABER İHBAR & DİJİTAL SERVİS</div>
              <p style={{ margin: '0.25rem 0' }}>haber@yeniyasamgazetesi.com</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.9rem' }}>SOSYAL MEDYA</div>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Bizi X (Twitter), Facebook, YouTube, Bluesky ve Instagram üzerinden takip edebilirsiniz.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div style={{
            background: 'var(--card-bg, #ffffff)',
            border: '1px solid var(--border-color, #e5e7eb)',
            borderRadius: '8px',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1.25rem' }}>
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
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  En kısa sürede tarafınıza geri dönüş yapılacaktır. Teşekkür ederiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Adınız Soyadınız
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color, #d1d5db)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    E-Posta Adresiniz
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color, #d1d5db)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Konu
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color, #d1d5db)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Mesajınız
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border-color, #d1d5db)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '0.85rem 1.5rem',
                    background: 'var(--accent, #dc2626)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '0.5rem'
                  }}
                >
                  Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
