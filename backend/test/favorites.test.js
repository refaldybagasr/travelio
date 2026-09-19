const express = require('express');
const request = require('supertest');
const { createFavoritesRouter } = require('../src/routes/favorites');
const { LruStore } = require('../src/store/favoritesStore');

function buildApp(store) {
  const app = express();
  app.use(express.json());
  app.use('/api/favorites', createFavoritesRouter(store));
  return app;
}

describe('favorites routes', () => {
  it('POST adds a favorite and returns 201', async () => {
    const app = buildApp(new LruStore({ capacity: 10 }));
    const res = await request(app)
      .post('/api/favorites')
      .send({ id: 'a', title: 'Book A' });
    expect(res.status).toBe(201);
    expect(res.body.item).toEqual({
      id: 'a',
      title: 'Book A',
      authors: [],
      thumbnail: null,
      averageRating: null,
      ratingsCount: null,
    });
  });

  it('POST normalizes malformed fields (missing/invalid authors, rating) to safe defaults', async () => {
    const app = buildApp(new LruStore({ capacity: 10 }));
    const res = await request(app)
      .post('/api/favorites')
      .send({ id: 'b', authors: 'not-an-array', averageRating: 'bad', ratingsCount: 'bad' });
    expect(res.status).toBe(201);
    expect(res.body.item).toEqual({
      id: 'b',
      title: 'Untitled',
      authors: [],
      thumbnail: null,
      averageRating: null,
      ratingsCount: null,
    });
  });

  it('POST without an id returns 400', async () => {
    const app = buildApp(new LruStore({ capacity: 10 }));
    const res = await request(app).post('/api/favorites').send({ title: 'No id' });
    expect(res.status).toBe(400);
  });

  it('GET lists favorites most-recently-used first', async () => {
    const app = buildApp(new LruStore({ capacity: 10 }));
    await request(app).post('/api/favorites').send({ id: 'a', title: 'A' });
    await request(app).post('/api/favorites').send({ id: 'b', title: 'B' });
    const res = await request(app).get('/api/favorites');
    expect(res.status).toBe(200);
    expect(res.body.items.map((i) => i.id)).toEqual(['b', 'a']);
  });

  it('DELETE removes an existing favorite and returns 204', async () => {
    const store = new LruStore({ capacity: 10 });
    const app = buildApp(store);
    await request(app).post('/api/favorites').send({ id: 'a', title: 'A' });
    const res = await request(app).delete('/api/favorites/a');
    expect(res.status).toBe(204);
    expect(store.get('a')).toBeUndefined();
  });

  it('DELETE on a missing id still returns 204', async () => {
    const app = buildApp(new LruStore({ capacity: 10 }));
    const res = await request(app).delete('/api/favorites/does-not-exist');
    expect(res.status).toBe(204);
  });
});
