

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/types/strapi';

interface FooterProps {
  initialSettings?: SiteSettings;
}

export default function Footer({ initialSettings }: FooterProps = {}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    } else {
      fetch('/api/site-settings')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.twitter) setSettings(data);
        })
        .catch(() => {});
    }
  }, [initialSettings]);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message || 'Bülten kaydınız başarıyla alındı.');
        setEmail('');
      } else {
        setStatus('error');
        setFeedback(data.error || 'Bülten kaydı oluşturulamadı.');
      }
    } catch {
      setStatus('error');
      setFeedback('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    } finally {
      setTimeout(() => {
        setStatus('idle');
        setFeedback('');
      }, 5000);
    }
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
              <a href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
            <div className="footer-social">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {settings.bluesky && (
                <a href={settings.bluesky} target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                  </svg>
                </a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
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
              <li><Link href="/kategori/spor">Spor</Link></li>
              <li><Link href="/video">Video</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Yayınlar</h4>
            <ul className="footer-links">
              <li><Link href="/yazarlar">Yazarlar</Link></li>
              <li><Link href="/manset">Günün Manşeti</Link></li>
              <li><Link href="/kategori/ozel-haber">Özel Haber</Link></li>
              <li><Link href="/kategori/dosya">Dosya</Link></li>
              <li><Link href="/kategori/editorun-sectikleri">Editörün Seçtikleri</Link></li>
              <li><a href="https://eyeniyasam.com/urunler/" target="_blank" rel="noopener noreferrer">E-Gazete Aboneliği</a></li>
              <li><a href="https://eyeniyasam.com/kategori/arsiv/" target="_blank" rel="noopener noreferrer">Gazete Arşivi (2018-2026)</a></li>
              <li><a href="https://eyeniyasam.com/epanel/" target="_blank" rel="noopener noreferrer">Abone Girişi</a></li>
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
                disabled={status === 'loading'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Abone Ol"
                disabled={status === 'loading'}
                style={{ opacity: status === 'loading' ? 0.6 : 1 }}
              >
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
              <p style={{ color: '#10b981', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>
                ✓ {feedback || 'Bülten kaydınız başarıyla alındı.'}
              </p>
            )}
            {status === 'error' && (
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>
                ✕ {feedback || 'Kayıt yapılamadı. Lütfen tekrar deneyin.'}
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
