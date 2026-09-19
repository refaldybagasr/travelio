const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function searchBooks(q, startIndex = 0, maxResults = 20) {
  const params = new URLSearchParams({ q, startIndex, maxResults });
  const res = await fetch(`${API_URL}/api/search?${params}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Search failed');
  }
  return res.json();
}

export async function getFavorites() {
  const res = await fetch(`${API_URL}/api/favorites`);
  if (!res.ok) throw new Error('Failed to load favorites');
  return res.json();
}

export async function addFavorite(book) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to add favorite');
  return res.json();
}

export async function removeFavorite(id) {
  const res = await fetch(`${API_URL}/api/favorites/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) throw new Error('Failed to remove favorite');
}
