// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { Article, Category, Author, StrapiMedia, StrapiResponse } from '@/types/strapi';
import { SITE } from '@/lib/site';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export function getStrapiURL(path = ''): string {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(media?: string | StrapiMedia | null): string {
  if (!media) return '/assets/photos/haber-foto1.jpg';
  if (typeof media === 'string') {
    if (media.startsWith('http://') || media.startsWith('https://') || media.startsWith('/')) {
      return media;
    }
    return `${STRAPI_URL}${media.startsWith('/') ? '' : '/'}${media}`;
  }
  if (media.url) {
    if (media.url.startsWith('http://') || media.url.startsWith('https://')) {
      return media.url;
    }
    return `${STRAPI_URL}${media.url}`;
  }
  return '/assets/photos/haber-foto1.jpg';
}

/**
 * Strapi REST API çağrısı yapan yardımcı fonksiyon.
 */
export async function fetchStrapi<T>(
  endpoint: string,
  urlParams: Record<string, string | number | boolean> = {},
  options: RequestInit = {}
): Promise<StrapiResponse<T> | null> {
  try {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(urlParams)) {
      searchParams.append(key, String(value));
    }
    const queryString = searchParams.toString();
    const requestUrl = `${getStrapiURL(`/api${endpoint}`)}${queryString ? `?${queryString}` : ''}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(requestUrl, {
      ...options,
      headers,
      next: { revalidate: 60, ...(options as { next?: { revalidate?: number } }).next },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    // Strapi henüz kurulu/çalışır durumda değilse null döner, fallback verisi kullanılır.
    return null;
  }
}

/* =================================================================
   MOCK VERİLER (Strapi bağlantısı henüz aktif değilken kusursuz çalışır)
   ================================================================= */

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Dünya', slug: 'dunya', color: 'var(--cat-dunya)' },
  { id: 2, name: 'Kadın', slug: 'kadin', color: 'var(--cat-kadin)' },
  { id: 3, name: 'Ekoloji', slug: 'ekoloji', color: 'var(--cat-ekoloji)' },
  { id: 4, name: 'Politika', slug: 'politika', color: 'var(--cat-politika)' },
  { id: 5, name: 'Ekonomi', slug: 'ekonomi', color: 'var(--cat-ekonomi)' },
  { id: 6, name: 'Kültür-Sanat', slug: 'kultur-sanat', color: 'var(--cat-kultur-sanat)' },
];

export const MOCK_AUTHORS: Author[] = [
  {
    id: 1,
    name: 'Nezahat Doğan',
    slug: 'nezahat-dogan',
    role: 'Yazar & Araştırmacı',
    avatar: '/assets/photos/yazar1.jpeg',
    bio: 'Toplumsal cinsiyet, kadın mücadelesi ve Ortadoğu politikaları üzerine yazıyor.',
  },
  {
    id: 2,
    name: 'Ahmet Kaya',
    slug: 'ahmet-kaya',
    role: 'Ekonomi Analisti',
    avatar: '/assets/photos/yazar2.webp',
    bio: 'Yerel yönetimler, dayanışma ekonomisi ve emek hareketleri üzerine değerlendirmeler.',
  },
  {
    id: 3,
    name: 'Dilzar Dîlok',
    slug: 'dilzar-dilok',
    role: 'Politika & Felsefe',
    avatar: '/assets/photos/yazar3.webp',
    bio: 'Politik ekoloji, özgürlük felsefesi ve güncel siyaset yazarı.',
  },
  {
    id: 4,
    name: 'Mehmet Eren',
    slug: 'mehmet-eren',
    role: 'Dış Politika',
    avatar: '/assets/photos/yazar4.webp',
    bio: 'Bölgesel diplomasi, küresel krizler ve uluslararası ilişkiler.',
  },
  {
    id: 5,
    name: 'Gülten Gül',
    slug: 'gulten-gul',
    role: 'Kültür-Edebiyat',
    avatar: '/assets/photos/yazar5.jpeg',
    bio: 'Kültür, edebiyat incelemeleri ve sanat kritik yazıları.',
  },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Kritik zirve: Bölgesel gelişmeler ve diplomatik temaslar masaya yatırıldı',
    slug: 'kritik-zirve-bolgesel-gelismeler-masaya-yatirildi',
    summary: 'Bölgesel aktörlerin katılımıyla gerçekleştirilen görüşmelerde güvenlik, ateşkes ve barış müzakereleri değerlendirildi.',
    content: `Bölgesel gelişmelerin hız kazandığı bu dönemde, diplomatik temaslar yeni bir boyuta evriliyor. Masadaki temel gündem maddeleri arasında sürdürülebilir barış, sınır güvenliği ve yerel toplulukların hakları yer alıyor.

Görüşmelere katılan heyetler, karşılıklı güven artırıcı adımların derhal atılması gerektiğinin altını çizdi. Önümüzdeki günlerde sürecin yeni toplantılarla devam etmesi bekleniyor.`,
    coverImage: '/assets/photos/haber-foto1.jpg',
    category: MOCK_CATEGORIES[0], // Dünya
    author: MOCK_AUTHORS[3],
    publishedAt: '2026-10-27T10:00:00Z',
    isHeadline: true,
  },
  {
    id: 2,
    title: 'İntihar girişiminde bulunan Halime Çiçek yaşamını yitirdi',
    slug: 'intihar-girisiminde-bulunan-halime-cicek-yasamini-yitirdi',
    summary: 'Hastanede tedavi altına alınan Halime Çiçek tüm müdahalelere rağmen kurtarılamadı. Kadın örgütleri adalet çağrısında bulundu.',
    content: `Yaşanan şüpheli olayın ardından hastaneye kaldırılan Çiçek, yoğun bakım ünitesinde verdiği yaşam mücadelesini kaybetti. Kadın hakları savunucuları olayın derinlemesine araştırılmasını talep ediyor.`,
    coverImage: '/assets/photos/haber-foto2.jpeg',
    category: MOCK_CATEGORIES[1], // Kadın
    author: MOCK_AUTHORS[0],
    publishedAt: '2026-10-27T11:30:00Z',
    isHeadline: true,
  },
  {
    id: 3,
    title: 'Ekolojik yıkım ve kuraklık tehdidi: Nehirler can çekişiyor',
    slug: 'ekolojik-yikim-ve-kuraklik-tehdidi-nehirler-can-cekisiyor',
    summary: 'Bölgede sürdürülen endüstriyel tarım ve HES projeleri nedeniyle su kaynakları tükenme noktasına geldi.',
    content: `Uzmanlar, su havzalarındaki kuraklığın geri döndürülemez noktalara yaklaştığı uyarısında bulunuyor. Ekoloji meclisleri acil eylem planı çağrısı yaptı.`,
    coverImage: '/assets/photos/haber-foto3.jpg',
    category: MOCK_CATEGORIES[2], // Ekoloji
    author: MOCK_AUTHORS[2],
    publishedAt: '2026-10-27T12:00:00Z',
    isHeadline: true,
  },
  {
    id: 4,
    title: 'Bizleri birleştiren noktalara dikkat kesilmeliyiz',
    slug: 'bizleri-birlestiren-noktalara-dikkat-kesilmeliyiz',
    summary: 'Toplumsal kutuplaşmaya karşı ortak mücadele zeminlerinin güçlendirilmesi gerektiğini vurgulayan söyleşi.',
    content: `Farklılıkların zenginlik olduğunu hatırlatan söyleşide, halkların kardeşliği ve bir arada yaşam iradesi öne çıkarıldı.`,
    coverImage: '/assets/photos/haber-foto12.jpeg',
    category: MOCK_CATEGORIES[1],
    author: MOCK_AUTHORS[0],
    kicker: 'Söyleşi',
    publishedAt: '2026-10-27T09:00:00Z',
  },
  {
    id: 5,
    title: 'Yerel Yönetimlerde Katılımcı Demokrasi Deneyimleri',
    slug: 'yerel-yonetimlerde-katilimci-demokrasi-deneyimleri',
    summary: 'Halk meclisleri ve bütçe süreçlerinde doğrudan yurttaş katılımının önemi masaya yatırıldı.',
    content: `Belediyecilik anlayışının merkezine halkı alan pratikler, kamu kaynaklarının adil dağıtımını sağlıyor.`,
    coverImage: '/assets/photos/haber-foto1.jpg',
    category: MOCK_CATEGORIES[4], // Ekonomi
    author: MOCK_AUTHORS[1],
    kicker: 'Dosya',
    publishedAt: '2026-10-27T08:30:00Z',
  },
  {
    id: 6,
    title: 'Politik alan kolektif yaratım alanıdır',
    slug: 'politik-alan-kolektif-yaratim-alanidir',
    summary: 'Özgürlükçü siyaset ve birey-toplum ilişkisi üzerine kapsamlı bir felsefi analiz.',
    content: `Toplumun kendi kaderini tayin etmesi ancak kolektif siyaset yapma kanallarının açık tutulmasıyla mümkündür.`,
    coverImage: '/assets/photos/haber-foto4.jpg',
    category: MOCK_CATEGORIES[2], // Ekoloji
    author: MOCK_AUTHORS[2],
    kicker: 'Forum',
    publishedAt: '2026-10-27T08:00:00Z',
  },
];

/* =================================================================
   SERVİS METOTLARI (Strapi öncelikli, bağlantı yoksa mock döner)
   ================================================================= */

export async function getArticles(filter?: {
  categorySlug?: string;
  isHeadline?: boolean;
  limit?: number;
}): Promise<Article[]> {
  const strapiData = await fetchStrapi<Article[]>('/articles', {
    populate: '*',
    ...(filter?.categorySlug ? { 'filters[category][slug][$eq]': filter.categorySlug } : {}),
    ...(filter?.isHeadline !== undefined ? { 'filters[isHeadline][$eq]': filter.isHeadline } : {}),
    ...(filter?.limit ? { 'pagination[pageSize]': filter.limit } : {}),
    sort: 'publishedAt:desc',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data;
  }

  // Fallback to mock
  let results = [...MOCK_ARTICLES];
  if (filter?.categorySlug) {
    results = results.filter((a) => a.category?.slug === filter.categorySlug);
  }
  if (filter?.isHeadline !== undefined) {
    results = results.filter((a) => Boolean(a.isHeadline) === filter.isHeadline);
  }
  if (filter?.limit) {
    results = results.slice(0, filter.limit);
  }
  return results;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const strapiData = await fetchStrapi<Article[]>('/articles', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data[0]) {
    return strapiData.data[0];
  }

  const found = MOCK_ARTICLES.find((a) => a.slug === slug);
  return found || null;
}

export async function getCategories(): Promise<Category[]> {
  const strapiData = await fetchStrapi<Category[]>('/categories', {
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data;
  }

  return MOCK_CATEGORIES;
}

export async function getAuthors(): Promise<Author[]> {
  const strapiData = await fetchStrapi<Author[]>('/authors', {
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data;
  }

  return MOCK_AUTHORS;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const strapiData = await fetchStrapi<Author[]>('/authors', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data[0]) {
    return strapiData.data[0];
  }

  return MOCK_AUTHORS.find((author) => author.slug === slug) || null;
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];

  const strapiData = await fetchStrapi<Article[]>('/articles', {
    'filters[$or][0][title][$containsi]': query,
    'filters[$or][1][summary][$containsi]': query,
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data;
  }

  const q = query.toLowerCase();
  return MOCK_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.author?.name.toLowerCase().includes(q)
  );
}
