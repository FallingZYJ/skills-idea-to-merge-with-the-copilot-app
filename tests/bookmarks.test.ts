import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBookmark,
  loadBookmarks,
  normalizeUrl,
} from '../src/lib/bookmarks.ts';

test('normalizes URLs with and without https to the same value', () => {
  assert.equal(normalizeUrl('example.com'), normalizeUrl('https://example.com'));
  assert.equal(normalizeUrl('example.com'), 'https://example.com/');
});

test('recovers from empty, corrupted, legacy, and non-array storage', () => {
  assert.deepEqual(loadBookmarks(null), []);
  assert.deepEqual(loadBookmarks(''), []);
  assert.deepEqual(loadBookmarks('{broken'), []);
  assert.deepEqual(loadBookmarks('{"url":"https://example.com"}'), []);
  assert.deepEqual(loadBookmarks('["https://example.com"]'), []);
  assert.deepEqual(
    loadBookmarks(JSON.stringify([
      { url: 'https://example.com/', slug: 'mona-0001' },
      { url: 42, slug: 'mona-0002' },
    ])),
    [{ url: 'https://example.com/', slug: 'mona-0001' }],
  );
});

test('formats a saved bookmark with the exact separator', () => {
  assert.equal(
    formatBookmark({ url: 'https://www.example.com', slug: 'mona-7fk2' }),
    'https://www.example.com :: mona-7fk2',
  );
});
