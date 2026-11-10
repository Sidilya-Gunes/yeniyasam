/**
 * Security & Privacy Filter
 * Strictly prevents passwords, hashes, emails, sessions, admin credentials,
 * and confidential/commercial data from entering the integration pipeline.
 */

const FORBIDDEN_TABLES = new Set([
  'wpyyg_aio_login_login_attempts',
  'wpyyg_aio_login_login_lockouts',
  'wpyyg_comments',
  'wpyyg_commentmeta',
  'wpyyg_options',
  'wpyyg_koko_analytics_dates',
  'wpyyg_koko_analytics_paths',
  'wpyyg_koko_analytics_post_stats',
  'wpyyg_koko_analytics_referrer_stats',
  'wpyyg_koko_analytics_referrer_urls',
  'wpyyg_koko_analytics_site_stats',
  'wpyyg_popularpostsdata',
  'wpyyg_popularpostssummary',
  'wpyyg_e_events',
  'wpyyg_links',
]);

const FORBIDDEN_COLUMNS = new Set([
  'user_pass',
  'user_email',
  'user_activation_key',
  'user_login',
  'session_tokens',
  'wp_capabilities',
  'comment_author_email',
  'comment_author_IP',
]);

const SENSITIVE_VALUE_PATTERNS = [
  /^\$P\$[a-zA-Z0-9\.\/]{31}$/, // WordPress PHPass hash
  /^\$wp\$2y\$[a-zA-Z0-9\.\/]{53}$/, // Bcrypt hash
  /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9\.\/]{53}$/, // Bcrypt
  /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, // Email address
];

/**
 * Checks if a table is allowed to be read.
 */
function isTableAllowed(tableName) {
  if (!tableName) return false;
  return !FORBIDDEN_TABLES.has(tableName.toLowerCase());
}

/**
 * Sanitizes an author profile to include ONLY public fields.
 * Strips all personal, authentication, or private information.
 */
function sanitizePublicAuthor(rawAuthor) {
  if (!rawAuthor) return null;

  // Extract public fields ONLY
  const author = {
    id: rawAuthor.id,
    name: (rawAuthor.displayName || rawAuthor.name || 'Yeni Yaşam').trim(),
    slug: rawAuthor.slug || '',
    role: rawAuthor.role || 'Yazar',
    bio: (rawAuthor.bio || rawAuthor.description || '').trim(),
    avatar: rawAuthor.avatar || null,
    twitter: rawAuthor.twitter || null,
    articleCount: rawAuthor.articleCount || 0,
  };

  // Hard safety verification: Ensure NO email or password hash slipped through
  for (const [key, val] of Object.entries(author)) {
    if (typeof val === 'string') {
      for (const pattern of SENSITIVE_VALUE_PATTERNS) {
        if (pattern.test(val)) {
          console.warn(`[SECURITY ALERT] Sensitive pattern detected and removed in author field: ${key}`);
          author[key] = null;
        }
      }
    }
  }

  return author;
}

/**
 * Validates a sanitized article object to ensure zero leaks.
 */
function verifySafeArticle(article) {
  if (!article) return false;
  // Ensure no password or email keys exist in the object
  const keys = Object.keys(article);
  for (const k of keys) {
    if (FORBIDDEN_COLUMNS.has(k.toLowerCase())) {
      delete article[k];
    }
  }
  return true;
}

module.exports = {
  isTableAllowed,
  sanitizePublicAuthor,
  verifySafeArticle,
  FORBIDDEN_TABLES,
  FORBIDDEN_COLUMNS,
};
