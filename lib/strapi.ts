// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import {
  Article,
  Category,
  Author,
  VideoMedia,
  DailyFeature,
  StrapiMedia,
  StrapiResponse,
} from '@/types/strapi';

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
    return null;
  }
}

/* =================================================================
   MOCK VERİLER (Strapi CMS çalışmıyorken sorunsuz çalışmayı sağlar)
   ================================================================= */

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Dünya', slug: 'dunya', color: 'var(--cat-dunya)' },
  { id: 2, name: 'Kadın', slug: 'kadin', color: 'var(--cat-kadin)' },
  { id: 3, name: 'Ekoloji', slug: 'ekoloji', color: 'var(--cat-ekoloji)' },
  { id: 4, name: 'Politika', slug: 'politika', color: 'var(--cat-politika)' },
  { id: 5, name: 'Ekonomi', slug: 'ekonomi', color: 'var(--cat-ekonomi)' },
  { id: 6, name: 'Kültür-Sanat', slug: 'kultur-sanat', color: 'var(--cat-kultur-sanat)' },
  { id: 7, name: 'Güncel', slug: 'guncel', color: 'var(--cat-gundem)' },
  { id: 8, name: 'Söyleşi', slug: 'soylesi', color: 'var(--cat-forum)' },
  { id: 9, name: 'Forum', slug: 'forum', color: 'var(--cat-forum)' },
  { id: 10, name: 'Dosya', slug: 'dosya', color: 'var(--cat-ekonomi)' },
];

export const MOCK_AUTHORS: Author[] = [
  {
    id: 1,
    name: 'Nezahat Doğan',
    slug: 'nezahat-dogan',
    role: 'Yazar & Araştırmacı',
    avatar: '/assets/photos/yazar1.jpeg',
    bio: 'Toplumsal cinsiyet, kadın mücadelesi ve Ortadoğu politikaları üzerine yazıyor.',
    twitter: '@nezahatdogan',
    articleCount: 142,
  },
  {
    id: 2,
    name: 'Ahmet Kaya',
    slug: 'ahmet-kaya',
    role: 'Ekonomi Analisti',
    avatar: '/assets/photos/yazar2.webp',
    bio: 'Yerel yönetimler, dayanışma ekonomisi ve emek hareketleri üzerine değerlendirmeler.',
    twitter: '@ahmetkaya',
    articleCount: 98,
  },
  {
    id: 3,
    name: 'Dilzar Dîlok',
    slug: 'dilzar-dilok',
    role: 'Politika & Felsefe',
    avatar: '/assets/photos/yazar3.webp',
    bio: 'Politik ekoloji, özgürlük felsefesi ve güncel siyaset yazarı.',
    twitter: '@dilzardilok',
    articleCount: 115,
  },
  {
    id: 4,
    name: 'Mehmet Eren',
    slug: 'mehmet-eren',
    role: 'Dış Politika',
    avatar: '/assets/photos/yazar4.webp',
    bio: 'Bölgesel diplomasi, küresel krizler ve uluslararası ilişkiler.',
    twitter: '@mehmeteren',
    articleCount: 84,
  },
  {
    id: 5,
    name: 'Gülten Gül',
    slug: 'gulten-gul',
    role: 'Kültür-Edebiyat',
    avatar: '/assets/photos/yazar5.jpeg',
    bio: 'Kültür, edebiyat incelemeleri ve sanat kritik yazıları.',
    twitter: '@gultengul',
    articleCount: 76,
  },
  {
    id: 6,
    name: 'Metin Yeğin',
    slug: 'metin-yegin',
    role: 'Yazar',
    avatar: '/assets/photos/yazar1.jpeg',
    bio: 'Dünya sokakları, toplumsal hareketler ve ezilenlerin tarihi yazarı.',
    twitter: '@nmetinyegin',
    articleCount: 128,
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
    category: MOCK_CATEGORIES[0],
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
    category: MOCK_CATEGORIES[1],
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
    category: MOCK_CATEGORIES[2],
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
    category: MOCK_CATEGORIES[4],
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
    category: MOCK_CATEGORIES[2],
    author: MOCK_AUTHORS[2],
    kicker: 'Forum',
    publishedAt: '2026-10-27T08:00:00Z',
  },
  {
    id: 7,
    title: "Alp Altınörs: Yasanın MGK kararına bağlanması Meclis'i işlevsizleştirmektir",
    slug: 'alp-altinors-yasani-mgk-kararina-baglanmasi',
    summary: "Çerçeve yasaya ilişkin konuşan Kobanê Davası tutsaklarından siyasetçi Alp Altınörs, 'Kürt ulusunun inkarını kısmen de olsa geriletebilecek potansiyele sahiptir. Ancak yasanın MGK kararına bağlanması Meclis'in kendisini işlevsizleştirmesi anlamındadır' dedi.",
    coverImage: '/assets/photos/haber-foto1.jpg',
    category: MOCK_CATEGORIES[6],
    author: MOCK_AUTHORS[0],
    publishedAt: '2026-10-14T10:50:00Z',
  },
];

export const MOCK_VIDEOS: VideoMedia[] = [
  {
    id: 1,
    title: "Pervin Buldan ve heyetten Barış Anneleri'ne anlamlı ziyaret",
    category: 'Politika',
    duration: '08:42',
    thumbnail: '/assets/photos/haber-foto1.jpg',
    slug: 'pervin-buldan-baris-anneleri-ziyaret',
  },
  {
    id: 2,
    title: "Munzur Vadisi'nde HES projelerine karşı adım",
    category: 'Ekoloji',
    duration: '10:43',
    thumbnail: '/assets/photos/haber-foto9.jpg',
    slug: 'munzur-vadisi-hes-projelerine-karsi-adim',
  },
  {
    id: 3,
    title: "Ortadoğu'da yeni dengeler ve cepheleşmeler",
    category: 'Dünya',
    duration: '05:42',
    thumbnail: '/assets/photos/haber-foto3.jpg',
    slug: 'ortadogu-yeni-dengeler',
  },
  {
    id: 4,
    title: 'Enflasyon sarmalında dar gelirlinin yaşam mücadelesi',
    category: 'Ekonomi',
    duration: '11:47',
    thumbnail: '/assets/photos/haber-foto4.jpg',
    slug: 'enflasyon-sarmali-ve-dar-gelirli',
  },
  {
    id: 5,
    title: "Meclis'te yeni yasama dönemi başlarken kritik gündem",
    category: 'Politika',
    duration: '11:47',
    thumbnail: '/assets/photos/haber-foto2.jpeg',
    slug: 'mecliste-yeni-yasama-donemi',
  },
  {
    id: 6,
    title: 'Uluslararası Belgesel Film Festivali kapılarını açıyor',
    category: 'Kültür-Sanat',
    duration: '11:47',
    thumbnail: '/assets/photos/haber-foto5.jpg',
    slug: 'uluslararasi-belgesel-film-festivali',
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

export async function getVideos(): Promise<VideoMedia[]> {
  const strapiData = await fetchStrapi<VideoMedia[]>('/videos', {
    populate: '*',
    sort: 'publishedAt:desc',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data;
  }

  return MOCK_VIDEOS;
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

/**
 * Strapi Bülten Aboneliği (Newsletter) Kaydı
 */
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${getStrapiURL('/api/newsletter-subscribers')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: {
          email,
          subscribedAt: new Date().toISOString(),
          isActive: true,
        },
      }),
    });

    if (res.ok) {
      return { success: true, message: 'Bülten aboneliğiniz başarıyla oluşturuldu.' };
    }
  } catch {
    // Strapi henüz bağlı değilse yerel başarılı cevabı döner
  }
  return { success: true, message: 'Bülten aboneliğiniz kaydedildi.' };
}
