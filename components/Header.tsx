

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import SearchOverlay from '@/components/SearchOverlay';
import { useAuth } from '@/context/AuthContext';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/types/strapi';

interface HeaderProps {
  initialSettings?: SiteSettings;
}

export default function Header({ initialSettings }: HeaderProps = {}) {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY || window.pageYOffset;
          // Yumuşak geçiş ve sıçramayı önleyen histerezis eşiği
          setIsScrolled((prev) => (y > (prev ? 240 : 280)));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  return (
    <>
      <header
        className={`site-header ${isScrolled ? 'scrolled' : ''}`}
        id="siteHeader"
      >
        <div className="header-normal">
          <div className="header-top container">
            <div className="header-left-info">
              <ThemeToggle />
            </div>

            <button
              type="button"
              className="mobile-menu-toggle"
              aria-label="Menüyü Aç"
              onClick={openMenu}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="2" y1="7" x2="12" y2="7" />
                <line x1="2" y1="13" x2="9" y2="13" />
                <line x1="2" y1="19" x2="12" y2="19" />
                <circle cx="18" cy="14" r="5" />
                <line x1="21.5" y1="17.5" x2="24" y2="20" />
              </svg>
            </button>

            <Link href="/" className="header-logo-mobile">
              <img src="/assets/img/yy-logo.png" alt="Yeni Yaşam" />
            </Link>

            <div className="header-right-actions">
              <button
                type="button"
                className="header-search-btn"
                id="headerSearchBtn"
                aria-label="Sitede ara"
                aria-expanded={isSearchOpen}
                onClick={() => setIsSearchOpen(true)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              <div className="header-social-icons">
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {settings.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {settings.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {settings.bluesky && (
                  <a href={settings.bluesky} target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                    </svg>
                  </a>
                )}
                {settings.telegram && (
                  <a href={settings.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  </a>
                )}
                {settings.whatsapp && (
                  <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                )}
              </div>

              {user ? (
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="btn-login"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      background: 'transparent',
                    }}
                    aria-label="Kullanıcı Menüsü"
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'uppercase',
                      }}
                    >
                      {user.username?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.username || user.email.split('@')[0]}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 6px)',
                        minWidth: '190px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        zIndex: 100,
                        padding: '6px 0',
                      }}
                    >
                      <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--heading)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.username}
                        </div>
                        <div style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {user.email}
                        </div>
                        {user.subscription && (
                          <div style={{ marginTop: '5px' }}>
                            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#ecfdf5', color: '#059669', fontWeight: 700, display: 'inline-block' }}>
                              ✓ {user.subscription.status === 'Aktif' ? 'Aktif Abone' : user.subscription.status}
                            </span>
                          </div>
                        )}
                      </div>
                      <Link
                        href="https://eyeniyasam.com/urunler/"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '8px 12px',
                          fontSize: '0.82rem',
                          color: 'var(--heading)',
                          textDecoration: 'none',
                        }}
                      >
                        Abonelik Paketleri
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '0.82rem',
                          color: '#dc2626',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          borderTop: '1px solid var(--border-light)',
                        }}
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href="https://eyeniyasam.com/urunler/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-subscribe"
                    style={{ textDecoration: 'none' }}
                  >
                    E-Gazete & Abone Ol
                  </a>
                  <a
                    href="https://eyeniyasam.com/epanel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-login"
                    style={{ textDecoration: 'none' }}
                  >
                    Giriş Yap
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ana Menü Çekmecesi & Masaüstü Menü */}
        <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`} id="mainNav">
          <button
            type="button"
            className="menu-close-btn"
            aria-label="Menüyü Kapat"
            onClick={closeMenu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>

          <div className="container main-nav-container">
            <div className="mobile-auth-buttons">
              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textTransform: 'uppercase',
                      }}
                    >
                      {user.username?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--heading)' }}>
                      {user.username || user.email}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                    <a
                      href="https://eyeniyasam.com/urunler/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-subscribe"
                      onClick={closeMenu}
                      style={{ flex: 1, textAlign: 'center', padding: '6px 12px' }}
                    >
                      Abonelik
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                      className="btn-login"
                      style={{ flex: 1, cursor: 'pointer', background: 'transparent', padding: '6px 12px' }}
                    >
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <a href="https://eyeniyasam.com/urunler/" target="_blank" rel="noopener noreferrer" className="btn-subscribe" onClick={closeMenu}>
                    Abone Ol
                  </a>
                  <Link href="/giris" className="btn-login" onClick={closeMenu}>
                    Giriş Yap
                  </Link>
                </>
              )}
            </div>

            <form
              className="mobile-menu-search"
              action="/arama"
              method="get"
              role="search"
              onSubmit={() => closeMenu()}
            >
              <div className="mobile-search-box">
                <input
                  type="text"
                  name="q"
                  placeholder="Sitede ara..."
                  aria-label="Sitede ara"
                  autoComplete="off"
                />
                <button type="submit" aria-label="Ara">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </form>

            <ul className="mobile-nav-list">
              <li>
                <Link href="/" onClick={closeMenu}>Tüm Haberler</Link>
              </li>
              <li>
                <Link href="/yazarlar" onClick={closeMenu}>Yazarlar</Link>
              </li>
              <li>
                <Link href="/manset" onClick={closeMenu}>Günün Manşeti</Link>
              </li>
              <li>
                <Link href="/kategori/guncel" onClick={closeMenu}>Güncel</Link>
              </li>
              <li>
                <Link href="/kategori/politika" onClick={closeMenu}>Politika</Link>
              </li>
              <li>
                <Link href="/kategori/kadin" onClick={closeMenu}>Kadın</Link>
              </li>
              <li>
                <Link href="/kategori/ekoloji" onClick={closeMenu}>Ekoloji</Link>
              </li>
              <li>
                <Link href="/kategori/ekonomi" onClick={closeMenu}>Ekonomi</Link>
              </li>
              <li>
                <Link href="/kategori/kultur-sanat" onClick={closeMenu}>Kültür-Sanat</Link>
              </li>
              <li>
                <Link href="/kategori/genclik" onClick={closeMenu}>Gençlik</Link>
              </li>
              <li>
                <Link href="/kategori/toplum-yasam" onClick={closeMenu}>Toplum-Yaşam</Link>
              </li>
              <li>
                <Link href="/kategori/dunya" onClick={closeMenu}>Dünya</Link>
              </li>
              <li>
                <Link href="/kategori/soylesi" onClick={closeMenu}>Söyleşi</Link>
              </li>
              <li>
                <Link href="/kategori/dosya" onClick={closeMenu}>Dosya</Link>
              </li>
              <li>
                <Link href="/kategori/forum" onClick={closeMenu}>Forum</Link>
              </li>
              <li>
                <Link href="/kategori/ozel-haber" onClick={closeMenu}>Özel Haber</Link>
              </li>
              <li>
                <Link href="/kategori/editorun-sectikleri" onClick={closeMenu}>Editörün Seçtikleri</Link>
              </li>
              <li>
                <Link href="/gunun-fotografi" onClick={closeMenu}>Günün Fotoğrafı</Link>
              </li>
              <li>
                <Link href="/kategori/panorama" onClick={closeMenu}>Panorama</Link>
              </li>
              <li>
                <Link href="/kategori/spor" onClick={closeMenu}>Spor</Link>
              </li>
              <li>
                <Link href="/video" onClick={closeMenu}>Video</Link>
              </li>
            </ul>

            <div className="nav-group nav-group-left">
              <ul className="nav-list">
                <li>
                  <Link href="/kategori/dunya">Dünya</Link>
                </li>
                <li className="dot">•</li>
                <li>
                  <Link href="/kategori/kadin">Kadın</Link>
                </li>
                <li className="dot">•</li>
                <li>
                  <Link href="/kategori/ekoloji">Ekoloji</Link>
                </li>
              </ul>
            </div>

            <div className="logo-area">
              <Link href="/" className="site-logo-link">
                <img
                  src="/assets/img/yy-logo.png"
                  alt="Yeni Yaşam Logo"
                  className="site-logo-img"
                />
              </Link>
            </div>

            <div className="nav-group nav-group-right">
              <ul className="nav-list">
                <li>
                  <Link href="/kategori/politika">Politika</Link>
                </li>
                <li className="dot">•</li>
                <li>
                  <Link href="/kategori/ekonomi">Ekonomi</Link>
                </li>
                <li className="dot">•</li>
                <li>
                  <Link href="/kategori/kultur-sanat">Kültür</Link>
                </li>
              </ul>
            </div>

            <div className="mobile-menu-social">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {settings.twitter && (
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {settings.bluesky && (
                <a href={settings.bluesky} target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                  </svg>
                </a>
              )}
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              )}
              {settings.tiktok && (
                <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </nav>

        {/* Kompakt Başlık (Aşağı kaydırıldığında görünür) */}
        <div className="header-compact">
          <div className="container header-compact-inner">
            <div className="compact-left">
              <ThemeToggle />
            </div>
            <Link href="/" className="compact-logo">
              <img src="/assets/img/yy-logo.png" alt="Yeni Yaşam" />
            </Link>
            <div className="compact-right">
              <button
                type="button"
                className="compact-toggle"
                aria-label="Menüyü Aç"
                onClick={openMenu}
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="2" y1="7" x2="12" y2="7" />
                  <line x1="2" y1="13" x2="9" y2="13" />
                  <line x1="2" y1="19" x2="12" y2="19" />
                  <circle cx="18" cy="14" r="5" />
                  <line x1="21.5" y1="17.5" x2="24" y2="20" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Arama Katmanı */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
