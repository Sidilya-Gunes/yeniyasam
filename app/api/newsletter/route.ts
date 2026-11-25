// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextResponse } from 'next/server';
import { addContactToBrevo } from '@/lib/brevo';
import { checkRateLimit, getClientIp } from '@/lib/security';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate Limiting: Dakikada en fazla 5 bülten kaydı denemesi
    const rateCheck = await checkRateLimit(`newsletter_${clientIp}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: `Çok fazla istek gönderdiniz. Lütfen ${rateCheck.resetInSec} saniye sonra tekrar deneyin.` },
        { status: 429 }
      );
    }

    const { email } = await request.json().catch(() => ({}));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Strapi'ye Abone Olarak Kaydet
    try {
      const strapiRes = await fetch(`${STRAPI_URL}/api/bulten-aboneleri`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            email: cleanEmail,
            subscribedAt: new Date().toISOString(),
            isActive: true,
            source: 'Web Sitesi (Footer)',
          },
        }),
      });

      if (!strapiRes.ok) {
        const errorData = await strapiRes.json().catch(() => ({}));
        // Eğer e-posta zaten kayıtlıysa
        if (
          errorData?.error?.message?.toLowerCase().includes('unique') ||
          errorData?.error?.message?.toLowerCase().includes('already exists') ||
          strapiRes.status === 400
        ) {
          return NextResponse.json({
            success: true,
            message: 'Bu e-posta adresi zaten bültenimize kayıtlıdır.',
          });
        }
      }
    } catch (strapiErr) {
      console.error('Strapi newsletter subscriber save error:', strapiErr);
    }

    // 2. Eğer Brevo API Anahtarı Tanımlıysa Brevo'ya da Eşitle
    if (process.env.BREVO_API_KEY) {
      try {
        await addContactToBrevo(cleanEmail);
      } catch (brevoErr) {
        console.error('Brevo newsletter sync error:', brevoErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bülten kaydınız başarıyla alındı. Teşekkür ederiz.',
    });
  } catch (error) {
    console.error('Newsletter Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'Bülten kaydı sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
