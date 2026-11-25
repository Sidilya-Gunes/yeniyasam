import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/strapi';

export const revalidate = 30;

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Ayarlar alınamadı' }, { status: 500 });
  }
}
