import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="text-7xl font-black text-[#F26B21]">404</div>
      <h1 className="text-2xl font-extrabold text-[#1F1F1F]">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-[#6B6B6B]">
        The page you are looking for does not exist or may have been moved.
      </p>
      <div className="pt-2 flex justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-[#F26B21] text-white font-bold text-xs shadow-md hover:bg-[#D9530F] transition flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" /> Home
        </Link>
        <Link
          to="/explore"
          className="px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 transition flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>
    </div>
  );
};
