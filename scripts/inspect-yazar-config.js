const path = require('path');
const dbPath = path.join(__dirname, '..', 'backend', '.tmp', 'data.db');
const db = require(path.join(__dirname, '..', 'backend', 'node_modules', 'better-sqlite3'))(dbPath);

const row = db.prepare("SELECT value FROM strapi_core_store_settings WHERE key = 'plugin_content_manager_configuration_content_types::api::yazar.yazar'").get();
const val = JSON.parse(row.value);
console.log('layouts.list:', val.settings.mainField, val.layouts.list);
console.log('layouts.edit:', JSON.stringify(val.layouts.edit, null, 2));

db.close();
