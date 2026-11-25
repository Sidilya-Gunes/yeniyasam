// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

//EL HAMDU LÎLLAH YA REZZAK Î QÛDDUS 
//ALLAH Û EKBER VE LA ÎLAHE ÎLLALLAH

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE } from '@/lib/site';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { getSiteSettings } from '@/lib/strapi';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yeniyasamgazetesi5.com'),
  title: {
    default: `${SITE.name} — Özgür ve Bağımsız Habercilik`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  icons: {
    icon: [{ url: SITE.favicon }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Header initialSettings={siteSettings} />
          {children}
          <Footer initialSettings={siteSettings} />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
