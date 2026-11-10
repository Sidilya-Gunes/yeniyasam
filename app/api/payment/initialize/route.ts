// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PRODUCTS, initializeCheckoutForm } from '@/lib/iyzico';
import { checkRateLimit, getClientIp, getSafeSiteUrl } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // Rate Limiting: Dakikada en fazla 10 ödeme başlatma isteği
    const rateCheck = await checkRateLimit(`payment_init_${clientIp}`, 10, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          status: 'failure',
          errorMessage: `Çok fazla deneme yaptınız. Lütfen ${rateCheck.resetInSec} saniye sonra tekrar deneyiniz.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { productId, buyer } = body;

    // 1. API Anahtarları kontrolü
    const apiKey = process.env.IYZICO_API_KEY;
    const secretKey = process.env.IYZICO_SECRET_KEY;

    if (!apiKey || !secretKey || apiKey.includes('BURAYA_') || secretKey.includes('BURAYA_')) {
      console.warn('[İyzico] API anahtarları henüz .env.local dosyasına tanımlanmadı.');
      return NextResponse.json(
        {
          status: 'failure',
          errorCode: 'KEYS_NOT_CONFIGURED',
          errorMessage: 'Ödeme sistemi şu anda güncellenmektedir. Lütfen daha sonra tekrar deneyiniz.',
        },
        { status: 400 }
      );
    }

    // 2. Ürün kontrolü
    const product = SUBSCRIPTION_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Geçersiz veya bulunamayan abonelik paketi.' },
        { status: 400 }
      );
    }

    // 3. Alıcı bilgileri doğrulaması
    if (!buyer || !buyer.name || !buyer.surname || !buyer.email) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Lütfen Ad, Soyad ve E-posta alanlarını doldurunuz.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(buyer.email.trim())) {
      return NextResponse.json(
        { status: 'failure', errorMessage: 'Lütfen geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    // Site URL'si (Callback adresi için güvenli tespit)
    const siteUrl = getSafeSiteUrl(req);

    const conversationId = `YY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const formattedPrice = Number(product.price).toFixed(2);

    const buyerData = {
      id: `BY-${Date.now()}`,
      name: buyer.name.trim(),
      surname: buyer.surname.trim(),
      gsmNumber: buyer.phone?.trim() || '+905550000000',
      email: buyer.email.trim(),
      identityNumber: buyer.identityNumber?.trim() || '11111111110',
      lastLoginDate: '2026-11-01 12:00:00',
      registrationDate: '2026-11-01 12:00:00',
      registrationAddress: buyer.address?.trim() || 'Yeni Yaşam Dijital Okur',
      ip: clientIp,
      city: buyer.city?.trim() || 'Istanbul',
      country: buyer.country?.trim() || (product.currency === 'EUR' ? 'Almanya' : 'Turkiye'),
      zipCode: buyer.zipCode?.trim() || '34000',
    };

    const addressData = {
      contactName: `${buyer.name.trim()} ${buyer.surname.trim()}`,
      city: buyer.city?.trim() || 'Istanbul',
      country: buyer.country?.trim() || (product.currency === 'EUR' ? 'Almanya' : 'Turkiye'),
      address: buyer.address?.trim() || 'Yeni Yaşam Dijital Okur',
      zipCode: buyer.zipCode?.trim() || '34000',
    };

    const requestPayload = {
      locale: 'tr',
      conversationId: conversationId,
      price: formattedPrice,
      paidPrice: formattedPrice,
      currency: product.currency,
      basketId: `BASKET-${Date.now()}`,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${siteUrl}/api/payment/callback`,
      enabledInstallments: [1],
      buyer: buyerData,
      shippingAddress: addressData,
      billingAddress: addressData,
      basketItems: [
        {
          id: product.id,
          name: product.name,
          category1: 'Abonelik',
          itemType: 'VIRTUAL',
          price: formattedPrice,
        },
      ],
    };

    const result = await initializeCheckoutForm(requestPayload);

    if (result && result.status === 'success') {
      return NextResponse.json({
        status: 'success',
        checkoutFormContent: result.checkoutFormContent,
        paymentPageUrl: result.paymentPageUrl,
        token: result.token,
        product,
      });
    } else {
      return NextResponse.json(
        {
          status: 'failure',
          errorMessage: result?.errorMessage || 'İyzico ödeme formu başlatılamadı.',
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('İyzico Initialize Hatası:', error);
    return NextResponse.json(
      { status: 'failure', errorMessage: error?.message || 'Sunucu hatası meydana geldi.' },
      { status: 500 }
    );
  }
}
