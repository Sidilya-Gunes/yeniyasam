// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/strapi';

export const metadata: Metadata = {
  title: 'Kategoriler — Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi tüm haber kategorileri.',
};

export default async function KategoriListPage() {
  const categories = await getCategories();

  return (
    <main className="site-main container" style={{ padding: '2rem 1rem' }}>
      <div className="section-title-bar" style={{ marginBottom: '2rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          KATEGORİLER
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/kategori/${cat.slug}`}
            style={{
              padding: '1.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--surface)',
              display: 'block',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--heading)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
