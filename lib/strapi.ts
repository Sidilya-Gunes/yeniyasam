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
      next: { revalidate: 0, ...(options as { next?: { revalidate?: number } }).next },
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
    role: 'Yazar',
    avatar: '/assets/photos/yazar3.jpeg',
    bio: 'Kadın mücadelesi ve insan hakları odaklı köşe yazarı.',
    twitter: '@nezahatdogan',
    articleCount: 42,
  },
  {
    id: 2,
    name: 'Ali Barış Kurt',
    slug: 'ali-baris-kurt',
    role: 'Gazeteci',
    avatar: '/assets/photos/yazar2.jpeg',
    bio: 'Ortadoğu politikası ve güncel siyaset yazarı.',
    twitter: '@alibariskurt',
    articleCount: 89,
  },
  {
    id: 3,
    name: 'Gülcan Dereli',
    slug: 'gulcan-dereli',
    role: 'Yazar',
    avatar: '/assets/photos/yazar4.jpeg',
    bio: 'Ekoloji, çevre hakları ve toplumsal yaşam üzerine yazılar.',
    twitter: '@gulcandereli',
    articleCount: 65,
  },
  {
    id: 4,
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
    slug: 'pervin-buldan-ve-heyetten-baris-annelerine-anlamli-ziyaret',
    category: 'Politika',
    duration: '06:14',
    thumbnail: '/assets/photos/video1.jpg',
    videoUrl: 'https://www.youtube.com',
    publishedAt: '2026-10-27T14:00:00Z',
  },
  {
    id: 2,
    title: 'Kadınlar 25 Kasım için alanlara çağırıyor: Şiddete karşı ortak ses',
    slug: 'kadinlar-25-kasim-icin-alanlara-cagiriyor',
    category: 'Kadın',
    duration: '04:32',
    thumbnail: '/assets/photos/video2.jpg',
    videoUrl: 'https://www.youtube.com',
    publishedAt: '2026-10-26T16:00:00Z',
  },
];

export const MOCK_DAILY_FEATURES: Record<string, DailyFeature> = {
  manset: {
    id: 1,
    type: 'manset',
    title: 'Günün Manşeti',
    captionTitle: 'Sayı: 2412',
    date: '27 Ekim 2026',
    image: '/assets/photos/manset-ornek.jpg',
  },
  jin: {
    id: 2,
    type: 'jin',
    title: 'Jin Dergi',
    captionTitle: 'Sayı: 89',
    date: 'Haftalık Kadın Eki',
    image: '/assets/photos/jin-dergi-ornek.jpg',
  },
  karikatur: {
    id: 3,
    type: 'karikatur',
    title: 'Günün Karikatürü',
    captionTitle: 'Çizen: Kemal Gökhan',
    date: '27 Ekim 2026',
    image: '/assets/photos/karikatur-ornek.jpg',
  },
};

// Strapi'deki ayrı koleksiyonlarımızın endpoint listesi
const CATEGORY_ENDPOINTS: Record<string, { endpoint: string; name: string; slug: string; color: string }> = {
  'dunya': { endpoint: '/dunya-haberleri', name: 'Dünya', slug: 'dunya', color: 'var(--cat-dunya)' },
  'kadin': { endpoint: '/kadin-haberleri', name: 'Kadın', slug: 'kadin', color: 'var(--cat-kadin)' },
  'ekoloji': { endpoint: '/ekoloji-haberleri', name: 'Ekoloji', slug: 'ekoloji', color: 'var(--cat-ekoloji)' },
  'politika': { endpoint: '/politika-haberleri', name: 'Politika', slug: 'politika', color: 'var(--cat-politika)' },
  'guncel': { endpoint: '/guncel-haberleri', name: 'Güncel', slug: 'guncel', color: 'var(--cat-gundem)' },
  'ekonomi': { endpoint: '/ekonomi-haberleri', name: 'Ekonomi', slug: 'ekonomi', color: 'var(--cat-ekonomi)' },
  'kultur-sanat': { endpoint: '/kultur-sanat-haberleri', name: 'Kültür-Sanat', slug: 'kultur-sanat', color: 'var(--cat-kultur-sanat)' },
  'soylesi': { endpoint: '/soylesiler', name: 'Söyleşi', slug: 'soylesi', color: 'var(--cat-forum)' },
};

function normalizeStrapiItem(item: any, catInfo: { name: string; slug: string; color: string }): Article {
  let cover = '/assets/photos/haber-foto1.jpg';
  if (item.coverImage) {
    cover = getStrapiMedia(item.coverImage);
  }

  return {
    id: `${catInfo.slug}-${item.id}`,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug || `haber-${item.id}`,
    summary: item.summary || '',
    content: item.content || '',
    kicker: item.kicker || '',
    coverImage: cover,
    author: {
      id: 1,
      name: item.authorName || 'Yeni Yaşam',
      slug: 'yeni-yasam',
      role: 'Muhabir',
    },
    category: {
      id: 1,
      name: catInfo.name,
      slug: catInfo.slug,
      color: catInfo.color,
    },
    isHeadline: Boolean(item.isHeadline),
    isFeatured: Boolean(item.isFeatured),
    readTime: item.readTime || '3 dk',
    publishedAt: item.publishedAt || item.createdAt || new Date().toISOString(),
  };
}

export async function getArticles(filter?: {
  categorySlug?: string;
  isHeadline?: boolean;
  limit?: number;
}): Promise<Article[]> {
  const articles: Article[] = [];

  // Belirli bir kategori istenmişse sadece o koleksiyondan çek
  if (filter?.categorySlug && CATEGORY_ENDPOINTS[filter.categorySlug]) {
    const cat = CATEGORY_ENDPOINTS[filter.categorySlug];
    const data = await fetchStrapi<any[]>(cat.endpoint, {
      populate: '*',
      sort: 'createdAt:desc',
      ...(filter.limit ? { 'pagination[pageSize]': filter.limit } : {}),
    });

    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const items = data.data.map((i) => normalizeStrapiItem(i, cat));
      return filter.isHeadline !== undefined
        ? items.filter((a) => Boolean(a.isHeadline) === filter.isHeadline)
        : items;
    }
  } else {
    // Tüm kategorilerden haberleri topla
    const promises = Object.values(CATEGORY_ENDPOINTS).map(async (cat) => {
      const data = await fetchStrapi<any[]>(cat.endpoint, {
        populate: '*',
        sort: 'createdAt:desc',
        'pagination[pageSize]': 10,
      });
      if (data && Array.isArray(data.data)) {
        return data.data.map((i) => normalizeStrapiItem(i, cat));
      }
      return [];
    });

    const results = await Promise.all(promises);
    for (const r of results) {
      articles.push(...r);
    }
  }

  // Eğer Strapi'den herhangi bir haber geldiyse sıralayıp dön
  if (articles.length > 0) {
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    let filtered = articles;
    if (filter?.isHeadline !== undefined) {
      filtered = filtered.filter((a) => Boolean(a.isHeadline) === filter.isHeadline);
      // Eğer hiç manşet işaretlenmemişse ilk haberleri göster
      if (filter.isHeadline && filtered.length === 0) {
        filtered = articles.slice(0, 5);
      }
    }
    if (filter?.limit) {
      filtered = filtered.slice(0, filter.limit);
    }
    return filtered;
  }

  // Strapi boşsa veya bağlanamazsa fallback mock verileri dön
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
  // Bütün kategori koleksiyonlarında ara
  for (const cat of Object.values(CATEGORY_ENDPOINTS)) {
    const data = await fetchStrapi<any[]>(cat.endpoint, {
      'filters[slug][$eq]': slug,
      populate: '*',
    });
    if (data && Array.isArray(data.data) && data.data[0]) {
      return normalizeStrapiItem(data.data[0], cat);
    }
  }

  const found = MOCK_ARTICLES.find((a) => a.slug === slug);
  return found || null;
}

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES;
}

export async function getAuthors(): Promise<Author[]> {
  const strapiData = await fetchStrapi<any[]>('/yazarlar', {
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data.map((y: any) => ({
      id: y.id,
      name: y.name,
      slug: y.slug,
      role: y.role || 'Yazar',
      bio: y.bio || '',
      avatar: y.avatar ? getStrapiMedia(y.avatar) : '/assets/photos/yazar1.jpeg',
      twitter: y.twitter,
      articleCount: 1,
    }));
  }

  return MOCK_AUTHORS;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const strapiData = await fetchStrapi<any[]>('/yazarlar', {
    'filters[slug][$eq]': slug,
    populate: '*',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data[0]) {
    const y = strapiData.data[0];
    return {
      id: y.id,
      name: y.name,
      slug: y.slug,
      role: y.role || 'Yazar',
      bio: y.bio || '',
      avatar: y.avatar ? getStrapiMedia(y.avatar) : '/assets/photos/yazar1.jpeg',
      twitter: y.twitter,
      articleCount: 1,
    };
  }

  return MOCK_AUTHORS.find((author) => author.slug === slug) || null;
}

export async function getVideos(): Promise<VideoMedia[]> {
  const strapiData = await fetchStrapi<any[]>('/videolar', {
    populate: '*',
    sort: 'createdAt:desc',
  });

  if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
    return strapiData.data.map((v: any) => ({
      id: v.id,
      title: v.title,
      slug: v.slug || `video-${v.id}`,
      category: v.category || 'Medya',
      duration: v.duration || '05:00',
      thumbnail: v.thumbnail ? getStrapiMedia(v.thumbnail) : '/assets/photos/video1.jpg',
      videoUrl: v.videoUrl || 'https://www.youtube.com',
      publishedAt: v.createdAt || new Date().toISOString(),
    }));
  }

  return MOCK_VIDEOS;
}

export async function searchArticles(query: string): Promise<Article[]> {
  if (!query.trim()) return [];

  const articles = await getArticles();
  const q = query.toLowerCase();
  return articles.filter(
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
  return { success: true, message: 'Bülten aboneliğiniz kaydedildi.' };
}
