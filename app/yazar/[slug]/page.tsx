// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthorBySlug, getArticlesByAuthor, getStrapiMedia } from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return { title: 'Yazar Bulunamadı — Yeni Yaşam Gazetesi' };
  }

  return {
    title: `${author.name} Yazıları — Yeni Yaşam Gazetesi`,
    description: author.bio || `${author.name} köşe yazıları ve makaleleri.`,
  };
}

export default async function YazarDetayPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const pageSize = 10;

  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const { articles: authorArticles, total } = await getArticlesByAuthor(slug, currentPage, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="site-main container">
      <div className="author-layout">
        <header className="author-hero">
          <div className="author-hero-avatar">
            <img src={getStrapiMedia(author.avatar)} alt={author.name} />
          </div>
          <div className="author-hero-info">
            <h1 className="author-name">{author.name}</h1>
            <div className="author-socials">
              <span className="author-handle">
                {total} Makale
              </span>
            </div>
          </div>
        </header>

        <section className="author-articles-section">
          <h2 className="author-articles-title">Yazıları ({total})</h2>
          <div className="author-articles">
            {authorArticles.length > 0 ? (
              authorArticles.map((item) => (
                <article
                  className="author-article-card"
                  data-cat="politika"
                  key={item.id}
                >
                  <Link href={`/haber/${item.slug}`}>
                    <h3 className="author-article-title">{item.title}</h3>
                    <p className="author-article-excerpt">{item.summary}</p>
                    <span className="author-article-meta">
                      {new Date(item.publishedAt).toLocaleDateString('tr-TR')} · 5 dk okuma
                    </span>
                  </Link>
                </article>
              ))
            ) : (
              <p style={{ color: 'var(--text-soft)', padding: '2rem 0' }}>
                Bu yazara ait henüz yayınlanmış yazı bulunmuyor.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <nav className="author-pagination" aria-label="Sayfalama">
              {currentPage > 1 ? (
                <Link
                  href={`/yazar/${slug}?page=${currentPage - 1}`}
                  className="page-arrow"
                  aria-label="Önceki sayfa"
                >
                  ‹
                </Link>
              ) : (
                <span className="page-arrow disabled">‹</span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 10).map((p) => {
                if (p === currentPage) {
                  return (
                    <span key={p} className="page-num active">
                      {p}
                    </span>
                  );
                }
                return (
                  <Link key={p} href={`/yazar/${slug}?page=${p}`} className="page-num">
                    {p}
                  </Link>
                );
              })}

              {currentPage < totalPages ? (
                <Link
                  href={`/yazar/${slug}?page=${currentPage + 1}`}
                  className="page-arrow"
                  aria-label="Sonraki sayfa"
                >
                  ›
                </Link>
              ) : (
                <span className="page-arrow disabled">›</span>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
