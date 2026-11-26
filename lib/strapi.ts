import { cache } from 'react';

import {
  Article,
  Category,
  Author,
  VideoMedia,
  DailyFeature,
  GununManseti,
  JinDergi,
  Karikatur,
  DailyPhoto,
  StrapiMedia,
  StrapiResponse,
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from '@/types/strapi';
import authorPhotosMap from './author-photos.json';

// =================================================================
// HIZLI ÖNBELLEK (IN-MEMORY CACHE & DEDUPLICATION)
// Strapi'ye arka arkaya atılan 11+ paralel sorguyu ve gecikmeleri önler.
// =================================================================
const CACHE_TTL_MS = 60 * 1000; // 60 saniye

let cachedAllAuthorsData: { data: Author[]; timestamp: number } | null = null;
const authorBySlugCache = new Map<string, { author: Author; timestamp: number }>();
let cachedVideosData: { data: VideoMedia[]; timestamp: number } | null = null;
let cachedMansetData: { data: GununManseti[]; timestamp: number } | null = null;
let cachedJinData: { data: JinDergi[]; timestamp: number } | null = null;
let cachedKarikaturData: { data: Karikatur[]; timestamp: number } | null = null;
const LONG_CACHE_TTL_MS = 3 * 60 * 1000; // 3 dakika

let globalArticlesCache: { data: Article[]; timestamp: number } | null = null;
const articleBySlugCache = new Map<string, { article: Article; timestamp: number }>();
const slugEndpointMap = new Map<string, { endpoint: string; name: string; slug: string; color: string }>();


const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

export function getStrapiURL(path = ''): string {
  return `${STRAPI_URL}${path}`;
}

export function getStrapiMedia(media?: any, fallbackId?: string | number): string {
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

  let rawUrl = '';
  if (typeof media === 'string') {
    rawUrl = media;
  } else if (media && typeof media === 'object') {
    if (typeof media.url === 'string') {
      rawUrl = media.url;
    } else if (media.data?.attributes?.url) {
      rawUrl = media.data.attributes.url;
    } else if (Array.isArray(media.data) && media.data[0]?.attributes?.url) {
      rawUrl = media.data[0].attributes.url;
    } else if (Array.isArray(media) && media[0]?.url) {
      rawUrl = media[0].url;
    }
  }

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
  // Vercel ortamında localhost Strapi'ye istek atıp timeout (504/500) almamak için doğrudan mock'a düşür
  if (STRAPI_URL.includes('localhost') && process.env.VERCEL) {
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
  'yazarlar': { endpoint: '/makaleler', name: 'Köşe Yazısı', slug: 'yazarlar', color: 'var(--cat-politika)' },
  'gundem': { endpoint: '/guncel-haberleri', name: 'Güncel', slug: 'guncel', color: 'var(--cat-gundem)' },
  'kultur': { endpoint: '/kultur-sanat-haberleri', name: 'Kültür-Sanat', slug: 'kultur-sanat', color: 'var(--cat-kultur-sanat)' },
  'yasam': { endpoint: '/guncel-haberleri', name: 'Toplum-Yaşam', slug: 'toplum-yasam', color: 'var(--cat-yasam)' },
  'yerel': { endpoint: '/guncel-haberleri', name: 'Yerel', slug: 'yerel', color: 'var(--cat-gundem)' },
  'analiz': { endpoint: '/politika-haberleri', name: 'Analiz', slug: 'analiz', color: 'var(--cat-politika)' },
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

export function cleanDumpArtifacts(text?: string | null, isSummary = false): string {
  if (!text || typeof text !== 'string') return '';
  let s = text;

  // 0. Excerpt/Paragraf basindaki artık rn kalıntılarını temizle
  s = s.replace(/^(?:rn\s*|\s*rn\s+)+/gi, '');
  s = s.replace(/(?:^|\n)\s*rn\s+/gi, '\n');

  // 1. rn ve nn kalıntılarını temizle (WordPress ve dump aktarımından kalan kaçış hataları)
  s = s.replace(/(?:r\s*n){2,}/gi, isSummary ? ' ' : '\n\n');
  s = s.replace(/([>)"’'…\.\?\!])\s*nn+\s*/gi, isSummary ? '$1 ' : '$1\n\n');
  s = s.replace(/\s*nn+<(?=[a-z0-9\/])/gi, isSummary ? ' <' : '\n\n<');
  s = s.replace(/([a-zçğıöşüA-ZÇĞİÖŞÜ0-9])nn+([A-ZÇĞİÖŞÜ])/g, isSummary ? '$1 $2' : '$1\n\n$2');
  s = s.replace(/(?:^|\s|>|"|')nn(?=[A-ZÇĞİÖŞÜ])/g, isSummary ? ' ' : '\n\n');
  s = s.replace(/(?:^|\n|\r)\s*nn+\s*/gi, isSummary ? ' ' : '\n\n');
  s = s.replace(/<\/(strong|p|b|i|h[1-6]|div|span)>n+/gi, isSummary ? ' ' : '</$1>\n\n');
  s = s.replace(/(?:rn)+<([a-z0-9]+)/gi, isSummary ? ' <$1' : '\n<$1');
  s = s.replace(/<\/([a-z0-9]+)>(?:rn)+/gi, isSummary ? '</$1> ' : '</$1>\n');
  s = s.replace(/>\s*(?:rn)+\s*</gi, isSummary ? '><' : '>\n<');

  if (isSummary) {
    // Özet metinlerde kalıntı HTML etiketlerini tamamen temizle
    s = s.replace(/<[^>]+>/g, ' ');
    s = s.replace(/<\/?[a-z0-9]+(?:\s+[^>]*)?/gi, ' ');
    s = s.replace(/\s+/g, ' ');
  } else {
    s = s.replace(/\n{3,}/g, '\n\n');
  }
  return s.trim();
}

function normalizeStrapiItem(item: any, catInfo: { name: string; slug: string; color: string }): Article {
  const yazarObj = item.yazar?.data ? { id: item.yazar.data.id, ...item.yazar.data.attributes } : item.yazar;
  const authorName = yazarObj?.name || item.authorName || 'Yeni Yaşam';
  const authorSlug = yazarObj?.slug || (authorName !== 'Yeni Yaşam' ? authorName.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'yeni-yasam');
  const authorAvatar = (yazarObj?.avatar && (yazarObj.avatar.url || typeof yazarObj.avatar === 'string' || yazarObj.avatar.data))
    ? getStrapiMedia(yazarObj.avatar)
    : getAuthorAvatar(authorName, authorSlug);

  const rawImage = item.coverImage || item.thumbnail || item.image || item.gorsel;
  let cover: string;
  if (rawImage) {
    cover = getStrapiMedia(rawImage, item.id);
  } else if (catInfo.slug === 'yazarlar' || catInfo.slug === 'makale' || yazarObj) {
    cover = authorAvatar;
  } else {
    cover = getStrapiMedia(null, item.id);
  }

  const artItem: Article = {
    id: `${catInfo.slug}-${item.id}`,
    documentId: item.documentId,
    title: item.title,
    slug: item.slug || `haber-${item.id}`,
    summary: cleanDumpArtifacts(item.summary || item.description || '', true),
    content: cleanDumpArtifacts(item.content || item.description || '', false),
    kicker: item.kicker || '',
    coverImage: cover,
    author: {
      id: yazarObj?.id || 1,
      name: authorName,
      slug: authorSlug,
      role: yazarObj?.role || '',
      avatar: authorAvatar,
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
    publishedAt: item.publishedAt || item.publishDate || item.createdAt || new Date().toISOString(),
    scheduledPublishAt: item.scheduledPublishAt || undefined,
  };

  if (artItem.slug) {
    slugEndpointMap.set(artItem.slug, {
      endpoint: (catInfo as any).endpoint || CATEGORY_ENDPOINTS[catInfo.slug]?.endpoint || '/guncel-haberleri',
      name: catInfo.name,
      slug: catInfo.slug,
      color: catInfo.color,
    });
    articleBySlugCache.set(artItem.slug, { article: artItem, timestamp: Date.now() });
  }

  return artItem;
}

export function isArticleScheduleReady(article: Article): boolean {
  if (article.scheduledPublishAt) {
    const t = new Date(article.scheduledPublishAt).getTime();
    if (!isNaN(t) && t > Date.now()) {
      return false;
    }
  }
  return true;
}

export async function getArticles(filter?: {
  categorySlug?: string;
  isHeadline?: boolean;
  limit?: number;
  page?: number;
}): Promise<Article[]> {
  // Genel haberler için 60 saniyelik bellek önbelleği kontrolü (0 ms)
  const isGeneralQuery = !filter?.categorySlug && !filter?.page;
  if (isGeneralQuery && globalArticlesCache && Date.now() - globalArticlesCache.timestamp < CACHE_TTL_MS) {
    let cachedList = globalArticlesCache.data;
    if (filter?.isHeadline !== undefined) {
      cachedList = cachedList.filter((a) => Boolean(a.isHeadline) === filter.isHeadline);
    }
    return filter?.limit ? cachedList.slice(0, filter.limit) : cachedList;
  }

  let articles: Article[] = [];

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
      const items = data.data.map((i) => normalizeStrapiItem(i, cat)).filter(isArticleScheduleReady);
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
    // Zamanlanmış yayın tarihi henüz gelmemiş haberleri filtrele
    const nowTime = Date.now();
    articles = articles.filter((a) => {
      if (a.scheduledPublishAt && new Date(a.scheduledPublishAt).getTime() > nowTime) {
        return false;
      }
      return true;
    });
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    if (isGeneralQuery) {
      globalArticlesCache = { data: articles, timestamp: Date.now() };
    }
    let filtered = articles;
    if (filter?.categorySlug === 'ozel-haber') {
      filtered = filtered.filter((a) => a.category?.slug === 'ozel-haber' || (a.kicker && a.kicker.toLowerCase().includes('özel')) || a.isFeatured);
    }
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

async function fetchArticleBySlugInternal(slug: string): Promise<Article | null> {
  if (!slug) return null;

  // 1. In-memory hızlı önbellek kontrolü (0 ms)
  const cached = articleBySlugCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.article;
  }

  // 2. Slug'ın hangi endpoint'te olduğu biliniyorsa doğrudan tek o endpoint'e sor (1 istek!)
  const knownCat = slugEndpointMap.get(slug);
  if (knownCat) {
    try {
      const data = await fetchStrapi<any[]>(knownCat.endpoint, {
        'filters[slug][$eq]': slug,
        populate: '*',
      });
      if (data && Array.isArray(data.data) && data.data[0]) {
        const art = normalizeStrapiItem(data.data[0], knownCat);
        if (!isArticleScheduleReady(art)) return null;
        articleBySlugCache.set(slug, { article: art, timestamp: Date.now() });
        return art;
      }
    } catch {
      // Endpoint değişmiş olabilir, genel aramaya geç
    }
  }

  // 3. Bilinmeyen slug ise öncelikli kategorilerden başlayarak paralel ara
  const priorityEndpoints = [
    CATEGORY_ENDPOINTS['guncel'],
    CATEGORY_ENDPOINTS['politika'],
    CATEGORY_ENDPOINTS['makale'],
    CATEGORY_ENDPOINTS['dunya'],
    CATEGORY_ENDPOINTS['kadin'],
    CATEGORY_ENDPOINTS['ekonomi'],
    CATEGORY_ENDPOINTS['kultur-sanat'],
    CATEGORY_ENDPOINTS['soylesi'],
    CATEGORY_ENDPOINTS['spor'],
    CATEGORY_ENDPOINTS['video'],
  ].filter(Boolean);

  const uniqueEndpointsMap = new Map<string, (typeof CATEGORY_ENDPOINTS)[string]>();
  for (const cat of priorityEndpoints) {
    if (!uniqueEndpointsMap.has(cat.endpoint)) {
      uniqueEndpointsMap.set(cat.endpoint, cat);
    }
  }
  const uniqueCategories = Array.from(uniqueEndpointsMap.values());

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
  if (foundArticle && isArticleScheduleReady(foundArticle)) {
    articleBySlugCache.set(slug, { article: foundArticle, timestamp: Date.now() });
    return foundArticle;
  }

  const found = MOCK_ARTICLES.find((a) => a.slug === slug);
  if (found) return found;

  return null;
}

export const getArticleBySlug = cache(fetchArticleBySlugInternal);

export async function getCategories(): Promise<Category[]> {
  return MOCK_CATEGORIES;
}

export function getAuthorAvatar(authorName?: string, authorSlug?: string): string {
  const photos = authorPhotosMap as Record<string, string>;
  if (authorSlug && photos[authorSlug]) {
    return photos[authorSlug];
  }
  return '/assets/photos/default-avatar.jpg';
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
      populate: '*',
      sort: 'createdAt:desc',
      'pagination[pageSize]': 40,
    });

    if (strapiData && Array.isArray(strapiData.data)) {
      for (const y of strapiData.data) {
        if (!y.name || y.name === 'Yeni Yaşam' || y.name === 'İçeriden' || y.role === 'Editör') {
          continue;
        }
        const key = y.slug || y.name;
        if (!seen.has(key)) {
          seen.add(key);
          authors.push({
            id: y.id,
            name: y.name,
            slug: y.slug,
            role: y.role || 'Yazar',
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
  if (cachedAllAuthorsData && Date.now() - cachedAllAuthorsData.timestamp < LONG_CACHE_TTL_MS) {
    return cachedAllAuthorsData.data;
  }
  try {
    let allData: any[] = [];
    let page = 1;
    let pageCount = 1;

    do {
      const strapiData = await fetchStrapi<any[]>('/yazarlar', {
        populate: '*',
        sort: 'name:asc',
        'pagination[page]': page,
        'pagination[pageSize]': 100,
      });

      if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
        allData = allData.concat(strapiData.data);
        pageCount = strapiData.meta?.pagination?.pageCount || 1;
      } else {
        break;
      }
      page++;
    } while (page <= pageCount);

    if (allData.length > 0) {
      const seenSlugs = new Set<string>();
      const seenNames = new Set<string>();
      const all: Author[] = [];
      for (const y of allData) {
        if (!y.name || y.name === 'Yeni Yaşam' || y.name === 'İçeriden' || y.role === 'Editör') {
          continue;
        }
        const normName = y.name.trim().toLocaleLowerCase('tr-TR');
        const cleanSlug = y.slug || `yazar-${y.id}`;
        if (!seenSlugs.has(cleanSlug) && !seenNames.has(normName)) {
          seenSlugs.add(cleanSlug);
          seenNames.add(normName);
          all.push({
            id: y.id,
            name: y.name,
            slug: cleanSlug,
            role: y.role || 'Yazar',
            bio: y.bio || '',
            avatar: (y.avatar && (y.avatar.url || typeof y.avatar === 'string')) ? getStrapiMedia(y.avatar) : getAuthorAvatar(y.name, cleanSlug),
            twitter: y.twitter,
            articleCount: 1,
          });
        }
      }
      if (all.length > 0) {
        cachedAllAuthorsData = { data: all, timestamp: Date.now() };
        return all;
      }
    }
  } catch {
    // fallback
  }

  // Combine MOCK_AUTHORS and author-photos.json without duplicates
  const authorsMap = new Map<string, Author>();

  for (const a of MOCK_AUTHORS) {
    if (a.slug && a.slug !== 'iceriden') {
      authorsMap.set(a.slug, a);
    }
  }

  const photos = authorPhotosMap as Record<string, string>;
  for (const [slug, avatarPath] of Object.entries(photos)) {
    if (!authorsMap.has(slug) && slug !== 'iceriden' && !slug.endsWith('1')) {
      const name = slug
        .split('-')
        .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
        .join(' ');
      authorsMap.set(slug, {
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

  return Array.from(authorsMap.values());
}

async function fetchAuthorBySlugInternal(slug: string): Promise<Author | null> {
  if (!slug) return null;

  const cached = authorBySlugCache.get(slug);
  if (cached && Date.now() - cached.timestamp < LONG_CACHE_TTL_MS) {
    return cached.author;
  }

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
  if (found) {
    authorBySlugCache.set(slug, { author: found, timestamp: Date.now() });
    return found;
  }

  const photos = authorPhotosMap as Record<string, string>;
  if (photos[slug]) {
    const name = slug
      .split('-')
      .filter(Boolean)
      .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
      .join(' ');

    const fallbackAuthor: Author = {
      id: slug,
      name,
      slug,
      role: 'Yazar',
      bio: `${name} — Yeni Yaşam Gazetesi yazarı.`,
      avatar: photos[slug],
      articleCount: 1,
    };
    authorBySlugCache.set(slug, { author: fallbackAuthor, timestamp: Date.now() });
    return fallbackAuthor;
  }

  return null;
}

export const getAuthorBySlug = cache(fetchAuthorBySlugInternal);

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
  if (cachedVideosData && Date.now() - cachedVideosData.timestamp < LONG_CACHE_TTL_MS) {
    return cachedVideosData.data;
  }
  try {
    const strapiData = await fetchStrapi<any[]>('/videolar', {
      populate: '*',
      sort: 'createdAt:desc',
    });

    if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
      const videoList: VideoMedia[] = strapiData.data.map((v: any) => ({
        id: v.id,
        title: v.title,
        slug: v.slug || `video-${v.id}`,
        category: v.category || 'Genel',
        duration: v.duration || '05:00',
        thumbnail: (v.thumbnail || v.coverImage || v.image) ? getStrapiMedia(v.thumbnail || v.coverImage || v.image) : '/assets/photos/haber-foto1.jpg',
        videoUrl: v.videoUrl || 'https://www.youtube.com',
        description: v.description || '',
        publishedAt: v.createdAt || new Date().toISOString(),
      }));
      cachedVideosData = { data: videoList, timestamp: Date.now() };
      return videoList;
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
        thumbnail: (v.thumbnail || v.coverImage || v.image) ? getStrapiMedia(v.thumbnail || v.coverImage || v.image) : '/assets/photos/haber-foto1.jpg',
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

const searchCache = new Map<string, { articles: Article[]; timestamp: number }>();
const authorSearchCache = new Map<string, { authors: Author[]; timestamp: number }>();
const SEARCH_CACHE_TTL_MS = 0; // Arama gerçek zamanlı (no-store) çalışır

export async function searchArticles(query: string): Promise<Article[]> {
  const q = query.trim();
  if (!q) return [];

  const qLower = q.toLocaleLowerCase('tr-TR');

  // 1. In-memory hızlı önbellek kontrolü (0 ms)
  const cached = searchCache.get(qLower);
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL_MS) {
    return cached.articles;
  }

  // 2. Strapi'deki kategori koleksiyonlarında hızlı arama (withCount: false & pageSize: 12)
  const searchEndpoints = [
    { endpoint: '/guncel-haberleri', name: 'Güncel', slug: 'guncel', color: 'var(--cat-gundem)' },
    { endpoint: '/politika-haberleri', name: 'Politika', slug: 'politika', color: 'var(--cat-politika)' },
    { endpoint: '/dunya-haberleri', name: 'Dünya', slug: 'dunya', color: 'var(--cat-dunya)' },
    { endpoint: '/makaleler', name: 'Köşe Yazısı', slug: 'yazarlar', color: 'var(--cat-politika)' },
    { endpoint: '/kadin-haberleri', name: 'Kadın', slug: 'kadin', color: 'var(--cat-kadin)' },
    { endpoint: '/ekonomi-haberleri', name: 'Ekonomi', slug: 'ekonomi', color: 'var(--cat-ekonomi)' },
    { endpoint: '/ekoloji-haberleri', name: 'Ekoloji', slug: 'ekoloji', color: 'var(--cat-ekoloji)' },
    { endpoint: '/kultur-sanat-haberleri', name: 'Kültür-Sanat', slug: 'kultur-sanat', color: 'var(--cat-kultur-sanat)' },
    { endpoint: '/soylesiler', name: 'Söyleşi', slug: 'soylesi', color: 'var(--cat-forum)' },
    { endpoint: '/spor-haberleri', name: 'Spor', slug: 'spor', color: 'var(--cat-spor)' },
  ];

  try {
    const promises = searchEndpoints.map(async (cat) => {
      try {
        const data = await fetchStrapi<any[]>(
          cat.endpoint,
          {
            'filters[title][$containsi]': q,
            'pagination[withCount]': false,
            'pagination[pageSize]': 12,
            populate: '*',
            sort: 'createdAt:desc',
          },
          { cache: 'no-store' }
        );

        if (data && Array.isArray(data.data)) {
          return data.data.map((i) => normalizeStrapiItem(i, cat));
        }
      } catch {
        return [];
      }
      return [];
    });

    const results = (await Promise.all(promises)).flat();
    const seenSlugs = new Set<string>();
    const uniqueResults: Article[] = [];
    for (const item of results) {
      if (!seenSlugs.has(item.slug)) {
        seenSlugs.add(item.slug);
        uniqueResults.push(item);
      }
    }

    const readyResults = uniqueResults.filter(isArticleScheduleReady);
    if (readyResults.length > 0) {
      readyResults.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      searchCache.set(qLower, { articles: readyResults, timestamp: Date.now() });
      return readyResults;
    }
  } catch {
    // Strapi bağlantı hatası durumunda fallback
  }

  // Strapi erişilemiyorsa veya sonuç çıkmadıysa mock verilerde ara
  const mockResults = MOCK_ARTICLES.filter(
    (a) =>
      a.title.toLocaleLowerCase('tr-TR').includes(qLower) ||
      a.summary.toLocaleLowerCase('tr-TR').includes(qLower) ||
      (a.author?.name && a.author.name.toLocaleLowerCase('tr-TR').includes(qLower)) ||
      (a.category?.name && a.category.name.toLocaleLowerCase('tr-TR').includes(qLower))
  );

  searchCache.set(qLower, { articles: mockResults, timestamp: Date.now() });
  return mockResults;
}

export async function searchAuthors(query: string): Promise<Author[]> {
  const q = query.trim();
  if (!q) return [];

  const qLower = q.toLocaleLowerCase('tr-TR');
  const cached = authorSearchCache.get(qLower);
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL_MS) {
    return cached.authors;
  }

  try {
    const strapiData = await fetchStrapi<any[]>(
      '/yazarlar',
      {
        'filters[name][$containsi]': q,
        'pagination[withCount]': false,
        'pagination[pageSize]': 15,
        populate: '*',
      },
      { cache: 'no-store' }
    );

    if (strapiData && Array.isArray(strapiData.data) && strapiData.data.length > 0) {
      const seenSlugs = new Set<string>();
      const seenNames = new Set<string>();
      const list: Author[] = [];
      for (const y of strapiData.data) {
        if (!y.name || y.name === 'Yeni Yaşam' || y.name === 'İçeriden') continue;
        const normName = y.name.trim().toLocaleLowerCase('tr-TR');
        const slug = y.slug || `yazar-${y.id}`;
        if (!seenSlugs.has(slug) && !seenNames.has(normName)) {
          seenSlugs.add(slug);
          seenNames.add(normName);
          list.push({
            id: y.id,
            name: y.name,
            slug,
            role: y.role || 'Yazar',
            bio: y.bio || '',
            avatar: (y.avatar && (y.avatar.url || typeof y.avatar === 'string')) ? getStrapiMedia(y.avatar) : getAuthorAvatar(y.name, slug),
            articleCount: 1,
          });
        }
      }
      authorSearchCache.set(qLower, { authors: list, timestamp: Date.now() });
      return list;
    }

    // Strapi'de yazar yoksa mock yazarlardan hızlı filtrele (tüm yazarları tekrar API'den çekme!)
    const mockMatching = MOCK_AUTHORS.filter(
      (a) =>
        a.name.toLocaleLowerCase('tr-TR').includes(qLower) ||
        (a.bio && a.bio.toLocaleLowerCase('tr-TR').includes(qLower)) ||
        (a.role && a.role.toLocaleLowerCase('tr-TR').includes(qLower))
    );
    authorSearchCache.set(qLower, { authors: mockMatching, timestamp: Date.now() });
    return mockMatching;
  } catch {
    return [];
  }
}

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  return { success: true, message: 'Bülten aboneliğiniz kaydedildi.' };
}

/**
 * Günün Manşeti (Gazete Baskısı) Fonksiyonları
 */
export async function getMansetList(): Promise<GununManseti[]> {
  if (cachedMansetData && Date.now() - cachedMansetData.timestamp < LONG_CACHE_TTL_MS) {
    return cachedMansetData.data;
  }
  try {
    const res = await fetchStrapi<any[]>('/gunun-mansetleri', {
      populate: '*',
      sort: 'issueDate:desc,createdAt:desc',
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      const mansetItems: GununManseti[] = res.data.map((m: any) => ({
        id: m.id,
        documentId: m.documentId,
        issueNumber: m.issueNumber || '',
        issueDate: m.issueDate || '',
        coverImage: m.coverImage ? getStrapiMedia(m.coverImage) : '/assets/photos/yy.jpg',
        pdfFile: m.pdfFile ? getStrapiMedia(m.pdfFile) : null,
        description: m.description || '',
      }));
      cachedMansetData = { data: mansetItems, timestamp: Date.now() };
      return mansetItems;
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
  jin?: DailyFeature;
  karikatur?: DailyFeature;
}> {
  const latestManset = await getLatestManset();

  return {
    manset: {
      id: latestManset.id,
      type: 'manset',
      title: 'Günün Manşeti',
      captionTitle: latestManset.issueNumber ? `Sayı: ${latestManset.issueNumber}` : 'Günün Manşeti',
      date: latestManset.issueDate || 'Bugün',
      image: latestManset.coverImage,
    },
  };
}

export const DEFAULT_DAILY_PHOTOS: DailyPhoto[] = [
  {
    id: 1,
    slug: 'kuzey-suriye-gerginlik-suruyor',
    title: "Kuzey Suriye'de gerginlik sürüyor",
    summary: 'Bölgede devam eden çatışmalar sivil halkı zorluyor. Yerel kaynaklara göre son 24 saatte onlarca aile yerinden edildi.',
    image: '/assets/photos/3556.jpg',
    credit: 'Yeni Yaşam Arşivi / AFP',
    date: '27 Ekim 2026',
    location: 'Kuzey ve Doğu Suriye',
    photos: [
      { id: 1, url: '/assets/photos/3556.jpg', caption: 'Kuzey Suriye kırsalında askeri hareketlilik ve yerel kaynaklar' },
      { id: 2, url: '/assets/photos/haber-foto11.jpeg', caption: 'Bölgedeki çadır kamplarında sivil halkın zorlu yaşam koşulları' },
      { id: 3, url: '/assets/photos/haber-foto1.jpg', caption: 'Çatışma hattı yakınlarındaki yerleşim alanları' },
      { id: 4, url: '/assets/photos/haber-foto2.jpeg', caption: 'Sınır hattı boyunca güvenlik noktaları ve hareketlilik' },
    ],
  },
  {
    id: 2,
    slug: 'amed-baris-anneleri-bulusma',
    title: 'Amed sokaklarında barış umudu ve kadınların sesleri',
    summary: 'Barış Anneleri ve kadın hakları savunucuları, kalıcı bir toplumsal barış ve adalet talebiyle meydanlarda bir araya geldi.',
    image: '/assets/photos/haber-foto12.jpeg',
    credit: 'Yeni Yaşam / Medya Haber',
    date: '26 Ekim 2026',
    location: 'Diyarbakır (Amed)',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto12.jpeg', caption: 'Kadın kurumları ve Barış Anneleri buluşması' },
      { id: 2, url: '/assets/photos/haber-foto5.jpg', caption: 'Kadınların ortak adalet ve eşitlik açıklaması' },
    ],
  },
  {
    id: 3,
    slug: 'munzur-ve-kazdaglari-direnis',
    title: 'Munzur ve Kazdağları: Doğanın talanına karşı ortak direniş',
    summary: 'Ekoloji aktivistleri ve yöre halkı, maden ve HES projeleriyle tahrip edilen vadilerini ve su havzalarını korumak için nöbette.',
    image: '/assets/photos/haber-foto3.jpg',
    credit: 'Ekoloji Kolektifi / Yeni Yaşam',
    date: '25 Ekim 2026',
    location: 'Dersim - Çanakkale',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto3.jpg', caption: 'Toprağımıza sahip çıkıyoruz pankartıyla yapılan eylem' },
      { id: 2, url: '/assets/photos/haber-foto4.jpg', caption: 'Köy halkı ve yaşam savunucularının doğa nöbeti' },
    ],
  },
  {
    id: 4,
    slug: 'multeci-kamplari-kis-sartlari',
    title: 'Zorlu kış öncesi mülteci kamplarında çadır nöbeti',
    summary: 'Soğuk hava dalgasının yaklaşmasıyla beraber göç kamplarındaki temel ihtiyaçlar ve barınma sorunları yeniden alarm veriyor.',
    image: '/assets/photos/haber-foto11.jpeg',
    credit: 'Yeni Yaşam Arşivi',
    date: '24 Ekim 2026',
    location: 'Hesekê',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto11.jpeg', caption: 'Kamplarda çadırların onarımı ve sivil savunma' },
      { id: 2, url: '/assets/photos/haber-foto1.jpg', caption: 'Göç mağduru aileler ve çocuklar' },
    ],
  },
  {
    id: 5,
    slug: 'bm-genel-kurulu-diplomasi',
    title: 'BM Genel Kurulu’nda diplomasi trafiği ve bölgesel gerilimler',
    summary: 'Uluslararası platformda Ortadoğu’daki çatışmalar ve ateşkes çağrıları liderlerin gündeminde yer aldı.',
    image: '/assets/photos/haber-foto7.jpg',
    credit: 'AFP / UN Photo',
    date: '23 Ekim 2026',
    location: 'New York - BM',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto7.jpg', caption: 'Genel Kurul hitabı ve diplomatik temaslar' },
    ],
  },
  {
    id: 6,
    slug: 'sur-sokaklarinda-sanat-ve-hafiza',
    title: "Sanatın ve direnişin ritmi: Sur'da sokak ezgileri",
    summary: 'Tarihi Sur sokaklarında genç sanatçılar dengbêjlik geleneğini çağdaş tınılarla buluşturarak hafızayı canlı tutuyor.',
    image: '/assets/photos/haber-foto8.jpg',
    credit: 'Yeni Yaşam Kültür Servisi',
    date: '22 Ekim 2026',
    location: 'Sur, Diyarbakır',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto8.jpg', caption: 'Tarihi surlar ve kültürel etkinlikler' },
    ],
  },
  {
    id: 7,
    slug: 'kadin-bulusmasi-dayanisma',
    title: 'Yerel kadın atölyelerinde dayanışma ve ortak üretim',
    summary: 'Toplumsal eşitlik ve kadın emeğini görünür kılmak amacıyla düzenlenen kadın buluşmaları sürüyor.',
    image: '/assets/photos/haber-foto6.webp',
    credit: 'Yeni Yaşam Kadın Servisi',
    date: '21 Ekim 2026',
    location: 'Van',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto6.webp', caption: 'Kadın kooperatifi ve dayanışma çemberi' },
    ],
  },
  {
    id: 8,
    slug: 'iklim-krizi-tarim-hasat',
    title: 'Mezopotamya ovasında kuraklık: Değişen iklim ve tarım',
    summary: 'Kuraklık ve azalan yer altı suları nedeniyle bölgedeki tarımsal üretim son yılların en kritik seviyesine geriledi.',
    image: '/assets/photos/haber-foto4.jpg',
    credit: 'Mezopotamya Ajansı',
    date: '20 Ekim 2026',
    location: 'Urfa - Mardin Ovası',
    photos: [
      { id: 1, url: '/assets/photos/haber-foto4.jpg', caption: 'Tarımsal üretim alanları ve üreticilerin nöbeti' },
    ],
  },
];

/**
 * Günün Fotoğraflarını (ve Arşivini) getiren fonksiyon.
 * Strapi api::gunun-fotografi koleksiyonunu sorgular, bulamazsa DEFAULT_DAILY_PHOTOS döner.
 */
export async function getDailyPhotos(): Promise<DailyPhoto[]> {
  try {
    const res = await fetchStrapi<any[]>('/gunun-fotograflari', {
      populate: '*',
      'sort[0]': 'publishDate:desc',
      'pagination[pageSize]': 25,
    });

    if (res && Array.isArray(res.data) && res.data.length > 0) {
      const strapiItems: DailyPhoto[] = res.data.map((item: any) => {
        const attrs = item.attributes || item;
        const coverMedia = attrs.coverImage?.data ? attrs.coverImage.data.attributes : (attrs.coverImage || null);
        const photosData = attrs.photos?.data ? attrs.photos.data : (Array.isArray(attrs.photos) ? attrs.photos : []);

        const photoList = photosData.map((p: any, idx: number) => {
          const pAttrs = p.attributes || p;
          return {
            id: p.id || idx,
            url: getStrapiMedia(pAttrs?.url || pAttrs),
            caption: pAttrs?.alternativeText || pAttrs?.caption || '',
          };
        });

        const coverUrl = getStrapiMedia(coverMedia?.url || coverMedia);

        return {
          id: item.id,
          slug: attrs.slug || `gunun-fotografi-${item.id}`,
          title: attrs.title || '',
          summary: cleanDumpArtifacts(attrs.summary, true) || '',
          image: coverUrl,
          credit: attrs.credit || 'Yeni Yaşam Arşivi',
          date: attrs.publishDate
            ? new Date(attrs.publishDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
            : 'Bugün',
          location: attrs.location || undefined,
          photos: photoList.length > 0 ? photoList : [{ id: 1, url: coverUrl, caption: attrs.title }],
        };
      });

      const seen = new Set<string>();
      const combined = [...strapiItems, ...DEFAULT_DAILY_PHOTOS];
      return combined.filter((p) => {
        if (seen.has(p.slug)) return false;
        seen.add(p.slug);
        return true;
      });
    }
  } catch (err) {
    console.error('getDailyPhotos error:', err);
  }

  return DEFAULT_DAILY_PHOTOS;
}

let siteSettingsCache: { settings: SiteSettings; timestamp: number } | null = null;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (siteSettingsCache && Date.now() - siteSettingsCache.timestamp < 30000) {
    return siteSettingsCache.settings;
  }

  try {
    const res = await fetchStrapi<any>('/site-ayari', {}, { next: { revalidate: 30 } });
    if (res && res.data) {
      const d = res.data;
      const settings: SiteSettings = {
        twitter: d.twitter || DEFAULT_SITE_SETTINGS.twitter,
        facebook: d.facebook || DEFAULT_SITE_SETTINGS.facebook,
        bluesky: d.bluesky || DEFAULT_SITE_SETTINGS.bluesky,
        youtube: d.youtube || DEFAULT_SITE_SETTINGS.youtube,
        telegram: d.telegram || DEFAULT_SITE_SETTINGS.telegram,
        tiktok: d.tiktok || DEFAULT_SITE_SETTINGS.tiktok,
        whatsapp: d.whatsapp || DEFAULT_SITE_SETTINGS.whatsapp,
        instagram: d.instagram || null,
        email: d.email || DEFAULT_SITE_SETTINGS.email,
        siteTitle: d.siteTitle || DEFAULT_SITE_SETTINGS.siteTitle,
        siteDescription: d.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
      };
      siteSettingsCache = { settings, timestamp: Date.now() };
      return settings;
    }
  } catch (err) {
    console.error('getSiteSettings error:', err);
  }

  return DEFAULT_SITE_SETTINGS;
}

