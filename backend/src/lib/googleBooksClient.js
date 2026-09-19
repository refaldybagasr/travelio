const DEFAULT_GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

class GoogleBooksError extends Error {}

function normalizeVolume(volume) {
  const info = volume.volumeInfo || {};
  const rawThumbnail = info.imageLinks && info.imageLinks.thumbnail;
  return {
    id: volume.id,
    title: info.title || 'Untitled',
    authors: info.authors || [],
    thumbnail: rawThumbnail ? rawThumbnail.replace(/^http:\/\//, 'https://') : null,
    averageRating: typeof info.averageRating === 'number' ? info.averageRating : null,
    ratingsCount: typeof info.ratingsCount === 'number' ? info.ratingsCount : null,
  };
}

async function searchBooks({
  q,
  startIndex,
  maxResults,
  fetchImpl = fetch,
  apiKey = process.env.GOOGLE_BOOKS_API_KEY,
  baseUrl = process.env.GOOGLE_BOOKS_BASE_URL || DEFAULT_GOOGLE_BOOKS_BASE_URL,
}) {
  const params = new URLSearchParams({ q, startIndex, maxResults });
  if (apiKey) params.set('key', apiKey);
  const url = `${baseUrl}?${params}`;

  let response;
  try {
    response = await fetchImpl(url);
  } catch (err) {
    throw new GoogleBooksError(`Failed to reach Google Books API: ${err.message}`);
  }

  if (!response.ok) {
    throw new GoogleBooksError(`Google Books API returned ${response.status}`);
  }

  const data = await response.json();
  return {
    items: (data.items || []).map(normalizeVolume),
    totalItems: data.totalItems || 0,
  };
}

module.exports = { searchBooks, normalizeVolume, GoogleBooksError };
