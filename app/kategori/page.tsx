// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getCategories, getStrapiMedia } from '@/lib/strapi';
import ArticleSidebar from '@/components/ArticleSidebar';

export const metadata: Metadata = {
  title: 'Kadın Haberleri — Yeni Yaşam Gazetesi',
  description: 'Kadın hakları, toplumsal cinsiyet, kadın emeği ve güncel gelişmeler.',
};

export default async function KategoriDefaultPage() {
  const categoryName = 'Kadın';

  const featuredArticle = {
    title: 'İntihar girişiminde bulunan Halime Çiçek yaşamını yitirdi',
    slug: 'intihar-girisiminde-bulunan-halime-cicek-yasamini-yitirdi',
    excerpt: 'Kadına yönelik şiddet ve yalnız bırakılmışlık, bölgede bir kadının daha yaşamına mal oldu. Kadın örgütleri, koruma mekanizmalarının etkin işletilmediğini vurguluyor.',
    author: 'Nezahat Doğan',
    date: '04 Ekim 2026',
    readTime: '5 dk okuma',
    thumb: '/assets/photos/haber-foto2.jpeg',
    cat: 'Kadın',
  };

  const archiveCards = [
    {
      title: 'Deprem Bölgesinde Toplumsal Yaşam ve Dayanışma',
      excerpt: 'Afet sonrası kurulan yaşam alanlarında dayanışma ağlarının dönüştürücü gücü...',
      date: '25 Eylül 2026',
      thumb: '/assets/photos/haber-foto11.jpeg',
      slug: 'deprem-bolgesinde-toplumsal-yasam',
      cat: 'Kadın',
    },
    {
      title: 'Anadilde Eğitim ve Çok Dilli Yaşam Üzerine',
      excerpt: 'Kültürel haklar bağlamında anadilin kamusal alandaki görünürlüğü...',
      date: '24 Eylül 2026',
      thumb: '/assets/photos/haber-foto6.webp',
      slug: 'anadilde-egitim',
      cat: 'Kadın',
    },
    {
      title: 'Dijital Yayıncılıkta Yeni Alternatif Modeller',
      excerpt: 'Geleneksel medyanın dışında kalan alanlarda üretilen özgün içerikler...',
      date: '23 Eylül 2026',
      thumb: '/assets/photos/haber-foto9.jpg',
      slug: 'dijital-yayincilikta-alternatif-modeller',
      cat: 'Kadın',
    },
    {
      title: 'Kadın kooperatifleri yerel üretimde güçleniyor',
      excerpt: 'Üretimden paylaşıma, kadın emeğinin kolektifleşme deneyimleri...',
      date: '22 Eylül 2026',
      thumb: '/assets/photos/haber-foto4.jpg',
      slug: 'kadin-kooperatifleri-yerel-uretim',
      cat: 'Kadın',
    },
    {
      title: "Meclis'te kadın temsili tartışmaları sürüyor",
      excerpt: 'Siyasette kadın temsili, kota tartışmaları ve yerel yönetimlerdeki tablo...',
      date: '21 Eylül 2026',
      thumb: '/assets/photos/haber-foto3.jpg',
      slug: 'mecliste-kadin-temsili',
      cat: 'Kadın',
    },
    {
      title: 'Kadın hareketinden ortak manifesto çağrısı',
      excerpt: 'Farklı örgütler, ortak mücadele zemininde buluşmak için bir araya geldi...',
      date: '20 Eylül 2026',
      thumb: '/assets/photos/haber-foto5.jpg',
      slug: 'kadin-hareketinden-ortak-manifesto',
      cat: 'Kadın',
    },
    {
      title: 'Kadına yönelik şiddete karşı yeni kampanya',
      excerpt: 'Sığınma evleri, hukuki destek ve psikososyal hizmetlere erişim...',
      date: '19 Eylül 2026',
      thumb: '/assets/photos/haber-foto8.jpg',
      slug: 'kadina-yonelik-siddete-karsi-kampanya',
      cat: 'Kadın',
    },
    {
      title: 'Kırsalda kadın istihdamı: Değişen dinamikler',
      excerpt: 'Tarımsal üretimde kadın emeği, güvencesizlik ve yeni arayışlar...',
      date: '18 Eylül 2026',
      thumb: '/assets/photos/haber-foto12.jpeg',
      slug: 'kirsalda-kadin-istihdami',
      cat: 'Kadın',
    },
    {
      title: 'Genç kadınların siyasete katılımı üzerine',
      excerpt: 'Yeni nesil kadın aktivistlerin örgütlenme biçimleri ve talepleri...',
      date: '17 Eylül 2026',
      thumb: '/assets/photos/haber-foto13.jpg',
      slug: 'genc-kadinlarin-siyasete-katilimi',
      cat: 'Kadın',
    },
  ];

  return (
    <main className="site-main container">
      <div className="archive-layout">
        <header className="archive-header">
          <nav className="archive-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span className="archive-sep">›</span>
            <span className="archive-current">{categoryName}</span>
          </nav>
          <h1 className="archive-title">{categoryName}</h1>
        </header>

        <div className="archive-body">
          <div className="archive-main">
            {/* Öne Çıkan Manşet Kartı */}
            <article className="archive-featured">
              <Link href={`/haber/${featuredArticle.slug}`} className="archive-featured-img">
                <img src={featuredArticle.thumb} alt={featuredArticle.title} />
              </Link>
              <div className="archive-featured-body">
                <span className="archive-featured-cat">{featuredArticle.cat}</span>
                <h2 className="archive-featured-title">
                  <Link href={`/haber/${featuredArticle.slug}`}>{featuredArticle.title}</Link>
                </h2>
                <p className="archive-featured-excerpt">{featuredArticle.excerpt}</p>
                <div className="archive-featured-meta">
                  <span>{featuredArticle.author}</span>
                  <span className="archive-meta-sep">·</span>
                  <span>{featuredArticle.date}</span>
                  <span className="archive-meta-sep">·</span>
                  <span>{featuredArticle.readTime}</span>
                </div>
              </div>
            </article>

            {/* Grid Kartlar */}
            <div className="archive-grid">
              {archiveCards.map((card, idx) => (
                <article className="archive-card" key={idx}>
                  <Link href={`/haber/${card.slug}`} className="archive-card-img">
                    <img src={card.thumb} alt={card.title} />
                  </Link>
                  <div className="archive-card-body">
                    <span className="archive-card-cat">{card.cat}</span>
                    <h3 className="archive-card-title">
                      <Link href={`/haber/${card.slug}`}>{card.title}</Link>
                    </h3>
                    <p className="archive-card-excerpt">{card.excerpt}</p>
                    <span className="archive-card-date">{card.date}</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Sayfalama */}
            <nav className="archive-pagination" aria-label="Sayfalama">
              <span className="page-arrow disabled">‹</span>
              <span className="page-num active">1</span>
              <a href="#" className="page-num">2</a>
              <a href="#" className="page-num">3</a>
              <a href="#" className="page-num">4</a>
              <span className="page-dots">…</span>
              <a href="#" className="page-num">12</a>
              <a href="#" className="page-arrow" aria-label="Sonraki sayfa">›</a>
            </nav>
          </div>

          {/* Kenar Çubuğu */}
          <ArticleSidebar className="archive-sidebar" />
        </div>
      </div>
    </main>
  );
}
