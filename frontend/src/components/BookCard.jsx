export default function BookCard({ book, isFavorited, onToggleFavorite }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4">
      <img
        src={book.thumbnail || 'https://placehold.co/96x144?text=No+Cover'}
        alt={book.title}
        className="w-24 h-36 object-cover rounded"
      />
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900">{book.title}</h3>
        <p className="text-sm text-gray-500">{book.authors.join(', ') || 'Unknown author'}</p>
        <button
          onClick={() => onToggleFavorite(book)}
          className="mt-auto self-start text-sm font-medium text-red-500 hover:text-red-700"
        >
          {isFavorited ? '♥ Remove from wishlist' : '♡ Add to wishlist'}
        </button>
      </div>
    </div>
  );
}
