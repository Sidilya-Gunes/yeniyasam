// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextRequest, NextResponse } from 'next/server';
import { retrieveCheckoutForm } from '@/lib/iyzico';
import { getSafeSiteUrl } from '@/lib/security';

export async function POST(req: NextRequest) {
  const siteUrl = getSafeSiteUrl(req);
  try {

    let token = '';

    // İyzico callback form-data (application/x-www-form-urlencoded) ile gelir
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      token = (formData.get('token') as string) || '';
    } else {
      const body = await req.json().catch(() => ({}));
      token = body.token || '';
    }

    if (!token) {
      return NextResponse.redirect(`${siteUrl}/abone/sonuc?status=error&message=${encodeURIComponent('Token bilgisi eksik.')}`);
    }

    // İyzico'dan ödeme durumunu sorgula
    const result = await retrieveCheckoutForm(token);

    if (result && result.status === 'success' && result.paymentStatus === 'SUCCESS') {
      const paidPrice = result.paidPrice || '';
      const currency = result.currency || 'TRY';
      const orderId = result.paymentId || token;

      // TODO: Başarılı ödeme Strapi'ye veya abone veri tabanına kaydedilebilir

      return NextResponse.redirect(
        `${siteUrl}/abone/sonuc?status=success&orderId=${encodeURIComponent(orderId)}&price=${encodeURIComponent(paidPrice)}&currency=${encodeURIComponent(currency)}`
      );
    } else {
      const errorMsg = result?.errorMessage || 'Ödeme tamamlanamadı veya karttan çekim reddedildi.';
      return NextResponse.redirect(
        `${siteUrl}/abone/sonuc?status=failed&message=${encodeURIComponent(errorMsg)}`
      );
    }
  } catch (error: any) {
    console.error('İyzico Callback Hatası:', error);
    return NextResponse.redirect(
      `${siteUrl}/abone/sonuc?status=error&message=${encodeURIComponent('Ödeme işlemi tamamlanırken bir hata oluştu.')}`
    );
  }
}
