// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import MetaShare from '@/components/MetaShare';
import ArticleBottomShare from '@/components/ArticleBottomShare';
import ArticleSidebar from '@/components/ArticleSidebar';

export const metadata: Metadata = {
  title: "Alp Altınörs: Yasanın MGK kararına bağlanması Meclis'i işlevsizleştirmektir — Yeni Yaşam Gazetesi",
  description: "Çerçeve yasaya ilişkin konuşan Kobanê Davası tutsaklarından siyasetçi Alp Altınörs, 'Kürt ulusunun inkarını kısmen de olsa geriletebilecek potansiyele sahiptir.' dedi.",
};

export default function HaberDefaultPage() {
  const defaultTags = ['Diplomasi', 'Bölgesel Gelişmeler', 'Ateşkes', 'İnsani Yardım'];

  const relatedArticles = [
    {
      title: "Ortadoğu'da diplomatik trafik hızlandı: Yeni zirve bekleniyor",
      cat: 'Dünya',
      date: '3 saat önce',
      thumb: '/assets/photos/haber-foto3.jpg',
      slug: 'ortadoguda-diplomatik-trafik',
    },
    {
      title: "Meclis'te yeni yasama dönemi başlarken kritik gündem",
      cat: 'Politika',
      date: '5 saat önce',
      thumb: '/assets/photos/haber-foto4.jpg',
      slug: 'mecliste-yeni-yasama-donemi',
    },
    {
      title: 'Sınır bölgesinde insani yardım sevkiyatı yeniden başladı',
      cat: 'Dünya',
      date: '8 saat önce',
      thumb: '/assets/photos/haber-foto2.jpeg',
      slug: 'sinir-bolgesinde-insani-yardim',
    },
    {
      title: 'Bölgesel aktörlerin son hamleleri küresel ölçekte nasıl yankı buluyor?',
      cat: 'Analiz',
      date: '1 gün önce',
      thumb: '/assets/photos/haber-foto9.jpg',
      slug: 'ortadogu-yeni-dengeler',
    },
  ];

  return (
    <main className="site-main container">
      <div className="article-layout">
        <article className="article-main">
          <nav className="article-breadcrumb" aria-label="Kategori">
            <Link href="/" className="breadcrumb-item">
              MANŞET
            </Link>
            <span className="breadcrumb-sep">›</span>
            <Link href="/kategori/guncel" className="breadcrumb-item">
              GÜNCEL
            </Link>
          </nav>

          <h1 className="article-title">
            Alp Altınörs: Yasanın MGK kararına bağlanması Meclis'i işlevsizleştirmektir
          </h1>

          <div className="article-meta">
            <span className="meta-source">
              <strong>Haber:</strong> Sema Bingöl \ MA
            </span>
            <span className="meta-sep">·</span>
            <span className="meta-item">14 Ekim 2026</span>
            <span className="meta-sep">·</span>
            <span className="meta-item">10:50</span>
            <span className="meta-sep">·</span>
            <span className="meta-item">5 dk okuma</span>

            <MetaShare title="Alp Altınörs: Yasanın MGK kararına bağlanması Meclis'i işlevsizleştirmektir" />
          </div>

          <figure className="article-hero">
            <img
              src="/assets/photos/haber-foto1.jpg"
              alt="Zirve öncesi hazırlıklar"
            />
            <figcaption>
              <span className="fig-caption">Zirve öncesi hazırlıklar ve temaslar</span>
              <span className="fig-credit">Fotoğraf: Yeni Yaşam Arşivi</span>
            </figcaption>
          </figure>

          <div className="article-lead-group">
            <p className="article-lead">
              Çerçeve yasaya ilişkin konuşan Kobanê Davası tutsaklarından siyasetçi Alp Altınörs, 'Kürt ulusunun inkarını kısmen de olsa geriletebilecek potansiyele sahiptir. Ancak yasanın MGK kararına bağlanması Meclis'in kendisini işlevsizleştirmesi anlamındadır' dedi
            </p>
          </div>

          <div className="article-body">
            <p>
              Ankara Sincan 2 No'lu F Tipi Yüksek Güvenlikli Cezaevi'nde tutulan Halkların Demokratik Partisi'nin (HDP) eski Eş Genel Başkan Yardımcısı, Merkez Yönetim Kurulu üyesi ve Kobanê Davası tutsaklarından Alp Altınörs, Barış ve Demokratik Toplum Süreci'nde gelinen aşamayı değerlendirdi. Alp Altınörs, Kürt sorununun ancak "demokratik cumhuriyet" temelinde çözülebileceğini dile getirdi.
            </p>
            <p>
              2013-2015 yılları arasındaki süreç ile şimdiki süreci karşılaştıran Alp Altınörs, iki sürecin temel farkının iktidarın Kürt sorununa yaklaşımında ortaya çıktığını belirtti. Önceki süreçte Kürt sorununun varlığının kabul edildiğini, bugün ise sorunun "terör" sorunu olarak ele alındığına dikkat çeken Alp Altınörs, "Bu devasa fark kamusal tartışmanın bağlamını da belirliyor. Sürecin kapsamını daha baştan daraltıyor. Dün Kürt sorununun nasıl çözüleceği tartışılıyordu. Bugünse PKK'nin hangi şartlarda silah bırakacağı" ifadelerini kullandı.
            </p>
            <h2>'Öcalan yaptığı çağrıyla kilit taşını söktü'</h2>
            <p>
              Kürt Halk Önderi Abdullah Öcalan'ın süreçteki rolüne işaret eden Alp Altınörs, "Abdullah Öcalan, kilitlenmiş bir ülkede yaptığı çağrıyla kilit taşını söktü. Böylece demokrasi ve barış mücadelesi için yeni koşullar yarattı. Bu koşulları etkince değerlendirmek ise tüm demokrasi güçlerine kalıyor. Barış yapıcı olarak Öcalan'ın statüsünün yasal bağlayıcılığa kavuşması, bu ülkede tüm Kürtlerin konumunun bir nebze yükselmesi, inkarın biraz geriletilmesi anlamına gelecektir" diye belirtti.
            </p>
            <h2>'Süreç fiili OHAL şartlarında yürütülüyor'</h2>
            <p>
              Sürecin toplumsal karşılığının sınırlı kaldığını kaydeden Alp Altınörs, "Önceki tüm süreçlere barış talepli bir kitle hareketi eşlik ederdi. 2013-2015 süreci bu bakımdan çok daha ileriydi. Bugünkü süreçte ise böyle bir kitle hareketinin gelişmediğini görüyoruz. Salonlara hapsolmuş bir süreç yürüyor. Miting iptalleri yaşanıyor. 2013-2015'te belki de cumhuriyet tarihinde ilk kez Kürt coğrafyasında OHAL ya da sıkıyönetim uygulanmadı. Bugünkü süreç ise ülke genelinde uzatılmış fiilî OHAL şartlarında yürütülüyor. Siyasal baskı, sansür, zorbalık günbegün tırmanıyor" dedi.
            </p>
            <h2>'Meclis'in kendini işlevsizleştirmesidir'</h2>
            <p>
              Meclis'te 10 Ağustos'ta kabul edilen çerçeve yasaya dikkati çeken Alp Altınörs şunları söyledi:
            </p>
            <blockquote>
              <h6>
                “Tarihte ilk kez 'pişmanlık' ifadesini içermeyen bir silahsızlanma yasası olması itibarıyla olumludur. Kürt ulusunun inkarını kısmen de olsa geriletebilecek potansiyele sahiptir. Ancak yasanın MGK kararına bağlanması Meclis'in kendisini işlevsizleştirmesi anlamındadır. Askeri vesayet deniliyordu. Bu yasa tam da çözüm sürecini askeri vesayet altına sokmuştur.”
              </h6>
            </blockquote>
            <h2>Siyasi tutsakların özgürlüğü barışın temel koşullarından</h2>
            <blockquote>
              <h6>
                Tutsaklar sürece umutla birlikte temkinli bir iyimserlikle yaklaşıyor. Siyasi tutsakların özgürlüğü barışın temel koşullarından biridir. Barış, hapishaneler boşalmadan, tüm politik tutsakların özgürlüğü sağlanmadan ilk adımını bile atamaz. Hapishaneler boşalırken kuyu tipi hapishaneler kalıcı olarak kapatılıp yıkılmalıdır. İdare ve Gözlem Kurullarına verilen infaz uzatma yetkisi kaldırılmalıdır. Hasta tutsakların tahliyesine getirilen Adli Tıp Raporu şartı da kaldırılmalıdır.
              </h6>
            </blockquote>
          </div>

          <ArticleBottomShare title="Alp Altınörs: Yasanın MGK kararına bağlanması Meclis'i işlevsizleştirmektir" />

          <div className="article-tags">
            <span className="tags-label">Etiketler</span>
            {defaultTags.map((tag, idx) => (
              <Link key={idx} href={`/arama?q=${encodeURIComponent(tag)}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>

          <section className="related-news">
            <h2 className="related-title">İlgili Haberler</h2>
            <div className="related-grid">
              {relatedArticles.map((rel, idx) => (
                <Link key={idx} href={`/haber/${rel.slug}`} className="related-card">
                  <div className="related-img">
                    <img src={rel.thumb} alt={rel.title} />
                  </div>
                  <span className="related-cat">{rel.cat}</span>
                  <h3 className="related-heading">{rel.title}</h3>
                  <span className="related-date">{rel.date}</span>
                </Link>
              ))}
            </div>
          </section>
        </article>

        <ArticleSidebar className="article-sidebar" />
      </div>
    </main>
  );
}
