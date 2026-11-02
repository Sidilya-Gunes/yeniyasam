
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Article } from '@/types/strapi';
import { getStrapiMedia } from '@/lib/strapi';

interface NewsSliderProps {
  articles: Article[];
}

export default function NewsSlider({ articles }: NewsSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const total = articles.length;

  const showSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
  }, [nextSlide]);

  const resetTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (total > 1) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, startTimer]);

  if (!articles || articles.length === 0) return null;

  return (
    <>
      <div
        className="news-slider-container"
        onMouseEnter={() => {
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        onMouseLeave={startTimer}
        onTouchStart={(e) => {
          touchStartRef.current = {
            x: e.changedTouches[0].screenX,
            y: e.changedTouches[0].screenY,
          };
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].screenX - touchStartRef.current.x;
          const dy = e.changedTouches[0].screenY - touchStartRef.current.y;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) {
              nextSlide();
              resetTimer();
            } else {
              prevSlide();
              resetTimer();
            }
          }
        }}
      >
        <div className="slider-track">
          {articles.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className={`slide-item ${idx === currentIndex ? 'active' : ''}`}
              data-index={idx}
            >
              <Link href={`/haber/${item.slug}`} className="slide-link">
                <div className="slide-figure">
                  <img
                    src={getStrapiMedia(item.coverImage)}
                    alt={item.title}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  {item.videoUrl && (
                    <a
                      href={item.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="slide-video-play-btn"
                      onClick={(e) => e.stopPropagation()}
                      title="YouTube'da İzle"
                      aria-label="Videoyu İzle"
                    >
                      {/* Video Kamera İkonu */}
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 8-6 4 6 4V8Z" fill="currentColor" />
                        <rect width="14" height="12" x="2" y="6" rx="2" fill="currentColor" />
                      </svg>
                    </a>
                  )}
                </div>
                <div className="slide-text">
                  <span
                    className="slide-cat"
                    data-cat={item.category?.slug || 'guncel'}
                  >
                    {item.category?.name || 'Güncel'}
                  </span>
                  <h2 className="slide-title">{item.title}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="slider-btn prev-btn"
          aria-label="Önceki"
          onClick={() => {
            prevSlide();
            resetTimer();
          }}
        >
          &#10094;
        </button>
        <button
          type="button"
          className="slider-btn next-btn"
          aria-label="Sonraki"
          onClick={() => {
            nextSlide();
            resetTimer();
          }}
        >
          ❯
        </button>
      </div>

      <div className="slider-numbers-pagination">
        {articles.map((_, idx) => (
          <button
            type="button"
            key={idx}
            className={`slide-num-btn ${idx === currentIndex ? 'active' : ''}`}
            data-index={idx}
            onClick={() => {
              showSlide(idx);
              resetTimer();
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </>
  );
}
