import { factories } from '@strapi/strapi';
import { sendDailyNewsletter, compileDailyNewsletterArticles, generateNewsletterHtml } from '../../../services/newsletter';

export default factories.createCoreController('api::gunluk-bulten.gunluk-bulten', ({ strapi }) => ({
  async sendNow(ctx) {
    try {
      const { testEmail } = (ctx.request as any).body || {};
      const result = await sendDailyNewsletter(strapi, { manual: true, testEmail });
      return ctx.send(result);
    } catch (err: any) {
      return ctx.badRequest(err?.message || 'Bülten gönderilemedi');
    }
  },

  async preview(ctx) {
    try {
      const nowTurkey = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
      const todayDateStr = nowTurkey.toISOString().slice(0, 10);
      const compiled = await compileDailyNewsletterArticles(strapi, todayDateStr);
      const html = generateNewsletterHtml({
        title: compiled.title,
        editorNote: compiled.editorNote,
        dateStr: nowTurkey.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        articles: compiled.articles,
      });
      ctx.type = 'html';
      return ctx.send(html);
    } catch (err: any) {
      return ctx.badRequest(err?.message || 'Önizleme oluşturulamadı');
    }
  },
}));
