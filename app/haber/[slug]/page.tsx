// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getArticleBySlug, getArticles, getStrapiMedia } from '@/lib/strapi';
import type { Article } from '@/types/strapi';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import ArticleBottomShare from '@/components/ArticleBottomShare';
import ArticleSidebar from '@/components/ArticleSidebar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function extractYouTubeId(url?: string): string {
  if (!url) return '';
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
  const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return match && match[2].length === 11 ? match[2] : url;
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

  // Eğer içerik bir video haberi ise video oynatıcılı özel sayfaya yönlendir
  if (article.category?.slug === 'video' || slug === 'video') {
    redirect(`/video/${article.slug || slug}`);
  }

  const categoryName = article.category?.name || 'Güncel';
  const categorySlug = article.category?.slug || 'guncel';

  // 1. İlgili Haberler: Öncelikle aynı kategorideki haberleri çek (mevcut haber hariç)
  let relatedArticles: Article[] = [];
  if (categorySlug) {
    const categoryArticles = await getArticles({ categorySlug, limit: 6 });
    relatedArticles = categoryArticles.filter((a) => a.slug !== article.slug);
  }

  // 2. Eğer aynı kategoride 4'ten az haber varsa genel en yeni haberlerle 4'e tamamla
  if (relatedArticles.length < 4) {
    const generalArticles = await getArticles({ limit: 10 });
    const additional = generalArticles.filter(
      (a) => a.slug !== article.slug && !relatedArticles.some((r) => r.slug === a.slug)
    );
    relatedArticles = [...relatedArticles, ...additional];
  }

  relatedArticles = relatedArticles.slice(0, 4);

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

          {/* Meta */}
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
          </div>

          {/* Video veya Ana Görsel Hero */}
          {article.videoUrl ? (
            <div
              className="article-video-hero"
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '6px',
                marginBottom: 'var(--sp-3)',
                background: '#000',
              }}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(article.videoUrl)}`}
                title={article.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          ) : (
            <figure className="article-hero">
              <img src={getStrapiMedia(article.coverImage)} alt={article.title} />
              <figcaption>
                <span className="fig-caption">{article.title}</span>
                <span className="fig-credit">Fotoğraf: Yeni Yaşam Arşivi</span>
              </figcaption>
            </figure>
          )}

          {/* Özet Lead Grubu */}
          {article.summary && (
            <div className="article-lead-group">
              <p className="article-lead">{article.summary}</p>
            </div>
          )}

          {/* Makale Gövdesi */}
          <div className="article-body">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(article.content) as string) }} />
            ) : null}
          </div>

          {/* Alt Paylaşım Butonları */}
          <ArticleBottomShare title={article.title} />

          {/* İlgili Haberler */}
          <section className="related-news">
            <h2 className="related-title">İlgili Haberler</h2>
            <div className="related-grid">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={rel.category?.slug === 'video' ? `/video/${rel.slug}` : `/haber/${rel.slug}`}
                  className="related-card"
                >
                  <div className="related-img">
                    <img src={getStrapiMedia(rel.coverImage)} alt={rel.title} />
                  </div>
                  <span className="related-cat">{rel.category?.name || categoryName}</span>
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
        <ArticleSidebar className="article-sidebar" currentSlug={article.slug} />
      </div>
    </main>
  );
}
