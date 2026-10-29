// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import Link from 'next/link';

interface ArticleSidebarProps {
  className?: string;
}

export default function ArticleSidebar({ className = 'article-sidebar' }: ArticleSidebarProps) {
  const latestNews = [
    { time: '14:45', title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret", slug: 'pervin-buldan-baris-anneleri-ziyaret' },
    { time: '14:12', title: "Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım", slug: 'munzur-vadisi-hes-projelerine-karsi-adim' },
    { time: '13:38', title: 'Enflasyon verileri sonrası piyasalarda son durum ne?', slug: 'enflasyon-verileri-piyasalar' },
    { time: '13:05', title: 'Kaz Dağları\'nda su kaynakları tehdit altında: Rapor açıklandı', slug: 'kaz-daglari-su-kaynaklari' },
    { time: '12:30', title: 'Uluslararası Belgesel Film Festivali kapılarını açıyor', slug: 'uluslararasi-belgesel-film-festivali' },
    { time: '11:58', title: 'Kürt edebiyatında son dönem çeviri eserlerin yükselişi', slug: 'kurt-edebiyati' },
    { time: '11:22', title: 'Yerel yönetimlerden ortak kalkınma hamlesi ve yeni projeler', slug: 'yerel-yonetimlerden-ortak-kalkinma-hamlesi' },
  ];

  const editorPicks = [
    {
      cat: 'Politika',
      catSlug: 'politika',
      title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret",
      thumb: '/assets/photos/haber-foto8.jpg',
      slug: 'pervin-buldan-baris-anneleri-ziyaret',
    },
    {
      cat: 'Gündem',
      catSlug: 'gundem',
      title: "İHD'den hak ihlalleri raporu: Adalet çağrısı yinelendi",
      thumb: '/assets/photos/haber-foto6.webp',
      slug: 'ihd-hak-ihlalleri-raporu',
    },
    {
      cat: 'Ekoloji',
      catSlug: 'ekoloji',
      title: "Kaz Dağları'nda su kaynakları tehdit altında",
      thumb: '/assets/photos/haber-foto9.jpg',
      slug: 'kaz-daglari-su-kaynaklari',
    },
    {
      cat: 'Kültür-Sanat',
      catSlug: 'kultur-sanat',
      title: 'Bağımsız tiyatrolar yeni sezon hazırlığında',
      thumb: '/assets/photos/haber-foto5.jpg',
      slug: 'bagimsiz-tiyatrolar-yeni-sezon',
    },
  ];

  return (
    <aside className={className}>
      <div className="sidebar-widget">
        <h3 className="widget-title">Son Haberler</h3>
        <ul className="latest-list">
          {latestNews.map((item, idx) => (
            <li className="latest-item" key={idx}>
              <Link href={`/haber/${item.slug}`}>
                <span className="latest-time">{item.time}</span>
                <span className="latest-heading">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-widget">
        <h3 className="widget-title">Editörün Seçtikleri</h3>
        <ul className="editor-picks-list">
          {editorPicks.map((item, idx) => (
            <li className="editor-picks-item" data-cat={item.catSlug} key={idx}>
              <Link href={`/haber/${item.slug}`}>
                <div className="editor-picks-thumb">
                  <img src={item.thumb} alt={item.title} />
                </div>
                <div className="editor-picks-body">
                  <span className="editor-picks-cat">{item.cat}</span>
                  <h4 className="editor-picks-title">{item.title}</h4>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/kategori/editorun-sectikleri" className="widget-all-link">
          Tümü →
        </Link>
      </div>
    </aside>
  );
}
