export interface Bookmark {
  url: string;
  slug: string;
}

export const STORAGE_KEY = 'mona-bookmarks';
export const COUNTER_KEY = 'mona-bookmark-counter';

export function normalizeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z\d+\-.]*:/i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}

export function nextSlug(counter: number): string {
  const safeCounter = Number.isFinite(counter) && counter >= 0
    ? Math.floor(counter)
    : 0;
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let value = safeCounter + 1;
  let encoded = '';

  do {
    encoded = chars[value % 62] + encoded;
    value = Math.floor(value / 62);
  } while (value > 0);

  return `mona-${encoded.padStart(4, '0')}`;
}

export function loadBookmarks(raw: string | null): Bookmark[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is Bookmark =>
      typeof item === 'object'
      && item !== null
      && typeof (item as { url?: unknown }).url === 'string'
      && typeof (item as { slug?: unknown }).slug === 'string'
      && /^mona-[0-9A-Za-z]+$/.test((item as { slug: string }).slug),
    );
  } catch {
    return [];
  }
}

export function formatBookmark(bookmark: Bookmark): string {
  return `${bookmark.url} :: ${bookmark.slug}`;
}
