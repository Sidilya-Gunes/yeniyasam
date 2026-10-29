// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { searchArticles, getStrapiMedia } from '@/lib/strapi';
import { Article } from '@/types/strapi';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" için arama sonuçları — Yeni Yaşam Gazetesi` : 'Sitede Ara — Yeni Yaşam Gazetesi',
  };
}

export default async function AramaPage({ searchParams }: SearchPageProps) {
  const { q = 'iklim krizi' } = await searchParams;
  const results = await searchArticles(q);

  const fallbackResults: Article[] = [
    {
      id: 101,
      title: 'İklim krizi ve tarımsal üretim: Değişen mevsimler, daralan hasat',
      summary: 'Mevsimlerin kayması, kuraklık ve aşırı hava olayları tarımsal üretimi doğrudan etkiliyor. İklim krizi artık üreticinin her günkü gerçeği.',
      category: { id: 3, name: 'Ekoloji', slug: 'ekoloji' },
      publishedAt: '2026-10-05T10:00:00Z',
      author: { id: 1, name: 'Nezahat Doğan', slug: 'nezahat-dogan' },
      coverImage: '/assets/photos/haber-foto4.jpg',
      slug: 'iklim-krizi-tarimsal-uretim',
    },
    {
      id: 102,
      title: "Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım",
      summary: 'Bölgede doğal yaşamı tehdit eden projelere karşı açılan davada, iklim krizi koşulları da gerekçe olarak sunuldu.',
      category: { id: 3, name: 'Ekoloji', slug: 'ekoloji' },
      publishedAt: '2026-10-04T10:00:00Z',
      author: { id: 2, name: 'Sema Bingöl', slug: 'sema-bingol' },
      coverImage: '/assets/photos/haber-foto9.jpg',
      slug: 'munzur-vadisi-hes-projelerine-karsi-adim',
    },
    {
      id: 103,
      title: 'Uluslararası iklim zirvesi: Beklentiler ve hayal kırıklıkları',
      summary: 'Zirvede fosil yakıtlardan çıkış takvimi tartışıldı ancak somut bir taahhüt çıkmadı. Uzmanlar iklim krizi için kritik uyarıda bulunuyor.',
      category: { id: 1, name: 'Dünya', slug: 'dunya' },
      publishedAt: '2026-10-03T10:00:00Z',
      author: { id: 3, name: 'Ayhan Kavak', slug: 'ayhan-kavak' },
      coverImage: '/assets/photos/haber-foto1.jpg',
      slug: 'uluslararasi-iklim-zirvesi',
    },
    {
      id: 104,
      title: 'Küresel iklim krizinde yeni dönemeç: Zirveden ortak karar çıktı mı?',
      summary: 'Son zirveden çıkan kararlar, iklim krizi ile mücadelede gerçek bir kırılma yaratacak mı? Yerel mücadelelerin rolü ne?',
      category: { id: 4, name: 'Analiz', slug: 'analiz' },
      publishedAt: '2026-10-02T10:00:00Z',
      author: { id: 4, name: 'Nimet Sevim', slug: 'nimet-sevim' },
      coverImage: '/assets/photos/haber-foto11.jpeg',
      slug: 'kuresel-iklim-krizi-donemec',
    },
    {
      id: 105,
      title: 'İklim krizi ve ekonomik maliyet: Kim ödüyor?',
      summary: 'İklim krizinin ekonomik maliyeti dar gelirli hanelerde daha ağır hissediliyor. Sınıfsal boyut göz ardı edilemez.',
      category: { id: 5, name: 'Ekonomi', slug: 'ekonomi' },
      publishedAt: '2026-10-01T10:00:00Z',
      author: { id: 5, name: 'Ergin Atabey', slug: 'ergin-atabey' },
      coverImage: '/assets/photos/haber-foto13.jpg',
      slug: 'iklim-krizi-ekonomik-maliyet',
    },
    {
      id: 106,
      title: 'Prof. Dr. Doğan: İklim krizi bir tür varlık krizi',
      summary: 'İklim krizi üzerine konuştuğumuz akademisyen, meselenin ekoloji kadar toplumsal bir mesele olduğunu vurguladı.',
      category: { id: 6, name: 'Söyleşi', slug: 'soylesi' },
      publishedAt: '2026-09-28T10:00:00Z',
      author: { id: 6, name: 'Nurcan Baysal', slug: 'nurcan-baysal' },
      coverImage: '/assets/photos/haber-foto5.jpg',
      slug: 'iklim-krizi-varlik-krizi',
    },
    {
      id: 107,
      title: 'Kent bostanları: İklim krizine karşı yerel çözümler',
      summary: 'Şehirde üretim, iklim krizi ile baş etmenin yerel araçlarından biri. Kent bostanları yaygınlaşıyor.',
      category: { id: 7, name: 'Yaşam', slug: 'yasam' },
      publishedAt: '2026-09-25T10:00:00Z',
      author: { id: 7, name: 'Dilzar Dîlok', slug: 'dilzar-dilok' },
      coverImage: '/assets/photos/haber-foto3.jpg',
      slug: 'kent-bostanlari-yerel-cozumler',
    },
    {
      id: 108,
      title: 'İklim politikaları ve yerel yönetimler: Yeni sorumluluklar',
      summary: 'Yerel yönetimlerin iklim kriziyle mücadeledeki rolü artıyor ancak yetki ve bütçe sorunları devam ediyor.',
      category: { id: 8, name: 'Politika', slug: 'politika' },
      publishedAt: '2026-09-22T10:00:00Z',
      author: { id: 8, name: 'Ahmet Kaya', slug: 'ahmet-kaya' },
      coverImage: '/assets/photos/haber-foto6.webp',
      slug: 'iklim-politikalari-yerel-yonetimler',
    },
  ];

  const popularSearches = [
    'iklim krizi',
    'kadın hareketi',
    'Kobanê Davası',
    'seçim',
    'ekonomi',
    'barış süreci',
    'Jin Dergi',
    'doğa',
  ];

  const latestNews = [
    { time: '14:45', title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret", slug: 'pervin-buldan-baris-anneleri-ziyaret' },
    { time: '14:12', title: "Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım", slug: 'munzur-vadisi-hes-projelerine-karsi-adim' },
    { time: '13:38', title: 'Enflasyon verileri sonrası piyasalarda son durum ne?', slug: 'enflasyon-verileri-piyasalar' },
    { time: '13:05', title: 'Kaz Dağları\'nda su kaynakları tehdit altında', slug: 'kaz-daglari-su-kaynaklari' },
    { time: '12:30', title: 'Uluslararası Belgesel Film Festivali kapılarını açıyor', slug: 'uluslararasi-belgesel-film-festivali' },
  ];

  const displayList: Article[] = results.length > 0 ? results : fallbackResults;
  const count = displayList.length;

  return (
    <main className="site-main container">
      <section className="search-hero">
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Arama</span>
        </nav>

        <h1 className="search-hero-title">Sitede Ara</h1>

        <form className="search-page-form" action="/arama" method="get" role="search">
          <div className="search-page-input-wrap">
            <svg
              className="search-page-icon"
              width="20"
              height="20"
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
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Haber, yazar veya konu ara..."
              autoComplete="off"
              aria-label="Sitede ara"
            />
            <button type="submit">Ara</button>
          </div>
        </form>

        <div className="search-stats">
          <strong>"{q}"</strong> için <strong>{count}</strong> sonuç bulundu{' '}
          <span className="search-stats-time">(0.12 saniye)</span>
        </div>
      </section>

      <div className="search-layout">
        <div className="search-main">
          <div className="search-filters">
            <div className="search-filter-tabs">
              <button type="button" className="search-filter-tab active">
                Tümü <span className="search-filter-count">{count}</span>
              </button>
              <button type="button" className="search-filter-tab">
                Haberler <span className="search-filter-count">{Math.max(1, Math.floor(count * 0.7))}</span>
              </button>
              <button type="button" className="search-filter-tab">
                Söyleşi <span className="search-filter-count">{Math.max(1, Math.floor(count * 0.2))}</span>
              </button>
              <button type="button" className="search-filter-tab">
                Yazarlar <span className="search-filter-count">{Math.max(1, Math.floor(count * 0.1))}</span>
              </button>
            </div>
            <div className="search-sort">
              <label htmlFor="searchSort">Sırala:</label>
              <select id="searchSort" defaultValue="En yeni">
                <option value="En yeni">En yeni</option>
                <option value="En eski">En eski</option>
                <option value="En alakalı">En alakalı</option>
              </select>
            </div>
          </div>

          <div className="search-results">
            {displayList.map((item) => (
              <article className="search-result-item" key={item.id}>
                <Link
                  href={`/haber/${item.slug}`}
                  className="search-result-img"
                >
                  <img
                    src={getStrapiMedia(item.coverImage)}
                    alt={item.title}
                  />
                </Link>
                <div className="search-result-body">
                  <span className="search-result-cat">
                    {item.category?.name || 'Güncel'}
                  </span>
                  <h3 className="search-result-title">
                    <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <p className="search-result-excerpt">
                    {item.summary}
                  </p>
                  <div className="search-result-meta">
                    <span>
                      {new Date(item.publishedAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="search-meta-sep">·</span>
                    <span>{item.author?.name || 'Yeni Yaşam'}</span>
                    <span className="search-meta-sep">·</span>
                    <span>6 dk okuma</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <nav className="archive-pagination" aria-label="Sayfalama">
            <span className="page-arrow disabled">‹</span>
            <span className="page-num active">1</span>
            <a href="#" className="page-num">2</a>
            <a href="#" className="page-num">3</a>
            <a href="#" className="page-arrow" aria-label="Sonraki sayfa">›</a>
          </nav>
        </div>

        <aside className="search-sidebar">
          <div className="sidebar-widget">
            <h3 className="widget-title">Popüler Aramalar</h3>
            <div className="popular-searches">
              {popularSearches.map((term, idx) => (
                <Link
                  key={idx}
                  href={`/arama?q=${encodeURIComponent(term)}`}
                  className="popular-tag"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>

          <div className="sidebar-widget">
            <h3 className="widget-title">Son Haberler</h3>
            <ul className="latest-list">
              {latestNews.map((news, idx) => (
                <li className="latest-item" key={idx}>
                  <Link href={`/haber/${news.slug}`}>
                    <span className="latest-time">{news.time}</span>
                    <span className="latest-heading">{news.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
