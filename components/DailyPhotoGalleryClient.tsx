'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DailyPhoto } from '@/types/strapi';

interface DailyPhotoGalleryClientProps {
  photos: DailyPhoto[];
}

export default function DailyPhotoGalleryClient({ photos }: DailyPhotoGalleryClientProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [heroPhotoIndex, setHeroPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const safePhotos = photos && photos.length > 0 ? photos : [];
  const latestPhoto = safePhotos[0];
  const archivePhotos = safePhotos.slice(1);

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = '';
  }, []);

  const nextLightboxPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! + 1) % safePhotos.length);
  }, [selectedPhotoIndex, safePhotos.length]);

  const prevLightboxPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! - 1 + safePhotos.length) % safePhotos.length);
  }, [selectedPhotoIndex, safePhotos.length]);

  // Klavye Kontrolleri (Esc, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightboxPhoto();
      if (e.key === 'ArrowLeft') prevLightboxPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, closeLightbox, nextLightboxPhoto, prevLightboxPhoto]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!latestPhoto) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Henüz günün fotoğrafı kaydı bulunmuyor.</p>
        <Link href="/" className="error-btn error-btn--primary">Ana Sayfaya Dön</Link>
      </div>
    );
  }

    const heroPhotos = latestPhoto?.photos && latestPhoto.photos.length > 0
    ? latestPhoto.photos
    : (latestPhoto ? [{ id: 1, url: latestPhoto.image, caption: latestPhoto.title }] : []);
  const currentHeroPhoto = heroPhotos[heroPhotoIndex] || heroPhotos[0];

  const activePhoto = selectedPhotoIndex !== null ? safePhotos[selectedPhotoIndex] : null;

  return (
    <div>
      {/* 1. ÖNE ÇIKAN GÜNÜN FOTOĞRAFI (HERO SHOWCASE) */}
      <section
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          marginBottom: '3rem',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0' }}>
          {/* Büyük Görsel */}
          <div
            style={{
              position: 'relative',
              minHeight: '380px',
              backgroundColor: '#0a0a0a',
              overflow: 'hidden',
              cursor: 'zoom-in',
            }}
            onClick={() => openLightbox(0)}
          >
            <img
              src={currentHeroPhoto.url}
              alt={currentHeroPhoto.caption || latestPhoto.title}
              key={currentHeroPhoto.url}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />

            {/* Büyüt Rozeti */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(6px)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
              Büyük Boyutta İncele
            </div>

            {latestPhoto.location && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                📍 {latestPhoto.location}
              </div>
            )}
          </div>

          {/* Açıklama ve Hikaye */}
          <div
            style={{
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(204, 0, 0, 0.12)',
                    color: 'var(--primary)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  GÜNÜN FOTOĞRAFI
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {latestPhoto.date}
                </span>
              </div>

              <h2
                style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--heading)',
                  lineHeight: 1.3,
                  marginBottom: '1rem',
                  letterSpacing: '-0.3px',
                }}
              >
                {latestPhoto.title}
              </h2>

              <p
                style={{
                  fontSize: '1.02rem',
                  color: 'var(--text)',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                {latestPhoto.summary}
              </p>

              {heroPhotos.length > 1 && (
                <div style={{ marginBottom: '1.5rem', padding: '10px 12px', backgroundColor: 'var(--bg-soft)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bu Konuya Ait Fotoğraflar:</span>
                    <span style={{ color: 'var(--primary)' }}>Kare {heroPhotoIndex + 1} / {heroPhotos.length}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {heroPhotos.map((hp, hIdx) => (
                      <button
                        key={hIdx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setHeroPhotoIndex(hIdx);
                        }}
                        style={{
                          width: '64px',
                          height: '44px',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          border: hIdx === heroPhotoIndex ? '2px solid var(--primary)' : '1px solid var(--border)',
                          padding: 0,
                          cursor: 'pointer',
                          opacity: hIdx === heroPhotoIndex ? 1 : 0.6,
                          flexShrink: 0,
                          transition: 'all 0.2s',
                        }}
                      >
                        <img src={hp.url} alt={hp.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                  {currentHeroPhoto.caption && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontStyle: 'italic', marginTop: '6px' }}>
                      Kare: {currentHeroPhoto.caption}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                Fotoğraf: <strong style={{ color: 'var(--heading)' }}>{latestPhoto.credit}</strong>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openLightbox(0)}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🔍 Detaylı İncele
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  style={{
                    backgroundColor: 'var(--bg-soft)',
                    border: '1px solid var(--border)',
                    color: 'var(--heading)',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Kopyalandı' : 'Paylaş'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GEÇMİŞ GÜNÜN FOTOĞRAFLARI & GÖRSEL ARŞİV (ESKİ GÖRSELLER) */}
      <section style={{ marginBottom: '4rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid var(--border)',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: 'var(--heading)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ width: '4px', height: '18px', backgroundColor: 'var(--primary)', borderRadius: '2px', display: 'inline-block' }} />
              Görsel Arşiv & Geçmiş Fotoğraflar
            </h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Yeni Yaşam Gazetesi arşivinde yer alan tüm görsel tanıklıklar ve kareler ({safePhotos.length} fotoğraf).
            </p>
          </div>
        </div>

        {/* Galeri Grid Kartları */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {safePhotos.map((photo, idx) => (
            <article
              key={photo.id || idx}
              style={{
                backgroundColor: 'var(--surface)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => openLightbox(idx)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Fotoğraf Alanı */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 10',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                }}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* Tarih Rozeti */}
                <span
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    color: '#fff',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  {photo.date}
                </span>

                {idx === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'var(--primary)',
                      color: '#fff',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                    }}
                  >
                    BUGÜN
                  </span>
                )}
              </div>

              {/* Bilgi ve Başlık */}
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  {photo.location && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '4px' }}>
                      📍 {photo.location}
                    </div>
                  )}

                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--heading)',
                      lineHeight: 1.35,
                      marginBottom: '0.5rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {photo.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {photo.summary}
                  </p>
                </div>

                <div
                  style={{
                    marginTop: '1rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: 'var(--text-soft)',
                  }}
                >
                  <span>{photo.credit}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>İncele →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. LIGHTBOX MODAL (TAM EKRAN ETKİLEŞİMLİ GÖRSEL GÖRÜNTÜLEYİCİ) */}
      {selectedPhotoIndex !== null && activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '1rem',
          }}
          onClick={closeLightbox}
        >
          {/* Lightbox Üst Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#fff',
              zIndex: 10,
              padding: '0.5rem 1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                }}
              >
                GÜNÜN FOTOĞRAFI
              </span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                {selectedPhotoIndex + 1} / {safePhotos.length}
              </span>
            </div>

            {/* Kapat Butonu */}
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Kapat"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Lightbox Ana Görsel & Oklar */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Önceki Butonu */}
            <button
              type="button"
              onClick={prevLightboxPhoto}
              aria-label="Önceki"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Görsel */}
            <div
              style={{
                maxWidth: '92vw',
                maxHeight: '68vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '68vh',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
                }}
              />
            </div>

            {/* Sonraki Butonu */}
            <button
              type="button"
              onClick={nextLightboxPhoto}
              aria-label="Sonraki"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Lightbox Alt Bilgi Paneli */}
          <div
            style={{
              backgroundColor: 'rgba(20, 20, 20, 0.95)',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              maxWidth: '960px',
              width: '100%',
              margin: '0 auto',
              color: '#fff',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
                  {activePhoto.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 8px', lineHeight: 1.5 }}>
                  {activePhoto.summary}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.55)', fontStyle: 'italic' }}>
                  Fotoğraf: {activePhoto.credit} · {activePhoto.date} {activePhoto.location ? `· 📍 ${activePhoto.location}` : ''}
                </div>
              </div>

              {/* Küçük Thumbnail Önizlemeleri */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  maxWidth: '300px',
                  paddingBottom: '4px',
                }}
              >
                {safePhotos.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(pIdx)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: pIdx === selectedPhotoIndex ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.2)',
                      padding: 0,
                      cursor: 'pointer',
                      flexShrink: 0,
                      opacity: pIdx === selectedPhotoIndex ? 1 : 0.6,
                    }}
                  >
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
