const express = require('express');
const cors = require('cors');
const { LruStore } = require('./store/favoritesStore');
const { createFavoritesRouter } = require('./routes/favorites');

const FAVORITES_CAPACITY = 100;

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const favoritesStore = new LruStore({ capacity: FAVORITES_CAPACITY });

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use('/api/favorites', createFavoritesRouter(favoritesStore));

  return app;
}

module.exports = { createApp };
