const path = require('path');
const dbPath = path.join(__dirname, '..', 'backend', '.tmp', 'data.db');
const db = require(path.join(__dirname, '..', 'backend', 'node_modules', 'better-sqlite3'))(dbPath);

const configs = db.prepare("SELECT key FROM strapi_core_store_settings WHERE key LIKE '%content_manager%'").all();
console.log('Configs:', configs);
db.close();
