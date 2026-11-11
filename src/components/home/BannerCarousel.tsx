import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BannerSlide {
  id: string;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  badgeColor: string;
  image: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: 'b-1',
    tag: 'FESTIVE SPECIAL',
    title: 'Furnish Your Dream Home',
    highlight: 'Starting at ₹449/mo',
    subtitle: 'Free doorstep setup, 100% refundable security deposit & free relocation once a year.',
    ctaText: 'Explore Furniture',
    ctaLink: '/explore?category=Furniture',
    bgGradient: 'from-orange-500 via-[#F26B21] to-[#D9530F]',
    badgeColor: 'bg-white text-[#D9530F]',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b-2',
    tag: 'COMBO PACK SAVINGS',
    title: 'Work-From-Home & Bachelor Packs',
    highlight: 'Flat 25% OFF Long Tenures',
    subtitle: 'Ergonomic high-back chairs, study tables, smart monitors & Wi-Fi routers bundled together.',
    ctaText: 'View Combo Packs',
    ctaLink: '/explore',
    bgGradient: 'from-neutral-900 via-neutral-800 to-neutral-900',
    badgeColor: 'bg-[#F26B21] text-white',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b-3',
    tag: 'CREATOR & EVENT GEAR',
    title: 'Sony Alpha, 4K Drones & JBL Sound',
    highlight: 'Daily Rentals from ₹150/day',
    subtitle: 'Shoot professional weddings, short films, and concerts without heavy equipment investments.',
    ctaText: 'Rent Photography Gear',
    ctaLink: '/explore?category=Photography',
    bgGradient: 'from-indigo-900 via-purple-900 to-neutral-900',
    badgeColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b-4',
    tag: 'ZERO WORRY GUARANTEE',
    title: 'Free Repairs & Instant Replacement',
    highlight: 'Zero Cost for Normal Wear & Tear',
    subtitle: 'AC not cooling? Washing machine noise? Our verified technician arrives next morning at ₹0 charge.',
    ctaText: 'Learn About Free Repairs',
    ctaLink: '/repairs',
    bgGradient: 'from-emerald-800 via-teal-900 to-neutral-900',
    badgeColor: 'bg-[#1FA463] text-white',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  },
];

export const BannerCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNERS[currentSlide];

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl my-6 bg-neutral-900 text-white">
      {/* Background with Gradient Overlay */}
      <div className={`relative min-h-[340px] sm:min-h-[380px] bg-gradient-to-r ${slide.bgGradient} transition-all duration-700 flex items-center`}>
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
          <div className="md:col-span-7 space-y-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${slide.badgeColor} shadow-xs`}>
              <Sparkles className="w-3.5 h-3.5" />
              {slide.tag}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xs">
              {slide.title}
            </h2>

            <p className="text-lg sm:text-2xl font-bold text-amber-200">
              {slide.highlight}
            </p>

            <p className="text-xs sm:text-sm text-neutral-200 max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>

            <div className="pt-2">
              <Link
                to={slide.ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#1F1F1F] font-bold text-xs sm:text-sm shadow-xl hover:bg-[#FFF3EA] hover:text-[#F26B21] transition transform active:scale-95"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 text-[#F26B21]" />
              </Link>
            </div>
          </div>

          {/* Right Floating Product Visual */}
          <div className="hidden md:flex md:col-span-5 justify-center items-center">
            <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl backdrop-blur-xs">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover transform hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-semibold text-white/90">Rent and Share Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + BANNERS.length) % BANNERS.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % BANNERS.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
