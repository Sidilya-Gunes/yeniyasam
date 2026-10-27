// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticles, getCategories, getStrapiMedia } from '@/lib/strapi';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: 'Kategori Bulunamadı' };
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

  const articles = await getArticles({ categorySlug: slug, limit: 18 });

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <div className="section-title-bar" style={{ marginBottom: '2rem' }}>
        <h1
          className="section-title"
          data-cat={category.slug}
          style={{ fontSize: '1.8rem', fontWeight: 800, textTransform: 'uppercase' }}
        >
          {category.name}
        </h1>
      </div>

      {articles.length === 0 ? (
        <p className="page-placeholder">Bu kategoride henüz haber bulunmamaktadır.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {articles.map((item) => (
            <article className="news-card" key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`/haber/${item.slug}`} className="news-card-img">
                <img src={getStrapiMedia(item.coverImage)} alt={item.title} />
              </Link>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.75rem 0 0.5rem', lineHeight: 1.35 }}>
                <Link href={`/haber/${item.slug}`}>{item.title}</Link>
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                {item.summary}
              </p>
              <span className="news-date" style={{ marginTop: '0.75rem' }}>
                {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
              </span>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
