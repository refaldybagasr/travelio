const { LruTtlCache } = require('../src/store/searchCache');

describe('LruTtlCache', () => {
  it('stores and retrieves a value', () => {
    const cache = new LruTtlCache({ capacity: 3, ttlMs: 1000 });
    cache.set('k', { data: 1 });
    expect(cache.get('k')).toEqual({ data: 1 });
  });

  it('returns undefined for a missing key', () => {
    const cache = new LruTtlCache({ capacity: 3, ttlMs: 1000 });
    expect(cache.get('missing')).toBeUndefined();
  });

  it('evicts the least-recently-used key when capacity is exceeded', () => {
    const cache = new LruTtlCache({ capacity: 2, ttlMs: 1000 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3); // 'a' should be evicted
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  it('treats an expired entry as a miss', () => {
    let currentTime = 0;
    const cache = new LruTtlCache({ capacity: 3, ttlMs: 100, now: () => currentTime });
    cache.set('k', 'value');
    currentTime = 150; // past the 100ms TTL
    expect(cache.get('k')).toBeUndefined();
  });

  it('a fresh (non-expired) entry is still returned', () => {
    let currentTime = 0;
    const cache = new LruTtlCache({ capacity: 3, ttlMs: 100, now: () => currentTime });
    cache.set('k', 'value');
    currentTime = 50; // still within the 100ms TTL
    expect(cache.get('k')).toBe('value');
  });

  it('reading a key refreshes its recency', () => {
    const cache = new LruTtlCache({ capacity: 2, ttlMs: 1000 });
    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a'); // 'a' is now most-recently-used
    cache.set('c', 3); // 'b' should be evicted instead of 'a'
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe(1);
  });
});
