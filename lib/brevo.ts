/**
 * Brevo (eski Sendinblue) E-posta ve Bülten Entegrasyonu
 */

export interface SubscribeResult {
  success: boolean;
  message: string;
}

export async function addContactToBrevo(email: string): Promise<SubscribeResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID || '2', 10);

  if (!apiKey) {
    console.error('BREVO_API_KEY is not defined in environment variables.');
    return {
      success: false,
      message: 'Bülten servisi şu anda yapılandırılmamış. Lütfen daha sonra tekrar deneyiniz.',
    };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (res.status === 201 || res.status === 204) {
      return {
        success: true,
        message: 'Bülten kaydınız başarıyla alındı. Teşekkür ederiz.',
      };
    }

    const data = await res.json().catch(() => ({}));

    // Kullanıcı zaten abone ise
    if (data.code === 'duplicate_parameter') {
      return {
        success: true,
        message: 'Bu e-posta adresi zaten bültenimize kayıtlıdır.',
      };
    }

    console.error('Brevo API Error:', data);
    return {
      success: false,
      message: data.message || 'Bülten kaydı oluşturulamadı. Lütfen e-postanızı kontrol edin.',
    };
  } catch (error) {
    console.error('Brevo Network Error:', error);
    return {
      success: false,
      message: 'Sunucuya bağlanılamadı. Lütfen internet bağlantınızı kontrol ediniz.',
    };
  }
}
