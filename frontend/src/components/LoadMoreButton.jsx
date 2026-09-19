export default function LoadMoreButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="mt-4 w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Load more'}
    </button>
  );
}
