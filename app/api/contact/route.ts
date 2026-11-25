import { NextRequest, NextResponse } from 'next/server';

// IP bazlı basit ve etkili rate limit: 10 dakikada en fazla 5 mesaj
const rateLimitMap = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 dakika
  const maxRequests = 5;

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla mesaj gönderdiniz. Lütfen birkaç dakika sonra tekrar deneyin.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, email, subject, message, honeypot } = body;

    // Honeypot spam bot tuzağı kontrolü
    if (honeypot) {
      // Botları oyalamak için sessizce başarılı dön
      return NextResponse.json({ success: true, message: 'Mesajınız başarıyla iletildi.' });
    }

    // Doğrulamalar
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir ad soyad giriniz.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Lütfen mesajınızın konusunu belirtiniz.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, error: 'Lütfen en az 5 karakterden oluşan bir mesaj yazınız.' },
        { status: 400 }
      );
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    // 1. Strapi API'sine kaydet
    const strapiRes = await fetch(`${strapiUrl}/api/iletisim-mesajlari`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
          ipAddress: ip,
          isRead: false,
        },
      }),
    });

    if (!strapiRes.ok) {
      console.error('Strapi contact save error:', await strapiRes.text());
      return NextResponse.json(
        { success: false, error: 'Mesajınız kaydedilirken bir hata oluştu. Lütfen doğrudan e-posta ile ulaşın.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.',
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.' },
      { status: 500 }
    );
  }
}
