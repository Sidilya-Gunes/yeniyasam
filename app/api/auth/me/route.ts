// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('yy_token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const strapiRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!strapiRes.ok) {
      // Token geçersiz veya süresi dolmuş
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete('yy_token');
      return response;
    }

    const user = await strapiRes.json();
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
