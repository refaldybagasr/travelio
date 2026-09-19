const express = require('express');
const cors = require('cors');
const { LruStore } = require('./store/favoritesStore');
const { LruTtlCache } = require('./store/searchCache');
const { searchBooks } = require('./lib/googleBooksClient');
const { createFavoritesRouter } = require('./routes/favorites');
const { createSearchRouter } = require('./routes/search');

const FAVORITES_CAPACITY = 100;
const SEARCH_CACHE_CAPACITY = 50;
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const favoritesStore = new LruStore({ capacity: FAVORITES_CAPACITY });
  const searchCache = new LruTtlCache({ capacity: SEARCH_CACHE_CAPACITY, ttlMs: SEARCH_CACHE_TTL_MS });

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/favorites', createFavoritesRouter(favoritesStore));
  app.use('/api/search', createSearchRouter({ cache: searchCache, searchBooks }));

  return app;
}

module.exports = { createApp };
