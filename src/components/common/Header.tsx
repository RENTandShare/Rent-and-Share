import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  MapPin,
  User,
  ChevronDown,
  Layers,
  Wrench,
  ShieldCheck,
  PlusCircle,
  Menu,
  X,
  Sparkles,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { CitySelectorModal } from './CitySelectorModal';
import { Category } from '../../types';

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'Furniture', label: 'Furniture', icon: '🛋️' },
  { id: 'Appliances', label: 'Appliances', icon: '🧊' },
  { id: 'Electronics', label: 'Electronics', icon: '💻' },
  { id: 'Fitness', label: 'Fitness', icon: '🏃' },
  { id: 'Photography', label: 'Photography', icon: '📷' },
  { id: 'Tools', label: 'Tools', icon: '🔧' },
  { id: 'Events', label: 'Events', icon: '🎉' },
  { id: 'Agriculture', label: 'Agriculture', icon: '🚜' },
];

export const Header: React.FC<{ onOpenAuthModal?: () => void }> = ({ onOpenAuthModal }) => {
  const { user, role, selectedCity, setSelectedCity, logout, switchRole } = useAuth();
  const { cart, wishlist, products } = useMarketplace();
  const navigate = useNavigate();
  const location = useLocation();

  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search suggestions
  const suggestions = searchQuery.trim().length >= 2
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (productId: string) => {
    setIsSearchFocused(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200/80 shadow-xs">
        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              {/* Bespoke Logo Icon */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#F26B21] to-[#D9530F] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
                <span className="tracking-tighter">R&S</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="font-extrabold text-lg sm:text-xl text-[#1F1F1F] tracking-tight">Rent</span>
                  <span className="font-extrabold text-lg sm:text-xl text-[#F26B21] tracking-tight ml-1">&</span>
                  <span className="font-extrabold text-lg sm:text-xl text-[#1F1F1F] tracking-tight ml-1">Share</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#6B6B6B] -mt-1 hidden sm:block">
                  Share it. Rent it. Use it.
                </span>
              </div>
            </Link>

            {/* City Selector */}
            <button
              onClick={() => setIsCityModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 hover:border-[#F26B21] hover:bg-[#FFF3EA]/40 text-[#1F1F1F] text-xs font-semibold transition"
              title="Change City"
            >
              <MapPin className="w-3.5 h-3.5 text-[#F26B21]" />
              <span className="max-w-[85px] sm:max-w-none truncate">{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          </div>

          {/* Search Bar with live suggestions */}
          <div ref={searchContainerRef} className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search furniture, AC, laptops, DSLRs, power tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-100 hover:bg-neutral-50 focus:bg-white border border-neutral-200 focus:border-[#F26B21] rounded-2xl text-xs sm:text-sm text-[#1F1F1F] focus:outline-none focus:ring-2 focus:ring-[#F26B21]/15 transition"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Live Search Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                  Matching Equipment
                </div>
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSuggestionClick(p.id)}
                    className="w-full px-3 py-2 flex items-center justify-between hover:bg-[#FFF3EA]/60 text-left transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover bg-neutral-100"
                      />
                      <div>
                        <p className="font-semibold text-xs text-[#1F1F1F] line-clamp-1">{p.name}</p>
                        <p className="text-[11px] text-[#6B6B6B]">
                          {p.category} • <span className="text-[#F26B21] font-medium">{p.brand}</span>
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-[#1F1F1F]">
                      ₹{p.monthlyRent || p.dailyRent}
                      <span className="text-[10px] text-neutral-500 font-normal">
                        {p.monthlyRent ? '/mo' : '/day'}
                      </span>
                    </span>
                  </button>
                ))}
                <div className="px-3 pt-2 mt-1 border-t border-neutral-100 text-center">
                  <button
                    onClick={handleSearchSubmit}
                    className="text-xs text-[#F26B21] font-semibold hover:underline"
                  >
                    View all matching results →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Icons & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Wishlist */}
            <Link
              to="/account?tab=wishlist"
              className="p-2 sm:p-2.5 rounded-xl border border-neutral-200 hover:border-[#F26B21] hover:bg-[#FFF3EA]/40 text-[#1F1F1F] relative transition"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 sm:p-2.5 rounded-xl border border-neutral-200 hover:border-[#F26B21] hover:bg-[#FFF3EA]/40 text-[#1F1F1F] relative transition"
              title="Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F26B21] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Button */}
            <div ref={profileMenuRef} className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-neutral-200 hover:border-[#F26B21] transition bg-white"
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#F26B21] to-amber-500 text-white font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="font-semibold text-xs text-[#1F1F1F] line-clamp-1">{user.name}</p>
                      <span className="text-[10px] font-semibold text-[#F26B21] uppercase tracking-wider block -mt-0.5">
                        {user.role}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  {/* Profile Menu Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="font-bold text-xs text-[#1F1F1F]">{user.name}</p>
                        <p className="text-[11px] text-[#6B6B6B] truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF3EA] text-[#F26B21]">
                          Role: {user.role.toUpperCase()}
                        </span>
                      </div>

                      <div className="py-1 text-xs">
                        <Link
                          to="/account"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-[#1F1F1F]"
                        >
                          <User className="w-4 h-4 text-neutral-500" /> My Profile & Addresses
                        </Link>
                        <Link
                          to="/account?tab=rentals"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-[#1F1F1F]"
                        >
                          <Layers className="w-4 h-4 text-neutral-500" /> My Active Rentals
                        </Link>
                        <Link
                          to="/repairs"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-[#1FA463] font-medium"
                        >
                          <Wrench className="w-4 h-4 text-[#1FA463]" /> Free Repair & Support
                        </Link>

                        <div className="my-1 border-t border-neutral-100" />

                        {/* Owner Link */}
                        <Link
                          to="/owner"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50 text-[#F26B21] font-semibold"
                        >
                          <PlusCircle className="w-4 h-4" /> Owner Equipment Dashboard
                        </Link>

                        {/* Admin Link (Admin Only) */}
                        {role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 hover:bg-purple-50 text-purple-700 font-semibold"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" /> Admin Control Panel
                          </Link>
                        )}

                        <div className="my-1 border-t border-neutral-100" />

                        {/* Role Switcher in Menu */}
                        <div className="px-4 py-1.5 text-[10px] uppercase font-semibold text-neutral-400">
                          Switch Role:
                        </div>
                        <div className="flex gap-1 px-3 pb-1">
                          <button
                            onClick={() => { switchRole('customer'); setIsProfileOpen(false); }}
                            className={`flex-1 py-1 rounded text-[11px] font-medium ${role === 'customer' ? 'bg-[#F26B21] text-white' : 'bg-neutral-100 text-neutral-700'}`}
                          >
                            Customer
                          </button>
                          <button
                            onClick={() => { switchRole('owner'); setIsProfileOpen(false); }}
                            className={`flex-1 py-1 rounded text-[11px] font-medium ${role === 'owner' ? 'bg-[#F26B21] text-white' : 'bg-neutral-100 text-neutral-700'}`}
                          >
                            Owner
                          </button>
                          <button
                            onClick={() => { switchRole('admin'); setIsProfileOpen(false); }}
                            className={`flex-1 py-1 rounded text-[11px] font-medium ${role === 'admin' ? 'bg-[#F26B21] text-white' : 'bg-neutral-100 text-neutral-700'}`}
                          >
                            Admin
                          </button>
                        </div>

                        <div className="my-1 border-t border-neutral-100" />

                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-rose-50 text-rose-600"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 rounded-xl bg-[#F26B21] hover:bg-[#D9530F] text-white text-xs font-semibold shadow-xs transition"
                >
                  Login / Signup
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-neutral-200 md:hidden text-neutral-700"
              aria-label="Toggle Navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search appliances, furniture, cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-100 focus:bg-white border border-neutral-200 focus:border-[#F26B21] rounded-xl text-xs text-[#1F1F1F] focus:outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Category Strip Under Header */}
        <div className="bg-[#FFF3EA]/40 border-t border-neutral-100 overflow-x-auto no-scrollbar py-2">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 min-w-max text-xs">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/explore"
                className="font-semibold text-[#F26B21] hover:text-[#D9530F] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#F26B21]/20 shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" /> All Categories
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/explore?category=${cat.id}`}
                  className="flex items-center gap-1.5 text-neutral-700 hover:text-[#F26B21] font-medium px-2 py-1 rounded-lg hover:bg-white transition"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-neutral-600 pl-4 border-l border-neutral-200">
              <Link to="/owner" className="hover:text-[#F26B21] text-[#D9530F] font-semibold">
                List Your Equipment
              </Link>
              <Link to="/repairs" className="hover:text-[#F26B21]">
                Repair & Support
              </Link>
              <Link to="/about" className="hover:text-[#F26B21]">
                About Us
              </Link>
              <Link to="/contact" className="hover:text-[#F26B21]">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <Link
                to="/explore"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-neutral-50 hover:bg-[#FFF3EA] text-[#1F1F1F]"
              >
                Explore All Products
              </Link>
              <Link
                to="/owner"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-[#FFF3EA] text-[#F26B21] font-bold"
              >
                List Equipment & Earn
              </Link>
              <Link
                to="/repairs"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-neutral-50 text-[#1FA463] font-medium"
              >
                Repair & Replacement
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-neutral-50 text-[#1F1F1F]"
              >
                About Rent & Share
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* City Selector Modal */}
      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
      />
    </>
  );
};
