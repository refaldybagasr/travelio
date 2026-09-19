import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { getFavorites, removeFavorite } from '../api/client';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    getFavorites()
      .then((data) => setItems(data.items))
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(book) {
    const previousItems = items;
    setActionError(null);
    setItems((prev) => prev.filter((b) => b.id !== book.id));
    try {
      await removeFavorite(book.id);
    } catch (err) {
      setItems(previousItems);
      setActionError('Could not remove item, please try again.');
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (loadError) return <p className="text-red-600">{loadError}</p>;
  if (items.length === 0) return <p className="text-gray-500">Your wishlist is empty.</p>;

  return (
    <div className="flex flex-col gap-4">
      {actionError && <p className="text-red-600 mb-2">{actionError}</p>}
      {items.map((book) => (
        <BookCard key={book.id} book={book} isFavorited={true} onToggleFavorite={handleRemove} />
      ))}
    </div>
  );
}
