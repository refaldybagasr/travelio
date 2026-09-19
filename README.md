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
npm run dev
```
Runs on http://localhost:5173 by default, and reads the backend URL from
`frontend/.env` (`VITE_API_URL`).

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
