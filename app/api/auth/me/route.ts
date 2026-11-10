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

    let subscription = null;
    try {
      const aboneRes = await fetch(
        `${STRAPI_URL}/api/aboneler?filters[email][$eq]=${encodeURIComponent(user.email)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        }
      );
      if (aboneRes.ok) {
        const aboneData = await aboneRes.json();
        if (aboneData?.data && aboneData.data.length > 0) {
          subscription = aboneData.data[0];
        }
      }
    } catch {
      // sessizce geç
    }

    return NextResponse.json({ user, subscription }, { status: 200 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
