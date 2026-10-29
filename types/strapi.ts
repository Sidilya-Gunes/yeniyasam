// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

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
  readTime?: string;
  views?: number;
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
