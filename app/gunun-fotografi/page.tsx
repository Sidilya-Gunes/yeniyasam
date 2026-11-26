// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getDailyPhotos } from '@/lib/strapi';
import DailyPhotoGalleryClient from '@/components/DailyPhotoGalleryClient';

export const metadata: Metadata = {
  title: 'Günün Fotoğrafı ve Görsel Arşiv',
  description: 'Yeni Yaşam Gazetesi günün fotoğrafı, fotoğraf galerileri ve toplumsal olayların görsel tanıklık arşivi.',
};

export const revalidate = 60;

export default async function GununFotografiPage() {
  const photos = await getDailyPhotos();

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <header className="archive-header" style={{ marginBottom: '2rem' }}>
        <nav className="archive-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">Günün Fotoğrafı</span>
        </nav>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="archive-title" style={{ margin: 0 }}>
              GÜNÜN FOTOĞRAFI VE GÖRSEL ARŞİV
            </h1>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.95rem',
                marginTop: '0.4rem',
                maxWidth: '720px',
                lineHeight: 1.5,
              }}
            >
              Yeni Yaşam Gazetesi foto muhabirleri ve arşivinden günün öne çıkan kareleri; hak mücadeleleri, doğa savunuları ve toplumsal hayatın görsel tanıklığı.
            </p>
          </div>
          <Link
            href="/"
            className="error-btn error-btn--secondary"
            style={{ fontSize: '0.82rem', padding: '9px 18px', textDecoration: 'none' }}
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </header>

      <DailyPhotoGalleryClient photos={photos} />
    </main>
  );
}
