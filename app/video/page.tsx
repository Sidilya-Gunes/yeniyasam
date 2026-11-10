// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import { getVideos } from '@/lib/strapi';
import VideoPlayerView from '@/components/VideoPlayerView';

export const metadata: Metadata = {
  title: 'Video Haber — Yeni Yaşam Medya',
  description: "Yeni Yaşam Gazetesi ve Yeni Yaşam Medya güncel video haberleri, 'Yaşam'da Politika' ve özel yayınlar.",
};

export default async function VideoPage() {
  const allVideos = await getVideos();
  const initialVideo = allVideos[0];

  return <VideoPlayerView initialVideo={initialVideo} allVideos={allVideos} />;
}
