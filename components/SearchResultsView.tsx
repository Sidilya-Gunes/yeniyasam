'use client';

// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Article, Author } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi';

interface SearchResultsViewProps {
  query: string;
  articles: Article[];
  matchingAuthors: Author[];
  initialTab?: string;
  initialSort?: string;
  pageSize?: number;
}

export default function SearchResultsView({
  query,
  articles,
  matchingAuthors,
  initialTab = 'all',
  initialSort = 'En yeni',
  pageSize = 10,
}: SearchResultsViewProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (initialTab && ['all', 'haberler', 'soylesi', 'yazarlar'].includes(initialTab)) {
      return initialTab;
    }
    return 'all';
  });
  const [sortBy, setSortBy] = useState<string>(initialSort || 'En yeni');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Kategorilere göre makaleleri sınıflandır
  const isSoylesi = (a: Article) => {
    const slug = a.category?.slug?.toLowerCase() || '';
    const name = a.category?.name?.toLowerCase() || '';
    return slug === 'soylesi' || name.includes('söyleşi');
  };

  const isYazarArticle = (a: Article) => {
    const slug = a.category?.slug?.toLowerCase() || '';
    const name = a.category?.name?.toLowerCase() || '';
    const qLower = query.trim().toLocaleLowerCase('tr-TR');
    return (
      slug === 'yazarlar' ||
      slug === 'makale' ||
      name.includes('köşe') ||
      name.includes('yazar') ||
      Boolean(a.author?.name && qLower && a.author.name.toLocaleLowerCase('tr-TR').includes(qLower))
    );
  };

  const isHaber = (a: Article) => !isSoylesi(a) && !isYazarArticle(a);

  const haberArticles = useMemo(() => articles.filter(isHaber), [articles]);
  const soylesiArticles = useMemo(() => articles.filter(isSoylesi), [articles]);
  const yazarArticles = useMemo(() => articles.filter(isYazarArticle), [articles, query]);

  // Sayımları hesapla
  const haberCount = haberArticles.length;
  const soylesiCount = soylesiArticles.length;
  const yazarCount = yazarArticles.length + matchingAuthors.length;
  const allCount = articles.length + matchingAuthors.length;

  // Tab değiştiğinde
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (newTab === 'all') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', newTab);
      }
      url.searchParams.delete('page');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Sıralama değiştiğinde
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    setCurrentPage(1);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('sort', newSort);
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Aktif sekmedeki makaleleri al ve sırala
  const currentTabArticles = useMemo(() => {
    let list: Article[] = [];
    if (activeTab === 'all') {
      list = articles;
    } else if (activeTab === 'haberler') {
      list = haberArticles;
    } else if (activeTab === 'soylesi') {
      list = soylesiArticles;
    } else if (activeTab === 'yazarlar') {
      list = yazarArticles;
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'En yeni') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      if (sortBy === 'En eski') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
      }
      if (sortBy === 'En alakalı') {
        const q = query.trim().toLocaleLowerCase('tr-TR');
        const aTitleMatch = a.title.toLocaleLowerCase('tr-TR').includes(q) ? 2 : 0;
        const bTitleMatch = b.title.toLocaleLowerCase('tr-TR').includes(q) ? 2 : 0;
        const aSummaryMatch = a.summary?.toLocaleLowerCase('tr-TR').includes(q) ? 1 : 0;
        const bSummaryMatch = b.summary?.toLocaleLowerCase('tr-TR').includes(q) ? 1 : 0;
        return (bTitleMatch + bSummaryMatch) - (aTitleMatch + aSummaryMatch);
      }
      return 0;
    });
  }, [activeTab, articles, haberArticles, soylesiArticles, yazarArticles, sortBy, query]);

  // Yazarlar sekmesinde veya Tümü sekmesinde varsa eşleşen yazarları göster
  const showAuthors = (activeTab === 'all' || activeTab === 'yazarlar') && matchingAuthors.length > 0;

  // Sayfalama hesapları
  const totalArticles = currentTabArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedArticles = currentTabArticles.slice(startIndex, startIndex + pageSize);

  const tabLabels: Record<string, string> = {
    all: 'Tümü',
    haberler: 'Haberler',
    soylesi: 'Söyleşi',
    yazarlar: 'Yazarlar',
  };

  const handlePageSelect = (p: number) => {
    setCurrentPage(p);
    if (typeof window !== 'undefined') {
      const filtersEl = document.querySelector('.search-filters');
      if (filtersEl) {
        filtersEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="search-main">
      <div className="search-filters">
        <div className="search-filter-tabs" role="tablist" aria-label="Arama Filtreleri">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`search-filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            Tümü <span className="search-filter-count">{allCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'haberler'}
            className={`search-filter-tab ${activeTab === 'haberler' ? 'active' : ''}`}
            onClick={() => handleTabChange('haberler')}
          >
            Haberler <span className="search-filter-count">{haberCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'soylesi'}
            className={`search-filter-tab ${activeTab === 'soylesi' ? 'active' : ''}`}
            onClick={() => handleTabChange('soylesi')}
          >
            Söyleşi <span className="search-filter-count">{soylesiCount}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'yazarlar'}
            className={`search-filter-tab ${activeTab === 'yazarlar' ? 'active' : ''}`}
            onClick={() => handleTabChange('yazarlar')}
          >
            Yazarlar <span className="search-filter-count">{yazarCount}</span>
          </button>
        </div>

        <div className="search-sort">
          <label htmlFor="searchSort">Sırala:</label>
          <select id="searchSort" value={sortBy} onChange={handleSortChange}>
            <option value="En yeni">En yeni</option>
            <option value="En eski">En eski</option>
            <option value="En alakalı">En alakalı</option>
          </select>
        </div>
      </div>

      {/* Eşleşen Yazarlar Varsa Göster */}
      {showAuthors && (
        <section className="search-matching-authors" style={{ marginBottom: '24px' }}>
          <h4
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--primary)',
              marginBottom: '12px',
            }}
          >
            Eşleşen Yazarlar ({matchingAuthors.length})
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {matchingAuthors.map((author) => (
              <Link
                key={author.id || author.slug}
                href={`/yazar/${author.slug}`}
                className="author-card"
                style={{ padding: '14px 10px' }}
              >
                <div className="author-card-avatar" style={{ width: '70px', height: '70px' }}>
                  <img
                    src={typeof author.avatar === 'string' ? author.avatar : getStrapiMedia(author.avatar)}
                    alt={author.name}
                  />
                </div>
                <h3 className="author-card-name" style={{ fontSize: '0.92rem' }}>
                  {author.name}
                </h3>
                {author.role && (
                  <span className="author-card-role" style={{ fontSize: '0.72rem' }}>
                    {author.role}
                  </span>
                )}
                <span className="author-card-link" style={{ fontSize: '0.72rem', marginTop: '4px' }}>
                  Yazılarını Gör <span>→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Sonuç Listesi */}
      {paginatedArticles.length > 0 ? (
        <div className="search-results">
          {paginatedArticles.map((item) => (
            <article className="search-result-item" key={item.id}>
              <Link href={`/haber/${item.slug}`} className="search-result-img">
                <img src={getStrapiMedia(item.coverImage)} alt={item.title} />
              </Link>
              <div className="search-result-body">
                <span className="search-result-cat">{item.category?.name || 'Güncel'}</span>
                <h3 className="search-result-title">
                  <Link href={`/haber/${item.slug}`}>{item.title}</Link>
                </h3>
                <p className="search-result-excerpt">{item.summary}</p>
                <div className="search-result-meta">
                  <span>
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="search-meta-sep">·</span>
                  <span>{item.author?.name || 'Yeni Yaşam'}</span>
                  <span className="search-meta-sep">·</span>
                  <span>5 dk okuma</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Eğer bu sekmede hiç haber yoksa (ve yazar da gösterilmiyorsa) */
        (!showAuthors || currentTabArticles.length === 0) && (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'var(--bg-soft)',
              borderRadius: '8px',
              margin: '20px 0 30px',
            }}
          >
            <p style={{ fontSize: '1rem', color: 'var(--text-soft)', marginBottom: '14px' }}>
              <strong>{tabLabels[activeTab] || activeTab}</strong> sekmesinde arama kriterinize uygun sonuç bulunamadı.
            </p>
            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Tüm Sonuçları Göster ({allCount})
              </button>
            )}
          </div>
        )
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <nav className="archive-pagination" aria-label="Sayfalama" style={{ marginTop: '24px' }}>
          {currentPage > 1 ? (
            <button
              type="button"
              onClick={() => handlePageSelect(currentPage - 1)}
              className="page-arrow"
              aria-label="Önceki sayfa"
              style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              ‹
            </button>
          ) : (
            <span className="page-arrow disabled">‹</span>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            if (p === currentPage) {
              return (
                <span key={p} className="page-num active">
                  {p}
                </span>
              );
            }
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageSelect(p)}
                className="page-num"
                style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}
              >
                {p}
              </button>
            );
          })}

          {currentPage < totalPages ? (
            <button
              type="button"
              onClick={() => handlePageSelect(currentPage + 1)}
              className="page-arrow"
              aria-label="Sonraki sayfa"
              style={{ background: 'none', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              ›
            </button>
          ) : (
            <span className="page-arrow disabled">›</span>
          )}
        </nav>
      )}
    </div>
  );
}
