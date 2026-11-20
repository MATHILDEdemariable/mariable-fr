import DOMPurify from 'dompurify';

/** Sanitize stored rich HTML before rendering (allows iframes for embeds). */
export function sanitizeHtml(html: string | null | undefined): string {
  return DOMPurify.sanitize(html ?? '', {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target'],
  });
}

/** Neutralize stored CSS so it cannot break out of a <style> element or load scripts. */
export function sanitizeCss(css: string | null | undefined): string {
  return (css ?? '')
    .replace(/<[^>]*>?/g, '')
    .replace(/@import[^;]*;?/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/javascript:/gi, '');
}
