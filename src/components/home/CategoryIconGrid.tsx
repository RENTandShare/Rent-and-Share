import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';
import { CATEGORY_FALLBACKS } from '../../data/productImages';

const CATEGORIES_DATA: { id: Category; label: string; count: string; image: string }[] = [
  { id: 'Furniture', label: 'Furniture', count: '28+ Items', image: CATEGORY_FALLBACKS.Furniture },
  { id: 'Appliances', label: 'Appliances', count: '23+ Items', image: CATEGORY_FALLBACKS.Appliances },
  { id: 'Electronics', label: 'Electronics', count: '22+ Items', image: CATEGORY_FALLBACKS.Electronics },
  { id: 'Fitness', label: 'Fitness & Gym', count: '17+ Items', image: CATEGORY_FALLBACKS.Fitness },
  { id: 'Photography', label: 'Photography', count: '13+ Items', image: CATEGORY_FALLBACKS.Photography },
  { id: 'Tools', label: 'Tools & Power', count: '15+ Items', image: CATEGORY_FALLBACKS.Tools },
  { id: 'Events', label: 'Events & AV', count: '12+ Items', image: CATEGORY_FALLBACKS.Events },
  { id: 'Agriculture', label: 'Agriculture', count: '10+ Items', image: CATEGORY_FALLBACKS.Agriculture },
];

export const CategoryIconGrid: React.FC = () => {
  return (
    <section className="my-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">Explore by Category</h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B]">Everything you need for home, work, shoots & events</p>
        </div>
        <Link
          to="/explore"
          className="text-xs sm:text-sm font-semibold text-[#F26B21] hover:text-[#D9530F] flex items-center gap-1"
        >
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {CATEGORIES_DATA.map((cat) => (
          <Link
            key={cat.id}
            to={`/explore?category=${cat.id}`}
            className="group flex flex-col items-center bg-white rounded-2xl border border-neutral-200/80 p-3 hover:border-[#F26B21] hover:shadow-lg transition-all text-center"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 relative bg-neutral-100">
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <p className="font-semibold text-xs sm:text-sm text-[#1F1F1F] group-hover:text-[#F26B21] transition-colors leading-tight">
              {cat.label}
            </p>
            <span className="text-[10px] sm:text-[11px] text-[#6B6B6B] mt-0.5">
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
