// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/strapi';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Geçersiz e-posta adresi.' }, { status: 400 });
    }

    const result = await subscribeToNewsletter(email);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
