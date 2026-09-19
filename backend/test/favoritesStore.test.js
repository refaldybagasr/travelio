const { LruStore } = require('../src/store/favoritesStore');

describe('LruStore', () => {
  it('stores and retrieves an item by id', () => {
    const store = new LruStore({ capacity: 3 });
    store.set('a', { id: 'a', title: 'Book A' });
    expect(store.get('a')).toEqual({ id: 'a', title: 'Book A' });
  });

  it('returns undefined for a missing id', () => {
    const store = new LruStore({ capacity: 3 });
    expect(store.get('missing')).toBeUndefined();
  });

  it('evicts the least-recently-used item when capacity is exceeded', () => {
    const store = new LruStore({ capacity: 2 });
    store.set('a', { id: 'a' });
    store.set('b', { id: 'b' });
    store.set('c', { id: 'c' }); // 'a' should be evicted
    expect(store.get('a')).toBeUndefined();
    expect(store.get('b')).toEqual({ id: 'b' });
    expect(store.get('c')).toEqual({ id: 'c' });
  });

  it('reading an item refreshes its recency', () => {
    const store = new LruStore({ capacity: 2 });
    store.set('a', { id: 'a' });
    store.set('b', { id: 'b' });
    store.get('a'); // 'a' is now most-recently-used
    store.set('c', { id: 'c' }); // 'b' should be evicted instead of 'a'
    expect(store.get('b')).toBeUndefined();
    expect(store.get('a')).toEqual({ id: 'a' });
  });

  it('getAll returns items most-recently-used first', () => {
    const store = new LruStore({ capacity: 3 });
    store.set('a', { id: 'a' });
    store.set('b', { id: 'b' });
    store.set('c', { id: 'c' });
    expect(store.getAll().map((i) => i.id)).toEqual(['c', 'b', 'a']);
  });

  it('remove deletes an item and reports whether it existed', () => {
    const store = new LruStore({ capacity: 3 });
    store.set('a', { id: 'a' });
    expect(store.remove('a')).toBe(true);
    expect(store.remove('a')).toBe(false);
    expect(store.get('a')).toBeUndefined();
  });
});
