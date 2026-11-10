// Bîsmîllahîr Rahmanîr Rahîm
// El Hamdu Lîllah î Rabbul Alemîn
// Es selatu vesSelamû ala rasûlîna Muhammedîn

import { StrapiAuthResponse, StrapiUser } from '@/types/strapi';

const USER_KEY = 'yy_user';
const TOKEN_KEY = 'yy_token';

/**
 * Kullanıcı oturum durumunu okur
 * Hassas JWT belirteci tarayıcı JavaScript'i yerine güvenli HttpOnly Cookie içerisinde tutulur
 */
export function getStoredUser(): StrapiUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Geriye dönük uyumluluk için (token artık HttpOnly cookie'de saklandığı için varlık bayrağı döner)
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const user = getStoredUser();
  return user ? 'active-session' : null;
}

/**
 * Kullanıcı profil bilgilerini yerel önbellekte saklar (JWT asla JavaScript ile okunabilir saklanmaz)
 */
export function saveSession(user: StrapiUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Eski/güvensiz çerez ve localStorage token'larını temizle
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  window.dispatchEvent(new Event('yy_auth_changed'));
}

/**
 * Oturumu güvenli bir şekilde sonlandırır ve HttpOnly çerezini sunucu üzerinden siler
 */
export async function logoutUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    // Network hatası durumunda dahi yerel oturum kapatılır
  }

  window.dispatchEvent(new Event('yy_auth_changed'));
}

/**
 * Kullanıcı girişi: Sunucu tarafındaki güvenli /api/auth/login rotasını çağırır
 * JWT istemci JavaScript'ine verilmez, HttpOnly çerez olarak yanıt başlığına eklenir
 */
export async function loginUser(
  identifier: string,
  password: string
): Promise<{ success: boolean; data?: StrapiAuthResponse; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.',
      };
    }

    if (data.user) {
      saveSession(data.user);
    }

    return {
      success: true,
      data: {
        jwt: 'secure-http-only-cookie',
        user: data.user,
      },
    };
  } catch (err: unknown) {
    console.error('Login error:', err);
    return {
      success: false,
      error: 'Giriş servisine bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.',
    };
  }
}

/**
 * Aktif oturumu doğrular: /api/auth/me rotası üzerinden HttpOnly çerezini kontrol eder
 */
export async function fetchCurrentUser(_unusedToken?: string): Promise<StrapiUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      await logoutUser();
      return null;
    }

    const data = await res.json();
    if (!data.user) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_KEY);
      }
      return null;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  } catch (err) {
    console.error('Failed to fetch current user:', err);
    return null;
  }
}

export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
    const res = await fetch(`${strapiUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return {
        success: false,
        message: data?.error?.message || 'Şifre sıfırlama isteği gönderilemedi.',
      };
    }

    return {
      success: true,
      message: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.',
    };
  } catch (err) {
    console.error('Forgot password error:', err);
    return {
      success: false,
      message: 'Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.',
    };
  }
}
