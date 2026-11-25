import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';

const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * Uzak WordPress sunucusundan görseli anlık çeker ve yerel diske kaydeder (cache).
 */
function fetchAndSaveRemote(uploadPath: string, localFilePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Uzak aktif WordPress medya adresi
    const remoteUrl = `https://yeniyasamgazetesi10.com/wp-content${uploadPath}`;
    
    https.get(remoteUrl, { agent, timeout: 6000 }, (res) => {
      if (res.statusCode === 200 && res.headers['content-type']?.startsWith('image/')) {
        const dir = path.dirname(localFilePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const fileStream = fs.createWriteStream(localFilePath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
        fileStream.on('error', () => resolve(false));
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: any) => {
    await next();

    // Eğer /uploads/ altındaki bir görsel diskte yoksa (404)
    if (ctx.status === 404 && ctx.path.startsWith('/uploads/')) {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Cross-Origin-Resource-Policy', 'cross-origin');

      const localFilePath = path.join(strapi.dirs.static.public, ctx.path);

      // 1. Önce canlı WordPress sunucusundan orijinal görseli indirip diske kaydet
      const downloaded = await fetchAndSaveRemote(ctx.path, localFilePath);
      if (downloaded && fs.existsSync(localFilePath)) {
        ctx.status = 200;
        const ext = path.extname(localFilePath).toLowerCase();
        ctx.type = ext === '.png' ? 'image/png' : (ext === '.webp' ? 'image/webp' : 'image/jpeg');
        ctx.body = fs.createReadStream(localFilePath);
        return;
      }

      // 2. Eğer görsel diskte veya uzakta bulunamadıysa 404 olarak bırak (asla alakasız kişi fotoğrafları basma!)
      return;
    }
  };
};
