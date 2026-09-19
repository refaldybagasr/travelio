import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { searchBooks, getFavorites, addFavorite, removeFavorite } from '../api/client';

export default function SearchPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [favoritedIds, setFavoritedIds] = useState(new Set());

  useEffect(() => {
    getFavorites()
      .then((data) => setFavoritedIds(new Set(data.items.map((b) => b.id))))
      .catch(() => {});
  }, []);

  async function handleSearch(q) {
    setQuery(q);
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks(q, 0, 20);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleFavorite(book) {
    const isFavorited = favoritedIds.has(book.id);

    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (isFavorited) next.delete(book.id);
      else next.add(book.id);
      return next;
    });

    try {
      if (isFavorited) {
        await removeFavorite(book.id);
      } else {
        await addFavorite(book);
      }
    } catch (err) {
      setFavoritedIds((prev) => {
        const next = new Set(prev);
        if (isFavorited) next.add(book.id);
        else next.delete(book.id);
        return next;
      });
      setError('Could not update wishlist, please try again.');
    }
  }

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      {error && (
        <div className="flex items-center gap-3 mb-4">
          <p className="text-red-600">{error}</p>
          <button onClick={() => handleSearch(query)} className="text-sm underline text-red-700">
            Retry
          </button>
        </div>
      )}
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && query && items.length === 0 && (
        <p className="text-gray-500">No results found for "{query}".</p>
      )}
      <div className="flex flex-col gap-4">
        {items.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isFavorited={favoritedIds.has(book.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}
