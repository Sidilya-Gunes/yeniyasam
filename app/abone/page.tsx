// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import SubscriptionView from '@/components/SubscriptionView';

export const metadata: Metadata = {
  title: "Yeni Yaşam'a Abone Ol — Bağımsız Haberciliğe Güç Kat",
  description: 'Yeni Yaşam Gazetesi yurt içi ve yurt dışı dijital e-abonelik ve dayanışma paketleri.',
};

export default function AbonePage() {
  return (
    <main className="site-main container" style={{ padding: '2.5rem 1rem 4rem' }}>
      <header
        className="archive-header"
        style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 2.5rem' }}
      >
        <span
          style={{
            color: 'var(--primary, #b91c1c)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontSize: '0.85rem',
          }}
        >
          HALKIN HABER ALMA HAKKI İÇİN
        </span>
        <h1
          className="archive-title"
          style={{ fontSize: '2.4rem', fontWeight: 900, margin: '0.5rem 0 1rem', color: 'var(--heading, #0f172a)' }}
        >
          Yeni Yaşam'a Abone Ol
        </h1>
        <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Hakikatin sesi olmak, sansüre karşı halkın haber alma hakkını savunmak için Yeni Yaşam’a abone olun; özgür basına güç katın.
        </p>
      </header>

      <SubscriptionView />
    </main>
  );
}
