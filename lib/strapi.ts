
import {
  Article,
  Category,
  Author,
  VideoMedia,
  DailyFeature,
  GununManseti,
  JinDergi,
  Karikatur,
  StrapiMedia,
  StrapiResponse,
} from '@/types/strapi';
import authorPhotosMap from './author-photos.json';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export function getStrapiURL(path = ''): string {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(media?: string | StrapiMedia | null, fallbackId?: string | number): string {
  const getFallbackPhoto = () => {
    const rawNum = fallbackId ? Number(fallbackId.toString().replace(/\D/g, '') || 1) : 1;
    const idx = (Math.abs(rawNum * 31) % 13) + 1;
    let ext = '.jpg';
    if (idx === 2 || idx === 11 || idx === 12) ext = '.jpeg';
    else if (idx === 6 || idx === 10) ext = '.webp';
    return `/assets/photos/haber-foto${idx}${ext}`;
  };

  if (!media) {
    return getFallbackPhoto();
  }

  const rawUrl = typeof media === 'string' ? media : media.url || '';
  if (!rawUrl) return getFallbackPhoto();

  // Filter out any default Strapi template placeholder like pexels_eberhardgross
  if (rawUrl.includes('pexels_eberhardgross') || rawUrl.includes('travel1.jpg')) {
    return getFallbackPhoto();
  }

  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl;
  }
  if (rawUrl.startsWith('/assets/')) {
    return rawUrl;
  }
  if (rawUrl.startsWith('/uploads/')) {
    return rawUrl;
  }

  return `${STRAPI_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
}

/**
 * Strapi REST API çağrısı yapan yardımcı fonksiyon.
 */
export async function fetchStrapi<T>(
  endpoint: string,
  urlParams: Record<string, string | number | boolean> = {},
  options: RequestInit = {}
): Promise<StrapiResponse<T> | null> {
  // Vercel veya canlı ortamda localhost Strapi'ye istek atıp timeout (504/500) almamak için doğrudan mock'a düşür
  if (STRAPI_URL.includes('localhost') && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    return null;
  }

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
   MOCK VERİLER & YARDIMCILAR (Strapi CMS çalışmıyorken sorunsuz çalışmayı sağlar)
   ================================================================= */

export {
  MOCK_CATEGORIES,
  MOCK_AUTHORS,
  MOCK_ARTICLES,
  MOCK_VIDEOS,
  getCategoryBySlug,
  generateFallbackArticle,
} from './mock-data';

import {
  MOCK_CATEGORIES,
  MOCK_AUTHORS,
  MOCK_ARTICLES,
  MOCK_VIDEOS,
  getCategoryBySlug,
  generateFallbackArticle,
} from './mock-data';

export const MOCK_DAILY_FEATURES: Record<string, DailyFeature> = {
  manset: {
    id: 1,
    type: 'manset',
    title: 'Günün Manşeti',
    captionTitle: 'Sayı: 2412',
    date: '27 Ekim 2026',
    image: '/assets/photos/yy.jpg',
  },
  jin: {
    id: 2,
    type: 'jin',
    title: 'Jin Dergi',
    captionTitle: 'Sayı: 89',
    date: 'Haftalık Kadın Eki',
    image: '/assets/photos/jin.jpeg',
  },
  karikatur: {
    id: 3,
    type: 'karikatur',
    title: 'Günün Karikatürü',
    captionTitle: 'Çizen: Kemal Gökhan',
    date: '27 Ekim 2026',
    image: '/assets/photos/karikatur.jpeg',
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
  'spor': { endpoint: '/spor-haberleri', name: 'Spor', slug: 'spor', color: 'var(--cat-spor)' },
  'makale': { endpoint: '/makaleler', name: 'Köşe Yazısı', slug: 'yazarlar', color: 'var(--cat-politika)' },
  'ozel-haber': { endpoint: '/guncel-haberleri', name: 'Özel Haber', slug: 'ozel-haber', color: 'var(--cat-politika)' },
  'dosya': { endpoint: '/ekonomi-haberleri', name: 'Dosya', slug: 'dosya', color: 'var(--cat-ekonomi)' },
  'forum': { endpoint: '/soylesiler', name: 'Forum', slug: 'forum', color: 'var(--cat-forum)' },
  'toplum-yasam': { endpoint: '/guncel-haberleri', name: 'Toplum-Yaşam', slug: 'toplum-yasam', color: 'var(--cat-yasam)' },
  'genclik': { endpoint: '/kultur-sanat-haberleri', name: 'Gençlik', slug: 'genclik', color: 'var(--cat-sanat)' },
  'editorun-sectikleri': { endpoint: '/politika-haberleri', name: 'Editörün Seçtikleri', slug: 'editorun-sectikleri', color: 'var(--cat-politika)' },
  'gunun-fotografi': { endpoint: '/kultur-sanat-haberleri', name: 'Günün Fotoğrafı', slug: 'gunun-fotografi', color: 'var(--cat-sanat)' },
  'panorama': { endpoint: '/dunya-haberleri', name: 'Panorama', slug: 'panorama', color: 'var(--cat-dunya)' },
  'video': { endpoint: '/videolar', name: 'Video', slug: 'video', color: 'var(--cat-gundem)' },
};

function normalizeStrapiItem(item: any, catInfo: { name: string; slug: string; color: string }): Article {
  let cover = getStrapiMedia(item.coverImage || item.thumbnail, item.id);

  const authorName = item.yazar?.name || item.authorName || 'Yeni Yaşam';
  const authorSlug = item.yazar?.slug || (item.authorName ? item.authorName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'yeni-yasam');

  return {
    id: `${catInfo.slug}-${item.id}`,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug || `haber-${item.id}`,
    summary: item.summary || item.description || '',
    content: item.content || item.description || '',
    kicker: item.kicker || '',
    coverImage: cover,
    author: {
      id: item.yazar?.id || 1,
      name: authorName,
      slug: authorSlug,
      role: item.yazar?.role || '',
      avatar: (item.yazar?.avatar && (item.yazar.avatar.url || typeof item.yazar.avatar === 'string')) ? getStrapiMedia(item.yazar.avatar) : getAuthorAvatar(authorName, authorSlug),
    },
    category: {
      id: 1,
      name: catInfo.name,
      slug: catInfo.slug,
      color: catInfo.color,
    },
    isHeadline: Boolean(item.isHeadline),
    isFeatured: Boolean(item.isFeatured),
    videoUrl: item.videoUrl || '',
    readTime: item.readTime || item.duration || '3 dk',
    publishedAt: item.publishedAt || item.createdAt || new Date().toISOString(),
  };
}

export async function getArticles(filter?: {
  categorySlug?: string;
  isHeadline?: boolean;
  limit?: number;
  page?: number;
}): Promise<Article[]> {
  const articles: Article[] = [];

  // Belirli bir kategori istenmişse sadece o koleksiyondan çek
  if (filter?.categorySlug && CATEGORY_ENDPOINTS[filter.categorySlug]) {
    const cat = CATEGORY_ENDPOINTS[filter.categorySlug];
    const data = await fetchStrapi<any[]>(cat.endpoint, {
      populate: '*',
      sort: 'createdAt:desc',
      ...(filter.page ? { 'pagination[page]': filter.page } : {}),
      ...(filter.limit ? { 'pagination[pageSize]': filter.limit } : {}),
    });

    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const items = data.data.map((i) => normalizeStrapiItem(i, cat));
      return filter.isHeadline !== undefined
        ? items.filter((a) => Boolean(a.isHeadline) === filter.isHeadline)
        : items;
    }
  } else {
    // Tekrar eden endpoint isteklerini önlemek için benzersiz endpoint'leri al (ana kategorileri koruyarak)
    const uniqueEndpointsMap = new Map<string, (typeof CATEGORY_ENDPOINTS)[string]>();
    for (const cat of Object.values(CATEGORY_ENDPOINTS)) {
      if (!uniqueEndpointsMap.has(cat.endpoint)) {
        uniqueEndpointsMap.set(cat.endpoint, cat);
      }
    }
    const uniqueCategories = Array.from(uniqueEndpointsMap.values());

    const promises = uniqueCategories.map(async (cat) => {
      const data = await fetchStrapi<any[]>(cat.endpoint, {
        populate: '*',
        sort: 'createdAt:desc',
        'pagination[pageSize]': 12,
      });
      if (data && Array.isArray(data.data)) {
        return data.data.map((i) => normalizeStrapiItem(i, cat));
      }
      return [];
    });

    const results = await Promise.all(promises);
    const seenSlugs = new Set<string>();
    for (const r of results) {
      for (const item of r) {
        if (!seenSlugs.has(item.slug)) {
          seenSlugs.add(item.slug);
          articles.push(item);
        }
      }
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
  if (!slug) return null;

  // Benzersiz kategori koleksiyonlarında paralel olarak ara
  const uniqueCategories = Array.from(
    new Map(Object.values(CATEGORY_ENDPOINTS).map((c) => [c.endpoint, c])).values()
  );

  const promises = uniqueCategories.map(async (cat) => {
    try {
      const data = await fetchStrapi<any[]>(cat.endpoint, {
        'filters[slug][$eq]': slug,
        populate: '*',
      });
      if (data && Array.isArray(data.data) && data.data[0]) {
        return normalizeStrapiItem(data.data[0], cat);
      }
    } catch {
      return null;
    }
    return null;
  });

  const results = await Promise.all(promises);
  const foundArticle = results.find(Boolean);
  if (foundArticle) return foundArticle;

  const found = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (found) return found;

  return null;
}

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES;
}

export function getAuthorAvatar(authorName: string, authorSlug?: string): string {
  const photos = authorPhotosMap as Record<string, string>;
  if (authorSlug && photos[authorSlug]) {
    return photos[authorSlug];
  }

  const cleanSlug = (authorName || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  if (photos[cleanSlug]) {
    return photos[cleanSlug];
  }

  const femaleNames = [
    'ayşe', 'sebahat', 'nezahat', 'gülcan', 'beyza', 'pervin',
    'dilzar', 'meryem', 'filiz', 'fidan', 'esra', 'fatma', 'yıldız',
    'ferda', 'nurcan', 'zehra', 'nimet', 'evin', 'sema'
  ];
  const lower = (authorName || '').toLowerCase();
  const isFemale = femaleNames.some((f) => lower.includes(f));

  let hash = 0;
  for (let i = 0; i < (authorName || '').length; i++) {
    hash = (hash << 5) - hash + authorName.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);

  if (isFemale) {
    return positive % 2 === 0 ? '/assets/photos/yazar3.webp' : '/assets/photos/yazar4.webp';
  }

  const malePhotos = ['/assets/photos/yazar1.jpeg', '/assets/photos/yazar2.webp', '/assets/photos/yazar5.jpeg'];
  return malePhotos[positive % malePhotos.length];
}

export async function getAuthors(): Promise<Author[]> {
  try {
    // 1. En son köşe yazısı yayınlayan yazarları ve yazı başlıklarını çek
    const makalelerData = await fetchStrapi<any[]>('/makaleler', {
      populate: '*',
      sort: 'createdAt:desc',
      'pagination[pageSize]': 40,
    });

    const seen = new Set<string>();
    const authors: Author[] = [];

    if (makalelerData && Array.isArray(makalelerData.data) && makalelerData.data.length > 0) {
      for (const m of makalelerData.data) {
        if (
          m.yazar &&
          m.yazar.name &&
          m.yazar.name !== 'Yeni Yaşam' &&
          m.yazar.slug !== 'iceriden' &&
          m.yazar.name !== 'İçeriden'
        ) {
          const key = m.yazar.slug || m.yazar.name;
          if (!seen.has(key)) {
            seen.add(key);
            authors.push({
              id: m.yazar.id,
              name: m.yazar.name,
              slug: m.yazar.slug,
              role: m.yazar.role || '',
              bio: m.yazar.bio || '',
              avatar: (m.yazar.avatar && (m.yazar.avatar.url || typeof m.yazar.avatar === 'string')) ? getStrapiMedia(m.yazar.avatar) : getAuthorAvatar(m.yazar.name, m.yazar.slug),
              twitter: m.yazar.twitter,
              articleCount: 1,
              latestArticleTitle: m.title,
              latestArticleSlug: m.slug,
            });
          }
        }
      }
    }

    // 2. Strapi'den doğrudan eklenen en yeni yazarları da listeye dahil et
    const strapiData = await fetchStrapi<any[]>('/yazarlar', {
      'filters[name][$notIn][0]': 'Yeni Yaşam',
      'filters[name][$notIn][1]': 'İçeriden',
      'filters[role][$ne]': 'Editör',
      populate: '*',
      sort: 'createdAt:desc',
      'pagination[pageSize]': 30,
    });

    if (strapiData && Array.isArray(strapiData.data)) {
      for (const y of strapiData.data) {
        const key = y.slug || y.name;
        if (!seen.has(key)) {
          seen.add(key);
          authors.push({
            id: y.id,
            name: y.name,
            slug: y.slug,
            role: y.role || '',
            bio: y.bio || '',
            avatar: (y.avatar && (y.avatar.url || typeof y.avatar === 'string')) ? getStrapiMedia(y.avatar) : getAuthorAvatar(y.name, y.slug),
            twitter: y.twitter,
            articleCount: 1,
          });
        }
      }
    }

    if (authors.length > 0) {
      return authors;
    }
  } catch {
    // fallback
  }

  return MOCK_AUTHORS;
}

export async function getAllAuthors(): Promise<Author[]> {
  try {
    const strapiData = await fetchStrapi<any[]>('/yazarlar', {
      'filters[name][$notIn][0]': 'Yeni Yaşam',
      'filters[name][$notIn][1]': 'İçeriden',
      'filters[role][$ne]': 'Editör',
      populate: '*',
      sort: 'name:asc',
      'pagination[pageSize]': 250,
    });

    if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
      const seen = new Set<string>();
      const all: Author[] = [];
      for (const y of strapiData.data) {
        if (!seen.has(y.slug)) {
          seen.add(y.slug);
          all.push({
            id: y.id,
            name: y.name,
            slug: y.slug,
            role: y.role || '',
            bio: y.bio || '',
            avatar: (y.avatar && (y.avatar.url || typeof y.avatar === 'string')) ? getStrapiMedia(y.avatar) : getAuthorAvatar(y.name, y.slug),
            twitter: y.twitter,
            articleCount: 1,
          });
        }
      }
      return all;
    }
  } catch {
    // fallback
  }

  // Combine MOCK_AUTHORS and author-photos.json
  const authors: Author[] = [...MOCK_AUTHORS];
  const seenSlugs = new Set(authors.map((a) => a.slug));

  const photos = authorPhotosMap as Record<string, string>;
  for (const [slug, avatarPath] of Object.entries(photos)) {
    if (!seenSlugs.has(slug) && slug !== 'iceriden') {
      seenSlugs.add(slug);
      const name = slug
        .split('-')
        .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
        .join(' ');
      authors.push({
        id: slug,
        name,
        slug,
        role: 'Yazar',
        bio: `${name} — Yeni Yaşam Gazetesi köşe yazarı.`,
        avatar: avatarPath,
        articleCount: 12,
      });
    }
  }

  return authors;
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  if (!slug) return null;

  try {
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
        role: y.role || '',
        bio: y.bio || '',
        avatar: (y.avatar && (y.avatar.url || typeof y.avatar === 'string')) ? getStrapiMedia(y.avatar) : getAuthorAvatar(y.name, y.slug),
        twitter: y.twitter,
        articleCount: 1,
      };
    }
  } catch {
    // fallback
  }

  const found = MOCK_AUTHORS.find((author) => author.slug === slug);
  if (found) return found;

  const photos = authorPhotosMap as Record<string, string>;
  if (photos[slug]) {
    const name = slug
      .split('-')
      .filter(Boolean)
      .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
      .join(' ');

    return {
      id: slug,
      name,
      slug,
      role: 'Yazar',
      bio: `${name} — Yeni Yaşam Gazetesi yazarı.`,
      avatar: photos[slug],
      articleCount: 1,
    };
  }

  return null;
}

export async function getArticlesByAuthor(
  authorSlug: string,
  page = 1,
  pageSize = 10
): Promise<{ articles: Article[]; total: number }> {
  try {
    const data = await fetchStrapi<any[]>('/makaleler', {
      'filters[yazar][slug][$eq]': authorSlug,
      populate: '*',
      sort: 'createdAt:desc',
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
    });

    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const cat = { endpoint: '/makaleler', name: 'Köşe Yazısı', slug: 'yazarlar', color: 'var(--cat-politika)' };
      const articles = data.data.map((i) => normalizeStrapiItem(i, cat));
      const total = data.meta?.pagination?.total || articles.length;
      return { articles, total };
    }
  } catch {
    // fallback
  }

  const matchingArticles = MOCK_ARTICLES.filter(
    (a) => a.author?.slug === authorSlug || (a.author?.name && a.author.name.toLowerCase().includes(authorSlug.replace(/-/g, ' ')))
  );
  if (matchingArticles.length > 0) {
    return { articles: matchingArticles, total: matchingArticles.length };
  }

  return { articles: [], total: 0 };
}

export async function getVideos(): Promise<VideoMedia[]> {
  try {
    const strapiData = await fetchStrapi<any[]>('/videolar', {
      populate: '*',
      sort: 'createdAt:desc',
    });

    if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
      return strapiData.data.map((v: any) => ({
        id: v.id,
        title: v.title,
        slug: v.slug || `video-${v.id}`,
        category: v.category || 'Genel',
        duration: v.duration || '05:00',
        thumbnail: v.thumbnail ? getStrapiMedia(v.thumbnail) : '/assets/photos/haber-foto1.jpg',
        videoUrl: v.videoUrl || 'https://www.youtube.com',
        description: v.description || '',
        publishedAt: v.createdAt || new Date().toISOString(),
      }));
    }
  } catch {
    // fallback
  }

  return MOCK_VIDEOS;
}

export async function getVideoBySlug(slug: string): Promise<VideoMedia | null> {
  if (!slug) return null;

  try {
    const strapiData = await fetchStrapi<any[]>('/videolar', {
      'filters[slug][$eq]': slug,
      populate: '*',
    });

    if (strapiData && Array.isArray(strapiData.data) && strapiData.data[0]) {
      const v = strapiData.data[0];
      return {
        id: v.id,
        title: v.title,
        slug: v.slug || `video-${v.id}`,
        category: v.category || 'Genel',
        duration: v.duration || '05:00',
        thumbnail: v.thumbnail ? getStrapiMedia(v.thumbnail) : '/assets/photos/haber-foto1.jpg',
        videoUrl: v.videoUrl || 'https://www.youtube.com',
        description: v.description || '',
        publishedAt: v.createdAt || new Date().toISOString(),
      };
    }
  } catch {
    // fallback
  }

  const all = await getVideos();
  return all.find((v) => v.slug === slug) || null;
}

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];

  // Strapi'deki tüm kategori koleksiyonlarında veritabanı düzeyinde filtreleme yap
  const searchEndpoints = [
    { endpoint: '/guncel-haberleri', name: 'Güncel', slug: 'guncel', color: 'var(--cat-gundem)' },
    { endpoint: '/politika-haberleri', name: 'Politika', slug: 'politika', color: 'var(--cat-politika)' },
    { endpoint: '/ekonomi-haberleri', name: 'Ekonomi', slug: 'ekonomi', color: 'var(--cat-ekonomi)' },
    { endpoint: '/dunya-haberleri', name: 'Dünya', slug: 'dunya', color: 'var(--cat-dunya)' },
    { endpoint: '/kadin-haberleri', name: 'Kadın', slug: 'kadin', color: 'var(--cat-kadin)' },
    { endpoint: '/ekoloji-haberleri', name: 'Ekoloji', slug: 'ekoloji', color: 'var(--cat-ekoloji)' },
    { endpoint: '/kultur-sanat-haberleri', name: 'Kültür-Sanat', slug: 'kultur-sanat', color: 'var(--cat-kultur-sanat)' },
    { endpoint: '/soylesiler', name: 'Söyleşi', slug: 'soylesi', color: 'var(--cat-forum)' },
    { endpoint: '/spor-haberleri', name: 'Spor', slug: 'spor', color: 'var(--cat-spor)' },
    { endpoint: '/makaleler', name: 'Köşe Yazısı', slug: 'yazarlar', color: 'var(--cat-politika)' },
  ];

  try {
    const promises = searchEndpoints.map(async (cat) => {
      const data = await fetchStrapi<any[]>(cat.endpoint, {
        'filters[$or][0][title][$containsi]': q,
        'filters[$or][1][summary][$containsi]': q,
        populate: '*',
        sort: 'createdAt:desc',
        'pagination[pageSize]': 30,
      });

      if (data && Array.isArray(data.data)) {
        return data.data.map((i) => normalizeStrapiItem(i, cat));
      }
      return [];
    });

    const results = (await Promise.all(promises)).flat();
    if (results.length > 0) {
      return results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
  } catch {
    // Strapi bağlantı hatası durumunda fallback
  }

  // Strapi erişilemiyorsa veya sonuç çıkmadıysa mock verilerde ara
  const qLower = q.toLocaleLowerCase('tr-TR');
  return MOCK_ARTICLES.filter(
    (a) =>
      a.title.toLocaleLowerCase('tr-TR').includes(qLower) ||
      a.summary.toLocaleLowerCase('tr-TR').includes(qLower) ||
      (a.author?.name && a.author.name.toLocaleLowerCase('tr-TR').includes(qLower)) ||
      (a.category?.name && a.category.name.toLocaleLowerCase('tr-TR').includes(qLower))
  );
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const strapiData = await fetchStrapi<any[]>('/yazarlar', {
      'filters[$or][0][name][$containsi]': q,
      'filters[$or][1][bio][$containsi]': q,
      'filters[$or][2][role][$containsi]': q,
      populate: '*',
      'pagination[pageSize]': 20,
    });

    if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
      return strapiData.data.map((y: any) => ({
        id: y.id,
        name: y.name,
        slug: y.slug || `yazar-${y.id}`,
        role: y.role || 'Yazar',
        bio: y.bio || '',
        avatar: (y.avatar && (y.avatar.url || typeof y.avatar === 'string')) ? getStrapiMedia(y.avatar) : getAuthorAvatar(y.name, y.slug),
        articleCount: 1,
      }));
    }

    const authors = await getAllAuthors();
    const qLower = q.toLocaleLowerCase('tr-TR');
    return authors.filter(
      (a) =>
        a.name.toLocaleLowerCase('tr-TR').includes(qLower) ||
        (a.bio && a.bio.toLocaleLowerCase('tr-TR').includes(qLower)) ||
        (a.role && a.role.toLocaleLowerCase('tr-TR').includes(qLower))
    );
  } catch {
    return [];
  }
}

/**
 * Strapi Bülten Aboneliği (Newsletter) Kaydı
 */
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  return { success: true, message: 'Bülten aboneliğiniz kaydedildi.' };
}

/**
 * Günün Manşeti (Gazete Baskısı) Fonksiyonları
 */
export async function getMansetList(): Promise<GununManseti[]> {
  try {
    const res = await fetchStrapi<any[]>('/gunun-mansetleri', {
      populate: '*',
      sort: 'issueDate:desc,createdAt:desc',
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((m: any) => ({
        id: m.id,
        documentId: m.documentId,
        issueNumber: m.issueNumber || '',
        issueDate: m.issueDate || '',
        coverImage: m.coverImage ? getStrapiMedia(m.coverImage) : '/assets/photos/yy.jpg',
        pdfFile: m.pdfFile ? getStrapiMedia(m.pdfFile) : null,
        description: m.description || '',
      }));
    }
  } catch {
    // fallback
  }

  return [
    {
      id: 'default-1',
      issueNumber: '3556',
      issueDate: '29 Ekim 2026',
      coverImage: '/assets/photos/yy.jpg',
      pdfFile: '/assets/photos/yy.jpg',
      description: 'Günlük Siyasi Gazete',
    },
    {
      id: 'default-2',
      issueNumber: '3555',
      issueDate: '28 Ekim 2026',
      coverImage: '/assets/photos/yy.jpg',
      pdfFile: '/assets/photos/yy.jpg',
      description: 'Günlük Siyasi Gazete',
    },
    {
      id: 'default-3',
      issueNumber: '3554',
      issueDate: '27 Ekim 2026',
      coverImage: '/assets/photos/yy.jpg',
      pdfFile: '/assets/photos/yy.jpg',
      description: 'Günlük Siyasi Gazete',
    },
    {
      id: 'default-4',
      issueNumber: '3553',
      issueDate: '26 Ekim 2026',
      coverImage: '/assets/photos/yy.jpg',
      pdfFile: '/assets/photos/yy.jpg',
      description: 'Günlük Siyasi Gazete',
    },
  ];
}

export async function getLatestManset(): Promise<GununManseti> {
  const list = await getMansetList();
  return list[0];
}

/**
 * Jin Dergi (Kadın Eki) Fonksiyonları
 */
export async function getJinDergiList(): Promise<JinDergi[]> {
  try {
    const res = await fetchStrapi<any[]>('/jin-dergiler', {
      populate: '*',
      sort: 'issueDate:desc,createdAt:desc',
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((j: any) => ({
        id: j.id,
        documentId: j.documentId,
        issueNumber: j.issueNumber || '',
        title: j.title || 'Jin Dergi',
        issueDate: j.issueDate || '',
        coverImage: j.coverImage ? getStrapiMedia(j.coverImage) : '/assets/photos/jin.jpeg',
        pdfFile: j.pdfFile ? getStrapiMedia(j.pdfFile) : null,
        description: j.description || '',
        sectionTitle: j.sectionTitle || '',
        highlightArticles: j.highlightArticles || '',
      }));
    }
  } catch {
    // fallback
  }

  return [
    {
      id: 'default-jin-1',
      issueNumber: '114',
      title: 'Kadın, Yaşam, Özgürlük',
      issueDate: '29 Ekim 2026',
      coverImage: '/assets/photos/jin.jpeg',
      pdfFile: '/assets/photos/jin.jpeg',
      description: '',
      sectionTitle: '',
      highlightArticles: '',
    },
  ];
}

export async function getLatestJinDergi(): Promise<JinDergi> {
  const list = await getJinDergiList();
  return list[0];
}

/**
 * Günün Karikatürü Fonksiyonları
 */
export async function getKarikaturList(): Promise<Karikatur[]> {
  try {
    const res = await fetchStrapi<any[]>('/karikaturler', {
      populate: '*',
      sort: 'publishDate:desc,createdAt:desc',
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map((k: any) => ({
        id: k.id,
        documentId: k.documentId,
        title: k.title || 'Günün Karikatürü',
        artist: k.artist || 'Yeni Yaşam Mizah',
        publishDate: k.publishDate || '',
        image: k.image ? getStrapiMedia(k.image) : '/assets/photos/karikatur.jpeg',
        description: k.description || '',
      }));
    }
  } catch {
    // fallback
  }

  return [
    {
      id: 'default-k-1',
      title: 'Günün Karikatürü',
      artist: 'Yeni Yaşam Mizah Kolektifi',
      publishDate: '29 Ekim 2026',
      image: '/assets/photos/karikatur.jpeg',
      description: 'Haftalık ve günlük siyasetin çizgilerle ifadesi.',
    },
    {
      id: 'default-k-2',
      title: 'Bütçe görüşmeleri ve halkın sofrası',
      artist: 'Yeni Yaşam Mizah',
      publishDate: '28 Ekim 2026',
      image: '/assets/photos/karikatur.jpeg',
      description: '',
    },
    {
      id: 'default-k-3',
      title: 'Diplomatik temaslar ve masadaki gerçekler',
      artist: 'Yeni Yaşam Mizah',
      publishDate: '27 Ekim 2026',
      image: '/assets/photos/karikatur.jpeg',
      description: '',
    },
    {
      id: 'default-k-4',
      title: 'Ekoloji ve ranta karşı direniş',
      artist: 'Yeni Yaşam Mizah',
      publishDate: '26 Ekim 2026',
      image: '/assets/photos/karikatur.jpeg',
      description: '',
    },
  ];
}

export async function getLatestKarikatur(): Promise<Karikatur> {
  const list = await getKarikaturList();
  return list[0];
}

/**
 * Ana Sayfadaki Günlük Özellikler (Manşet, Jin Dergi, Karikatür)
 */
export async function getDailyFeatures(): Promise<{
  manset: DailyFeature;
  jin: DailyFeature;
  karikatur: DailyFeature;
}> {
  const [latestManset, latestJin, latestKarikatur] = await Promise.all([
    getLatestManset(),
    getLatestJinDergi(),
    getLatestKarikatur(),
  ]);

  return {
    manset: {
      id: latestManset.id,
      type: 'manset',
      title: 'Günün Manşeti',
      captionTitle: latestManset.issueNumber ? `Sayı: ${latestManset.issueNumber}` : 'Günün Manşeti',
      date: latestManset.issueDate || 'Bugün',
      image: latestManset.coverImage,
    },
    jin: {
      id: latestJin.id,
      type: 'jin',
      title: latestJin.title || 'Jin Dergi',
      captionTitle: latestJin.issueNumber ? `Sayı: ${latestJin.issueNumber}` : 'Haftalık Kadın Eki',
      date: latestJin.issueDate || 'Haftalık Kadın Eki',
      image: latestJin.coverImage,
    },
    karikatur: {
      id: latestKarikatur.id,
      type: 'karikatur',
      title: latestKarikatur.title || 'Günün Karikatürü',
      captionTitle: latestKarikatur.artist ? `Çizen: ${latestKarikatur.artist}` : 'Günün Karikatürü',
      date: latestKarikatur.publishDate || 'Bugün',
      image: latestKarikatur.image,
    },
  };
}
