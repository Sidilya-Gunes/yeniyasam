// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getArticles, getCategoryBySlug, getStrapiMedia } from '@/lib/strapi';
import ArticleSidebar from '@/components/ArticleSidebar';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Kategori — Yeni Yaşam Gazetesi' };
  }

  return {
    title: `${category.name} Haberleri — Yeni Yaşam Gazetesi`,
    description: category.description || `${category.name} kategorisine ait güncel haberler ve analizler.`,
  };
}

export default async function KategoriDetayPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || '1', 10));

  // Kategori alias yönlendirmeleri
  if (slug === 'video') redirect('/video');
  if (slug === 'kultur') redirect('/kategori/kultur-sanat');
  if (slug === 'gundem') redirect('/kategori/guncel');
  if (slug === 'karikatur') redirect('/karikatur');
  if (slug === 'manset') redirect('/manset');
  if (slug === 'jin' || slug === 'jin-dergi') redirect('/jin-dergi');
  if (slug === 'yazarlar') redirect('/yazarlar');

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const isFirstPage = currentPage === 1;
  const pageSize = isFirstPage ? 13 : 12;
  const categoryArticles = await getArticles({ categorySlug: slug, page: currentPage, limit: pageSize });
  const articles = categoryArticles.length > 0 ? categoryArticles : await getArticles({ page: currentPage, limit: pageSize });
  const featured = isFirstPage && articles.length > 0 ? articles[0] : null;
  const listCards = isFirstPage ? articles.slice(1) : articles;

  return (
    <main className="site-main container">
      <div className="archive-layout">
        <header className="archive-header">
          <nav className="archive-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Ana Sayfa</Link>
            <span className="archive-sep">›</span>
            <span className="archive-current">{category.name}</span>
          </nav>
          <h1 className="archive-title">{category.name}</h1>
        </header>

        <div className="archive-body">
          <div className="archive-main">
            {featured ? (
              <article className="archive-featured">
                <Link href={`/haber/${featured.slug}`} className="archive-featured-img">
                  <img src={getStrapiMedia(featured.coverImage)} alt={featured.title} />
                </Link>
                <div className="archive-featured-body">
                  <span className="archive-featured-cat">{category.name}</span>
                  <h2 className="archive-featured-title">
                    <Link href={`/haber/${featured.slug}`}>{featured.title}</Link>
                  </h2>
                  <p className="archive-featured-excerpt">{featured.summary}</p>
                  <div className="archive-featured-meta">
                    <span>{featured.author?.name || 'Yeni Yaşam'}</span>
                    <span className="archive-meta-sep">·</span>
                    <span>
                      {new Date(featured.publishedAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="archive-meta-sep">·</span>
                    <span>5 dk okuma</span>
                  </div>
                </div>
              </article>
            ) : null}

            {listCards.length > 0 && (
              <div className="archive-grid">
                {listCards.map((item) => (
                  <article className="archive-card" key={item.id}>
                    <Link href={`/haber/${item.slug}`} className="archive-card-img">
                      <img src={getStrapiMedia(item.coverImage)} alt={item.title} />
                    </Link>
                    <div className="archive-card-body">
                      <span className="archive-card-cat">{category.name}</span>
                      <h3 className="archive-card-title">
                        <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                      </h3>
                      <p className="archive-card-excerpt">{item.summary}</p>
                      <span className="archive-card-date">
                        {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <nav className="archive-pagination" aria-label="Sayfalama">
              {currentPage > 1 ? (
                <Link
                  href={`/kategori/${slug}?page=${currentPage - 1}`}
                  className="page-arrow"
                  aria-label="Önceki sayfa"
                >
                  ‹
                </Link>
              ) : (
                <span className="page-arrow disabled">‹</span>
              )}

              {[1, 2, 3, 4, 5].map((p) => {
                if (p === currentPage) {
                  return (
                    <span key={p} className="page-num active">
                      {p}
                    </span>
                  );
                }
                return (
                  <Link key={p} href={`/kategori/${slug}?page=${p}`} className="page-num">
                    {p}
                  </Link>
                );
              })}

              <Link
                href={`/kategori/${slug}?page=${currentPage + 1}`}
                className="page-arrow"
                aria-label="Sonraki sayfa"
              >
                ›
              </Link>
            </nav>
          </div>

          <ArticleSidebar className="archive-sidebar" />
        </div>
      </div>
    </main>
  );
}
