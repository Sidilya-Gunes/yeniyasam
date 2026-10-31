import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['tr'],
    translations: {
      tr: {
        'app.components.LeftMenu.navbrand.title': 'Yeni Yaşam Gazetesi',
        'app.components.LeftMenu.navbrand.workplace': 'Yönetim Paneli',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    // Türkçe dil desteği ve yapılandırma
  },
};
