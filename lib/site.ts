// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

/**
 * site.ts — site geneli sabitler ve tip tanımları.
 * ÖNEMLİ: Bu dosyanın en başındaki 5 satır korunmalıdır (proje kuralı).
 */

export interface SiteConfig {
  name: string;
  shortName: string;
  email: string;
  description: string;
  logo: string;
  favicon: string;
  strapiUrl: string;
}

export const SITE: SiteConfig = {
  name: 'Yeni Yaşam Gazetesi',
  shortName: 'Yeni Yaşam',
  email: 'yeniyasamgazetesi@gmail.com',
  description: 'Yeni Yaşam Gazetesi — bağımsız habercilik, güncel gelişmeler, analizler ve yazarlar.',
  logo: '/assets/img/yy-logo.png',
  favicon: '/assets/img/yy-logo.png',
  strapiUrl: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
};

export const NAV_CATEGORIES = [
  { name: 'Dünya', slug: 'dunya' },
  { name: 'Kadın', slug: 'kadin' },
  { name: 'Ekoloji', slug: 'ekoloji' },
  { name: 'Politika', slug: 'politika' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Kültür', slug: 'kultur' },
  { name: 'Güncel', slug: 'guncel' },
  { name: 'Söyleşi', slug: 'soylesi' },
  { name: 'Forum', slug: 'forum' },
  { name: 'Dosya', slug: 'dosya' },
] as const;

export default SITE;
