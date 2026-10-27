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
  publishedAt: string;
  updatedAt?: string;
  isHeadline?: boolean;
  isFeatured?: boolean;
  videoUrl?: string;
  views?: number;
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
