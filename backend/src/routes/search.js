const express = require('express');

function createSearchRouter({ cache, searchBooks }) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const q = req.query.q;
    if (!q) {
      return res.status(400).json({ error: 'q is required' });
    }

    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const maxResults = parseInt(req.query.maxResults, 10) || 20;
    const cacheKey = `${q}::${startIndex}::${maxResults}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    try {
      const result = await searchBooks({ q, startIndex, maxResults });
      cache.set(cacheKey, result);
      return res.json(result);
    } catch (err) {
      return res.status(502).json({ error: err.message });
    }
  });

  return router;
}

module.exports = { createSearchRouter };
