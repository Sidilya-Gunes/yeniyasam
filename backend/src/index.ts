import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
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
  },
};
