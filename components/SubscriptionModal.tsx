// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SubscriptionProduct } from '@/lib/subscription-products';

interface SubscriptionModalProps {
  product: SubscriptionProduct | null;
  onClose: () => void;
}

export default function SubscriptionModal({ product, onClose }: SubscriptionModalProps) {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form alanları
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(product?.currency === 'EUR' ? 'Berlin' : 'İstanbul');
  const [country, setCountry] = useState(product?.currency === 'EUR' ? 'Almanya' : 'Türkiye');

  const paymentContainerRef = useRef<HTMLDivElement>(null);

  // ESC tuşuyla kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !surname.trim() || !email.trim()) {
      setError('Lütfen Ad, Soyad ve E-posta alanlarını doldurunuz.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          buyer: {
            name,
            surname,
            email,
            phone: phone || '+905550000000',
            city,
            country,
            address: `${city}, ${country}`,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        if (data.errorCode === 'KEYS_NOT_CONFIGURED') {
          console.warn('İyzico API anahtarları .env.local dosyasında eksik.');
          setError('Ödeme sistemi şu anda güncellenmektedir. Lütfen daha sonra tekrar deneyiniz.');
        } else {
          setError(data.errorMessage || 'Ödeme işlemi başlatılamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyiniz.');
        }
        setLoading(false);
        return;
      }

      // Başarılı: İyzico form içeriğini göster
      setStep('payment');
      setLoading(false);

      // İyzico'nun script ve div içeriğini DOM'a ekle ve script'i çalıştır
      setTimeout(() => {
        if (paymentContainerRef.current && data.checkoutFormContent) {
          paymentContainerRef.current.innerHTML = '';
          const range = document.createRange();
          const fragment = range.createContextualFragment(data.checkoutFormContent);
          paymentContainerRef.current.appendChild(fragment);
        }
      }, 50);
    } catch (err: any) {
      console.error('Ödeme başlatma hatası:', err);
      setError('Sunucu ile bağlantı kurulurken bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--surface, #ffffff)',
          color: 'var(--text-main, #1e293b)',
          borderRadius: '14px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          position: 'relative',
          padding: '2rem',
        }}
      >
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1,
            padding: '4px 8px',
          }}
          title="Kapat"
        >
          ✕
        </button>

        {/* Seçilen Paket Özeti */}
        <div
          style={{
            borderBottom: '1px solid var(--border-color, #e2e8f0)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'var(--primary, #b91c1c)',
            }}
          >
            SEÇİLEN ABONELİK PAKETİ
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.25rem 0 0.5rem' }}>
            {product.name}
          </h2>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary, #b91c1c)' }}>
              {product.currencySymbol}{product.price.toLocaleString('tr-TR')}
            </span>
            <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.95rem' }}>
              / {product.period}
            </span>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: '8px',
              fontSize: '0.9rem',
              marginBottom: '1.25rem',
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {step === 'form' ? (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted, #64748b)', marginBottom: '1.25rem' }}>
              Aboneliğinizi başlatmak ve faturanızı oluşturmak için bilgilerinizi giriniz:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Adınız *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ahmet"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    backgroundColor: 'var(--bg-main, #f8fafc)',
                    color: 'inherit',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Yılmaz"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    backgroundColor: 'var(--bg-main, #f8fafc)',
                    color: 'inherit',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                E-posta Adresiniz (Giriş & Makbuz İçin) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color, #cbd5e1)',
                  backgroundColor: 'var(--bg-main, #f8fafc)',
                  color: 'inherit',
                  fontSize: '0.95rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Telefon (Opsiyonel)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+90 5xx xxx xx xx"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    backgroundColor: 'var(--bg-main, #f8fafc)',
                    color: 'inherit',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                  Şehir
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İstanbul"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    backgroundColor: 'var(--bg-main, #f8fafc)',
                    color: 'inherit',
                    fontSize: '0.95rem',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: 'var(--primary, #b91c1c)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
              }}
            >
              {loading ? 'İyzico Bağlanıyor...' : 'Güvenli Ödemeye İlerle 🔒'}
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginTop: '1.25rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted, #64748b)',
              }}
            >
              <span>🔒 256-Bit SSL Şifreleme</span>
              <span>•</span>
              <span>💳 3D Secure Güvencesi</span>
              <span>•</span>
              <span>⚡ İyzico Ödeme Altyapısı</span>
            </div>
          </form>
        ) : (
          <div>
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.65rem 1rem',
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                borderRadius: '6px',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span>Lütfen kart bilgilerinizi aşağıdaki güvenli İyzico formuna giriniz:</span>
              <button
                type="button"
                onClick={() => setStep('form')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                Bilgileri Değiştir
              </button>
            </div>

            {/* İyzico iFrame / Checkout Form Yerleşimi */}
            <div
              ref={paymentContainerRef}
              id="iyzico-checkout-wrapper"
              style={{ minHeight: '380px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
