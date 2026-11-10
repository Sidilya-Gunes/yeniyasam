// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/strapi';
import { checkRateLimit, getClientIp } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate Limiting: Dakikada en fazla 5 bülten kaydı denemesi
    const rateCheck = await checkRateLimit(`newsletter_${clientIp}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Çok fazla istek gönderdiniz. Lütfen ${rateCheck.resetInSec} saniye sonra tekrar deneyin.` },
        { status: 429 }
      );
    }

    const { email } = await request.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Lütfen geçerli bir e-posta adresi giriniz.' }, { status: 400 });
    }

    const result = await subscribeToNewsletter(email.trim());
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
