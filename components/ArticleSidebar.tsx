// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import Link from 'next/link';
import { getArticles, getStrapiMedia } from '@/lib/strapi';
import type { Article } from '@/types/strapi';

interface ArticleSidebarProps {
  className?: string;
  currentSlug?: string;
}

export default async function ArticleSidebar({
  className = 'article-sidebar',
  currentSlug,
}: ArticleSidebarProps) {
  // 1. Strapi'den en güncel haberleri çek
  const allArticles = await getArticles({ limit: 16 });

  // Mevcut haberi hariç tut
  const availableArticles = currentSlug
    ? allArticles.filter((a) => a.slug !== currentSlug)
    : allArticles;

  // 2. Dinamik Son Haberler (ilk 7 haber)
  const dynamicLatest = availableArticles.slice(0, 7).map((item) => {
    const d = new Date(item.publishedAt);
    const time = !isNaN(d.getTime())
      ? d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      : '12:00';
    return {
      id: item.id,
      time,
      title: item.title,
      slug: item.slug,
    };
  });

  // 3. Dinamik Editörün Seçtikleri (Öne çıkan / farklı kategorilerden 4 haber)
  let editorCandidates = availableArticles.filter((a) => a.isFeatured || a.isHeadline);
  if (editorCandidates.length < 4) {
    // Farklı kategorilerden haberlerle 4'e tamamla
    const seenCats = new Set<string>();
    for (const art of availableArticles) {
      const catSlug = art.category?.slug || '';
      if (!seenCats.has(catSlug) && !editorCandidates.some((e) => e.slug === art.slug)) {
        seenCats.add(catSlug);
        editorCandidates.push(art);
      }
      if (editorCandidates.length >= 4) break;
    }
  }
  if (editorCandidates.length < 4) {
    const remainder = availableArticles.filter((a) => !editorCandidates.some((e) => e.slug === a.slug));
    editorCandidates = [...editorCandidates, ...remainder];
  }

  const dynamicEditor = editorCandidates.slice(0, 4).map((item) => ({
    id: item.id,
    cat: item.category?.name || 'Güncel',
    catSlug: item.category?.slug || 'guncel',
    title: item.title,
    thumb: getStrapiMedia(item.coverImage, item.id),
    slug: item.slug,
  }));

  // Fallback şablon verisi
  const fallbackLatest = [
    { id: 'fl1', time: '14:45', title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret", slug: 'pervin-buldan-baris-anneleri-ziyaret' },
    { id: 'fl2', time: '14:12', title: "Munzur Vadisi'nde HES projelerine karşı yeni hukuki adım", slug: 'munzur-vadisi-hes-projelerine-karsi-adim' },
    { id: 'fl3', time: '13:38', title: 'Enflasyon verileri sonrası piyasalarda son durum ne?', slug: 'enflasyon-verileri-piyasalar' },
    { id: 'fl4', time: '13:05', title: "Kaz Dağları'nda su kaynakları tehdit altında: Rapor açıklandı", slug: 'kaz-daglari-su-kaynaklari' },
    { id: 'fl5', time: '12:30', title: 'Uluslararası Belgesel Film Festivali kapılarını açıyor', slug: 'uluslararasi-belgesel-film-festivali' },
    { id: 'fl6', time: '11:58', title: 'Kürt edebiyatında son dönem çeviri eserlerin yükselişi', slug: 'kurt-edebiyati' },
    { id: 'fl7', time: '11:22', title: 'Yerel yönetimlerden ortak kalkınma hamlesi ve yeni projeler', slug: 'yerel-yonetimlerden-ortak-kalkinma-hamlesi' },
  ];

  const fallbackEditor = [
    {
      id: 'fe1',
      cat: 'Politika',
      catSlug: 'politika',
      title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret",
      thumb: '/assets/photos/haber-foto8.jpg',
      slug: 'pervin-buldan-baris-anneleri-ziyaret',
    },
    {
      id: 'fe2',
      cat: 'Gündem',
      catSlug: 'gundem',
      title: "İHD'den hak ihlalleri raporu: Adalet çağrısı yinelendi",
      thumb: '/assets/photos/haber-foto6.webp',
      slug: 'ihd-hak-ihlalleri-raporu',
    },
    {
      id: 'fe3',
      cat: 'Ekoloji',
      catSlug: 'ekoloji',
      title: "Kaz Dağları'nda su kaynakları tehdit altında",
      thumb: '/assets/photos/haber-foto9.jpg',
      slug: 'kaz-daglari-su-kaynaklari',
    },
    {
      id: 'fe4',
      cat: 'Kültür-Sanat',
      catSlug: 'kultur-sanat',
      title: 'Bağımsız tiyatrolar yeni sezon hazırlığında',
      thumb: '/assets/photos/haber-foto5.jpg',
      slug: 'bagimsiz-tiyatrolar-yeni-sezon',
    },
  ];

  const displayLatest = dynamicLatest.length > 0 ? dynamicLatest : fallbackLatest;
  const displayEditor = dynamicEditor.length > 0 ? dynamicEditor : fallbackEditor;

  return (
    <aside className={className}>
      <div className="sidebar-widget">
        <h3 className="widget-title">Son Haberler</h3>
        <ul className="latest-list">
          {displayLatest.map((item, idx) => (
            <li className="latest-item" key={item.id || idx}>
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
          {displayEditor.map((item, idx) => (
            <li className="editor-picks-item" data-cat={item.catSlug} key={item.id || idx}>
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
