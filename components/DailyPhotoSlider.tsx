'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { DailyPhoto } from '@/types/strapi';

interface DailyPhotoSliderProps {
  photos: DailyPhoto[];
}

export default function DailyPhotoSlider({ photos }: DailyPhotoSliderProps) {
  const safePhotos = photos && photos.length > 0 ? photos : [];
  
  // Eğer ilk konunun kendine ait alt fotoğraf galerisi varsa onu kullan,
  // yoksa günün fotoğrafları listesini hikayeler olarak gezdir.
  const hasSubGallery = Boolean(safePhotos[0]?.photos && safePhotos[0].photos.length > 1);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentStory = hasSubGallery
    ? safePhotos[0]
    : (safePhotos[currentImageIndex] || safePhotos[0]);

  const storyPhotos = hasSubGallery
    ? (safePhotos[0]?.photos || [])
    : safePhotos.map((p, idx) => ({ id: p.id || idx, url: p.image, caption: p.summary || p.title }));

  const total = storyPhotos.length;
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const goToNext = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [total]);

  const goToPrev = useCallback(() => {
    if (total <= 1) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [total]);

  const goToSlide = (idx: number) => {
    if (idx === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(idx);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Otomatik geçiş (Auto-play - 5 saniye)
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, total, goToNext]);

  // Dokunmatik kaydırma (Touch Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!currentStory || total === 0) return null;

  const activePhoto = storyPhotos[currentImageIndex];

  return (
    <section
      className="daily-photo-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Günün Fotoğrafı Slider"
    >
      <div className="container">
        {/* Üst Başlık Alanı */}
        <div className="daily-photo-header">
          <h2>
            <Link href="/gunun-fotografi" style={{ color: 'inherit', textDecoration: 'none' }}>
              GÜNÜN FOTOSU <span>❯</span>
            </Link>
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Fotoğraf Sayı Göstergesi */}
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.85)',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '3px 12px',
                borderRadius: '20px',
                letterSpacing: '0.5px',
              }}
            >
              Fotoğraf {currentImageIndex + 1} / {total}
            </span>

            {/* Arşiv Linki */}
            <Link
              href="/gunun-fotografi"
              className="daily-photo-archive-link"
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'opacity 0.2s',
              }}
            >
              Tüm Görsel Arşiv ›
            </Link>
          </div>
        </div>

        {/* Ana Gövde */}
        <div className="daily-photo-grid">
          {/* Sol Kolon: Fotoğraf Slider'ı (Tek konunun farklı fotoğrafları) */}
          <div className="daily-photo-img-wrap" style={{ position: 'relative' }}>
            <Link
              href="/gunun-fotografi"
              style={{ display: 'block', width: '100%', height: '100%' }}
              title="Günün Fotoğrafını ve Arşivi Görüntüle"
            >
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || currentStory.title}
                key={activePhoto.url}
                style={{
                  opacity: isTransitioning ? 0.7 : 1,
                  transition: 'opacity 0.3s ease, transform 0.5s ease',
                }}
              />
            </Link>

            {/* Konum Rozeti */}
            {currentStory.location && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#fff',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              >
                <span>📍</span> {currentStory.location}
              </div>
            )}

            {/* Fotoğraf Özel Alt Başlığı (Kare Açıklaması) */}
            {activePhoto.caption && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%)',
                  padding: '24px 14px 10px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.78rem',
                  fontStyle: 'italic',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              >
                {activePhoto.caption}
              </div>
            )}

            {/* Fotoğraf Üzerindeki Sol / Sağ Ok Butonları */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  aria-label="Önceki Fotoğraf"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    zIndex: 3,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Sonraki Fotoğraf"
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    zIndex: 3,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--primary)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Sağ Kolon: Hikaye ve Açıklama (TEK KONU / SABİT HİKAYE) */}
          <div className="daily-photo-caption">
            <div>
              <span className="caption-tag">FOTOĞRAFIN HİKAYESİ</span>
            </div>

            {/* Sabit Başlık */}
            <h3 className="caption-title">
              <Link href="/gunun-fotografi" style={{ color: 'inherit', textDecoration: 'none' }}>
                {currentStory.title}
              </Link>
            </h3>

            {/* Sabit Hikaye / Açıklama */}
            <p className="caption-desc">{currentStory.summary}</p>

            {/* Sabit Künye & Tarih */}
            <span className="caption-meta">
              Fotoğraf: {currentStory.credit} · {currentStory.date}
            </span>

            {/* Fotoğraf Galerisi Bullet Noktaları */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingTop: '10px',
                marginTop: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Sayfa Noktaları (Fotoğraf Kareleri) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {storyPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Kare ${idx + 1}`}
                    style={{
                      width: idx === currentImageIndex ? '22px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: idx === currentImageIndex ? 'var(--primary)' : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
