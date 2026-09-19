const express = require('express');

function createFavoritesRouter(store) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.json({ items: store.getAll() });
  });

  router.post('/', (req, res) => {
    const item = req.body;
    if (!item || !item.id) {
      return res.status(400).json({ error: 'id is required' });
    }
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
