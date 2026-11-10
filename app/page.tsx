// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah
// La îlahe îll Allah û vahdehû lâ şerîke leh, lehul-mülku ve lehul-hamdü.
//  ve hüve alâ külli şey’in kadîr.
// Allah û Ekber Ve Lîllahîl Hamd.

import MainContent from '@/components/MainContent';
import { getArticles, getCategories, getAuthors, getDailyFeatures, getVideos } from '@/lib/strapi';

export const revalidate = 60;

export default async function HomePage() {
  const [articles, categories, authors, dailyFeatures, videos] = await Promise.all([
    getArticles(),
    getCategories(),
    getAuthors(),
    getDailyFeatures(),
    getVideos(),
  ]);

  return (
    <main className="site-main container">
      <MainContent
        articles={articles}
        categories={categories}
        authors={authors}
        dailyFeatures={dailyFeatures}
        videos={videos}
      />
    </main>
  );
}
