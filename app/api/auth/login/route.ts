// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/security';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // Brute-force koruması: IP başına dakikada maksimum 5 giriş denemesi
    const rateCheck = await checkRateLimit(`login_${clientIp}`, 5, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Çok fazla hatalı giriş denemesi. Lütfen ${rateCheck.resetInSec} saniye sonra tekrar deneyin.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'E-posta ve şifre alanları zorunludur.' },
        { status: 400 }
      );
    }

    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: identifier.trim(), password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok || !data.jwt) {
      const msg = data?.error?.message;
      const errorText =
        msg === 'Invalid identifier or password' || msg?.toLowerCase().includes('invalid')
          ? 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.'
          : msg || 'Giriş yapılamadı.';
      return NextResponse.json({ success: false, error: errorText }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      user: data.user,
    });

    // JWT token'ı XSS saldırılarına karşı korumalı HttpOnly Cookie olarak ayarla
    response.cookies.set({
      name: 'yy_token',
      value: data.jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 gün
    });

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
