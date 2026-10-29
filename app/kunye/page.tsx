// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Künye | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi yönetim, yayın ve editöryal kadrosu künyesi.',
};

export default function KunyePage() {
  const staff = [
    { title: 'İmtiyaz Sahibi / Yayın Sahibi', name: 'Arinna Basın Yayın ve Reklam Sanayi Ticaret Ltd. Şti.' },
    { title: 'Sorumlu Haber Müdürü', name: 'Ahmet Güneş' },
    { title: 'Genel Yayın Yönetmeni', name: 'Mehmet Ferhat Çelik' },
    { title: 'Haber Koordinatörü', name: 'Derya Okatan' },
    { title: 'Politika Editörü', name: 'Ali Barış Kurt' },
    { title: 'Kadın Sayfası Editörü', name: 'Zeynep Durgut' },
    { title: 'Ekoloji & Yaşam Editörü', name: 'Gülcan Dereli' },
    { title: 'Kültür Sanat Editörü', name: 'Ramazan Kaya' },
    { title: 'Görsel Yönetmen / Tasarım', name: 'Kemal Akın' },
    { title: 'İnternet Editörü & Web Sorumlusu', name: 'Dijital Yayın Masası' },
    { title: 'Hukuk Danışmanı', name: 'Av. Özcan Kılıç' },
  ];

  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>Künye</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            Künye
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1rem' }}>
            Yeni Yaşam Gazetesi Yayın Kurulu ve Yönetim Bilgileri
          </p>
        </header>

        <div style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, #e5e7eb)',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          {staff.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.1rem 1.5rem',
                borderBottom: idx < staff.length - 1 ? '1px solid var(--border-color, #e5e7eb)' : 'none',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)'
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
              <span style={{ color: 'var(--text-secondary, #4b5563)' }}>{item.name}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, #e5e7eb)',
          borderRadius: '8px',
          padding: '1.5rem',
          lineHeight: '1.7',
          color: 'var(--text-secondary)'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Yönetim & İletişim Bilgileri
          </h3>
          <p style={{ margin: '0.25rem 0' }}><strong>Adres:</strong> Kocatepe Mah. Receppaşa Cad. ATA-KAR İş Merkezi No:5/5 Beyoğlu / İstanbul</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Telefon:</strong> +90 530 153 64 49</p>
          <p style={{ margin: '0.25rem 0' }}><strong>E-Posta:</strong> yeniyasamgazetesi@gmail.com</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Basım Yeri:</strong> İhlas Gazetecilik A.Ş.</p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', opacity: 0.75 }}>
            * Yeni Yaşam Gazetesi, Basın Ahlak Yasası ilkelerine uymayı taahhüt eder. Sitedeki köşe yazılarından yazarları sorumludur.
          </p>
        </div>
      </div>
    </main>
  );
}
