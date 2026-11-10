
import Link from 'next/link';
import { Article, Category, Author, DailyFeature, VideoMedia } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi';
import NewsSlider from '@/components/NewsSlider';
import VideoCarousel from '@/components/VideoCarousel';

interface MainContentProps {
  articles: Article[];
  categories: Category[];
  authors: Author[];
  dailyFeatures?: {
    manset: DailyFeature;
    jin: DailyFeature;
    karikatur: DailyFeature;
  };
  videos?: VideoMedia[];
}

export default function MainContent({
  articles,
  categories,
  authors,
  dailyFeatures,
  videos,
}: MainContentProps) {
  // Slider için manşet haberleri (En fazla 10 manşet, en yeni 10 haber alınır)
  const headlineArticles = (
    articles.filter((a) => a.isHeadline).length > 0
      ? articles.filter((a) => a.isHeadline)
      : articles
  ).slice(0, 10);

  // Sol söyleşi/dosya/özel haber kartları (Strapi'den gelenler öncelikli, eksik kalanlar fallback ile tamamlanır)
  const defaultOpinionCards = [
    {
      kicker: 'Söyleşi',
      cat: 'kadin',
      title: 'Bizleri birleştiren noktalara dikkat kesilmeliyiz',
      author: 'Nezahat Doğan',
      thumb: '/assets/photos/haber-foto12.jpeg',
      slug: 'bizleri-birlestiren-noktalara-dikkat-kesilmeliyiz',
    },
    {
      kicker: 'Dosya',
      cat: 'ekonomi',
      title: 'Yerel Yönetimlerde Katılımcı Demokrasi Deneyimleri',
      author: 'Ahmet Kaya',
      thumb: '/assets/photos/haber-foto1.jpg',
      slug: 'yerel-yonetimlerde-katilimci-demokrasi-deneyimleri',
    },
    {
      kicker: 'Özel Haber',
      cat: 'ozel-haber',
      title: 'Politik alan kolektif yaratım alanıdır',
      author: 'Dilzar Dîlok',
      thumb: '/assets/photos/haber-foto4.jpg',
      slug: 'politik-alan-kolektif-yaratim-alanidir',
    },
  ];

  const soylesiList = articles.filter((a) => a.category?.slug === 'soylesi' || a.category?.slug === 'forum');
  const liveOpinionCards = soylesiList.map((item) => ({
    kicker: item.kicker || item.category?.name || 'Söyleşi',
    cat: item.category?.slug || 'soylesi',
    title: item.title,
    author: item.author?.name || 'Yeni Yaşam',
    thumb: getStrapiMedia(item.coverImage, item.id),
    slug: item.slug,
  }));
  const opinionCards = [
    ...liveOpinionCards,
    ...defaultOpinionCards.filter((d) => !liveOpinionCards.some((l) => l.slug === d.slug)),
  ].slice(0, 3);

  const renderCategoryRow = (catTitle: string, catSlug: string, fallbackCards: any[]) => {
    const catArticles = articles.filter((a) => a.category?.slug === catSlug);
    const displayItems = catArticles.length > 0
      ? [...catArticles, ...fallbackCards.filter((f) => !catArticles.some((c) => c.slug === f.slug))].slice(0, 3)
      : fallbackCards.slice(0, 3);

    return (
      <div className="news-block-row" key={catSlug}>
        <div className="category-col">
          <h3 className="category-title" data-cat={catSlug}>
            <Link href={`/kategori/${catSlug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
              {catTitle}
            </Link>
          </h3>
        </div>
        <div className="news-items-grid">
          {displayItems.map((item: any, idx: number) => {
            const title = item.title;
            const slug = item.slug;
            const summary = item.summary || item.excerpt || '';
            const cover = item.coverImage || item.thumb || '/assets/photos/haber-foto1.jpg';
            const dateStr = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
              : (item.date || '');

            return (
              <article className="news-card" key={item.id || idx}>
                <Link href={`/haber/${slug}`} className="news-card-img">
                  <img src={getStrapiMedia(cover, item.id || idx)} alt={title} />
                </Link>
                <h4>
                  <Link href={`/haber/${slug}`}>{title}</Link>
                </h4>
                <p>{summary.slice(0, 95)}...</p>
                <span className="news-date">{dateStr}</span>
              </article>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <section className="top-triple-grid-section">
        {/* Sol Kolon: Söyleşi / Dosya / Forum */}
        <div className="column-left-interviews">
          {opinionCards.map((card, idx) => (
            <article className="op-card" data-cat={card.cat} key={idx}>
              <div className="op-card-text">
                <div className="op-card-meta">
                  <span className="op-card-kicker">{card.kicker}</span>
                </div>
                <h3 className="op-card-title">
                  <Link href={`/haber/${card.slug}`}>{card.title}</Link>
                </h3>
                <span className="op-card-author">
                  <span className="op-card-dash">—</span> {card.author}
                </span>
              </div>
              <Link href={`/haber/${card.slug}`} className="op-card-thumb">
                <img src={card.thumb} alt={card.title} />
              </Link>
            </article>
          ))}
        </div>

        {/* Orta Kolon: Manşet Slider */}
        <div className="column-middle-slider">
          <NewsSlider articles={headlineArticles} />
        </div>

        {/* Sağ Kolon: Yazarlar */}
        <aside className="column-right-opinions">
          <div className="col-header">
            <h3>
              <Link href="/yazarlar">
                YAZARLAR <span>❯</span>
              </Link>
            </h3>
          </div>
          <div className="opinion-list">
            {authors.slice(0, 5).map((author) => (
              <article className="opinion-item" key={author.id}>
                <div className="author-avatar">
                  <img
                    src={getStrapiMedia(author.avatar)}
                    alt={author.name}
                  />
                </div>
                <div className="opinion-content">
                  <span className="author-name">{author.name}</span>
                  <h4 className="opinion-title">
                    <Link
                      href={author.latestArticleSlug ? `/haber/${author.latestArticleSlug}` : `/yazar/${author.slug}`}
                    >
                      {author.latestArticleTitle || author.bio || `${author.name} köşe yazısı ve güncel değerlendirmeler.`}
                    </Link>
                  </h4>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      {/* Video Carousel */}
      <VideoCarousel videos={videos} />

      {/* Günlük Özellikler (Manşet, Jin, Karikatür, Abone Ol) */}
      <section className="daily-features-section">
        <div className="daily-features-grid">
          <article className="daily-card daily-card--manset">
            <div className="daily-card-header">
              <h3>MANŞET</h3>
              <span className="daily-arrow">❯</span>
            </div>
            <Link href="/manset" className="daily-card-link">
              <div className="daily-card-body">
                <img
                  src={typeof dailyFeatures?.manset?.image === 'string' ? dailyFeatures.manset.image : '/assets/photos/yy.jpg'}
                  alt={dailyFeatures?.manset?.captionTitle || "Bugünün Yeni Yaşamı"}
                />
              </div>
            </Link>
          </article>

          <article className="daily-card daily-card--jin">
            <div className="daily-card-header">
              <h3>JIN DERGİ</h3>
              <span className="daily-arrow">❯</span>
            </div>
            <Link href="/jin-dergi" className="daily-card-link">
              <div className="daily-card-body">
                <img
                  src={typeof dailyFeatures?.jin?.image === 'string' ? dailyFeatures.jin.image : '/assets/photos/jin.jpeg'}
                  alt={dailyFeatures?.jin?.title || "Jin Dergi"}
                />
              </div>
            </Link>
          </article>

          <article className="daily-card daily-card--karikatur">
            <div className="daily-card-header">
              <h3>KARİKATÜR</h3>
              <span className="daily-arrow">❯</span>
            </div>
            <Link href="/karikatur" className="daily-card-link">
              <div className="daily-card-body">
                <img
                  src={typeof dailyFeatures?.karikatur?.image === 'string' ? dailyFeatures.karikatur.image : '/assets/photos/karikatur.jpeg'}
                  alt={dailyFeatures?.karikatur?.captionTitle || "Günün Karikatürü"}
                />
              </div>
            </Link>
          </article>

          <article className="daily-card daily-card--abone">
            <div className="daily-card-body">
              <div className="abone-inner">
                <span className="abone-tag">DESTEK OL</span>
                <h3 className="abone-title">
                  Yeni Yaşam'a<br />Abone Ol
                </h3>
                <p className="abone-desc">Bağımsız haberciliğe güç kat.</p>
                <a href="https://eyeniyasam.com/urunler/" target="_blank" rel="noopener noreferrer" className="abone-cta">
                  <span>Abone Ol</span>
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
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Kategori Blokları */}
      <div className="custom-news-sections">
        {/* POLİTİKA */}
        {renderCategoryRow('POLİTİKA', 'politika', [
          {
            title: 'Yerel Yönetimlerde Katılımcı Demokrasi Deneyimleri',
            slug: 'yerel-yonetimlerde-katilimci-demokrasi',
            excerpt: 'Kent uzlaşıları ve yerel meclislerin karar alma mekanizmalarındaki yeri...',
            date: '25 Ekim 2026',
            thumb: '/assets/photos/haber-foto6.webp',
          },
          {
            title: 'Ekoloji Mücadelesi ve Yerel Direnişler',
            slug: 'ekoloji-mucadelesi',
            excerpt: 'Doğal yaşam alanlarını koruma ekseninde gelişen sivil toplum hareketleri...',
            date: '24 Ekim 2026',
            thumb: '/assets/photos/haber-foto4.jpg',
          },
          {
            title: 'Hak Temelli Haberciliğin Güncel Sorunları',
            slug: 'hak-temelli-habercilik',
            excerpt: 'Dijital çağda bağımsız medyanın sürdürülebilirliği ve karşılaştığı engeller...',
            date: '23 Ekim 2026',
            thumb: '/assets/photos/haber-foto5.jpg',
          },
        ])}

        {/* KADIN */}
        {renderCategoryRow('KADIN', 'kadin', [
          {
            title: 'Deprem Bölgesinde Toplumsal Yaşam ve Dayanışma',
            slug: 'deprem-bolgesinde-toplumsal-yasam',
            excerpt: 'Afet sonrası kurulan yaşam alanlarında dayanışma ağlarının dönüştürücü gücü...',
            date: '25 Ekim 2026',
            thumb: '/assets/photos/haber-foto11.jpeg',
          },
          {
            title: 'Anadilde Eğitim ve Çok Dilli Yaşam Üzerine',
            slug: 'anadilde-egitim',
            excerpt: 'Kültürel haklar bağlamında anadilin kamusal alandaki görünürlüğü...',
            date: '24 Ekim 2026',
            thumb: '/assets/photos/haber-foto6.webp',
          },
          {
            title: 'Dijital Yayıncılıkta Yeni Alternatif Modeller',
            slug: 'dijital-yayincilikta-alternatif-modeller',
            excerpt: 'Geleneksel medyanın dışında kalan alanlarda üretilen özgün içerikler...',
            date: '23 Ekim 2026',
            thumb: '/assets/photos/haber-foto9.jpg',
          },
        ])}

        {/* EKOLOJİ */}
        {renderCategoryRow('EKOLOJİ', 'ekoloji', [
          {
            title: 'Ekolojik yıkım ve kuraklık tehdidi: Nehirler can çekişiyor',
            slug: 'ekolojik-yikim-ve-kuraklik-tehdidi-nehirler-can-cekisiyor',
            excerpt: 'Uzmanlar, su havzalarındaki kuraklığın geri döndürülemez noktalara yaklaştığı uyarısında bulunuyor...',
            date: '25 Ekim 2026',
            thumb: '/assets/photos/haber-foto3.jpg',
          },
          {
            title: "Kaz Dağları'nda su kaynakları tehdit altında: Rapor açıklandı",
            slug: 'kaz-daglarinda-su-kaynaklari',
            excerpt: 'Bölgede sürdürülen madencilik faaliyetleri su havzalarını zehirliyor...',
            date: '24 Ekim 2026',
            thumb: '/assets/photos/haber-foto10.webp',
          },
          {
            title: 'Kent bostanları yaygınlaşıyor: Yerel üretim alternatifleri',
            slug: 'kent-bostanlari-yayginlasiyor',
            excerpt: 'Şehirlerde ekolojik üretim alanları yurttaşların buluşma noktasına dönüşüyor...',
            date: '23 Ekim 2026',
            thumb: '/assets/photos/haber-foto11.jpeg',
          },
        ])}

        {/* EKONOMİ */}
        {renderCategoryRow('EKONOMİ', 'ekonomi', [
          {
            title: 'Muhalefet ve sendikalardan ortak asgari ücret ve geçim zirvesi',
            slug: 'asgari-ucret-zirvesi',
            excerpt: 'Yüksek enflasyon karşısında eriyen ücretler ve hayat pahalılığı için temel gelir güvencesi çağrısı...',
            date: '25 Ekim 2026',
            thumb: '/assets/photos/haber-foto2.jpeg',
          },
          {
            title: 'Gelir dağılımında tarihi uçurum: Raporlar ne söylüyor?',
            slug: 'enflasyon-ve-gelir-dagilimi',
            excerpt: 'DİSK-AR ve bağımsız ekonomistlerin analizlerine göre emeğin milli gelirden aldığı pay geriledi...',
            date: '24 Ekim 2026',
            thumb: '/assets/photos/haber-foto1.jpg',
          },
          {
            title: 'Tarımda mazot ve gübre maliyeti üreticiyi çıkmaza sürüklüyor',
            slug: 'tarimda-maliyet-krizi',
            excerpt: 'Çiftçiler ve üretici kooperatifleri, artan girdi maliyetlerine karşı acil kamusal destek ve taban fiyat garantisi talep ediyor...',
            date: '23 Ekim 2026',
            thumb: '/assets/photos/haber-foto7.jpg',
          },
        ])}

                {/* ÖZEL HABER */}
        {(() => {
          const ozelList = articles.filter(
            (a) => a.category?.slug === 'ozel-haber' || (a.kicker && a.kicker.toLowerCase().includes('özel'))
          );
          const defaultFeatureMain = {
            title: 'Dün erken, yarın geç, şimdi zamanıdır!',
            slug: 'dun-erken-yarin-gec',
            summary:
              'Demokratik toplumun/ulusun inşa hamlesi risk ve fırsatı iç içe barındırıyor. Bu sefer rolümüzü layıkıyla oynamak için hem riski hem fırsatı...',
            author: { name: 'Ergin Atabey' },
            coverImage: '/assets/photos/haber-foto8.jpg',
            kicker: 'Özel Haber',
          };
          const defaultSideList = [
            {
              title: 'Özgürlük neden önce ilişkilerde başlar?',
              slug: 'ozgurluk-neden-once-iliskilerde-baslar',
              author: { name: 'Nimet Sevim' },
              coverImage: '/assets/photos/haber-foto12.jpeg',
              kicker: 'Özel Haber',
            },
            {
              title: "'Çaylak Filozof' okuyucuyla buluştu",
              slug: 'caylak-filozof',
              author: { name: 'Ayhan Kavak' },
              coverImage: '/assets/photos/haber-foto13.jpg',
              kicker: 'Özel Haber',
            },
          ];

          const mainItem: any = ozelList[0] || defaultFeatureMain;
          const sideItems: any[] = [
            ...ozelList.slice(1, 3),
            ...defaultSideList.filter(
              (d) => d.slug !== mainItem.slug && !ozelList.slice(1, 3).some((o) => o.slug === d.slug)
            ),
          ].slice(0, 2);

          return (
            <div className="news-block-row">
              <div className="category-col">
                <h3 className="category-title" data-cat="ozel-haber">
                  <Link href="/kategori/ozel-haber" style={{ color: 'inherit', textDecoration: 'none' }}>
                    ÖZEL HABER
                  </Link>
                </h3>
              </div>
              <div className="features-layout-grid">
                <div className="feature-main-card">
                  <Link href={`/haber/${mainItem.slug}`} className="feature-img-link">
                    <img src={getStrapiMedia(mainItem.coverImage, mainItem.id || 1)} alt={mainItem.title} />
                  </Link>
                  <div className="feature-content">
                    <span className="feature-kicker">{mainItem.kicker || 'Özel Haber'}</span>
                    <h3 className="feature-title">
                      <Link href={`/haber/${mainItem.slug}`}>{mainItem.title}</Link>
                    </h3>
                    <p className="feature-excerpt">
                      {(mainItem.summary || '').slice(0, 160)}...
                    </p>
                    <span className="feature-author">{mainItem.author?.name || 'Yeni Yaşam'}</span>
                  </div>
                </div>
                <div className="feature-side-list">
                  {sideItems.map((item: any, idx: number) => (
                    <div className="feature-side-card" key={item.id || idx}>
                      <Link href={`/haber/${item.slug}`} className="side-img-link">
                        <img src={getStrapiMedia(item.coverImage, item.id || idx)} alt={item.title} />
                      </Link>
                      <div className="side-content">
                        <span className="feature-kicker">{item.kicker || 'Özel Haber'}</span>
                        <h4 className="side-title">
                          <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                        </h4>
                        <span className="side-author">{item.author?.name || 'Yeni Yaşam'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>



            {/* Günün Fotosu */}
      {(() => {
        const photoArticle = articles.find((a) => a.category?.slug === 'gunun-fotografi');
        const photoImg = photoArticle ? getStrapiMedia(photoArticle.coverImage, photoArticle.id) : '/assets/photos/3556.jpg';
        const photoTitle = photoArticle ? photoArticle.title : "Kuzey Suriye'de gerginlik sürüyor";
        const photoSummary = photoArticle
          ? photoArticle.summary
          : 'Bölgede devam eden çatışmalar sivil halkı zorluyor. Yerel kaynaklara göre son 24 saatte onlarca aile yerinden edildi.';
        const photoDate = photoArticle
          ? new Date(photoArticle.publishedAt).toLocaleDateString('tr-TR')
          : '27.10.2026';
        const photoSlug = photoArticle?.slug;

        return (
          <section className="daily-photo-section">
            <div className="container">
              <div className="daily-photo-header">
                <h2>
                  <Link href="/kategori/kultur-sanat" style={{ color: 'inherit', textDecoration: 'none' }}>
                    GÜNÜN FOTOSU <span>❯</span>
                  </Link>
                </h2>
              </div>
              <div className="daily-photo-grid">
                <div className="daily-photo-img-wrap">
                  {photoSlug ? (
                    <Link href={`/haber/${photoSlug}`}>
                      <img src={photoImg} alt={photoTitle} />
                    </Link>
                  ) : (
                    <img src={photoImg} alt={photoTitle} />
                  )}
                </div>
                <div className="daily-photo-caption">
                  <span className="caption-tag">FOTOĞRAFIN HİKAYESİ</span>
                  <h3 className="caption-title">
                    {photoSlug ? <Link href={`/haber/${photoSlug}`}>{photoTitle}</Link> : photoTitle}
                  </h3>
                  <p className="caption-desc">{photoSummary}</p>
                  <span className="caption-meta">Fotoğraf: Yeni Yaşam Arşivi · {photoDate}</span>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 4 Kolonlu Haber Bölümü */}
      <section className="multi-column-news-section">
        <div className="news-four-columns">
          {/* Güncel */}
          {(() => {
            const guncelList = articles.filter((a) => a.category?.slug === 'guncel' || a.category?.slug === 'toplum-yasam' || a.category?.name?.toLowerCase().includes('güncel'));
            const fallbackGuncel = articles.slice(0, 4);
            const activeGuncel = guncelList.length > 0 ? guncelList : fallbackGuncel;
            const featured = activeGuncel[0];
            const subs = activeGuncel.slice(1, 4);
            return (
              <div className="news-col">
                <div className="col-header">
                  <h3>
                    <Link href="/kategori/guncel">Güncel <span>❯</span></Link>
                  </h3>
                </div>
                {featured && (
                  <article className="col-featured">
                    <Link href={`/haber/${featured.slug}`} className="col-featured-img-link">
                      <div className="col-featured-img">
                        <img src={getStrapiMedia(featured.coverImage, featured.id)} alt={featured.title} />
                      </div>
                    </Link>
                    <h4>
                      <Link href={`/haber/${featured.slug}`}>{featured.title}</Link>
                    </h4>
                    <p>{(featured.summary || '').slice(0, 110)}...</p>
                  </article>
                )}
                <div className="col-sub-list">
                  {subs.map((item) => (
                    <article className="sub-news-item" key={item.id}>
                      <h4><Link href={`/haber/${item.slug}`}>{item.title}</Link></h4>
                    </article>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Kültür-Sanat */}
          {(() => {
            const kulturList = articles.filter((a) => a.category?.slug === 'kultur-sanat' || a.category?.slug === 'genclik' || a.category?.slug === 'gunun-fotografi' || a.category?.name?.toLowerCase().includes('kültür'));
            const fallbackKultur = articles.slice(4, 8);
            const activeKultur = kulturList.length > 0 ? kulturList : fallbackKultur;
            const featured = activeKultur[0];
            const subs = activeKultur.slice(1, 4);
            return (
              <div className="news-col">
                <div className="col-header">
                  <h3>
                    <Link href="/kategori/kultur-sanat">Kültür-Sanat <span>❯</span></Link>
                  </h3>
                </div>
                {featured && (
                  <article className="col-featured">
                    <Link href={`/haber/${featured.slug}`} className="col-featured-img-link">
                      <div className="col-featured-img">
                        <img src={getStrapiMedia(featured.coverImage, featured.id)} alt={featured.title} />
                      </div>
                    </Link>
                    <h4>
                      <Link href={`/haber/${featured.slug}`}>{featured.title}</Link>
                    </h4>
                    <p>{(featured.summary || '').slice(0, 110)}...</p>
                  </article>
                )}
                <div className="col-sub-list">
                  {subs.map((item) => (
                    <article className="sub-news-item" key={item.id}>
                      <h4><Link href={`/haber/${item.slug}`}>{item.title}</Link></h4>
                    </article>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Dünya */}
          {(() => {
            const dunyaList = articles.filter((a) => a.category?.slug === 'dunya' || a.category?.slug === 'panorama' || a.category?.name?.toLowerCase().includes('dünya'));
            const fallbackDunya = articles.slice(8, 12);
            const activeDunya = dunyaList.length > 0 ? dunyaList : fallbackDunya;
            const featured = activeDunya[0];
            const subs = activeDunya.slice(1, 4);
            return (
              <div className="news-col">
                <div className="col-header">
                  <h3>
                    <Link href="/kategori/dunya">Dünya <span>❯</span></Link>
                  </h3>
                </div>
                {featured && (
                  <article className="col-featured">
                    <Link href={`/haber/${featured.slug}`} className="col-featured-img-link">
                      <div className="col-featured-img">
                        <img src={getStrapiMedia(featured.coverImage, featured.id)} alt={featured.title} />
                      </div>
                    </Link>
                    <h4>
                      <Link href={`/haber/${featured.slug}`}>{featured.title}</Link>
                    </h4>
                    <p>{(featured.summary || '').slice(0, 110)}...</p>
                  </article>
                )}
                <div className="col-sub-list">
                  {subs.map((item) => (
                    <article className="sub-news-item" key={item.id}>
                      <h4><Link href={`/haber/${item.slug}`}>{item.title}</Link></h4>
                    </article>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Spor */}
          {(() => {
            const sporList = articles.filter(
              (a) => a.category?.slug === 'spor' || a.category?.name?.toLowerCase().includes('spor')
            );
            const fallbackSpor = articles.slice(12, 16);
            const activeSpor = sporList.length > 0 ? sporList : fallbackSpor;
            const featured = activeSpor[0];
            const subs = activeSpor.slice(1, 4);
            return (
              <div className="news-col">
                <div className="col-header">
                  <h3>
                    <Link href="/kategori/spor">Spor <span>❯</span></Link>
                  </h3>
                </div>
                {featured && (
                  <article className="col-featured">
                    <Link href={`/haber/${featured.slug}`} className="col-featured-img-link">
                      <div className="col-featured-img">
                        <img src={getStrapiMedia(featured.coverImage, featured.id)} alt={featured.title} />
                      </div>
                    </Link>
                    <h4>
                      <Link href={`/haber/${featured.slug}`}>{featured.title}</Link>
                    </h4>
                    <p>{(featured.summary || '').slice(0, 110)}...</p>
                  </article>
                )}
                <div className="col-sub-list">
                  {subs.map((item) => (
                    <article className="sub-news-item" key={item.id}>
                      <h4><Link href={`/haber/${item.slug}`}>{item.title}</Link></h4>
                    </article>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Editörün Seçtikleri */}
      <section className="editor-picks-section">
        <div className="container">
          <div className="editor-picks-header">
            <div className="editor-picks-title-wrap">
              <h2 className="editor-picks-title">EDİTÖRÜN SEÇTİKLERİ</h2>
            </div>
            <Link href="/kategori/editorun-sectikleri" className="editor-picks-more">
              Tümü
              <svg
                width="14"
                height="14"
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
            </Link>
          </div>
                    {(() => {
            const featuredArticles = articles.filter(
              (a) => a.isFeatured || a.category?.slug === 'editorun-sectikleri'
            );
            const fallbackPool = articles.filter((a) => !featuredArticles.some((f) => f.slug === a.slug));
            const editorPicks = [...featuredArticles, ...fallbackPool].slice(0, 6);

            const hero = editorPicks[0];
            const list = editorPicks.slice(1, 6);

            return (
              <div className="editor-picks-grid">
                {hero && (
                  <article className="editor-picks-hero">
                    <Link href={`/haber/${hero.slug}`} className="editor-picks-hero-img">
                      <img src={getStrapiMedia(hero.coverImage, hero.id)} alt={hero.title} />
                    </Link>
                    <div className="editor-picks-hero-body">
                      <span className="editor-picks-cat" data-cat={hero.category?.slug || 'politika'}>
                        {hero.category?.name || 'Politika'}
                      </span>
                      <h3 className="editor-picks-hero-title">
                        <Link href={`/haber/${hero.slug}`}>{hero.title}</Link>
                      </h3>
                      <p className="editor-picks-hero-excerpt">
                        {(hero.summary || '').slice(0, 160)}...
                      </p>
                      <span className="editor-picks-meta">
                        {new Date(hero.publishedAt).toLocaleDateString('tr-TR')} · {hero.readTime || '5 dk okuma'}
                      </span>
                    </div>
                  </article>
                )}
                <div className="editor-picks-list">
                  {list.map((item, idx) => (
                    <article className="editor-picks-item" key={item.id || idx}>
                      <div className="editor-picks-item-body">
                        <span className="editor-picks-cat" data-cat={item.category?.slug || 'gundem'}>
                          {item.category?.name || 'Güncel'}
                        </span>
                        <h4 className="editor-picks-item-title">
                          <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                        </h4>
                        <span className="editor-picks-meta">
                          {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* SÖYLEŞİ Blok */}
      {(() => {
        const soylesiItems = articles.filter(
          (a) => a.category?.slug === 'soylesi' || a.category?.slug === 'forum'
        );
        const fallbackSoylesi = [
          {
            slug: 'munzur-vadisi-hes-projelerine-karsi-adim',
            coverImage: '/assets/photos/haber-foto9.jpg',
            title: "Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım",
          },
          {
            slug: 'kaz-daglari-su-kaynaklari',
            coverImage: '/assets/photos/haber-foto10.webp',
            title: "Kaz Dağları'nda su kaynakları tehdit altında: Rapor açıklandı",
          },
          {
            slug: 'kent-bostanlari-yayginlasiyor',
            coverImage: '/assets/photos/haber-foto11.jpeg',
            title: "Kent bostanları yaygınlaşıyor: Yerel üretim alternatifleri",
          },
        ];
        const displaySoylesi = [
          ...soylesiItems,
          ...fallbackSoylesi.filter((f) => !soylesiItems.some((s) => s.slug === f.slug)),
        ].slice(0, 3);

        return (
          <section className="news-block block-ecology">
            <div className="col-header">
              <h3>
                <Link href="/kategori/soylesi">SÖYLEŞİ <span>❯</span></Link>
              </h3>
            </div>
            <div className="ecology-grid-3col">
              {displaySoylesi.map((item: any, idx: number) => (
                <article className="eco-card" key={item.id || idx}>
                  <Link href={`/haber/${item.slug}`} className="eco-card-img">
                    <img src={getStrapiMedia(item.coverImage, item.id || idx)} alt={item.title} />
                  </Link>
                  <span className="card-cat" data-cat="soylesi">Söyleşi</span>
                  <h3>
                    <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                  </h3>
                </article>
              ))}
            </div>
          </section>
        );
      })()}

      {/* DOSYA Blok */}
      {(() => {
        const dosyaItems = articles.filter((a) => a.category?.slug === 'dosya');
        const fallbackDosya = [
          {
            slug: 'ortadogu-yeni-dengeler',
            coverImage: '/assets/photos/haber-foto12.jpeg',
            title: "Ortadoğu'da yeni dengeler ve diplomatik cepheleşmeler",
            summary: 'Bölgesel aktörlerin son hamleleri küresel ölçekte nasıl yankı buluyor?',
          },
          {
            slug: 'enflasyon-sarmali-ve-dar-gelirli',
            coverImage: '/assets/photos/haber-foto13.jpg',
            title: 'Enflasyon sarmalında dar gelirlinin yaşam mücadelesi',
            summary: 'Temel tüketim maddelerindeki artış bütçeleri eritmeye devam ediyor.',
          },
        ];
        const displayDosya = [
          ...dosyaItems,
          ...fallbackDosya.filter((f) => !dosyaItems.some((d) => d.slug === f.slug)),
        ].slice(0, 2);

        return (
          <section className="news-block block-horizontal">
            <div className="col-header">
              <h3>
                <Link href="/kategori/dosya">DOSYA <span>❯</span></Link>
              </h3>
            </div>
            <div className="horizontal-strip-list">
              {displayDosya.map((item: any, idx: number) => (
                <article className="strip-card" key={item.id || idx}>
                  <Link href={`/haber/${item.slug}`} className="strip-card-img">
                    <img src={getStrapiMedia(item.coverImage, item.id || idx)} alt={item.title} />
                  </Link>
                  <div className="strip-content">
                    <span className="card-cat" data-cat="dosya">Dosya</span>
                    <h3>
                      <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <p>{item.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })()}

      {/* ÖZEL HABER Blok */}
      {(() => {
        const ozelItems = articles.filter(
          (a) => a.category?.slug === 'ozel-haber' || (a.kicker && a.kicker.toLowerCase().includes('özel'))
        );
        const fallbackOzel = [
          {
            slug: 'haftanin-karikatur-seckisi',
            coverImage: '/assets/photos/haber-foto4.jpg',
            title: 'Haftanın karikatür seçkisi yayımlandı',
          },
          {
            slug: 'kadin-hareketinden-ortak-manifesto',
            coverImage: '/assets/photos/haber-foto13.jpg',
            title: 'Kadın hareketinden ortak manifesto',
          },
          {
            slug: 'yeni-cikan-kitaplar',
            coverImage: '/assets/photos/haber-foto6.webp',
            title: 'Yeni çıkan kitaplar ve eleştiri yazıları',
          },
          {
            slug: 'bagimsiz-sinema-gunleri',
            coverImage: '/assets/photos/haber-foto5.jpg',
            title: 'Bağımsız sinema günleri başlıyor',
          },
        ];
        const displayOzel = [
          ...ozelItems,
          ...fallbackOzel.filter((f) => !ozelItems.some((o) => o.slug === f.slug)),
        ].slice(0, 4);

        return (
          <section className="news-block block-grid4">
            <div className="col-header">
              <h3>
                <Link href="/kategori/ozel-haber">ÖZEL HABER <span>❯</span></Link>
              </h3>
            </div>
            <div className="grid-4col">
              {displayOzel.map((item: any, idx: number) => (
                <article className="standard-card" key={item.id || idx}>
                  <Link href={`/haber/${item.slug}`} className="standard-card-img">
                    <img src={getStrapiMedia(item.coverImage, item.id || idx)} alt={item.title} />
                  </Link>
                  <span className="card-cat" data-cat="ozel-haber">Özel Haber</span>
                  <h4>
                    <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                  </h4>
                </article>
              ))}
            </div>
          </section>
        );
      })()}
    </>
  );
}
