// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Sayfa Bulunamadı — Yeni Yaşam Gazetesi',
  description: 'Aradığınız sayfa silinmiş, taşınmış veya adresi değişmiş olabilir.',
};

export default function NotFound() {
  const suggestedCategories = [
    { name: 'Politika', slug: 'politika' },
    { name: 'Kadın', slug: 'kadin' },
    { name: 'Ekoloji', slug: 'ekoloji' },
    { name: 'Dünya', slug: 'dunya' },
    { name: 'Ekonomi', slug: 'ekonomi' },
    { name: 'Kültür-Sanat', slug: 'kultur-sanat' },
    { name: 'Güncel', slug: 'guncel' },
    { name: 'Söyleşi', slug: 'soylesi' },
    { name: 'Forum', slug: 'forum' },
  ];

  const suggestedArticles = [
    {
      cat: 'Politika',
      catSlug: 'politika',
      title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret",
      slug: 'pervin-buldan-baris-anneleri-ziyaret',
    },
    {
      cat: 'Ekoloji',
      catSlug: 'ekoloji',
      title: "Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım",
      slug: 'munzur-vadisi-hes-projelerine-karsi-adim',
    },
    {
      cat: 'Dünya',
      catSlug: 'dunya',
      title: "Ortadoğu'da yeni dengeler ve diplomatik cepheleşmeler",
      slug: 'ortadogu-yeni-dengeler',
    },
    {
      cat: 'Kadın',
      catSlug: 'kadin',
      title: 'İntihar girişiminde bulunan Halime Çiçek yaşamını yitirdi',
      slug: 'intihar-girisiminde-bulunan-halime-cicek-yasamini-yitirdi',
    },
  ];

  return (
    <main className="site-main container">
      <div className="error-page">
        <div className="error-hero">
          <span className="error-code">404</span>
          <span className="error-divider" />
        </div>

        <h1 className="error-title">Aradığınız Sayfaya Ulaşılamadı</h1>
        <p className="error-desc">
          İstediğiniz sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı kalmış olabilir. Ana sayfaya dönebilir veya aşağıdaki arama bölümünü kullanabilirsiniz.
        </p>

        <div className="error-actions">
          <Link href="/" className="error-btn error-btn--primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Ana Sayfaya Dön</span>
          </Link>

          <Link href="/arama" className="error-btn error-btn--secondary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <span>Sitede Arama Yap</span>
          </Link>
        </div>

        <div className="error-suggestions">
          <div className="suggestion-block">
            <h2 className="suggestion-title">Popüler Kategoriler</h2>
            <div className="suggestion-tags">
              {suggestedCategories.map((cat, idx) => (
                <Link key={idx} href={`/kategori/${cat.slug}`}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="suggestion-block">
            <h2 className="suggestion-title">Öne Çıkan Haberler</h2>
            <ul className="suggestion-list">
              {suggestedArticles.map((art, idx) => (
                <li key={idx}>
                  <Link href={`/haber/${art.slug}`}>
                    <span className="suggestion-cat" data-cat={art.catSlug}>
                      {art.cat}
                    </span>
                    <span className="suggestion-heading">{art.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
