// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllAuthors, getStrapiMedia } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Yazarlar — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi yazarlar listesi ve güncel köşe yazıları.',
};

interface YazarlarPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function YazarlarPage({ searchParams }: YazarlarPageProps) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || '1', 10));
  const pageSize = 16;

  const allAuthors = await getAllAuthors();
  const totalAuthors = allAuthors.length;
  const totalPages = Math.max(1, Math.ceil(totalAuthors / pageSize));
  const validPage = Math.min(currentPage, totalPages);

  const startIndex = (validPage - 1) * pageSize;
  const currentAuthors = allAuthors.slice(startIndex, startIndex + pageSize);

  // Sayfa numaraları dizisi
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <main className="site-main container">
      <header className="archive-header">
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Yazarlar</span>
        </nav>
        <h1 className="archive-title">Yazarlar</h1>
      </header>

      <div className="authors-grid">
        {currentAuthors.map((author, idx) => (
          <Link href={`/yazar/${author.slug}`} className="author-card" key={author.id || idx}>
            <div className="author-card-avatar">
              <img
                src={typeof author.avatar === 'string' ? author.avatar : getStrapiMedia(author.avatar)}
                alt={author.name}
              />
            </div>
            <h3 className="author-card-name">{author.name}</h3>
            <span className="author-card-link">
              Yazıları <span>›</span>
            </span>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="author-pagination" aria-label="Sayfalama">
          {validPage > 1 ? (
            <Link
              href={`/yazarlar?page=${validPage - 1}`}
              className="page-arrow"
              aria-label="Önceki sayfa"
            >
              ‹
            </Link>
          ) : (
            <span className="page-arrow disabled">‹</span>
          )}

          {pageNumbers.map((p) => {
            if (p === validPage) {
              return (
                <span key={p} className="page-num active">
                  {p}
                </span>
              );
            }
            return (
              <Link key={p} href={`/yazarlar?page=${p}`} className="page-num">
                {p}
              </Link>
            );
          })}

          {validPage < totalPages ? (
            <Link
              href={`/yazarlar?page=${validPage + 1}`}
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
    </main>
  );
}
