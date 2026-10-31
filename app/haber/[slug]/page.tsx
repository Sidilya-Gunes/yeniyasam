// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles, getStrapiMedia } from '@/lib/strapi';
import { marked } from 'marked';
import MetaShare from '@/components/MetaShare';
import ArticleBottomShare from '@/components/ArticleBottomShare';
import ArticleSidebar from '@/components/ArticleSidebar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Haber Bulunamadı — Yeni Yaşam Gazetesi' };
  }

  return {
    title: `${article.title} — Yeni Yaşam Gazetesi`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [getStrapiMedia(article.coverImage)],
    },
  };
}

export default async function HaberDetayPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getArticles({ limit: 8 });
  const relatedArticles = allArticles
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4);

  const dateObj = new Date(article.publishedAt);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const categoryName = article.category?.name || 'Güncel';
  const categorySlug = article.category?.slug || 'guncel';

  const defaultTags = ['Diplomasi', 'Bölgesel Gelişmeler', 'Ateşkes', 'İnsani Yardım'];

  return (
    <main className="site-main container">
      <div className="article-layout">
        <article className="article-main">
          {/* Breadcrumb */}
          <nav className="article-breadcrumb" aria-label="Kategori">
            <Link href="/" className="breadcrumb-item">
              MANŞET
            </Link>
            <span className="breadcrumb-sep">›</span>
            <Link href={`/kategori/${categorySlug}`} className="breadcrumb-item">
              {categoryName.toUpperCase()}
            </Link>
          </nav>

          {/* Başlık */}
          <h1 className="article-title">{article.title}</h1>

          {/* Meta & Paylaşım Dropdown */}
          <div className="article-meta">
            <span className="meta-source">
              <strong>Haber:</strong> {article.author?.name || 'Sema Bingöl \\ MA'}
            </span>
            <span className="meta-sep">·</span>
            <span className="meta-item">{formattedDate}</span>
            <span className="meta-sep">·</span>
            <span className="meta-item">{formattedTime}</span>
            <span className="meta-sep">·</span>
            <span className="meta-item">5 dk okuma</span>

            <MetaShare title={article.title} />
          </div>

          {/* Ana Görsel Hero */}
          <figure className="article-hero">
            <img src={getStrapiMedia(article.coverImage)} alt={article.title} />
            <figcaption>
              <span className="fig-caption">{article.title}</span>
              <span className="fig-credit">Fotoğraf: Yeni Yaşam Arşivi</span>
            </figcaption>
          </figure>

          {/* Özet Lead Grubu */}
          <div className="article-lead-group">
            <p className="article-lead">{article.summary}</p>
          </div>

          {/* Makale Gövdesi */}
          <div className="article-body">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: marked.parse(article.content) as string }} />
            ) : (
              <>
                <p>
                  Bölgesel gelişmelerin hız kazandığı bu dönemde, diplomatik temaslar yeni bir boyuta evriliyor. Masadaki temel gündem maddeleri arasında sürdürülebilir barış, sınır güvenliği ve yerel toplulukların hakları yer alıyor.
                </p>
                <p>
                  2013-2015 yılları arasındaki süreç ile şimdiki süreci karşılaştıran değerlendirmelerde, temel farkın iktidarın yaklaşımlarında ortaya çıktığı belirtiliyor. Önceki süreçte barışçıl çözüm iradesi öne çıkarken, bugün daha dar bir çerçevede güvenlik odaklı yaklaşımlar sergileniyor.
                </p>
                <h2>'Barış ve özgürlük mücadelesi kararlılıkla sürdürülmeli'</h2>
                <p>
                  Demokrasi güçlerinin ortak mücadelesine işaret eden uzmanlar, "Kilitlenmiş bir siyasal zeminde toplumsal muhalefetin birlikteliği yeni olanaklar yaratacaktır. Bu olanakları değerlendirmek ise tüm barış ve emek güçlerine düşüyor" ifadelerini kullandı.
                </p>
                <blockquote>
                  <h6>
                    “Tarihte ilk kez halkların kendi iradelerini doğrudan yansıttığı modeller kalıcı barışın teminatı olmuştur. Yerel yönetimlerin güçlendirilmesi ve demokratik katılım kanallarının açılması elzemdir.”
                  </h6>
                </blockquote>
                <h2>Siyasi tutsakların özgürlüğü barışın temel koşullarından</h2>
                <p>
                  Toplumun tüm kesimlerinin barış sürecine etkin katılımının sağlanması gerektiği vurgulanırken, adil yargılanma hakkı ve evrensel hukuk standartlarına uyulmasının önemi bir kez daha yinelendi.
                </p>
              </>
            )}
          </div>

          {/* Alt Paylaşım Butonları */}
          <ArticleBottomShare title={article.title} />

          {/* Etiketler */}
          <div className="article-tags">
            <span className="tags-label">Etiketler</span>
            {defaultTags.map((tag, idx) => (
              <Link key={idx} href={`/arama?q=${encodeURIComponent(tag)}`} className="tag">
                {tag}
              </Link>
            ))}
          </div>

          {/* İlgili Haberler */}
          <section className="related-news">
            <h2 className="related-title">İlgili Haberler</h2>
            <div className="related-grid">
              {relatedArticles.map((rel) => (
                <Link key={rel.id} href={`/haber/${rel.slug}`} className="related-card">
                  <div className="related-img">
                    <img src={getStrapiMedia(rel.coverImage)} alt={rel.title} />
                  </div>
                  <span className="related-cat">{rel.category?.name || 'Dünya'}</span>
                  <h3 className="related-heading">{rel.title}</h3>
                  <span className="related-date">
                    {new Date(rel.publishedAt).toLocaleDateString('tr-TR')}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </article>

        {/* Kenar Çubuğu (Sidebar) */}
        <ArticleSidebar className="article-sidebar" />
      </div>
    </main>
  );
}
