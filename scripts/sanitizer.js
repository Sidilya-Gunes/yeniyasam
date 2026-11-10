/**
 * Data Sanitizer & Text Normalizer
 * Cleans corrupted characters, decodes HTML entities, strips shortcodes, and verifies record validity.
 */

// Common HTML entities map
const HTML_ENTITIES = {
  '&amp;': '&',
  '&#038;': '&',
  '&quot;': '"',
  '&#034;': '"',
  '&apos;': "'",
  '&#039;': "'",
  '&#8216;': '‘',
  '&#8217;': '’',
  '&#8220;': '“',
  '&#8221;': '”',
  '&#8211;': '–',
  '&#8212;': '—',
  '&#8230;': '…',
  '&nbsp;': ' ',
  '&lt;': '<',
  '&gt;': '>',
  '&laquo;': '«',
  '&raquo;': '»',
  '&ndash;': '–',
  '&mdash;': '—',
  '&hellip;': '…',
};

// Turkish mojibake correction map (in case of double UTF-8 encoding)
const MOJIBAKE_MAP = [
  [/Ã§/g, 'ç'],
  [/Ã‡/g, 'Ç'],
  [/ÄŸ/g, 'ğ'],
  [/Äž/g, 'Ğ'],
  [/Ä±/g, 'ı'],
  [/Ä°/g, 'İ'],
  [/Ã¶/g, 'ö'],
  [/Ã–/g, 'Ö'],
  [/ÅŸ/g, 'ş'],
  [/Åž/g, 'Ş'],
  [/Ã¼/g, 'ü'],
  [/Ãœ/g, 'Ü'],
  [/â€™/g, '’'],
  [/â€˜/g, '‘'],
  [/â€œ/g, '“'],
  [/â€/g, '”'],
  [/â€“/g, '–'],
  [/â€”/g, '—'],
];

function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return '';
  let res = str;
  for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
    res = res.replaceAll(entity, replacement);
  }
  // Decimal entities like &#123;
  res = res.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(parseInt(dec, 10));
    } catch {
      return match;
    }
  });
  // Hex entities like &#x1F;
  res = res.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    try {
      return String.fromCharCode(parseInt(hex, 16));
    } catch {
      return match;
    }
  });
  return res;
}

function fixMojibake(str) {
  if (!str || typeof str !== 'string') return '';
  let res = str;
  for (const [pattern, replacement] of MOJIBAKE_MAP) {
    res = res.replace(pattern, replacement);
  }
  return res;
}

function stripWpShortcodes(str) {
  if (!str || typeof str !== 'string') return '';
  let res = str;
  // Remove [caption ...]<img .../> Caption text[/caption] -> keep img and clean
  res = res.replace(/\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/gi, (match, inner) => {
    return inner.replace(/<a[^>]*>(.*?)<\/a>/gi, '$1').trim();
  });
  // Remove Visual Composer & Elementor shortcodes
  res = res.replace(/\[\/?vc_[^\]]*\]/gi, '');
  res = res.replace(/\[\/?jnews_[^\]]*\]/gi, '');
  res = res.replace(/\[\/?elementor[^\]]*\]/gi, '');
  // Generic leftover shortcodes [gallery ...], [audio ...], etc.
  res = res.replace(/\[[a-zA-Z0-9_\-]+(?:\s+[^\]]+)?\]/g, (m) => {
    if (m.startsWith('[http') || m.startsWith('[www')) return m; // keep links if any
    return '';
  });
  res = res.replace(/\[\/[a-zA-Z0-9_\-]+\]/g, '');
  // Remove HTML comments like <!-- wp:... -->
  res = res.replace(/<!--[\s\S]*?-->/g, '');
  return res;
}

function cleanControlCharacters(str) {
  if (!str || typeof str !== 'string') return '';
  // Remove null bytes and non-printable control characters except \t, \n, \r
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  let s = cleanControlCharacters(str);
  s = fixMojibake(s);
  s = decodeHtmlEntities(s);
  return s.trim();
}

function sanitizeContent(htmlOrText) {
  if (!htmlOrText || typeof htmlOrText !== 'string') return '';
  let s = cleanControlCharacters(htmlOrText);
  s = stripWpShortcodes(s);
  s = fixMojibake(s);
  s = decodeHtmlEntities(s);
  
  // Clean empty paragraphs or redundant breaks
  s = s.replace(/<p>\s*(?:&nbsp;|<br\s*\/?>)?\s*<\/p>/gi, '');
  s = s.replace(/(\r?\n){3,}/g, '\n\n');
  return s.trim();
}

function createSlug(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isValidRecord(post) {
  if (!post) return false;
  const title = (post.title || '').trim();
  const content = (post.content || '').trim();

  // Filter out empty titles or contents
  if (!title || title.length < 2) return false;
  if (!content || content.length < 5) return false;

  // Filter out auto drafts, trash, or placeholders
  if (/^auto-draft$/i.test(title)) return false;
  if (/^taslak$/i.test(title)) return false;

  return true;
}

module.exports = {
  sanitizeText,
  sanitizeContent,
  decodeHtmlEntities,
  fixMojibake,
  stripWpShortcodes,
  createSlug,
  isValidRecord,
};
