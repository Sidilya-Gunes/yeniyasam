const fs = require('fs');
const path = require('path');
const apiDir = path.join(__dirname, '..', 'backend', 'src', 'api');

fs.readdirSync(apiDir).forEach(dir => {
  const schemaPath = path.join(apiDir, dir, 'content-types', dir, 'schema.json');
  if (fs.existsSync(schemaPath)) {
    const s = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    console.log(`${dir.padEnd(20)} -> displayName: ${s.info.displayName}`);
  }
});
