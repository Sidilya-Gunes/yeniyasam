'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VideoMedia } from '@/types/strapi';

interface VideoPlayerViewProps {
  initialVideo: VideoMedia;
  allVideos: VideoMedia[];
}

function extractYouTubeId(url?: string, fallbackId = 'kJQP7kiw5Fk'): string {
  if (!url) return fallbackId;
  if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : fallbackId;
}

export default function VideoPlayerView({ initialVideo, allVideos }: VideoPlayerViewProps) {
  const [activeVideo, setActiveVideo] = useState<VideoMedia>(initialVideo);
  const [copied, setCopied] = useState(false);

  const youtubeId = extractYouTubeId(activeVideo.videoUrl || activeVideo.youtubeId);

  const handleSelectVideo = (video: VideoMedia) => {
    setActiveVideo(video);
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `/video/${video.slug}`);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = (platform: 'x' | 'facebook' | 'whatsapp' | 'telegram') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(activeVideo.title);
    let shareLink = '';

    if (platform === 'x') {
      shareLink = `https://x.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'facebook') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'whatsapp') {
      shareLink = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    } else if (platform === 'telegram') {
      shareLink = `https://t.me/share/url?url=${url}&text=${text}`;
    }

    if (shareLink) {
      window.open(shareLink, '_blank', 'noopener,noreferrer');
    }
  };

  const formattedDate = activeVideo.publishedAt
    ? new Date(activeVideo.publishedAt).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '27 Ekim 2026';

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      {/* Breadcrumb & Sayfa Başlığı */}
      <header className="archive-header" style={{ marginBottom: '1.5rem' }}>
        <nav className="archive-breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '0.5rem' }}>
          <Link href="/">Ana Sayfa</Link>
          <span className="archive-sep">›</span>
          <Link href="/video">Video Haber</Link>
          <span className="archive-sep">›</span>
          <span className="archive-current">{activeVideo.category || 'Medya'}</span>
        </nav>
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 900,
            color: 'var(--heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            margin: 0,
          }}
        >
          VİDEO HABER
        </h1>
      </header>

      {/* Ana Video Player ve Oynatma Listesi Konteyneri (Görsel 2) */}
      <section
        style={{
          backgroundColor: '#0f1117',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            minHeight: '480px',
          }}
          className="video-player-grid"
        >
          {/* Sol Kolon: YouTube Video Oynatıcı */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              backgroundColor: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9
              }}
            >
              <iframe
                key={youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </div>

          {/* Sağ Kolon: Oynatma Listesi (Görsel 2'deki gibi) */}
          <div
            style={{
              backgroundColor: '#161922',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              maxHeight: '580px',
            }}
          >
            {/* Kırmızı Başlık Alanı (Şu an gösterilen) */}
            <div
              style={{
                backgroundColor: 'var(--primary, #cc0000)',
                color: '#fff',
                padding: '1.1rem 1.25rem',
                position: 'relative',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              <div style={{ position: 'relative', zIndex: 2 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    opacity: 0.9,
                    fontWeight: 600,
                    marginBottom: '0.25rem',
                  }}
                >
                  Şu an gösterilen:
                </span>
                <h2
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    lineHeight: 1.35,
                    margin: 0,
                    color: '#fff',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {activeVideo.title}
                </h2>
              </div>
              {/* Filigran Play İkonu */}
              <div
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '4.5rem',
                  color: 'rgba(255, 255, 255, 0.18)',
                  pointerEvents: 'none',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                ▶
              </div>
            </div>

            {/* Video Listesi */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '0.5rem 0',
              }}
              className="video-playlist-scroll"
            >
              {allVideos.map((video) => {
                const isActive = video.slug === activeVideo.slug;
                const thumb = typeof video.thumbnail === 'string' ? video.thumbnail : '/assets/photos/haber-foto1.jpg';

                return (
                  <button
                    key={video.id || video.slug}
                    type="button"
                    onClick={() => handleSelectVideo(video)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      textAlign: 'left',
                      backgroundColor: isActive ? 'rgba(204, 0, 0, 0.18)' : 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '4px solid var(--primary, #cc0000)' : '4px solid transparent',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Küçük Görsel */}
                    <div
                      style={{
                        position: 'relative',
                        width: '84px',
                        height: '52px',
                        flexShrink: 0,
                        borderRadius: '4px',
                        overflow: 'hidden',
                        backgroundColor: '#000',
                      }}
                    >
                      <img
                        src={thumb}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                          opacity: isActive ? 0.9 : 0.75,
                        }}
                      />
                      {isActive ? (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(204, 0, 0, 0.45)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '0.85rem',
                          }}
                        >
                          ▶
                        </div>
                      ) : (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '3px',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 3px',
                            borderRadius: '2px',
                          }}
                        >
                          {video.duration || '05:00'}
                        </span>
                      )}
                    </div>

                    {/* Başlık ve Kategori */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          color: isActive ? '#fff' : '#d1d5db',
                          fontSize: '0.82rem',
                          fontWeight: isActive ? 700 : 500,
                          lineHeight: 1.35,
                          margin: '0 0 4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {video.title}
                      </h4>
                      <span
                        style={{
                          color: isActive ? 'var(--primary, #cc0000)' : '#9ca3af',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {video.category || 'Medya'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Aktif Video Detay ve Paylaşım Alanı */}
      <section
        style={{
          backgroundColor: 'var(--surface)',
          padding: '2rem',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          marginBottom: '3rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
          <span
            style={{
              backgroundColor: 'var(--primary, #cc0000)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '3px',
              textTransform: 'uppercase',
            }}
          >
            {activeVideo.category || 'Video'}
          </span>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>·</span>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>{formattedDate}</span>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>·</span>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.85rem' }}>Süre: {activeVideo.duration || '10:00'}</span>
        </div>

        <h2
          style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            color: 'var(--heading)',
            lineHeight: 1.3,
            marginBottom: '1rem',
          }}
        >
          {activeVideo.title}
        </h2>

        <p
          style={{
            color: 'var(--text)',
            fontSize: '1.05rem',
            lineHeight: 1.65,
            marginBottom: '1.5rem',
          }}
        >
          {activeVideo.description ||
            activeVideo.summary ||
            `${activeVideo.title} gelişmeleri, röportajlar ve analizlerle Yeni Yaşam Medya kanalında.`}
        </p>

        {/* Paylaşım Butonları */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flexWrap: 'wrap',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--heading)', marginRight: '0.5rem' }}>
            Videoyu Paylaş:
          </span>

          <button
            type="button"
            onClick={() => handleShare('x')}
            className="share-btn share-x"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#000',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            X'te Paylaş
          </button>

          <button
            type="button"
            onClick={() => handleShare('facebook')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#1877f2',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={() => handleShare('whatsapp')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#25d366',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={() => handleShare('telegram')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: '#0088cc',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Telegram
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-soft)',
              color: 'var(--heading)',
              border: '1px solid var(--border)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Kopyalandı' : 'Bağlantıyı Kopyala'}
          </button>
        </div>
      </section>

      {/* Diğer Video Haberler Galerisi */}
      <section style={{ borderTop: '2px solid var(--border)', paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: 'var(--heading)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              margin: 0,
            }}
          >
            TÜM VİDEO HABERLER
          </h3>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-soft)' }}>
            Toplam {allVideos.length} Video
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {allVideos.map((video) => {
            const isCurr = video.slug === activeVideo.slug;
            const thumb = typeof video.thumbnail === 'string' ? video.thumbnail : '/assets/photos/haber-foto1.jpg';

            return (
              <article
                key={video.id || video.slug}
                onClick={() => handleSelectVideo(video)}
                style={{
                  backgroundColor: 'var(--surface)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: isCurr ? '2px solid var(--primary, #cc0000)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                className="video-archive-card"
              >
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', backgroundColor: '#000' }}>
                  <img
                    src={thumb}
                    alt={video.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: 'var(--primary, #cc0000)',
                        color: '#fff',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      ▶
                    </span>
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '6px',
                      right: '6px',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: '#fff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '3px',
                    }}
                  >
                    {video.duration || '08:00'}
                  </span>
                </div>

                <div style={{ padding: '1rem' }}>
                  <span
                    style={{
                      color: 'var(--primary, #cc0000)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {video.category || 'Medya'}
                  </span>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: 'var(--heading)',
                      lineHeight: 1.4,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {video.title}
                  </h4>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Responsive Stiller */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .video-player-grid {
            grid-template-columns: 1fr !important;
          }
          .video-playlist-scroll {
            max-height: 320px !important;
          }
        }
        .video-archive-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </main>
  );
}
