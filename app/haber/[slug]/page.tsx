// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getArticles, getStrapiMedia } from '@/lib/strapi';
import ShareMenu from '@/components/ShareMenu';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Haber Bulunamadı' };
  }

  return {
    title: article.title,
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

  const relatedArticles = (await getArticles({ limit: 4 }))
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <article className="single-article-view" style={{ maxWidth: '840px', margin: '0 auto' }}>
        {/* Kategori ve Başlık */}
        <div className="article-header" style={{ marginBottom: '1.5rem' }}>
          {article.category && (
            <Link
              href={`/kategori/${article.category.slug}`}
              className="article-cat-badge"
              style={{
                display: 'inline-block',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'var(--primary)',
                marginBottom: '0.75rem',
              }}
            >
              {article.category.name}
            </Link>
          )}

          <h1
            className="article-main-title"
            style={{
              fontSize: '2.2rem',
              fontWeight: 800,
              lineHeight: 1.25,
              marginBottom: '1rem',
              color: 'var(--heading)',
            }}
          >
            {article.title}
          </h1>

          <p
            className="article-lead"
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.6,
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            {article.summary}
          </p>

          {/* Yazar ve Tarih Bilgisi */}
          <div
            className="article-meta-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              borderTop: '1px solid var(--border)',
              borderBottom: '1px solid var(--border)',
              padding: '0.75rem 0',
              gap: '1rem',
            }}
          >
            {article.author ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                  src={getStrapiMedia(article.author.avatar)}
                  alt={article.author.name}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <Link
                    href={`/yazar/${article.author.slug}`}
                    style={{ fontWeight: 700, color: 'var(--heading)', display: 'block' }}
                  >
                    {article.author.name}
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-soft)' }}>
                    {article.author.role || 'Yeni Yaşam'}
                  </span>
                </div>
              </div>
            ) : (
              <span style={{ fontWeight: 600 }}>Yeni Yaşam</span>
            )}

            <time dateTime={article.publishedAt} style={{ fontSize: '0.85rem', color: 'var(--text-soft)' }}>
              {formattedDate}
            </time>
          </div>
        </div>

        {/* Kapak Görseli */}
        {article.coverImage && (
          <div className="article-figure" style={{ marginBottom: '2rem' }}>
            <img
              src={getStrapiMedia(article.coverImage)}
              alt={article.title}
              style={{ width: '100%', maxHeight: '520px', objectFit: 'cover', borderRadius: '4px' }}
            />
          </div>
        )}

        {/* Paylaşım Butonları */}
        <ShareMenu title={article.title} />

        {/* Haber İçeriği */}
        <div
          className="article-body-content"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--body-size)',
            lineHeight: 'var(--body-leading)',
            color: 'var(--text)',
            whiteSpace: 'pre-line',
          }}
        >
          {article.content || article.summary}
        </div>

        {/* İlgili Haberler */}
        {relatedArticles.length > 0 && (
          <section style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '2px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--heading)' }}>
              İLGİLİ HABERLER
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {relatedArticles.map((rel) => (
                <article key={rel.id} className="news-card">
                  <Link href={`/haber/${rel.slug}`} className="news-card-img">
                    <img src={getStrapiMedia(rel.coverImage)} alt={rel.title} />
                  </Link>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem' }}>
                    <Link href={`/haber/${rel.slug}`}>{rel.title}</Link>
                  </h4>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
