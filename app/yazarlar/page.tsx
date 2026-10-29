// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getAuthors, getStrapiMedia } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Yazarlar — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi yazarlar listesi ve güncel köşe yazıları.',
};

export default async function YazarlarPage() {
  const strapiAuthors = await getAuthors();

  // Orijinal demo sayfasındaki zengin yazar listesi
  const defaultAuthors = [
    { name: 'Nurcan Baysal', avatar: '/assets/photos/yazar1.jpeg', slug: 'nurcan-baysal' },
    { name: 'Hasan Özgür Top', avatar: '/assets/photos/yazar2.webp', slug: 'hasan-ozgur-top' },
    { name: 'Fırat Yücel', avatar: '/assets/photos/yazar3.webp', slug: 'firat-yucel' },
    { name: 'Ahmet Kaya', avatar: '/assets/photos/yazar4.webp', slug: 'ahmet-kaya' },
    { name: 'Zehra Doğan', avatar: '/assets/photos/yazar5.jpeg', slug: 'zehra-dogan' },
    { name: 'Nezahat Doğan', avatar: '/assets/photos/yazar1.jpeg', slug: 'nezahat-dogan' },
    { name: 'Ayhan Kavak', avatar: '/assets/photos/yazar2.webp', slug: 'ayhan-kavak' },
    { name: 'Nimet Sevim', avatar: '/assets/photos/yazar3.webp', slug: 'nimet-sevim' },
    { name: 'Ergin Atabey', avatar: '/assets/photos/yazar4.webp', slug: 'ergin-atabey' },
    { name: 'Sema Bingöl', avatar: '/assets/photos/yazar5.jpeg', slug: 'sema-bingol' },
    { name: 'Evin Çiftçi', avatar: '/assets/photos/yazar1.jpeg', slug: 'evin-ciftci' },
    { name: 'Dilzar Dîlok', avatar: '/assets/photos/yazar2.webp', slug: 'dilzar-dilok' },
  ];

  const authors = strapiAuthors && strapiAuthors.length > defaultAuthors.length
    ? strapiAuthors
    : defaultAuthors;

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
        {authors.map((author, idx) => (
          <Link href={`/yazar/${author.slug}`} className="author-card" key={idx}>
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

      <nav className="author-pagination" aria-label="Sayfalama">
        <span className="page-arrow disabled">‹</span>
        <span className="page-num active">1</span>
        <a href="#" className="page-num">2</a>
        <a href="#" className="page-arrow" aria-label="Sonraki sayfa">›</a>
      </nav>
    </main>
  );
}
