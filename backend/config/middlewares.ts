import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'global::uploads-fallback',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', '*'],
          'media-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', '*'],
          upgradeInsecureRequests: null,
        },
      },
      crossOriginResourcePolicy: {
        policy: 'cross-origin',
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://yeniyasamgazetesi5.com',
        'https://www.yeniyasamgazetesi5.com',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeadersOnError: true,
    },
  },
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
