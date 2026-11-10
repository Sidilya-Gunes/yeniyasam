// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import type { Metadata } from 'next';
import { getVideos, getVideoBySlug } from '@/lib/strapi';
import VideoPlayerView from '@/components/VideoPlayerView';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  if (!video) {
    return { title: 'Video Haber — Yeni Yaşam Medya' };
  }

  return {
    title: `${video.title} — Video Haber — Yeni Yaşam Medya`,
    description: video.description || `${video.title} video haberi ve Yeni Yaşam Medya özel yayını.`,
  };
}

export default async function VideoDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [video, allVideos] = await Promise.all([
    getVideoBySlug(slug),
    getVideos(),
  ]);

  const activeVideo = video || allVideos.find((v) => v.slug === slug) || allVideos[0];

  return <VideoPlayerView initialVideo={activeVideo} allVideos={allVideos} />;
}
