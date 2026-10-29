// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, getCategories, getStrapiMedia } from '@/lib/strapi';
import ArticleSidebar from '@/components/ArticleSidebar';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Kategori Bulunamadı — Yeni Yaşam Gazetesi' };
  }

  return {
    title: `${category.name} Haberleri — Yeni Yaşam Gazetesi`,
    description: category.description || `${category.name} kategorisine ait güncel haberler ve analizler.`,
  };
}

export default async function KategoriDetayPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticles({ categorySlug: slug, limit: 12 });
  const featured = articles[0];
  const listCards = articles.slice(1);

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

            <div className="archive-grid">
              {(listCards.length > 0 ? listCards : articles).map((item) => (
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

            <nav className="archive-pagination" aria-label="Sayfalama">
              <span className="page-arrow disabled">‹</span>
              <span className="page-num active">1</span>
              <span className="page-arrow disabled">›</span>
            </nav>
          </div>

          <ArticleSidebar className="archive-sidebar" />
        </div>
      </div>
    </main>
  );
}
