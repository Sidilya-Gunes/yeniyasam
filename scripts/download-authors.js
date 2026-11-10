const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Fetching live author list from yeniyasamgazetesi10.com/yazarlar/...');
  const res = await fetch('https://yeniyasamgazetesi10.com/yazarlar/');
  const html = await res.text();

  const authorImages = {};

  // Split by /kategori/yazarlar/
  const parts = html.split(/\/kategori\/yazarlar\//);
  for (let i = 1; i < parts.length; i++) {
    const chunk = parts[i];
    const slugMatch = chunk.match(/^([a-zA-Z0-9_-]+)\//);
    if (!slugMatch) continue;
    const slug = slugMatch[1].trim();

    // Look for <img src="..." within the first 600 characters of this block
    const subChunk = chunk.slice(0, 600);
    const imgMatch = subChunk.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      const src = imgMatch[1].trim();
      if (src.startsWith('http')) {
        authorImages[slug] = src;
      }
    }
  }

  console.log(`Found ${Object.keys(authorImages).length} real columnist photos!`);

  const targetDir = path.join(__dirname, '..', 'public', 'assets', 'photos', 'authors');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const backendTargetDir = path.join(__dirname, '..', 'backend', 'public', 'assets', 'photos', 'authors');
  if (!fs.existsSync(backendTargetDir)) {
    fs.mkdirSync(backendTargetDir, { recursive: true });
  }

  let downloaded = 0;
  for (const [slug, imgUrl] of Object.entries(authorImages)) {
    try {
      const ext = path.extname(new URL(imgUrl).pathname) || '.jpg';
      const fileName = `${slug}${ext}`;
      const destPath = path.join(targetDir, fileName);
      const backendDestPath = path.join(backendTargetDir, fileName);

      const imgRes = await fetch(imgUrl);
      if (imgRes.ok) {
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(destPath, buffer);
        fs.writeFileSync(backendDestPath, buffer);
        downloaded++;
      }
    } catch (e) {
      console.error(`Failed to download for ${slug}:`, e.message);
    }
  }

  console.log(`Successfully downloaded ${downloaded} real columnist photos!`);

  // Write a mapping file so frontend can lookup real author photos directly by slug
  const mapping = {};
  const files = fs.readdirSync(targetDir);
  for (const slug of Object.keys(authorImages)) {
    const found = files.find(f => f.startsWith(`${slug}.`));
    if (found) {
      mapping[slug] = `/assets/photos/authors/${found}`;
    }
  }

  // Also add special author "iceriden"
  mapping['iceriden'] = '/assets/photos/yazar3.webp';

  fs.writeFileSync(
    path.join(__dirname, '..', 'lib', 'author-photos.json'),
    JSON.stringify(mapping, null, 2)
  );
  console.log(`Saved mapping with ${Object.keys(mapping).length} authors to lib/author-photos.json`);
}

main().catch(console.error);
