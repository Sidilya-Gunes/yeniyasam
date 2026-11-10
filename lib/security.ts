// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î  Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn
// La îlahe îll Allah
// Muhammedur Rasûlûllah

import { NextRequest } from 'next/server';

const ALLOWED_HOSTS = new Set([
  'localhost:3000',
  '127.0.0.1:3000',
  'yeniyasamgazetesi5.com',
  'www.yeniyasamgazetesi5.com',
  'yeniyasam.vercel.app',
]);

/**
 * Host Header Injection ve Open Redirect açıklarını önleyen güvenli site URL tespit edici
 */
export function getSafeSiteUrl(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }

  const host = req.headers.get('host') || 'localhost:3000';
  const proto = req.headers.get('x-forwarded-proto') || 'http';

  // Sadece güvenilir hostlara izin ver, şüpheli host başlığında varsayılan alan adına dön
  if (ALLOWED_HOSTS.has(host) || host.endsWith('.vercel.app')) {
    return `${proto}://${host}`;
  }

  return 'https://yeniyasamgazetesi5.com';
}

/**
 * İstemcinin gerçek IP adresini tespit eder
 * Sahte header (Header Spoofing) enjeksiyonlarına karşı güvenilir proxy önceliklendirmesi yapar
 */
export function getClientIp(req: NextRequest | Request): string {
  if ('ip' in req && typeof (req as any).ip === 'string' && (req as any).ip) {
    return (req as any).ip;
  }

  if ('headers' in req) {
    // 1. Cloudflare CDN arkasındaysa
    const cfIp = req.headers.get('cf-connecting-ip');
    if (cfIp && isValidIp(cfIp)) return cfIp.trim();

    // 2. Vercel Edge arkasındaysa
    const vercelIp = req.headers.get('x-vercel-ip');
    if (vercelIp && isValidIp(vercelIp)) return vercelIp.trim();

    // 3. Standart Nginx / Reverse Proxy arkasındaysa
    const realIp = req.headers.get('x-real-ip');
    if (realIp && isValidIp(realIp)) return realIp.trim();

    // 4. X-Forwarded-For zincirindeki ilk istemci IP'si
    const xForwardedFor = req.headers.get('x-forwarded-for');
    if (xForwardedFor) {
      const ips = xForwardedFor.split(',').map((ip) => ip.trim()).filter(Boolean);
      if (ips.length > 0 && isValidIp(ips[0])) return ips[0];
    }
  }

  return '127.0.0.1';
}

function isValidIp(ip: string): boolean {
  // Basit IPv4 / IPv6 kontrolü
  const trimmed = ip.trim();
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^[a-fA-F0-9:]+$/;
  return ipv4Regex.test(trimmed) || ipv6Regex.test(trimmed);
}

/**
 * Hibrit Rate Limiter:
 * - Vercel KV / Upstash Redis mevcutsa dağıtık (distributed) serverless modunda çalışır.
 * - Değilse bellek içi (in-memory) sliding window algoritması ile koruma sağlar.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Bellek içi periyodik temizleme (bellek sızıntısını önler)
if (typeof setInterval !== 'undefined') {
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);
  if (cleanup.unref) cleanup.unref();
}

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 20,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetInSec: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  // 1. Dağıtık (Distributed / Serverless) Redis ortamı varsa
  if (redisUrl && redisToken) {
    try {
      const key = `rl:${identifier}`;
      const windowSec = Math.ceil(windowMs / 1000);

      // REST API üzerinden atomik INCR isteği
      const res = await fetch(`${redisUrl.replace(/\/$/, '')}/incr/${encodeURIComponent(key)}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${redisToken}`,
        },
        cache: 'no-store',
      });

      if (res.ok) {
        const data = await res.json();
        const currentCount = Number(data.result) || 1;

        if (currentCount === 1) {
          // İlk istekte expire süresini tanımla
          await fetch(
            `${redisUrl.replace(/\/$/, '')}/expire/${encodeURIComponent(key)}/${windowSec}`,
            {
              method: 'POST',
              headers: { Authorization: `Bearer ${redisToken}` },
              cache: 'no-store',
            }
          ).catch(() => {});
        }

        if (currentCount > maxRequests) {
          return { allowed: false, remaining: 0, resetInSec: windowSec };
        }

        return {
          allowed: true,
          remaining: maxRequests - currentCount,
          resetInSec: windowSec,
        };
      }
    } catch {
      // Redis erişiminde hata olursa güvenli şekilde bellek içi mekanizmaya dön
    }
  }

  // 2. Bellek-içi (In-Memory) Güvenli Sliding Window Mekanizması
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { allowed: true, remaining: maxRequests - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= maxRequests) {
    const resetInSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
    return { allowed: false, remaining: 0, resetInSec };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetInSec: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
  };
}
