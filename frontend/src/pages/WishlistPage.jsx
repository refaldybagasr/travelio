import { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import { getFavorites, removeFavorite } from '../api/client';

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFavorites()
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleRemove(book) {
    setItems((prev) => prev.filter((b) => b.id !== book.id));
    try {
      await removeFavorite(book.id);
    } catch (err) {
      setError('Could not remove item, please refresh and try again.');
    }
  }

  if (loading) return <p className="text-gray-500">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (items.length === 0) return <p className="text-gray-500">Your wishlist is empty.</p>;

  return (
    <div className="flex flex-col gap-4">
      {items.map((book) => (
        <BookCard key={book.id} book={book} isFavorited={true} onToggleFavorite={handleRemove} />
      ))}
    </div>
  );
}
