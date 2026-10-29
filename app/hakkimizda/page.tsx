// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hakkımızda | Yeni Yaşam Gazetesi',
  description: 'Yeni Yaşam Gazetesi yayın ilkeleri, tarihçesi ve bağımsız gazetecilik anlayışı.',
};

export default function HakkimizdaPage() {
  return (
    <main className="archive-layout" style={{ minHeight: '80vh', padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto' }}>
        <nav className="breadcrumb" style={{ marginBottom: '1.5rem', fontSize: '0.875rem', opacity: 0.8 }}>
          <Link href="/">Ana Sayfa</Link>
          <span style={{ margin: '0 0.5rem' }}>/</span>
          <span>Hakkımızda</span>
        </nav>

        <header style={{ marginBottom: '2.5rem', borderBottom: '2px solid var(--accent)', paddingBottom: '1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
            Hakkımızda
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
            Halkın haber alma hakkı ve hakikatin izinde bağımsız gazetecilik.
          </p>
        </header>

        <div style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--border-color, #e5e7eb)',
          borderRadius: '8px',
          padding: '2.5rem',
          lineHeight: 1.85,
          color: 'var(--text-primary)',
          fontSize: '1.05rem'
        }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent)' }}>
            Biz Kimiz?
          </h2>
          <p>
            <strong>Yeni Yaşam Gazetesi</strong>, sansürsüz ve özgür basının evrensel ilkelerini rehber edinerek; toplumun, işçilerin, kadınların, gençlerin, ekoloji savunucularının ve ezilen halkların sesini duyurmayı ilke edinmiş bağımsız bir yayın organıdır.
          </p>
          <p>
            Kurulduğu günden bu yana, gerçekleri perdeleyen ana akım medyanın sınırlarını aşarak; sansürsüz, ilkeli ve doğrudan halkın yararını gözeten haberleri okurlarıyla buluşturmaktadır.
          </p>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '2rem 0 1rem 0', color: 'var(--accent)' }}>
            Yayın İlkelerimiz
          </h2>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li>
              <strong>Hakikat Odaklılık:</strong> Olayları manipüle etmeden, doğrudan tanıkların ve belgelerin ışığında doğru aktarmak.
            </li>
            <li>
              <strong>Toplumsal Barış ve Hak Savunuculuğu:</strong> İnsan hakları, eşitlik, özgürlük ve adaleti temel alarak ayrımcı ve nefret söylemine yer vermemek.
            </li>
            <li>
              <strong>Kadın ve Ekoloji Perspektifi:</strong> Kadın mücadelesini ve doğanın talanına karşı ekolojik direnci yayın politikasının merkezinde tutmak.
            </li>
            <li>
              <strong>Bağımsızlık:</strong> Herhangi bir çıkar veya sermaye grubuna bağlı olmaksızın sadece okurlarının desteğiyle varlığını sürdürmek.
            </li>
          </ul>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '2rem 0 1rem 0', color: 'var(--accent)' }}>
            Jin Dergi ve Haftalık Eklerimiz
          </h2>
          <p>
            Yeni Yaşam Gazetesi, günlük gazetenin yanı sıra her pazar günü okurlarıyla buluşan <strong>Jin Dergi</strong> ile kadın odaklı teorik, politik ve kültürel tartışmaları sayfalarına taşımaktadır.
          </p>
        </div>
      </div>
    </main>
  );
}
