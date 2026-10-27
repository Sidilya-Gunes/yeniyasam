// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import Link from 'next/link';
import { Article, Category, Author } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi';
import NewsSlider from '@/components/NewsSlider';
import VideoCarousel from '@/components/VideoCarousel';

interface MainContentProps {
  articles: Article[];
  categories: Category[];
  authors: Author[];
}

export default function MainContent({
  articles,
  categories,
  authors,
}: MainContentProps) {
  // Slider için manşet haberleri
  const headlineArticles = articles.filter((a) => a.isHeadline).length > 0
    ? articles.filter((a) => a.isHeadline)
    : articles.slice(0, 7);

  // Sol söyleşi/dosya/forum kartları
  const opinionCards = [
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
      kicker: 'Forum',
      cat: 'ekoloji',
      title: 'Politik alan kolektif yaratım alanıdır',
      author: 'Dilzar Dîlok',
      thumb: '/assets/photos/haber-foto4.jpg',
      slug: 'politik-alan-kolektif-yaratim-alanidir',
    },
  ];

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

        {/* Sağ Kolon: Günün Yazarları */}
        <aside className="column-right-opinions">
          <div className="col-header">
            <h3>
              <Link href="/yazarlar">
                GÜNÜN YAZARLARI <span>❯</span>
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
                    <Link href={`/yazar/${author.slug}`}>
                      {author.bio || `${author.name} köşe yazısı ve güncel değerlendirmeler.`}
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
              <h3>GÜNÜN MANŞETİ</h3>
              <span className="daily-arrow">❯</span>
            </div>
            <Link href="/manset" className="daily-card-link">
              <div className="daily-card-body">
                <img src="/assets/photos/yy.jpg" alt="Bugünün Yeni Yaşamı" />
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
                <img src="/assets/photos/jin.jpeg" alt="Jin Dergi" />
              </div>
            </Link>
          </article>

          <article className="daily-card daily-card--karikatur">
            <div className="daily-card-header">
              <h3>GÜNÜN KARİKATÜRÜ</h3>
              <span className="daily-arrow">❯</span>
            </div>
            <Link href="/karikatur" className="daily-card-link">
              <div className="daily-card-body">
                <img src="/assets/photos/karikatur.jpeg" alt="Günün Karikatürü" />
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
        {/* DÜNYA */}
        <div className="news-block-row">
          <div className="category-col">
            <h3 className="category-title" data-cat="dunya">DÜNYA</h3>
          </div>
          <div className="news-items-grid">
            <article className="news-card">
              <Link href="/haber/yerel-yonetimlerde-katilimci-demokrasi" className="news-card-img">
                <img src="/assets/photos/haber-foto6.webp" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/yerel-yonetimlerde-katilimci-demokrasi">
                  Yerel Yönetimlerde Katılımcı Demokrasi Deneyimleri
                </Link>
              </h4>
              <p>Kent uzlaşıları ve yerel meclislerin karar alma mekanizmalarındaki yeri...</p>
              <span className="news-date">25 Ekim 2026</span>
            </article>
            <article className="news-card">
              <Link href="/haber/ekoloji-mucadelesi" className="news-card-img">
                <img src="/assets/photos/haber-foto4.jpg" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/ekoloji-mucadelesi">
                  Ekoloji Mücadelesi ve Yerel Direnişler
                </Link>
              </h4>
              <p>Doğal yaşam alanlarını koruma ekseninde gelişen sivil toplum hareketleri...</p>
              <span className="news-date">24 Ekim 2026</span>
            </article>
            <article className="news-card">
              <Link href="/haber/hak-temelli-habercilik" className="news-card-img">
                <img src="/assets/photos/haber-foto5.jpg" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/hak-temelli-habercilik">
                  Hak Temelli Haberciliğin Güncel Sorunları
                </Link>
              </h4>
              <p>Dijital çağda bağımsız medyanın sürdürülebilirliği ve karşılaştığı engeller...</p>
              <span className="news-date">23 Ekim 2026</span>
            </article>
          </div>
        </div>

        {/* KADIN */}
        <div className="news-block-row">
          <div className="category-col">
            <h3 className="category-title" data-cat="kadin">KADIN</h3>
          </div>
          <div className="news-items-grid">
            <article className="news-card">
              <Link href="/haber/deprem-bolgesinde-toplumsal-yasam" className="news-card-img">
                <img src="/assets/photos/haber-foto11.jpeg" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/deprem-bolgesinde-toplumsal-yasam">
                  Deprem Bölgesinde Toplumsal Yaşam ve Dayanışma
                </Link>
              </h4>
              <p>Afet sonrası kurulan yaşam alanlarında dayanışma ağlarının dönüştürücü gücü...</p>
              <span className="news-date">25 Ekim 2026</span>
            </article>
            <article className="news-card">
              <Link href="/haber/anadilde-egitim" className="news-card-img">
                <img src="/assets/photos/haber-foto6.webp" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/anadilde-egitim">
                  Anadilde Eğitim ve Çok Dilli Yaşam Üzerine
                </Link>
              </h4>
              <p>Kültürel haklar bağlamında anadilin kamusal alandaki görünürlüğü...</p>
              <span className="news-date">24 Ekim 2026</span>
            </article>
            <article className="news-card">
              <Link href="/haber/dijital-yayincilikta-alternatif-modeller" className="news-card-img">
                <img src="/assets/photos/haber-foto9.jpg" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/dijital-yayincilikta-alternatif-modeller">
                  Dijital Yayıncılıkta Yeni Alternatif Modeller
                </Link>
              </h4>
              <p>Geleneksel medyanın dışında kalan alanlarda üretilen özgün içerikler...</p>
              <span className="news-date">23 Ekim 2026</span>
            </article>
          </div>
        </div>

        {/* EKOLOJİ */}
        <div className="news-block-row">
          <div className="category-col">
            <h3 className="category-title" data-cat="cevre">EKOLOJİ</h3>
          </div>
          <div className="news-items-grid">
            <article className="news-card">
              <Link href="/haber/ekolojik-yikim-ve-kuraklik-tehdidi-nehirler-can-cekisiyor" className="news-card-img">
                <img src="/assets/photos/haber-foto3.jpg" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/ekolojik-yikim-ve-kuraklik-tehdidi-nehirler-can-cekisiyor">
                  Ekolojik yıkım ve kuraklık tehdidi: Nehirler can çekişiyor
                </Link>
              </h4>
              <p>Uzmanlar, su havzalarındaki kuraklığın geri döndürülemez noktalara yaklaştığı uyarısında bulunuyor...</p>
              <span className="news-date">25 Ekim 2026</span>
            </article>
            <article className="news-card">
              <Link href="/haber/kaz-daglarinda-su-kaynaklari" className="news-card-img">
                <img src="/assets/photos/haber-foto10.webp" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/kaz-daglarinda-su-kaynaklari">
                  Kaz Dağları'nda su kaynakları tehdit altında: Rapor açıklandı
                </Link>
              </h4>
              <p>Bölgede sürdürülen madencilik faaliyetleri su havzalarını zehirliyor...</p>
              <span className="news-date">24 Ekim 2026</span>
            </article>
            <article className="news-card">
              <Link href="/haber/kent-bostanlari-yayginlasiyor" className="news-card-img">
                <img src="/assets/photos/haber-foto11.jpeg" alt="Haber" />
              </Link>
              <h4>
                <Link href="/haber/kent-bostanlari-yayginlasiyor">
                  Kent bostanları yaygınlaşıyor: Yerel üretim alternatifleri
                </Link>
              </h4>
              <p>Şehirlerde ekolojik üretim alanları yurttaşların buluşma noktasına dönüşüyor...</p>
              <span className="news-date">23 Ekim 2026</span>
            </article>
          </div>
        </div>

        {/* FORUM */}
        <div className="news-block-row">
          <div className="category-col">
            <h3 className="category-title" data-cat="forum">FORUM</h3>
          </div>
          <div className="features-layout-grid">
            <div className="feature-main-card">
              <Link href="/haber/dun-erken-yarin-gec" className="feature-img-link">
                <img src="/assets/photos/haber-foto8.jpg" alt="Manşet Görseli" />
              </Link>
              <div className="feature-content">
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
          {/* Politika */}
          <div className="news-col">
            <div className="col-header">
              <h3>
                <Link href="/kategori/politika">Politika <span>❯</span></Link>
              </h3>
            </div>
            <article className="col-featured">
              <Link href="/haber/mecliste-yeni-yasama-donemi" className="col-featured-img-link">
                <div className="col-featured-img">
                  <img src="/assets/photos/haber-foto2.jpeg" alt="Haber" />
                </div>
              </Link>
              <h4>
                <Link href="/haber/mecliste-yeni-yasama-donemi">
                  Meclis'te yeni yasama döneminde kritik gündemler
                </Link>
              </h4>
              <p>Yeni dönemin ilk haftasında yerel yönetimler ve anayasa tartışmaları öncelikli başlıklar arasında yer alıyor.</p>
            </article>
            <div className="col-sub-list">
              <article className="sub-news-item">
                <h4><Link href="/haber/imamoglu-davasi">İmamoğlu davasında istinaf kararının siyasi yankıları sürüyor</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/asgari-ucret-zirvesi">Muhalefet partilerinden ortak asgari ücret ve geçim zirvesi</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/yerel-secim-ittifaklari">Yerel seçim ittifakları için kulisler hareketleniyor</Link></h4>
              </article>
            </div>
          </div>

          {/* Kültür-Sanat */}
          <div className="news-col">
            <div className="col-header">
              <h3>
                <Link href="/kategori/kultur-sanat">Kültür-Sanat <span>❯</span></Link>
              </h3>
            </div>
            <article className="col-featured">
              <Link href="/haber/ortadoguda-diplomatik-trafik" className="col-featured-img-link">
                <div className="col-featured-img">
                  <img src="/assets/photos/haber-foto3.jpg" alt="Haber" />
                </div>
              </Link>
              <h4>
                <Link href="/haber/ortadoguda-diplomatik-trafik">
                  Ortadoğu'da diplomatik trafik hızlandı: Yeni zirve bekleniyor
                </Link>
              </h4>
              <p>Bölgesel aktörler arasında artan gerilimi düşürmek için arabuluculuk girişimleri yoğunlaştı.</p>
            </article>
            <div className="col-sub-list">
              <article className="sub-news-item">
                <h4><Link href="/haber/avrupada-asiri-sag">Avrupa'da aşırı sağın yükselişi parlamentoları nasıl etkiliyor?</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/latin-amerika-sol">Latin Amerika'da sol hükümetlerden yeni entegrasyon hamlesi</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/iklim-krizi">İklim krizinde yeni dönemeç: Zirveden ortak karar çıktı mı?</Link></h4>
              </article>
            </div>
          </div>

          {/* Emek-Ekonomi */}
          <div className="news-col">
            <div className="col-header">
              <h3>
                <Link href="/kategori/ekonomi">Emek-Ekonomi <span>❯</span></Link>
              </h3>
            </div>
            <article className="col-featured">
              <Link href="/haber/enflasyon-verileri-piyasalar" className="col-featured-img-link">
                <div className="col-featured-img">
                  <img src="/assets/photos/haber-foto4.jpg" alt="Haber" />
                </div>
              </Link>
              <h4>
                <Link href="/haber/enflasyon-verileri-piyasalar">
                  Enflasyon verileri sonrası piyasalarda son durum ne?
                </Link>
              </h4>
              <p>Merkez Bankası'nın yıl sonu tahminleri ve döviz kurlarındaki hareketlilik yatırımcıların gözünü bu haftaya çevirdi.</p>
            </article>
            <div className="col-sub-list">
              <article className="sub-news-item">
                <h4><Link href="/haber/kobi-destek-paketleri">KOBİ'ler için yeni kredi destek paketleri açıklandı</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/enerji-maliyetleri">Enerji maliyetleri sanayi üretimini nasıl baskılıyor?</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/asgari-ucret-takvimi">Asgari ücret görüşmeleri takvimi netleşiyor</Link></h4>
              </article>
            </div>
          </div>

          {/* Toplum-Yaşam */}
          <div className="news-col">
            <div className="col-header">
              <h3>
                <Link href="/kategori/toplum-yasam">Toplum-Yaşam <span>❯</span></Link>
              </h3>
            </div>
            <article className="col-featured">
              <Link href="/haber/uluslararasi-belgesel-film-festivali" className="col-featured-img-link">
                <div className="col-featured-img">
                  <img src="/assets/photos/haber-foto5.jpg" alt="Haber" />
                </div>
              </Link>
              <h4>
                <Link href="/haber/uluslararasi-belgesel-film-festivali">
                  Uluslararası Belgesel Film Festivali kapılarını açıyor
                </Link>
              </h4>
              <p>Dünyanın dört bir yanından bağımsız yapımların katıldığı festival bu yıl zengin bir seçki sunuyor.</p>
            </article>
            <div className="col-sub-list">
              <article className="sub-news-item">
                <h4><Link href="/haber/kurt-edebiyati">Kürt edebiyatında son dönem çeviri eserlerin yükselişi</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/istanbul-modern-sanat">İstanbul'un tarihi mekanlarında sergilenen modern sanat projeleri</Link></h4>
              </article>
              <article className="sub-news-item">
                <h4><Link href="/haber/bagimsiz-tiyatrolar">Bağımsız tiyatroların yeni sezon sahnede karşılaştığı zorluklar</Link></h4>
              </article>
            </div>
          </div>
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
            </div>
          </div>
        </div>
      </section>

      {/* Söyleşi Blok */}
      <section className="news-block block-ecology">
        <div className="col-header">
          <h3><Link href="/kategori/soylesi">Söyleşi <span>❯</span></Link></h3>
        </div>
        <div className="ecology-grid-3col">
          <article className="eco-card">
            <Link href="/haber/munzur-vadisi-hes-projelerine-karsi-adim" className="eco-card-img">
              <img src="/assets/photos/haber-foto9.jpg" alt="Eko 1" />
            </Link>
            <span className="card-cat" data-cat="ekoloji">Ekoloji</span>
            <h3>
              <Link href="/haber/munzur-vadisi-hes-projelerine-karsi-adim">
                Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım
              </Link>
            </h3>
          </article>
          <article className="eco-card">
            <Link href="/haber/kaz-daglari-su-kaynaklari" className="eco-card-img">
              <img src="/assets/photos/haber-foto10.webp" alt="Eko 2" />
            </Link>
            <span className="card-cat" data-cat="dunya">Dünya</span>
            <h3>
              <Link href="/haber/kaz-daglari-su-kaynaklari">
                Kaz Dağları'nda su kaynakları tehdit altında: Rapor açıklandı
              </Link>
            </h3>
          </article>
          <article className="eco-card">
            <Link href="/haber/kent-bostanlari-yayginlasiyor" className="eco-card-img">
              <img src="/assets/photos/haber-foto11.jpeg" alt="Eko 3" />
            </Link>
            <span className="card-cat" data-cat="yasam">Yaşam</span>
            <h3>
              <Link href="/haber/kent-bostanlari-yayginlasiyor">
                Kent bostanları yaygınlaşıyor: Yerel üretim alternatifleri
              </Link>
            </h3>
          </article>
        </div>
      </section>

      {/* Güncel Analiz ve Dosyalar */}
      <section className="news-block block-horizontal">
        <div className="col-header">
          <h3><Link href="/kategori/dosya">Güncel Analiz ve Dosyalar <span>❯</span></Link></h3>
        </div>
        <div className="horizontal-strip-list">
          <article className="strip-card">
            <Link href="/haber/ortadogu-yeni-dengeler" className="strip-card-img">
              <img src="/assets/photos/haber-foto12.jpeg" alt="Analiz 1" />
            </Link>
            <div className="strip-content">
              <span className="card-cat" data-cat="dunya">Dünya</span>
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
              <img src="/assets/photos/haber-foto13.jpg" alt="Analiz 2" />
            </Link>
            <div className="strip-content">
              <span className="card-cat" data-cat="ekonomi">Ekonomi</span>
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

      {/* Spor & Kültür Blok */}
      <section className="news-block block-grid4">
        <div className="col-header">
          <h3><Link href="/kategori/spor">Spor <span>❯</span></Link></h3>
        </div>
        <div className="grid-4col">
          <article className="standard-card">
            <Link href="/haber/haftanin-karikatur-seckisi" className="standard-card-img">
              <img src="/assets/photos/haber-foto4.jpg" alt="Kültür 1" />
            </Link>
            <span className="card-cat" data-cat="sanat">Sanat</span>
            <h4>
              <Link href="/haber/haftanin-karikatur-seckisi">
                Haftanın karikatür seçkisi yayımlandı
              </Link>
            </h4>
          </article>
          <article className="standard-card">
            <Link href="/haber/kadin-hareketinden-ortak-manifesto" className="standard-card-img">
              <img src="/assets/photos/haber-foto13.jpg" alt="Kültür 2" />
            </Link>
            <span className="card-cat" data-cat="kadin">Kadın</span>
            <h4>
              <Link href="/haber/kadin-hareketinden-ortak-manifesto">
                Kadın hareketinden ortak manifesto
              </Link>
            </h4>
          </article>
          <article className="standard-card">
            <Link href="/haber/yeni-cikan-kitaplar" className="standard-card-img">
              <img src="/assets/photos/haber-foto6.webp" alt="Kültür 3" />
            </Link>
            <span className="card-cat" data-cat="edebiyat">Edebiyat</span>
            <h4>
              <Link href="/haber/yeni-cikan-kitaplar">
                Yeni çıkan kitaplar ve eleştiri yazıları
              </Link>
            </h4>
          </article>
          <article className="standard-card">
            <Link href="/haber/bagimsiz-sinema-gunleri" className="standard-card-img">
              <img src="/assets/photos/haber-foto5.jpg" alt="Kültür 4" />
            </Link>
            <span className="card-cat" data-cat="sanat">Sanat</span>
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
