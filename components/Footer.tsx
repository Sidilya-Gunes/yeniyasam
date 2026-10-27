// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-col footer-col--brand">
            <Link href="/" className="footer-logo">
              <img
                src="/assets/img/yy-logo.png"
                alt="Yeni Yaşam"
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-tagline">
              <a href="mailto:yeniyasamgazetesi@gmail.com">
                yeniyasamgazetesi@gmail.com
              </a>
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Kategoriler</h4>
            <ul className="footer-links">
              <li><Link href="/kategori/guncel">Güncel</Link></li>
              <li><Link href="/kategori/politika">Politika</Link></li>
              <li><Link href="/kategori/dunya">Dünya</Link></li>
              <li><Link href="/kategori/kadin">Kadın</Link></li>
              <li><Link href="/kategori/ekoloji">Ekoloji</Link></li>
              <li><Link href="/kategori/ekonomi">Ekonomi</Link></li>
              <li><Link href="/kategori/kultur-sanat">Kültür-Sanat</Link></li>
              <li><Link href="/kategori/soylesi">Söyleşi</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Kurumsal</h4>
            <ul className="footer-links">
              <li><Link href="/hakkimizda">Hakkımızda</Link></li>
              <li><Link href="/kunye">Künye</Link></li>
              <li><Link href="/iletisim">İletişim</Link></li>
              <li><Link href="/reklam">Reklam</Link></li>
              <li><Link href="/gizlilik-politikasi">Gizlilik Politikası</Link></li>
              <li><Link href="/kullanim-kosullari">Kullanım Koşulları</Link></li>
              <li><Link href="/cerez-politikasi">Çerez Politikası</Link></li>
              <li><Link href="/rss">RSS</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-col--newsletter">
            <h4 className="footer-col-title">Bültenimize Abone Olun</h4>
            <p className="footer-newsletter-desc">
              Günün öne çıkan haberleri ve analizler her sabah mailinizde.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                placeholder="E-posta adresiniz"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" aria-label="Abone Ol">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>
            {status === 'success' && (
              <p style={{ color: 'var(--cat-ekoloji)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                ✓ Bülten kaydınız başarıyla alındı.
              </p>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © {new Date().getFullYear()} Yeni Yaşam Gazetesi. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
}
