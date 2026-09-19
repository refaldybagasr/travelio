const express = require('express');
const request = require('supertest');
const { createSearchRouter } = require('../src/routes/search');
const { LruTtlCache } = require('../src/store/searchCache');

function buildApp({ cache, searchBooks }) {
  const app = express();
  app.use('/api/search', createSearchRouter({ cache, searchBooks }));
  return app;
}

describe('search route', () => {
  it('returns 400 when q is missing', async () => {
    const app = buildApp({ cache: new LruTtlCache({ capacity: 5, ttlMs: 1000 }), searchBooks: jest.fn() });
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
  });

  it('returns search results on a cache miss', async () => {
    const searchBooks = jest.fn().mockResolvedValue({ items: [{ id: '1' }], totalItems: 1 });
    const app = buildApp({ cache: new LruTtlCache({ capacity: 5, ttlMs: 1000 }), searchBooks });
    const res = await request(app).get('/api/search?q=dune');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ items: [{ id: '1' }], totalItems: 1 });
    expect(searchBooks).toHaveBeenCalledTimes(1);
  });

  it('serves a repeated identical query from cache without calling upstream again', async () => {
    const searchBooks = jest.fn().mockResolvedValue({ items: [{ id: '1' }], totalItems: 1 });
    const cache = new LruTtlCache({ capacity: 5, ttlMs: 100000 });
    const app = buildApp({ cache, searchBooks });

    await request(app).get('/api/search?q=dune&startIndex=0&maxResults=20');
    await request(app).get('/api/search?q=dune&startIndex=0&maxResults=20');

    expect(searchBooks).toHaveBeenCalledTimes(1);
  });

  it('re-fetches once the cached entry has expired', async () => {
    let currentTime = 0;
    const searchBooks = jest.fn().mockResolvedValue({ items: [], totalItems: 0 });
    const cache = new LruTtlCache({ capacity: 5, ttlMs: 100, now: () => currentTime });
    const app = buildApp({ cache, searchBooks });

    await request(app).get('/api/search?q=dune');
    currentTime = 200; // past TTL
    await request(app).get('/api/search?q=dune');

    expect(searchBooks).toHaveBeenCalledTimes(2);
  });

  it('returns 502 when the upstream client throws', async () => {
    const searchBooks = jest.fn().mockRejectedValue(new Error('upstream down'));
    const app = buildApp({ cache: new LruTtlCache({ capacity: 5, ttlMs: 1000 }), searchBooks });
    const res = await request(app).get('/api/search?q=dune');
    expect(res.status).toBe(502);
  });
});
