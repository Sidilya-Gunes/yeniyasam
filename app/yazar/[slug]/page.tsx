// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAuthorBySlug, getArticles, getStrapiMedia } from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
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

export default async function YazarDetayPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const allArticles = await getArticles({ limit: 20 });
  const authorArticles = allArticles.filter(
    (a) => a.author?.slug === author.slug || a.author?.name === author.name
  );

  return (
    <main className="site-main container">
      <div className="author-layout">
        <header className="author-hero">
          <div className="author-hero-avatar">
            <img src={getStrapiMedia(author.avatar)} alt={author.name} />
          </div>
          <div className="author-hero-info">
            <h1 className="author-name">{author.name}</h1>
            <span className="author-role">{author.role || `${authorArticles.length} yazı`}</span>
            <div className="author-socials">
              <a href="#" aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>@{author.slug}</span>
              </a>
              {author.email && (
                <a href={`mailto:${author.email}`} aria-label="E-posta">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>E-posta</span>
                </a>
              )}
            </div>
          </div>
        </header>

        <section className="author-articles-section">
          <h2 className="author-articles-title">Yazıları</h2>
          <div className="author-articles">
            {(authorArticles.length > 0 ? authorArticles : allArticles.slice(0, 8)).map((item) => (
              <article
                className="author-article-card"
                data-cat={item.category?.slug || 'politika'}
                key={item.id}
              >
                <Link href={`/haber/${item.slug}`}>
                  <h3 className="author-article-title">{item.title}</h3>
                  <p className="author-article-excerpt">{item.summary}</p>
                  <span className="author-article-meta">
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR')} · 6 dk okuma
                  </span>
                </Link>
              </article>
            ))}
          </div>

          <nav className="author-pagination" aria-label="Sayfalama">
            <span className="page-arrow disabled">‹</span>
            <span className="page-num active">1</span>
            <span className="page-arrow disabled">›</span>
          </nav>
        </section>
      </div>
    </main>
  );
}
