const path = require('path');
const dbPath = path.join(__dirname, '..', 'backend', '.tmp', 'data.db');
const db = require(path.join(__dirname, '..', 'backend', 'node_modules', 'better-sqlite3'))(dbPath);

const perms = db.prepare("SELECT * FROM admin_permissions WHERE subject LIKE '%yazar%'").all();
console.log('Perms for yazar count:', perms.length);
console.log(perms);

const roles = db.prepare("SELECT * FROM admin_roles").all();
console.log('Admin roles:', roles);

db.close();
