import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/common/ProductCard';
import { Category, City, ItemAvailability } from '../types';
import { CATEGORY_FALLBACKS } from '../data/productImages';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Star,
  Check,
  ChevronDown,
  Search,
} from 'lucide-react';

const CATEGORIES: Category[] = [
  'Furniture',
  'Appliances',
  'Electronics',
  'Fitness',
  'Photography',
  'Tools',
  'Events',
  'Agriculture',
];

const CITIES: City[] = [
  'Hyderabad',
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Chennai',
  'Vijayawada',
  'Visakhapatnam',
  'Amaravati',
];

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useMarketplace();

  // URL state sync
  const initialCategory = searchParams.get('category') as Category | null;
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'popular';

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>(
    initialCategory || 'All'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<ItemAvailability | 'All'>('All');
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category if URL param changes
  useEffect(() => {
    const cat = searchParams.get('category') as Category | null;
    if (cat && CATEGORIES.includes(cat)) {
      setSelectedCategory(cat);
      setSelectedSubcategory('All');
    }
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Available subcategories and brands based on products
  const subcategories = useMemo(() => {
    const list = products
      .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
      .map((p) => p.subcategory);
    return ['All', ...Array.from(new Set(list))];
  }, [products, selectedCategory]);

  const brands = useMemo(() => {
    const list = products
      .filter((p) => selectedCategory === 'All' || p.category === selectedCategory)
      .map((p) => p.brand);
    return ['All', ...Array.from(new Set(list))];
  }, [products, selectedCategory]);

  // Combined Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchSub = p.subcategory.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchCat && !matchSub) return false;
        }

        // Category
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Subcategory
        if (selectedSubcategory !== 'All' && p.subcategory !== selectedSubcategory) {
          return false;
        }

        // City
        if (selectedCity !== 'All' && p.city !== selectedCity && p.city !== 'All Cities') {
          return false;
        }

        // Brand
        if (selectedBrand !== 'All' && p.brand !== selectedBrand) {
          return false;
        }

        // Availability
        if (selectedAvailability !== 'All' && p.availability !== selectedAvailability) {
          return false;
        }

        // Rating
        if (minRating > 0 && p.rating < minRating) {
          return false;
        }

        // Price range (monthly or daily)
        const price = p.monthlyRent || p.dailyRent || 0;
        if (price > priceRange) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.monthlyRent || a.dailyRent || 0;
        const priceB = b.monthlyRent || b.dailyRent || 0;

        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        // Default Popularity (reviews & rating)
        return b.reviewCount * b.rating - a.reviewCount * a.rating;
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedCity,
    selectedBrand,
    selectedAvailability,
    minRating,
    priceRange,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery('');
    setPriceRange(5000);
    setMinRating(0);
    setSelectedCity('All');
    setSelectedBrand('All');
    setSelectedAvailability('All');
    setSortBy('popular');
    setSearchParams({});
  };

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedSubcategory !== 'All' ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    (selectedBrand !== 'All' ? 1 : 0) +
    (selectedAvailability !== 'All' ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (priceRange < 5000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
        <div className="flex items-center gap-4">
          {selectedCategory !== 'All' && CATEGORY_FALLBACKS[selectedCategory] && (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-neutral-200 shadow-xs bg-neutral-100">
              <img
                src={CATEGORY_FALLBACKS[selectedCategory]}
                alt={selectedCategory}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
              {selectedCategory === 'All' ? 'All Rental Equipment' : `${selectedCategory} Rentals`}
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-0.5">
              Showing <strong className="text-[#F26B21]">{filteredProducts.length}</strong> verified equipment listings
            </p>
          </div>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-[#1F1F1F]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#F26B21]" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold text-[#1F1F1F] focus:outline-none focus:border-[#F26B21]"
            >
              <option value="popular">Popularity & Bookings</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters + Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 mt-6 items-start">
        {/* Left Filter Panel (Desktop) */}
        <aside className="hidden md:block bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h2 className="font-bold text-base text-[#1F1F1F] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#F26B21]" /> Filter Catalog
            </h2>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#F26B21] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search Input Filter */}
          <div>
            <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
              Keyword Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, brand, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F26B21]"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => { setSelectedCategory('All'); setSelectedSubcategory('All'); }}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-[#FFF3EA] text-[#F26B21] font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSelectedSubcategory('All'); }}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-[#FFF3EA] text-[#F26B21] font-bold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories (if available) */}
          {subcategories.length > 2 && (
            <div>
              <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
                Subcategory
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F26B21]"
              >
                {subcategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#1F1F1F] uppercase tracking-wider">
                Max Budget
              </label>
              <span className="text-xs font-bold text-[#F26B21]">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#F26B21] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>₹100</span>
              <span>₹5,000+</span>
            </div>
          </div>

          {/* City Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F26B21]"
            >
              <option value="All">All Cities (Pan-India)</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F26B21]"
            >
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Minimum Rating Filter */}
          <div>
            <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
              Customer Rating
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 4.0, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                    minRating === rating
                      ? 'border-[#F26B21] bg-[#FFF3EA] text-[#F26B21]'
                      : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}+`}
                  {rating > 0 && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold text-[#1F1F1F] uppercase tracking-wider mb-2">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value as any)}
              className="w-full p-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#F26B21]"
            >
              <option value="All">All (In-Stock & Reserved)</option>
              <option value="in-stock">Ready to Dispatch (In-Stock)</option>
              <option value="rented">Currently Rented</option>
            </select>
          </div>
        </aside>

        {/* Product Grid Area (3 Columns on Desktop) */}
        <main className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center mx-auto text-2xl font-bold">
                🔍
              </div>
              <h3 className="font-bold text-lg text-[#1F1F1F]">No Matching Equipment Found</h3>
              <p className="text-xs sm:text-sm text-[#6B6B6B] max-w-sm mx-auto">
                Try adjusting your budget slider, clearing brand filters, or switching cities to see available rentals.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#F26B21] text-white text-xs font-bold shadow-md hover:bg-[#D9530F] transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="font-bold text-base text-[#1F1F1F]">Filters</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-[#1F1F1F] uppercase mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="w-full p-2 text-xs bg-neutral-50 border rounded-xl"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-[#1F1F1F] uppercase mb-2">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 text-xs bg-neutral-50 border rounded-xl"
              >
                <option value="All">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Max Budget</span>
                <span className="text-[#F26B21]">₹{priceRange}</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#F26B21]"
              />
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#F26B21] text-xs font-bold text-white"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
