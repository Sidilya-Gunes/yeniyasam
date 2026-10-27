// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('search-open');
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.classList.remove('search-open');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/arama?q=${encodeURIComponent(query.trim())}`);
  };

  const handleHintClick = (hint: string) => {
    onClose();
    router.push(`/arama?q=${encodeURIComponent(hint)}`);
  };

  if (!isOpen) return null;

  return (
    <div
      className="search-overlay active"
      id="searchOverlay"
      aria-hidden={!isOpen}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        className="search-close-btn"
        id="searchCloseBtn"
        aria-label="Aramayı kapat"
        onClick={onClose}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>

      <form className="search-overlay-form" onSubmit={handleSubmit}>
        <label htmlFor="searchInput" className="search-overlay-label">
          SİTEDE ARA
        </label>
        <div className="search-overlay-input-wrap">
          <input
            ref={inputRef}
            type="text"
            id="searchInput"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Haber, yazar veya konu..."
            autoComplete="off"
          />
          <button type="submit" aria-label="Ara">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>
        <div className="search-overlay-hints">
          <span>Popüler:</span>
          <button type="button" onClick={() => handleHintClick('dünya')}>Dünya</button>
          <button type="button" onClick={() => handleHintClick('kadın')}>Kadın</button>
          <button type="button" onClick={() => handleHintClick('ekoloji')}>Ekoloji</button>
          <button type="button" onClick={() => handleHintClick('ekonomi')}>Ekonomi</button>
        </div>
      </form>
    </div>
  );
}
