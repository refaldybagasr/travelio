# Book Search App

Search books via the Google Books API, view ratings, and build a wishlist —
no account needed. Wishlist and search results are cached in-memory on the
backend (no database).

## Architecture

Two independent services in this monorepo:

- **`backend/`** — Node.js + Express API. Proxies and normalizes Google
  Books search results (behind an in-memory LRU+TTL cache) and exposes a
  favorites API backed by a separate in-memory LRU store.
- **`frontend/`** — React (Vite) + Tailwind CSS single-page app. Calls the
  backend for both search and favorites.

The two communicate over plain HTTP; the frontend never calls Google Books
directly.

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, react-router-dom, rater-js |
| Backend | Node.js, Express |
| Storage | In-memory LRU caches (no database) |
| Testing | Jest, Supertest (backend) |
| Containerization | Docker, docker-compose, nginx |

## Project structure

```
travelio/
├── backend/     # Express API (search proxy + favorites)
├── frontend/    # React + Tailwind SPA
└── docker-compose.yml
```

## Running with Docker (recommended)

Requires Docker and Docker Compose.

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Optional: Google Books API key

Search works without any key, using Google's shared anonymous quota — but
that quota can be rate-limited (HTTP 429) depending on network/usage. A
free API key raises the quota significantly:

1. Create/select a project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Books API** under APIs & Services → Library
3. Create a key under APIs & Services → Credentials → Create Credentials → API Key

Then, for Docker: `cp .env.example .env` (repo root) and set
`GOOGLE_BOOKS_API_KEY=your_key` before running `docker compose up --build`.
For running without Docker: `export GOOGLE_BOOKS_API_KEY=your_key` before
starting the backend.

The Google Books API base URL is also configurable via `GOOGLE_BOOKS_BASE_URL`
(defaults to `https://www.googleapis.com/books/v1/volumes` if unset) — same
`.env` file for Docker, or `export GOOGLE_BOOKS_BASE_URL=...` otherwise.

## Running without Docker

Requires Node.js 20+.

**Backend:**
```bash
cd backend
npm install
npm run dev
```
Runs on http://localhost:4000.

**Frontend** (in a separate terminal):
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs on http://localhost:5173 by default, and reads the backend URL from
`frontend/.env` (`VITE_API_URL`). This file is git-ignored — copy it from
`.env.example` as shown above. It's optional: `frontend/src/api/client.js`
already falls back to `http://localhost:4000` if `.env` is omitted.

## Backend API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/api/search?q=&startIndex=&maxResults=` | Search books via Google Books, cached (LRU, TTL 5 min, capacity 50) |
| GET | `/api/favorites` | List favorited books, most-recently-used first |
| POST | `/api/favorites` | Add/update a favorite (LRU, capacity 100) |
| DELETE | `/api/favorites/:id` | Remove a favorite |

## Testing

Backend:
```bash
cd backend
npm test
```
