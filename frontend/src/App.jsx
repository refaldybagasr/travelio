import { Routes, Route, NavLink } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';

export default function App() {
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-4 py-3 flex gap-2">
        <NavLink to="/" end className={linkClass}>Search</NavLink>
        <NavLink to="/wishlist" className={linkClass}>Wishlist</NavLink>
      </nav>
      <main className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </main>
    </div>
  );
}
