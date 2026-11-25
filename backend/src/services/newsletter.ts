import type { Core } from '@strapi/strapi';

export interface NewsletterArticleItem {
  id?: number | string;
  type: 'MANŞET' | 'ÖZEL HABER' | 'DOSYA' | 'KÖŞE YAZISI';
  title: string;
  slug: string;
  summary?: string;
  author?: string;
  kicker?: string;
  url: string;
}

const CANDIDATE_TABLES = [
  { table: 'guncel_haberler', defaultType: 'MANŞET' },
  { table: 'politika_haberleri', defaultType: 'DOSYA' },
  { table: 'makaleler', defaultType: 'KÖŞE YAZISI' },
  { table: 'kadin_haberleri', defaultType: 'ÖZEL HABER' },
  { table: 'ekoloji_haberleri', defaultType: 'ÖZEL HABER' },
  { table: 'ekonomi_haberleri', defaultType: 'ÖZEL HABER' },
  { table: 'dunya_haberleri', defaultType: 'DOSYA' },
  { table: 'kultur_sanat_haberleri', defaultType: 'ÖZEL HABER' },
  { table: 'soylesiler', defaultType: 'ÖZEL HABER' },
];

export function generateNewsletterHtml(data: {
  title: string;
  editorNote?: string;
  dateStr: string;
  articles: NewsletterArticleItem[];
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yeniyasamgazetesi5.com';

  const articlesHtml = data.articles
    .map((art) => {
      const typeBadgeColors: Record<string, { bg: string; text: string }> = {
        'MANŞET': { bg: '#e11d48', text: '#ffffff' },
        'ÖZEL HABER': { bg: '#b91c1c', text: '#ffffff' },
        'DOSYA': { bg: '#4338ca', text: '#ffffff' },
        'KÖŞE YAZISI': { bg: '#0d9488', text: '#ffffff' },
      };
      const badge = typeBadgeColors[art.type] || { bg: '#334155', text: '#ffffff' };

      return `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; background-color: ${badge.bg}; color: ${badge.text}; margin-bottom: 8px;">
                  ${art.type}
                </span>
                ${art.author ? `<span style="display: inline-block; font-size: 12px; color: #64748b; margin-left: 8px; font-weight: 600;">✍️ ${art.author}</span>` : ''}
                <h3 style="margin: 6px 0 8px 0; font-size: 17px; line-height: 1.4; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  <a href="${art.url}" target="_blank" style="color: #0f172a; text-decoration: none;">
                    ${art.title}
                  </a>
                </h3>
                ${art.summary ? `<p style="margin: 0 0 10px 0; font-size: 13px; line-height: 1.5; color: #475569; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${art.summary}</p>` : ''}
                <a href="${art.url}" target="_blank" style="display: inline-block; font-size: 12px; font-weight: 600; color: #e11d48; text-decoration: none;">
                  Haberi Oku &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      `;
    })
    .join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f1f5f9; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          
          <!-- Üst Kırmızı Çizgi & Başlık -->
          <tr>
            <td style="background-color: #111827; padding: 24px 20px; text-align: center; border-bottom: 4px solid #e11d48;">
              <a href="${siteUrl}" target="_blank" style="text-decoration: none; color: #ffffff;">
                <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #e11d48; font-family: serif;">
                  Yeni Yaşam
                </h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8;">
                  Özgür ve Bağımsız Habercilik
                </p>
              </a>
            </td>
          </tr>

          <!-- Tarih & Bülten Adı Şeridi -->
          <tr>
            <td style="background-color: #f8fafc; padding: 12px 20px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <span style="font-size: 13px; font-weight: 600; color: #334155;">
                📅 ${data.dateStr} &bull; Saat 15:00 Günün Özeti
              </span>
            </td>
          </tr>

          <!-- Varsa Editörden Not -->
          ${
            data.editorNote
              ? `
          <tr>
            <td style="padding: 16px 20px; background-color: #fff1f2; border-bottom: 1px solid #fecdd3;">
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #9f1239; font-style: italic;">
                <strong>Editörden:</strong> "${data.editorNote}"
              </p>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Haber Listesi (Max 10) -->
          ${articlesHtml}

          <!-- Alt Bilgi / Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #f8fafc;">
                Yeni Yaşam Gazetesi &bull; Bağımsız Medya
              </p>
              <p style="margin: 0 0 14px 0; line-height: 1.5;">
                Bu bülten, web sitemiz üzerinden e-bültene abone olduğunuz için her gün saat 15:00'te gönderilmektedir.
              </p>
              <p style="margin: 0;">
                <a href="${siteUrl}" target="_blank" style="color: #e11d48; text-decoration: none; font-weight: 600;">Siteyi Ziyaret Et</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Günlük bülten haberlerini derler.
 * 1. Öncelik: Editörlerin haber içine girip "📧 Bugünkü E-Bültene Ekle" işaretlediği haberler!
 * 2. Eksik kalan kısımlar: En güncel Manşet, Özel Haber, Dosya ve Köşe Yazıları ile 10'a tamamlanır.
 */
export async function compileDailyNewsletterArticles(
  strapi: Core.Strapi,
  targetDateStr: string
): Promise<{ title: string; editorNote?: string; articles: NewsletterArticleItem[] }> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yeniyasamgazetesi5.com';

  let bultenRecord: any = null;
  try {
    bultenRecord = await strapi.db
      .connection('gunluk_bultenler')
      .where('send_date', targetDateStr)
      .first();
  } catch {}

  const articles: NewsletterArticleItem[] = [];
  const seenSlugs = new Set<string>();

  const bultenTitle = bultenRecord?.title || `Yeni Yaşam Günlük Bülten — ${targetDateStr}`;
  const editorNote = bultenRecord?.editor_note || undefined;
  const autoFallback = bultenRecord ? Boolean(bultenRecord.auto_fallback) : true;

  // 1. ÖNCELİK (A EN KOLAY VE EN NET YÖNTEM):
  // Editör Strapi'de "Günlük E-Bülten" kaydına girip arama kutusundan haberleri seçmiş mi?
  if (bultenRecord?.id) {
    try {
      // Manşetler
      const selMansetler = await strapi.db
        .connection('gunluk_bultenler_mansetler_lnk as lnk')
        .join('guncel_haberler as h', 'h.id', 'lnk.guncel_haberi_id')
        .where('lnk.gunluk_bulten_id', bultenRecord.id)
        .orderBy('lnk.guncel_haberi_ord', 'asc')
        .select('h.id', 'h.title', 'h.slug', 'h.summary', 'h.kicker');
      for (const m of selMansetler) {
        if (m.slug && !seenSlugs.has(m.slug) && articles.length < 10) {
          seenSlugs.add(m.slug);
          articles.push({
            id: m.id,
            type: 'MANŞET',
            title: m.title,
            slug: m.slug,
            summary: m.summary || '',
            kicker: m.kicker,
            url: `${siteUrl}/haber/${m.slug}`,
          });
        }
      }

      // Özel Haberler
      const selOzel = await strapi.db
        .connection('gunluk_bultenler_ozel_haberler_lnk as lnk')
        .join('guncel_haberler as h', 'h.id', 'lnk.guncel_haberi_id')
        .where('lnk.gunluk_bulten_id', bultenRecord.id)
        .orderBy('lnk.guncel_haberi_ord', 'asc')
        .select('h.id', 'h.title', 'h.slug', 'h.summary', 'h.kicker');
      for (const o of selOzel) {
        if (o.slug && !seenSlugs.has(o.slug) && articles.length < 10) {
          seenSlugs.add(o.slug);
          articles.push({
            id: o.id,
            type: 'ÖZEL HABER',
            title: o.title,
            slug: o.slug,
            summary: o.summary || '',
            kicker: o.kicker,
            url: `${siteUrl}/haber/${o.slug}`,
          });
        }
      }

      // Dosyalar
      const selDosyalar = await strapi.db
        .connection('gunluk_bultenler_dosyalar_lnk as lnk')
        .join('politika_haberleri as p', 'p.id', 'lnk.politika_haberi_id')
        .where('lnk.gunluk_bulten_id', bultenRecord.id)
        .orderBy('lnk.politika_haberi_ord', 'asc')
        .select('p.id', 'p.title', 'p.slug', 'p.summary', 'p.kicker');
      for (const d of selDosyalar) {
        if (d.slug && !seenSlugs.has(d.slug) && articles.length < 10) {
          seenSlugs.add(d.slug);
          articles.push({
            id: d.id,
            type: 'DOSYA',
            title: d.title,
            slug: d.slug,
            summary: d.summary || '',
            kicker: d.kicker,
            url: `${siteUrl}/haber/${d.slug}`,
          });
        }
      }

      // Köşe Yazıları
      const selKose = await strapi.db
        .connection('gunluk_bultenler_kose_yazilari_lnk as lnk')
        .join('makaleler as m', 'm.id', 'lnk.makale_id')
        .leftJoin('makaleler_yazar_lnk as ylnk', 'ylnk.makale_id', 'm.id')
        .leftJoin('yazarlar as y', 'y.id', 'ylnk.yazar_id')
        .where('lnk.gunluk_bulten_id', bultenRecord.id)
        .orderBy('lnk.makale_ord', 'asc')
        .select('m.id', 'm.title', 'm.slug', 'm.summary', 'y.name as author_name');
      for (const k of selKose) {
        if (k.slug && !seenSlugs.has(k.slug) && articles.length < 10) {
          seenSlugs.add(k.slug);
          articles.push({
            id: k.id,
            type: 'KÖŞE YAZISI',
            title: k.title,
            slug: k.slug,
            summary: k.summary || '',
            author: k.author_name || 'Yazar',
            url: `${siteUrl}/haber/${k.slug}`,
          });
        }
      }
    } catch (relationErr) {
      strapi.log.warn('[Newsletter] Bülten ilişkileri okunurken hata:', relationErr);
    }
  }

  // 2. ÖNCELİK (B YÖNTEMİ):
  // Editör herhangi bir haberin içine girip "📧 Bugünkü E-Bültene Ekle" kutucuğunu işaretlemiş mi?
  for (const t of CANDIDATE_TABLES) {
    if (articles.length >= 10) break;
    try {
      let rows: any[] = [];
      if (t.table === 'makaleler') {
        rows = await strapi.db
          .connection('makaleler as m')
          .leftJoin('makaleler_yazar_lnk as lnk', 'lnk.makale_id', 'm.id')
          .leftJoin('yazarlar as y', 'y.id', 'lnk.yazar_id')
          .where('m.include_in_newsletter', 1)
          .whereNotNull('m.published_at')
          .select('m.id', 'm.title', 'm.slug', 'm.summary', 'y.name as author_name');
      } else {
        rows = await strapi.db
          .connection(t.table)
          .where('include_in_newsletter', 1)
          .whereNotNull('published_at')
          .select('id', 'title', 'slug', 'summary', 'kicker');
      }

      if (Array.isArray(rows)) {
        for (const r of rows) {
          if (articles.length >= 10) break;
          if (r.slug && !seenSlugs.has(r.slug)) {
            seenSlugs.add(r.slug);
            let artType: NewsletterArticleItem['type'] = t.defaultType as any;
            if (r.kicker && r.kicker.toLowerCase().includes('özel')) {
              artType = 'ÖZEL HABER';
            }
            articles.push({
              id: r.id,
              type: artType,
              title: r.title,
              slug: r.slug,
              summary: r.summary || '',
              kicker: r.kicker,
              author: r.author_name || undefined,
              url: `${siteUrl}/haber/${r.slug}`,
            });
          }
        }
      }
    } catch {}
  }

  // 2. EĞER 10'DAN AZ İSE VE autoFallback AÇIKSA: En güncel Manşet, Özel Haber, Dosya ve Köşe Yazıları ile 10'a tamamla
  if (autoFallback && articles.length < 10) {
    try {
      // a. Manşet Haberleri (En fazla 3 adet)
      const neededManset = Math.min(3, 10 - articles.length);
      if (neededManset > 0) {
        const mansetler = await strapi.db
          .connection('guncel_haberler')
          .where('is_headline', 1)
          .whereNotNull('published_at')
          .orderBy('published_at', 'desc')
          .limit(neededManset * 2)
          .select('id', 'title', 'slug', 'summary', 'kicker');

        let addedM = 0;
        for (const m of mansetler) {
          if (addedM >= neededManset || articles.length >= 10) break;
          if (m.slug && !seenSlugs.has(m.slug)) {
            seenSlugs.add(m.slug);
            articles.push({
              id: m.id,
              type: 'MANŞET',
              title: m.title,
              slug: m.slug,
              summary: m.summary || '',
              kicker: m.kicker,
              url: `${siteUrl}/haber/${m.slug}`,
            });
            addedM++;
          }
        }
      }

      // b. Özel Haberler (En fazla 3 adet)
      const neededOzel = Math.min(3, 10 - articles.length);
      if (neededOzel > 0) {
        const ozeller = await strapi.db
          .connection('guncel_haberler')
          .where((builder: any) => {
            builder.where('is_featured', 1).orWhere('kicker', 'like', '%özel%');
          })
          .whereNotNull('published_at')
          .orderBy('published_at', 'desc')
          .limit(neededOzel * 2)
          .select('id', 'title', 'slug', 'summary', 'kicker');

        let addedO = 0;
        for (const o of ozeller) {
          if (addedO >= neededOzel || articles.length >= 10) break;
          if (o.slug && !seenSlugs.has(o.slug)) {
            seenSlugs.add(o.slug);
            articles.push({
              id: o.id,
              type: 'ÖZEL HABER',
              title: o.title,
              slug: o.slug,
              summary: o.summary || '',
              kicker: o.kicker,
              url: `${siteUrl}/haber/${o.slug}`,
            });
            addedO++;
          }
        }
      }

      // c. Dosyalar (En fazla 2 adet)
      const neededDosya = Math.min(2, 10 - articles.length);
      if (neededDosya > 0) {
        const dosyalar = await strapi.db
          .connection('politika_haberleri')
          .whereNotNull('published_at')
          .orderBy('published_at', 'desc')
          .limit(neededDosya * 2)
          .select('id', 'title', 'slug', 'summary', 'kicker');

        let addedD = 0;
        for (const d of dosyalar) {
          if (addedD >= neededDosya || articles.length >= 10) break;
          if (d.slug && !seenSlugs.has(d.slug)) {
            seenSlugs.add(d.slug);
            articles.push({
              id: d.id,
              type: 'DOSYA',
              title: d.title,
              slug: d.slug,
              summary: d.summary || '',
              kicker: d.kicker,
              url: `${siteUrl}/haber/${d.slug}`,
            });
            addedD++;
          }
        }
      }

      // d. Köşe Yazıları (En fazla 2 adet - yazarı ile birlikte)
      const neededKose = Math.min(2, 10 - articles.length);
      if (neededKose > 0) {
        const makaleler = await strapi.db
          .connection('makaleler as m')
          .leftJoin('makaleler_yazar_lnk as lnk', 'lnk.makale_id', 'm.id')
          .leftJoin('yazarlar as y', 'y.id', 'lnk.yazar_id')
          .whereNotNull('m.published_at')
          .orderBy('m.published_at', 'desc')
          .limit(neededKose * 2)
          .select('m.id', 'm.title', 'm.slug', 'm.summary', 'y.name as author_name');

        let addedK = 0;
        for (const k of makaleler) {
          if (addedK >= neededKose || articles.length >= 10) break;
          if (k.slug && !seenSlugs.has(k.slug)) {
            seenSlugs.add(k.slug);
            articles.push({
              id: k.id,
              type: 'KÖŞE YAZISI',
              title: k.title,
              slug: k.slug,
              summary: k.summary || '',
              author: k.author_name || 'Yazar',
              url: `${siteUrl}/haber/${k.slug}`,
            });
            addedK++;
          }
        }
      }
    } catch (queryErr) {
      strapi.log.error('[Newsletter] Otomatik haber tamamlama hatası:', queryErr);
    }
  }

  return {
    title: bultenTitle,
    editorNote,
    articles: articles.slice(0, 10),
  };
}

/**
 * Günlük e-bülteni derleyip tüm aktif abonelere gönderir.
 */
export async function sendDailyNewsletter(
  strapi: Core.Strapi,
  options?: { manual?: boolean; testEmail?: string }
): Promise<{ success: boolean; recipientCount: number; message: string }> {
  const nowTurkey = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  const todayDateStr = nowTurkey.toISOString().slice(0, 10); // YYYY-MM-DD
  const nowMs = Date.now();

  strapi.log.info(`[Newsletter] Günlük bülten süreci başlatıldı (Tarih: ${todayDateStr}, Manuel: ${Boolean(options?.manual)})`);

  // 1. Haberleri derle
  const compiled = await compileDailyNewsletterArticles(strapi, todayDateStr);

  if (!compiled.articles || compiled.articles.length === 0) {
    strapi.log.warn('[Newsletter] Gönderilecek bülten haberi bulunamadı.');
    return { success: false, recipientCount: 0, message: 'Gönderilecek haber bulunamadı.' };
  }

  // 2. HTML şablonu oluştur
  const htmlContent = generateNewsletterHtml({
    title: compiled.title,
    editorNote: compiled.editorNote,
    dateStr: nowTurkey.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
    articles: compiled.articles,
  });

  // 3. Alıcıları belirle
  let recipients: string[] = [];

  if (options?.testEmail) {
    recipients = [options.testEmail.trim().toLowerCase()];
  } else {
    try {
      const activeSubs = await strapi.db
        .connection('bulten_aboneleri')
        .where('is_active', 1)
        .select('email');

      if (Array.isArray(activeSubs)) {
        recipients = activeSubs.map((s: any) => s.email?.trim().toLowerCase()).filter(Boolean);
      }
    } catch (e) {
      strapi.log.error('[Newsletter] Abone listesi çekilemedi:', e);
    }
  }

  strapi.log.info(`[Newsletter] Toplam ${recipients.length} aboneye bülten iletilecek.`);

  // 4. E-posta Gönderimi (Brevo API veya SMTP)
  const brevoApiKey = process.env.BREVO_API_KEY;
  let sentSuccessCount = 0;

  if (brevoApiKey && recipients.length > 0) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Yeni Yaşam Gazetesi', email: 'yeniyasamgazetesi@gmail.com' },
          to: recipients.map((em) => ({ email: em })),
          subject: compiled.title,
          htmlContent,
        }),
      });

      if (res.ok) {
        sentSuccessCount = recipients.length;
        strapi.log.info(`[Newsletter] Brevo üzerinden ${sentSuccessCount} aboneye bülten başarıyla gönderildi.`);
      } else {
        const errJson = await res.json().catch(() => ({}));
        strapi.log.error('[Newsletter] Brevo e-posta gönderim hatası:', errJson);
      }
    } catch (emailErr) {
      strapi.log.error('[Newsletter] E-posta gönderim bağlantı hatası:', emailErr);
    }
  } else {
    sentSuccessCount = recipients.length;
    strapi.log.info(
      `[Newsletter] Geliştirme/Yerel Mod: ${sentSuccessCount} aboneye gönderim başarıyla simüle edildi ve loglandı.`
    );
  }

  // 5. gunluk_bultenler tablosunu kaydet / güncelle
  try {
    const existing = await strapi.db
      .connection('gunluk_bultenler')
      .where('send_date', todayDateStr)
      .first();

    if (existing) {
      await strapi.db
        .connection('gunluk_bultenler')
        .where('id', existing.id)
        .update({
          title: compiled.title,
          is_sent: 1,
          sent_at: nowMs,
          recipient_count: sentSuccessCount,
          updated_at: nowMs,
        });
    } else {
      const crypto = await import('crypto');
      const docId = crypto.randomBytes(12).toString('hex');
      await strapi.db
        .connection('gunluk_bultenler')
        .insert({
          document_id: docId,
          title: compiled.title,
          send_date: todayDateStr,
          editor_note: compiled.editorNote || null,
          is_sent: 1,
          sent_at: nowMs,
          recipient_count: sentSuccessCount,
          auto_fallback: 1,
          created_at: nowMs,
          updated_at: nowMs,
          published_at: nowMs,
        });
    }

    // 6. Bültene eklenen haberlerin işaretini temizle ki yarınki bültene tertemiz başlansın
    if (!options?.manual) {
      for (const t of CANDIDATE_TABLES) {
        try {
          await strapi.db.connection(t.table).where('include_in_newsletter', 1).update({ include_in_newsletter: 0 });
        } catch {}
      }
    }
  } catch (dbErr) {
    strapi.log.error('[Newsletter] gunluk_bultenler güncellenirken hata:', dbErr);
  }

  return {
    success: true,
    recipientCount: sentSuccessCount,
    message: `${sentSuccessCount} aboneye bülten başarıyla gönderildi. (${compiled.articles.length} haber)`,
  };
}
