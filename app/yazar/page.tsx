// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Metin Yeğin Yazıları — Yeni Yaşam Gazetesi',
  description: 'Metin Yeğin köşe yazıları, analizleri ve makaleleri.',
};

export default function YazarDefaultPage() {
  const author = {
    name: 'Metin Yeğin',
    avatar: '/assets/photos/yazar1.jpeg',
    role: '128 yazı',
    twitter: '@nmetinyegin',
    email: 'metinyegin@gmail.com',
  };

  const articles = [
    {
      title: 'Bölgede sivil toplumun hafızası ve dayanışma ağları üzerine',
      excerpt: 'Uzun yıllara dayanan saha deneyiminden yola çıkarak sivil toplumun bölgedeki rolünü ve dayanışma ağlarının dönüştürücü gücünü konuştuk.',
      date: '04 Ekim 2026',
      readTime: '8 dk okuma',
      cat: 'kadin',
      slug: 'bolgede-sivil-toplumun-hafizasi',
    },
    {
      title: 'Kadın hareketinde yeni örgütlenme modelleri',
      excerpt: 'Son on yılda kadın hareketinin dönüşen örgütlenme biçimlerini ve yeni mücadele alanlarını değerlendiren bir analiz.',
      date: '28 Eylül 2026',
      readTime: '6 dk okuma',
      cat: 'ekonomi',
      slug: 'kadin-hareketinde-yeni-orgutlenme-modelleri',
    },
    {
      title: 'Hafıza çalışmaları ve toplumsal yas üzerine',
      excerpt: 'Bölgede yürütülen hafıza çalışmalarının toplumsal yas süreçlerine etkisi ve dayanışma ağlarının rolü üzerine bir söyleşi.',
      date: '21 Eylül 2026',
      readTime: '10 dk okuma',
      cat: 'ekoloji',
      slug: 'hafiza-calismalari-ve-toplumsal-yas',
    },
    {
      title: 'Yerel kadın kooperatiflerinin ekonomik etkisi',
      excerpt: 'Bölgede kurulan kadın kooperatiflerinin yerel ekonomiye katkısı ve kadın istihdamındaki yeri.',
      date: '15 Eylül 2026',
      readTime: '4 dk okuma',
      cat: 'politika',
      slug: 'yerel-kadin-kooperatiflerinin-ekonomik-etkisi',
    },
    {
      title: 'Sivil toplum ve devlet arasındaki ilişki biçimleri',
      excerpt: 'Bölgede sivil toplumun devletle kurduğu ilişki biçimleri ve karşılaştığı zorluklar üzerine bir değerlendirme.',
      date: '08 Eylül 2026',
      readTime: '7 dk okuma',
      cat: 'kultur-sanat',
      slug: 'sivil-toplum-ve-devlet-iliskileri',
    },
    {
      title: 'Genç kadın aktivistlerle söyleşi: Yeni nesil mücadele',
      excerpt: 'Genç kadın aktivistlerin örgütlenme biçimleri, talepleri ve gelecek perspektifleri üzerine bir söyleşi.',
      date: '01 Eylül 2026',
      readTime: '12 dk okuma',
      cat: 'gundem',
      slug: 'genc-kadin-aktivistlerle-soylesi',
    },
    {
      title: 'Bölgesel aktörlerin son hamleleri ve yansımaları',
      excerpt: 'Sınır bölgesindeki son gelişmelerin bölge halkı üzerindeki etkilerini yerinde inceledik.',
      date: '25 Ağustos 2026',
      readTime: '5 dk okuma',
      cat: 'dunya',
      slug: 'bolgesel-aktorlerin-son-hamleleri',
    },
    {
      title: 'Kadın dayanışma ağlarının dönüştürücü gücü',
      excerpt: 'Yerel kadın örgütleri üzerinden dayanışma ağlarının toplumsal dönüşümdeki rolü.',
      date: '18 Ağustos 2026',
      readTime: '9 dk okuma',
      cat: 'kadin',
      slug: 'kadin-dayanisma-aglarinin-gucu',
    },
  ];

  return (
    <main className="site-main container">
      <div className="author-layout">
        <header className="author-hero">
          <div className="author-hero-avatar">
            <img src={author.avatar} alt={author.name} />
          </div>
          <div className="author-hero-info">
            <h1 className="author-name">{author.name}</h1>
            <span className="author-role">{author.role}</span>
            <div className="author-socials">
              <a href="#" aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>{author.twitter}</span>
              </a>
              <a href={`mailto:${author.email}`} aria-label="E-posta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>E-posta</span>
              </a>
            </div>
          </div>
        </header>

        <section className="author-articles-section">
          <h2 className="author-articles-title">Yazıları</h2>
          <div className="author-articles">
            {articles.map((item, idx) => (
              <article className="author-article-card" data-cat={item.cat} key={idx}>
                <Link href={`/haber/${item.slug}`}>
                  <h3 className="author-article-title">{item.title}</h3>
                  <p className="author-article-excerpt">{item.excerpt}</p>
                  <span className="author-article-meta">
                    {item.date} · {item.readTime}
                  </span>
                </Link>
              </article>
            ))}
          </div>

          <nav className="author-pagination" aria-label="Sayfalama">
            <span className="page-arrow disabled">‹</span>
            <span className="page-num active">1</span>
            <a href="#" className="page-num">2</a>
            <a href="#" className="page-num">3</a>
            <span className="page-dots">…</span>
            <a href="#" className="page-num">16</a>
            <a href="#" className="page-arrow" aria-label="Sonraki sayfa">›</a>
          </nav>
        </section>
      </div>
    </main>
  );
}
