import DOMPurify from 'dompurify';

export function sanitizeHtml(value = '') {
  return DOMPurify.sanitize(String(value), {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  });
}
