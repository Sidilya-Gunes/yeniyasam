// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import { useState } from 'react';

interface ShareMenuProps {
  title: string;
}

export default function ShareMenu({ title }: ShareMenuProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    if (typeof window === 'undefined') return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    let shareUrl = '';
    if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'whatsapp') {
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="article-share-bar" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', margin: '1.5rem 0' }}>
      <button
        type="button"
        onClick={() => handleShare('twitter')}
        className="btn-share"
        style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border)' }}
      >
        𝕏 Paylaş
      </button>
      <button
        type="button"
        onClick={() => handleShare('facebook')}
        className="btn-share"
        style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border)' }}
      >
        Facebook
      </button>
      <button
        type="button"
        onClick={() => handleShare('whatsapp')}
        className="btn-share"
        style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border)' }}
      >
        WhatsApp
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="btn-share copy-link"
        style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid var(--border)' }}
      >
        {copied ? '✓ Bağlantı Kopyalandı' : '🔗 Bağlantıyı Kopyala'}
      </button>
    </div>
  );
}
