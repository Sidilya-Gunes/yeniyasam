

export interface StrapiUser {
  id: number | string;
  documentId?: string;
  username: string;
  email: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subscription?: {
    id?: number | string;
    fullName?: string;
    email?: string;
    plan?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    price?: number;
    currency?: string;
  };
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id?: number;
  documentId?: string;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

export interface Category {
  id: number | string;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Author {
  id: number | string;
  documentId?: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatar?: string | StrapiMedia;
  email?: string;
  twitter?: string;
  articleCount?: number;
  latestArticleTitle?: string;
  latestArticleSlug?: string;
}

export interface Article {
  id: number | string;
  documentId?: string;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  kicker?: string;
  coverImage?: string | StrapiMedia;
  category?: Category;
  author?: Author;
  tags?: string[];
  publishedAt: string;
  updatedAt?: string;
  isHeadline?: boolean;
  isFeatured?: boolean;
  videoUrl?: string;
  readTime?: string;
  views?: number;
  scheduledPublishAt?: string;
}

export interface VideoMedia {
  id: number | string;
  documentId?: string;
  title: string;
  slug: string;
  category: string;
  duration: string;
  thumbnail: string | StrapiMedia;
  videoUrl?: string;
  youtubeId?: string;
  summary?: string;
  description?: string;
  publishedAt?: string;
}

export interface DailyFeature {
  id: number | string;
  documentId?: string;
  type: 'manset' | 'jin' | 'karikatur' | 'foto';
  title: string;
  image: string | StrapiMedia;
  date: string;
  captionTitle?: string;
  captionDescription?: string;
  captionMeta?: string;
}

export interface GununManseti {
  id: number | string;
  documentId?: string;
  issueNumber: string;
  issueDate: string;
  coverImage: string;
  pdfFile?: string | null;
  description?: string;
}

export interface JinDergi {
  id: number | string;
  documentId?: string;
  issueNumber: string;
  title: string;
  issueDate: string;
  coverImage: string;
  pdfFile?: string | null;
  description?: string;
  sectionTitle?: string;
  highlightArticles?: string;
}

export interface Karikatur {
  id: number | string;
  documentId?: string;
  title: string;
  artist: string;
  publishDate: string;
  image: string;
  description?: string;
}

export interface DailyPhotoItem {
  id: number | string;
  url: string;
  caption?: string;
}

export interface DailyPhoto {
  id: number | string;
  slug: string;
  title: string;
  summary: string;
  image: string;
  credit: string;
  date: string;
  location?: string;
  articleSlug?: string;
  photos?: DailyPhotoItem[];
}

export interface NewsletterSubscriber {
  id?: number | string;
  email: string;
  subscribedAt?: string;
  isActive?: boolean;
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: StrapiPagination;
  };
  error?: {
    status: number;
    name: string;
    message: string;
  };
}

export interface SiteSettings {
  twitter: string;
  facebook: string;
  bluesky: string;
  youtube: string;
  telegram: string;
  tiktok: string;
  whatsapp: string;
  instagram?: string | null;
  email: string;
  siteTitle?: string;
  siteDescription?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  twitter: 'https://x.com/yeniyasamnews6',
  facebook: 'https://www.facebook.com/profile.php?id=61594460757919',
  bluesky: 'https://bsky.app/profile/yeniyasamgazetesi.bsky.social',
  youtube: 'https://www.youtube.com/@yeniyasammedia',
  telegram: 'https://web.telegram.org/k/#@yeniyasamgazetesi',
  tiktok: 'https://www.tiktok.com/@yeniyasamgazete',
  whatsapp: 'https://whatsapp.com/channel/0029VbDs4DAEAKWHDAbQRX03',
  instagram: null,
  email: 'yeniyasamgazetesi@gmail.com',
  siteTitle: 'Yeni Yaşam Gazetesi',
  siteDescription: 'Halkın Özgür Sesi',
};
