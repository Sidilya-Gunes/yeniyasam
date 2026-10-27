// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import SearchOverlay from '@/components/SearchOverlay';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setIsScrolled(y > 120);
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
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://bsky.app" target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
                  </svg>
                </a>
              </div>

              <Link href="/giris" className="btn-login">
                Giriş Yap
              </Link>
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
              <Link href="/abone" className="btn-subscribe" onClick={closeMenu}>
                Abone Ol
              </Link>
              <Link href="/giris" className="btn-login" onClick={closeMenu}>
                Giriş Yap
              </Link>
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
                <Link href="/kategori/guncel" onClick={closeMenu}>Güncel</Link>
              </li>
              <li>
                <Link href="/yazarlar" onClick={closeMenu}>Yazarlar</Link>
              </li>
              <li>
                <Link href="/kategori/video" onClick={closeMenu}>Video</Link>
              </li>
              <li>
                <Link href="/kategori/dunya" onClick={closeMenu}>Dünya</Link>
              </li>
              <li>
                <Link href="/kategori/kadin" onClick={closeMenu}>Kadın</Link>
              </li>
              <li>
                <Link href="/kategori/ekoloji" onClick={closeMenu}>Ekoloji</Link>
              </li>
              <li>
                <Link href="/kategori/soylesi" onClick={closeMenu}>Söyleşi</Link>
              </li>
              <li>
                <Link href="/kategori/forum" onClick={closeMenu}>Forum</Link>
              </li>
              <li>
                <Link href="/kategori/dosya" onClick={closeMenu}>Dosya</Link>
              </li>
              <li>
                <Link href="/kategori/politika" onClick={closeMenu}>Politika</Link>
              </li>
              <li>
                <Link href="/kategori/kultur-sanat" onClick={closeMenu}>Kültür-Sanat</Link>
              </li>
              <li>
                <Link href="/kategori/ekonomi" onClick={closeMenu}>Emek-Ekonomi</Link>
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
              <a href="https://facebook.com" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
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
