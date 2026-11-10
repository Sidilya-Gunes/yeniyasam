

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yeniyasamgazetesi5.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.yeniyasamgazetesi5.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.strapiapp.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}/uploads/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: '/haberler', destination: '/', permanent: true },
      { source: '/haberler/:slug', destination: '/haber/:slug', permanent: true },
      { source: '/kose-yazilari', destination: '/yazarlar', permanent: true },
      { source: '/kose-yazisi/:slug', destination: '/haber/:slug', permanent: true },
      { source: '/yazi/:slug', destination: '/haber/:slug', permanent: true },
      { source: '/yazilar/:slug', destination: '/haber/:slug', permanent: true },
      { source: '/arsiv', destination: '/manset', permanent: true },
      { source: '/e-gazete', destination: '/manset', permanent: true },
      { source: '/gazete', destination: '/manset', permanent: true },
      { source: '/kategori/video', destination: '/video', permanent: true },
      { source: '/videolar', destination: '/video', permanent: true },
      { source: '/video-haber', destination: '/video', permanent: true },
      { source: '/video-haberler', destination: '/video', permanent: true },
      { source: '/kategori/kultur', destination: '/kategori/kultur-sanat', permanent: true },
      { source: '/kategori/gundem', destination: '/kategori/guncel', permanent: true },
      { source: '/kategori/karikatur', destination: '/karikatur', permanent: true },
      { source: '/kategori/manset', destination: '/manset', permanent: true },
      { source: '/kategori/jin', destination: '/jin-dergi', permanent: true },
      { source: '/kategori/jin-dergi', destination: '/jin-dergi', permanent: true },
      { source: '/kategori/yazarlar', destination: '/yazarlar', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
