
import Link from 'next/link';
import { Article, Category, Author, DailyFeature } from '@/types/strapi';
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
}

export default function MainContent({
  articles,
  categories,
  authors,
  dailyFeatures,
}: MainContentProps) {
  // Slider için manşet haberleri (En fazla 10 manşet, en yeni 10 haber alınır)
  const headlineArticles = (
    articles.filter((a) => a.isHeadline).length > 0
      ? articles.filter((a) => a.isHeadline)
      : articles
  ).slice(0, 10);

  // Sol söyleşi/dosya/özel haber kartları
  const soylesiList = articles.filter((a) => a.category?.slug === 'soylesi');
  const opinionCards = soylesiList.length >= 3
    ? soylesiList.slice(0, 3).map((item) => ({
        kicker: item.kicker || 'Söyleşi',
        cat: 'soylesi',
        title: item.title,
        author: item.author?.name || 'Yeni Yaşam',
        thumb: getStrapiMedia(item.coverImage, item.id),
        slug: item.slug,
      }))
    : [
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

  const renderCategoryRow = (catTitle: string, catSlug: string, fallbackCards: any[]) => {
    const catArticles = articles.filter((a) => a.category?.slug === catSlug);
    const displayItems = catArticles.length >= 3 ? catArticles.slice(0, 3) : fallbackCards;

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
      <VideoCarousel />

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
                <Link href="/abone" className="abone-cta">
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
                </Link>
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
        <div className="news-block-row">
          <div className="category-col">
            <h3 className="category-title" data-cat="ozel-haber">ÖZEL HABER</h3>
          </div>
          <div className="features-layout-grid">
            <div className="feature-main-card">
              <Link href="/haber/dun-erken-yarin-gec" className="feature-img-link">
                <img src="/assets/photos/haber-foto8.jpg" alt="Manşet Görseli" />
              </Link>
              <div className="feature-content">
                <span className="feature-kicker">Özel Haber</span>
                <h3 className="feature-title">
                  <Link href="/haber/dun-erken-yarin-gec">
                    Dün erken, yarın geç, şimdi zamanıdır!
                  </Link>
                </h3>
                <p className="feature-excerpt">
                  Demokratik toplumun/ulusun inşa hamlesi risk ve fırsatı iç içe barındırıyor. Bu sefer rolümüzü layıkıyla oynamak için hem riski hem fırsatı...
                </p>
                <span className="feature-author">Ergin Atabey</span>
              </div>
            </div>
            <div className="feature-side-list">
              <div className="feature-side-card">
                <Link href="/haber/ozgurluk-neden-once-iliskilerde-baslar" className="side-img-link">
                  <img src="/assets/photos/haber-foto12.jpeg" alt="Yan 1" />
                </Link>
                <div className="side-content">
                  <span className="feature-kicker">Özel Haber</span>
                  <h4 className="side-title">
                    <Link href="/haber/ozgurluk-neden-once-iliskilerde-baslar">
                      Özgürlük neden önce ilişkilerde başlar?
                    </Link>
                  </h4>
                  <span className="side-author">Nimet Sevim</span>
                </div>
              </div>
              <div className="feature-side-card">
                <Link href="/haber/caylak-filozof" className="side-img-link">
                  <img src="/assets/photos/haber-foto13.jpg" alt="Yan 2" />
                </Link>
                <div className="side-content">
                  <span className="feature-kicker">Özel Haber</span>
                  <h4 className="side-title">
                    <Link href="/haber/caylak-filozof">'Çaylak Filozof' okuyucuyla buluştu</Link>
                  </h4>
                  <span className="side-author">Ayhan Kavak</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Günün Fotosu */}
      <section className="daily-photo-section">
        <div className="container">
          <div className="daily-photo-header">
            <h2>GÜNÜN FOTOSU</h2>
            <span className="daily-arrow">❯</span>
          </div>
          <div className="daily-photo-grid">
            <div className="daily-photo-img-wrap">
              <img src="/assets/photos/3556.jpg" alt="Günün Fotosu" />
            </div>
            <div className="daily-photo-caption">
              <span className="caption-tag">FOTOĞRAFIN HİKAYESİ</span>
              <h3 className="caption-title">Kuzey Suriye'de gerginlik sürüyor</h3>
              <p className="caption-desc">
                Bölgede devam eden çatışmalar sivil halkı zorluyor. Yerel kaynaklara göre son 24 saatte onlarca aile yerinden edildi.
              </p>
              <span className="caption-meta">Fotoğraf: Yeni Yaşam Arşivi · 27.10.2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Kolonlu Haber Bölümü */}
      <section className="multi-column-news-section">
        <div className="news-four-columns">
          {/* Güncel */}
          {(() => {
            const guncelList = articles.filter((a) => a.category?.slug === 'guncel');
            const featured = guncelList[0];
            const subs = guncelList.slice(1, 4);
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
            const kulturList = articles.filter((a) => a.category?.slug === 'kultur-sanat');
            const featured = kulturList[0];
            const subs = kulturList.slice(1, 4);
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
            const dunyaList = articles.filter((a) => a.category?.slug === 'dunya');
            const featured = dunyaList[0];
            const subs = dunyaList.slice(1, 4);
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
            const sporList = articles.filter((a) => a.category?.slug === 'spor');
            const featured = sporList[0];
            const subs = sporList.slice(1, 4);
            return (
              <div className="news-col">
                <div className="col-header">
                  <h3>
                    <Link href="/kategori/spor">Spor <span>❯</span></Link>
                  </h3>
                </div>
                {featured ? (
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
                ) : (
                  <article className="col-featured">
                    <Link href="/haber/amedspor-zirve-yarisi" className="col-featured-img-link">
                      <div className="col-featured-img">
                        <img src="/assets/photos/haber-foto7.jpg" alt="Haber" />
                      </div>
                    </Link>
                    <h4>
                      <Link href="/haber/amedspor-zirve-yarisi">
                        Amedspor ligde zirve yarışını sürdürüyor: Hedef şampiyonluk
                      </Link>
                    </h4>
                    <p>Yeşil-kırmızılı ekip ligin kritik haftasında taraftarının desteğiyle sahadan 3 puanla ayrıldı.</p>
                  </article>
                )}
                <div className="col-sub-list">
                  {subs.length > 0 ? (
                    subs.map((item) => (
                      <article className="sub-news-item" key={item.id}>
                        <h4><Link href={`/haber/${item.slug}`}>{item.title}</Link></h4>
                      </article>
                    ))
                  ) : (
                    <>
                      <article className="sub-news-item">
                        <h4><Link href="/kategori/spor">Kadın futbol liginde haftanın maçları ve öne çıkanlar</Link></h4>
                      </article>
                      <article className="sub-news-item">
                        <h4><Link href="/kategori/spor">Bölgesel amatör liglerde genç yetenekler dikkat çekiyor</Link></h4>
                      </article>
                    </>
                  )}
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
          <div className="editor-picks-grid">
            <article className="editor-picks-hero">
              <Link href="/haber/pervin-buldan-baris-anneleri-ziyaret" className="editor-picks-hero-img">
                <img src="/assets/photos/haber-foto5.jpg" alt="Manşet" />
              </Link>
              <div className="editor-picks-hero-body">
                <span className="editor-picks-cat" data-cat="politika">Politika</span>
                <h3 className="editor-picks-hero-title">
                  <Link href="/haber/pervin-buldan-baris-anneleri-ziyaret">
                    Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret
                  </Link>
                </h3>
                <p className="editor-picks-hero-excerpt">
                  Ziyaret sırasında tecridin kaldırılması ve barış mücadelesinin ortaklaştırılması gerektiği vurgulandı.
                </p>
                <span className="editor-picks-meta">4 saat önce · 5 dk okuma</span>
              </div>
            </article>
            <div className="editor-picks-list">
              <article className="editor-picks-item">
                <div className="editor-picks-item-body">
                  <span className="editor-picks-cat" data-cat="gundem">Gündem</span>
                  <h4 className="editor-picks-item-title">
                    <Link href="/haber/ihd-hak-ihlalleri-raporu">İHD'den hak ihlalleri raporu: Adalet çağrısı yinelendi</Link>
                  </h4>
                  <span className="editor-picks-meta">3 saat önce</span>
                </div>
              </article>
              <article className="editor-picks-item">
                <div className="editor-picks-item-body">
                  <span className="editor-picks-cat" data-cat="yerel">Yerel</span>
                  <h4 className="editor-picks-item-title">
                    <Link href="/haber/diyarbakir-kultur-sanat">Diyarbakır'da kültür-sanat sezonu açılıyor</Link>
                  </h4>
                  <span className="editor-picks-meta">5 saat önce</span>
                </div>
              </article>
              <article className="editor-picks-item">
                <div className="editor-picks-item-body">
                  <span className="editor-picks-cat" data-cat="ekonomi">Ekonomi</span>
                  <h4 className="editor-picks-item-title">
                    <Link href="/haber/tarim-ureticileri-tepki">Tarım üreticilerinden artan girdi maliyetlerine tepki</Link>
                  </h4>
                  <span className="editor-picks-meta">6 saat önce</span>
                </div>
              </article>
              <article className="editor-picks-item">
                <div className="editor-picks-item-body">
                  <span className="editor-picks-cat" data-cat="ekoloji">Ekoloji</span>
                  <h4 className="editor-picks-item-title">
                    <Link href="/haber/kaz-daglari-su-kaynaklari">Kaz Dağları'nda su kaynakları tehdit altında</Link>
                  </h4>
                  <span className="editor-picks-meta">8 saat önce</span>
                </div>
              </article>
              <article className="editor-picks-item">
                <div className="editor-picks-item-body">
                  <span className="editor-picks-cat" data-cat="politika">Politika</span>
                  <h4 className="editor-picks-item-title">
                    <Link href="/haber/mecliste-yeni-yasama-donemi">Meclis'te yeni yasama dönemi kritik başlıklarla başlıyor</Link>
                  </h4>
                  <span className="editor-picks-meta">9 saat önce</span>
                </div>
              </article>
              <article className="editor-picks-item">
                <div className="editor-picks-item-body">
                  <span className="editor-picks-cat" data-cat="kadin">Kadın</span>
                  <h4 className="editor-picks-item-title">
                    <Link href="/haber/kadin-hareketinden-ortak-manifesto">Kadın hareketinden şiddete karşı ortak mücadele çağrısı</Link>
                  </h4>
                  <span className="editor-picks-meta">10 saat önce</span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* SÖYLEŞİ Blok */}
      <section className="news-block block-ecology">
        <div className="col-header">
          <h3><Link href="/kategori/soylesi">SÖYLEŞİ <span>❯</span></Link></h3>
        </div>
        <div className="ecology-grid-3col">
          <article className="eco-card">
            <Link href="/haber/munzur-vadisi-hes-projelerine-karsi-adim" className="eco-card-img">
              <img src="/assets/photos/haber-foto9.jpg" alt="Söyleşi 1" />
            </Link>
            <span className="card-cat" data-cat="soylesi">Söyleşi</span>
            <h3>
              <Link href="/haber/munzur-vadisi-hes-projelerine-karsi-adim">
                Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım
              </Link>
            </h3>
          </article>
          <article className="eco-card">
            <Link href="/haber/kaz-daglari-su-kaynaklari" className="eco-card-img">
              <img src="/assets/photos/haber-foto10.webp" alt="Söyleşi 2" />
            </Link>
            <span className="card-cat" data-cat="soylesi">Söyleşi</span>
            <h3>
              <Link href="/haber/kaz-daglari-su-kaynaklari">
                Kaz Dağları'nda su kaynakları tehdit altında: Rapor açıklandı
              </Link>
            </h3>
          </article>
          <article className="eco-card">
            <Link href="/haber/kent-bostanlari-yayginlasiyor" className="eco-card-img">
              <img src="/assets/photos/haber-foto11.jpeg" alt="Söyleşi 3" />
            </Link>
            <span className="card-cat" data-cat="soylesi">Söyleşi</span>
            <h3>
              <Link href="/haber/kent-bostanlari-yayginlasiyor">
                Kent bostanları yaygınlaşıyor: Yerel üretim alternatifleri
              </Link>
            </h3>
          </article>
        </div>
      </section>

      {/* DOSYA Blok */}
      <section className="news-block block-horizontal">
        <div className="col-header">
          <h3><Link href="/kategori/dosya">DOSYA <span>❯</span></Link></h3>
        </div>
        <div className="horizontal-strip-list">
          <article className="strip-card">
            <Link href="/haber/ortadogu-yeni-dengeler" className="strip-card-img">
              <img src="/assets/photos/haber-foto12.jpeg" alt="Dosya 1" />
            </Link>
            <div className="strip-content">
              <span className="card-cat" data-cat="dosya">Dosya</span>
              <h3>
                <Link href="/haber/ortadogu-yeni-dengeler">
                  Ortadoğu'da yeni dengeler ve diplomatik cepheleşmeler
                </Link>
              </h3>
              <p>Bölgesel aktörlerin son hamleleri küresel ölçekte nasıl yankı buluyor?</p>
            </div>
          </article>
          <article className="strip-card">
            <Link href="/haber/enflasyon-sarmali-ve-dar-gelirli" className="strip-card-img">
              <img src="/assets/photos/haber-foto13.jpg" alt="Dosya 2" />
            </Link>
            <div className="strip-content">
              <span className="card-cat" data-cat="dosya">Dosya</span>
              <h3>
                <Link href="/haber/enflasyon-sarmali-ve-dar-gelirli">
                  Enflasyon sarmalında dar gelirlinin yaşam mücadelesi
                </Link>
              </h3>
              <p>Temel tüketim maddelerindeki artış bütçeleri eritmeye devam ediyor.</p>
            </div>
          </article>
        </div>
      </section>

      {/* ÖZEL HABER Blok */}
      <section className="news-block block-grid4">
        <div className="col-header">
          <h3><Link href="/kategori/ozel-haber">ÖZEL HABER <span>❯</span></Link></h3>
        </div>
        <div className="grid-4col">
          <article className="standard-card">
            <Link href="/haber/haftanin-karikatur-seckisi" className="standard-card-img">
              <img src="/assets/photos/haber-foto4.jpg" alt="Özel Haber 1" />
            </Link>
            <span className="card-cat" data-cat="ozel-haber">Özel Haber</span>
            <h4>
              <Link href="/haber/haftanin-karikatur-seckisi">
                Haftanın karikatür seçkisi yayımlandı
              </Link>
            </h4>
          </article>
          <article className="standard-card">
            <Link href="/haber/kadin-hareketinden-ortak-manifesto" className="standard-card-img">
              <img src="/assets/photos/haber-foto13.jpg" alt="Özel Haber 2" />
            </Link>
            <span className="card-cat" data-cat="ozel-haber">Özel Haber</span>
            <h4>
              <Link href="/haber/kadin-hareketinden-ortak-manifesto">
                Kadın hareketinden ortak manifesto
              </Link>
            </h4>
          </article>
          <article className="standard-card">
            <Link href="/haber/yeni-cikan-kitaplar" className="standard-card-img">
              <img src="/assets/photos/haber-foto6.webp" alt="Özel Haber 3" />
            </Link>
            <span className="card-cat" data-cat="ozel-haber">Özel Haber</span>
            <h4>
              <Link href="/haber/yeni-cikan-kitaplar">
                Yeni çıkan kitaplar ve eleştiri yazıları
              </Link>
            </h4>
          </article>
          <article className="standard-card">
            <Link href="/haber/bagimsiz-sinema-gunleri" className="standard-card-img">
              <img src="/assets/photos/haber-foto5.jpg" alt="Özel Haber 4" />
            </Link>
            <span className="card-cat" data-cat="ozel-haber">Özel Haber</span>
            <h4>
              <Link href="/haber/bagimsiz-sinema-gunleri">
                Bağımsız sinema günleri başlıyor
              </Link>
            </h4>
          </article>
        </div>
      </section>
    </>
  );
}
