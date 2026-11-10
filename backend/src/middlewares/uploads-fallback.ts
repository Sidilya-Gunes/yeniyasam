import fs from 'fs';
import path from 'path';

export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: any) => {
    await next();

    // If an upload image file is missing on disk (404), serve authentic newspaper fallback image
    if (ctx.status === 404 && ctx.path.startsWith('/uploads/')) {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Cross-Origin-Resource-Policy', 'cross-origin');

      // Hash path to vary fallback between photo 1 and 13 so not all cards look identical
      const cleanPath = ctx.path;
      let hash = 0;
      for (let i = 0; i < cleanPath.length; i++) {
        hash = (hash << 5) - hash + cleanPath.charCodeAt(i);
        hash |= 0;
      }
      const idx = (Math.abs(hash) % 13) + 1;
      let ext = '.jpg';
      if (idx === 2 || idx === 11 || idx === 12) ext = '.jpeg';
      else if (idx === 6 || idx === 10) ext = '.webp';

      let fallbackPath = path.join(strapi.dirs.static.public, 'assets', 'photos', `haber-foto${idx}${ext}`);
      if (!fs.existsSync(fallbackPath)) {
        fallbackPath = path.join(strapi.dirs.static.public, 'assets', 'photos', 'haber-foto1.jpg');
      }

      if (fs.existsSync(fallbackPath)) {
        ctx.status = 200;
        ctx.type = ext === '.webp' ? 'image/webp' : 'image/jpeg';
        ctx.body = fs.createReadStream(fallbackPath);
      }
    }
  };
};
