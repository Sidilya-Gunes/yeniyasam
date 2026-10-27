// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

interface VideoItem {
  id: string | number;
  title: string;
  category: string;
  duration: string;
  thumbnail: string;
  slug: string;
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret",
    category: 'Politika',
    duration: '08:42',
    thumbnail: '/assets/photos/haber-foto1.jpg',
    slug: 'pervin-buldan-baris-anneleri-ziyaret',
  },
  {
    id: 2,
    title: "Munzur Vadisi'nde HES projelerine karşı adım",
    category: 'Ekoloji',
    duration: '10:43',
    thumbnail: '/assets/photos/haber-foto9.jpg',
    slug: 'munzur-vadisi-hes-projelerine-karsi-adim',
  },
  {
    id: 3,
    title: "Ortadoğu'da yeni dengeler ve cepheleşmeler",
    category: 'Dünya',
    duration: '05:42',
    thumbnail: '/assets/photos/haber-foto3.jpg',
    slug: 'ortadogu-yeni-dengeler',
  },
  {
    id: 4,
    title: 'Enflasyon sarmalında dar gelirlinin yaşam mücadelesi',
    category: 'Ekonomi',
    duration: '11:47',
    thumbnail: '/assets/photos/haber-foto4.jpg',
    slug: 'enflasyon-sarmali-ve-dar-gelirli',
  },
  {
    id: 5,
    title: "Meclis'te yeni yasama dönemi başlarken kritik gündem",
    category: 'Politika',
    duration: '11:47',
    thumbnail: '/assets/photos/haber-foto2.jpeg',
    slug: 'mecliste-yeni-yasama-donemi',
  },
  {
    id: 6,
    title: 'Uluslararası Belgesel Film Festivali kapılarını açıyor',
    category: 'Kültür-Sanat',
    duration: '11:47',
    thumbnail: '/assets/photos/haber-foto5.jpg',
    slug: 'uluslararasi-belgesel-film-festivali',
  },
];

export default function VideoCarousel({ videos = DEFAULT_VIDEOS }: { videos?: VideoItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = 320;
    trackRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="video-carousel-section">
      <div className="container">
        <div className="section-title-bar dark">
          <Link href="/kategori/video">
            <h2>YENİ YAŞAM MEDYA</h2>
          </Link>
          <div className="carousel-nav">
            <button
              type="button"
              className="carousel-prev"
              aria-label="Önceki"
              disabled={!canScrollLeft}
              onClick={() => scroll('left')}
            >
              &#10094;
            </button>
            <button
              type="button"
              className="carousel-next"
              aria-label="Sonraki"
              disabled={!canScrollRight}
              onClick={() => scroll('right')}
            >
              ❯
            </button>
          </div>
        </div>

        <div
          className="video-carousel-track"
          id="videoTrack"
          ref={trackRef}
          onScroll={checkScroll}
        >
          {videos.map((item) => (
            <article className="video-carousel-card" key={item.id}>
              <Link href={`/haber/${item.slug}`} className="vcc-link">
                <div className="vcc-thumb">
                  <img src={item.thumbnail} alt={item.title} loading="lazy" />
                  <div className="play-btn-overlay">
                    <span>▶</span>
                  </div>
                  <span className="vcc-duration">{item.duration}</span>
                </div>
                <h3 className="vcc-title">{item.title}</h3>
                <span className="vcc-cat">{item.category}</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
