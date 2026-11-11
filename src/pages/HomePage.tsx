import React from 'react';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { CategoryIconGrid } from '../components/home/CategoryIconGrid';
import { ComboSection } from '../components/home/ComboSection';
import { TrustBar } from '../components/home/TrustBar';
import { HowItWorks } from '../components/home/HowItWorks';
import { WhyRentSection } from '../components/home/WhyRentSection';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { FaqSection } from '../components/home/FaqSection';
import { ProductCard } from '../components/common/ProductCard';
import { useMarketplace } from '../context/MarketplaceContext';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Flame, Clock } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products } = useMarketplace();

  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 8);
  const trending = products.filter((p) => p.trending || p.rating >= 4.9).slice(0, 8);
  const recentlyAdded = products.slice(-8).reverse();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      {/* Hero Offer Banner Carousel */}
      <BannerCarousel />

      {/* Trust Pillars */}
      <TrustBar />

      {/* Category Grid */}
      <CategoryIconGrid />

      {/* Best Sellers Section */}
      <section className="my-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#F26B21] flex items-center justify-center">
              <Flame className="w-5 h-5 fill-[#F26B21]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">Best Sellers in Your City</h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B]">Most booked furniture, appliances & electronics</p>
            </div>
          </div>
          <Link
            to="/explore?sort=popular"
            className="text-xs sm:text-sm font-semibold text-[#F26B21] hover:text-[#D9530F]"
          >
            See All ({products.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Curated Combo Packs */}
      <ComboSection />

      {/* Trending Rentals */}
      <section className="my-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#1FA463] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">Trending Right Now</h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B]">Top rated gear with fast 24hr delivery</p>
            </div>
          </div>
          <Link
            to="/explore?sort=rating"
            className="text-xs sm:text-sm font-semibold text-[#F26B21] hover:text-[#D9530F]"
          >
            Explore Trending →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Recently Added Equipment */}
      <section className="my-14">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1F1F1F]">Recently Added Gear</h2>
              <p className="text-xs sm:text-sm text-[#6B6B6B]">Fresh arrivals from verified equipment partners</p>
            </div>
          </div>
          <Link
            to="/explore?sort=newest"
            className="text-xs sm:text-sm font-semibold text-[#F26B21] hover:text-[#D9530F]"
          >
            View New Additions →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentlyAdded.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Why Rent Section */}
      <WhyRentSection />

      {/* Customer Testimonials */}
      <ReviewsSection />

      {/* FAQ Accordion */}
      <FaqSection />
    </div>
  );
};
