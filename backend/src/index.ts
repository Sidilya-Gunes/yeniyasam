import type { Core } from '@strapi/strapi';

const SCHEDULING_TABLES = [
  { table: 'guncel_haberler', uid: 'api::guncel-haberi.guncel-haberi', name: 'Güncel Haberler' },
  { table: 'politika_haberleri', uid: 'api::politika-haberi.politika-haberi', name: 'Politika Haberleri' },
  { table: 'kadin_haberleri', uid: 'api::kadin-haberi.kadin-haberi', name: 'Kadın Haberleri' },
  { table: 'ekoloji_haberleri', uid: 'api::ekoloji-haberi.ekoloji-haberi', name: 'Ekoloji Haberleri' },
  { table: 'ekonomi_haberleri', uid: 'api::ekonomi-haberi.ekonomi-haberi', name: 'Ekonomi Haberleri' },
  { table: 'kultur_sanat_haberleri', uid: 'api::kultur-sanat-haberi.kultur-sanat-haberi', name: 'Kültür-Sanat Haberleri' },
  { table: 'soylesiler', uid: 'api::soylesi.soylesi', name: 'Söyleşiler' },
  { table: 'spor_haberleri', uid: 'api::spor-haberi.spor-haberi', name: 'Spor Haberleri' },
  { table: 'dunya_haberleri', uid: 'api::dunya-haberi.dunya-haberi', name: 'Dünya Haberleri' },
  { table: 'makaleler', uid: 'api::makale.makale', name: 'Köşe Yazıları (Makaleler)' },
  { table: 'gunun_fotograflari', uid: 'api::gunun-fotografi.gunun-fotografi', name: 'Günün Fotoğrafı' },
  { table: 'gunun_mansetleri', uid: 'api::gunun-manseti.gunun-manseti', name: 'Günün Manşeti' },
  { table: 'karikaturler', uid: 'api::karikatur.karikatur', name: 'Günün Karikatürü' },
  { table: 'jin_dergiler', uid: 'api::jin-dergi.jin-dergi', name: 'Jin Dergi' },
  { table: 'videolar', uid: 'api::video.video', name: 'Videolar' },
];

async function checkAndPublishScheduledEntries(strapi: Core.Strapi) {
  const nowMs = Date.now();
  const nowIso = new Date().toISOString();

  for (const item of SCHEDULING_TABLES) {
    try {
      // Doğrudan Knex bağlantısı üzerinden zamanı gelmiş taslakları sorgula
      // SQLite'da scheduled_publish_at hem integer (epoch ms) hem de metin (ISO) olabileceğinden ikisini de doğru karşılaştırıyoruz
      const pending = await strapi.db
        .connection(item.table)
        .whereNotNull('scheduled_publish_at')
        .whereNull('published_at')
        .where((builder: any) => {
          builder
            .where('scheduled_publish_at', '<=', nowMs)
            .orWhere((inner: any) => {
              inner.whereRaw("typeof(scheduled_publish_at) = 'text'").andWhere('scheduled_publish_at', '<=', nowIso);
            });
        })
        .select('id', 'document_id', 'title', 'scheduled_publish_at');

      if (Array.isArray(pending) && pending.length > 0) {
        for (const entry of pending) {
          strapi.log.info(
            `[Scheduled Publishing] Otomatik yayına alınıyor: "${entry.title || entry.id}" (${item.name}) - Zamanlandı: ${entry.scheduled_publish_at}`
          );

          let publishedViaDocs = false;
          try {
            if ((strapi as any).documents && (strapi as any).documents(item.uid)) {
              await (strapi as any).documents(item.uid).publish({
                documentId: entry.document_id,
              });
              publishedViaDocs = true;
            }
          } catch (docErr: any) {
            strapi.log.warn(`[Scheduled Publishing] Document service fallback: ${docErr?.message || docErr}`);
          }

          if (!publishedViaDocs) {
            // Strapi 5'te taslak satırının published_at'i DAİMA NULL kalmalıdır ki panelde görünsün!
            const existingPub = await strapi.db
              .connection(item.table)
              .where('document_id', entry.document_id)
              .whereNotNull('published_at')
              .first();

            if (existingPub) {
              await strapi.db
                .connection(item.table)
                .where('id', existingPub.id)
                .update({ published_at: nowMs, updated_at: nowMs });
            } else {
              const draftRow = await strapi.db.connection(item.table).where('id', entry.id).first();
              if (draftRow) {
                const { id, ...copyData } = draftRow;
                await strapi.db.connection(item.table).insert({
                  ...copyData,
                  published_at: nowMs,
                  updated_at: nowMs,
                });
              }
            }
          }

          // Zamanlama tamamlandığı için scheduled_publish_at'i temizle
          await strapi.db
            .connection(item.table)
            .where('document_id', entry.document_id)
            .update({ scheduled_publish_at: null });

          strapi.log.info(`[Scheduled Publishing] Başarıyla yayınlandı: "${entry.title || entry.id}"`);
        }
      }
    } catch (err: any) {
      // Tablo henüz yoksa veya kolon kontrolünde hata olursa sessizce geç
    }
  }
}

let lastNewsletterSentDate = '';

async function checkAndTriggerNewsletterAt15(strapi: Core.Strapi) {
  try {
    const nowTurkey = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    const todayDateStr = nowTurkey.toISOString().slice(0, 10);
    const hour = nowTurkey.getHours();
    const minute = nowTurkey.getMinutes();

    // Türkiye saati ile saat 15:00 - 15:05 arası ve bugün henüz gönderilmediyse
    if (hour === 15 && minute >= 0 && minute <= 5 && lastNewsletterSentDate !== todayDateStr) {
      const alreadySent = await strapi.db
        .connection('gunluk_bultenler')
        .where('send_date', todayDateStr)
        .where('is_sent', 1)
        .first();

      if (!alreadySent) {
        lastNewsletterSentDate = todayDateStr;
        strapi.log.info(`[Newsletter] Saat 15:00 geldi! Günlük bülten otomatik gönderiliyor (Tarih: ${todayDateStr})...`);
        const { sendDailyNewsletter } = await import('./services/newsletter');
        await sendDailyNewsletter(strapi);
      } else {
        lastNewsletterSentDate = todayDateStr;
      }
    }
  } catch (err: any) {
    strapi.log.error('[Newsletter] 15:00 cron kontrol hatası:', err);
  }
}

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Güvenlik: Public kayıt olma kapalı
    try {
      const pluginStore = strapi.store({
        type: 'plugin',
        name: 'users-permissions',
      });
      const settings: any = await pluginStore.get({ key: 'advanced' });
      if (settings && settings.allow_register !== false) {
        settings.allow_register = false;
        await pluginStore.set({ key: 'advanced', value: settings });
        strapi.log.info('[Security] Public user registration has been automatically disabled.');
      }
    } catch (err) {
      strapi.log.warn('[Security] Could not enforce allow_register: false', err);
    }

    // 2. İleri Tarihli / Zamanlanmış Haber Yayınlama Servisi (Her 15 saniyede bir kontrol)
    strapi.log.info('[Scheduled Publishing] Zamanlanmış haber yayınlama servisi aktif edildi (15 saniye periyot).');
    
    // Açılışta hemen bir kontrol yap
    checkAndPublishScheduledEntries(strapi).catch(() => {});

    // Düzenli aralıkla çalıştır
    setInterval(() => {
      checkAndPublishScheduledEntries(strapi).catch((err) => {
        strapi.log.error('[Scheduled Publishing] Periyodik kontrol hatası:', err);
      });
    }, 15 * 1000);

    // 3. Günlük E-Bülten Servisi (Her gün Türkiye saati ile saat 15:00'te abonelere bülten gönderimi)
    strapi.log.info('[Newsletter] Günlük saat 15:00 e-bülten servisi aktif edildi.');
    setInterval(() => {
      checkAndTriggerNewsletterAt15(strapi).catch((err) => {
        strapi.log.error('[Newsletter] 15:00 kontrol hatası:', err);
      });
    }, 20 * 1000);
  },
};
