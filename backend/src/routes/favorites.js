const express = require('express');

function createFavoritesRouter(store) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ items: store.getAll() });
  });

  router.post('/', (req, res) => {
    const body = req.body || {};
    if (!body.id) {
      return res.status(400).json({ error: 'id is required' });
    }
    const item = {
      id: body.id,
      title: body.title ?? 'Untitled',
      authors: Array.isArray(body.authors) ? body.authors : [],
      thumbnail: body.thumbnail ?? null,
      averageRating: typeof body.averageRating === 'number' ? body.averageRating : null,
      ratingsCount: typeof body.ratingsCount === 'number' ? body.ratingsCount : null,
    };
    store.set(item.id, item);
    res.status(201).json({ item });
  });

  router.delete('/:id', (req, res) => {
    store.remove(req.params.id);
    res.status(204).end();
  });

  return router;
}

module.exports = { createFavoritesRouter };
