import React, { useState } from 'react';
import { Product } from '../../types';
import { Heart, Star, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { createSvgFallback } from '../../data/productImages';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onQuickRent?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickRent }) => {
  const { isWishlisted, toggleWishlist, addToCart } = useMarketplace();
  const wishlisted = isWishlisted(product.id);
  const [imgSrc, setImgSrc] = useState<string>(product.images[0]);
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setImgSrc(product.images[0]);
    setHasError(false);
  }, [product.images]);

  const isDaily = Boolean(product.dailyRent && !product.monthlyRent);
  const price = isDaily ? product.dailyRent : product.monthlyRent;
  const unit = isDaily ? '/day' : '/month';

  const discountPercent = product.originalPrice && price
    ? Math.round(((product.originalPrice - price) / product.originalPrice) * 100)
    : 0;

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(createSvgFallback(product.name, product.category));
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F26B21]/30 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* 4:3 Aspect Ratio Image Container */}
      <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imgSrc}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md backdrop-blur-xs transition-all ${
            wishlisted
              ? 'bg-rose-50 text-rose-500 border border-rose-200'
              : 'bg-white/90 text-neutral-500 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Free Repair Green Badge */}
        {product.isFreeRepair && (
          <div className="absolute top-3 left-3 bg-[#1FA463] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <ShieldCheck className="w-3.5 h-3.5" /> Free Repair
          </div>
        )}

        {/* Availability Badge */}
        {product.availability !== 'in-stock' && (
          <div className="absolute bottom-2 left-2 bg-neutral-900/80 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded backdrop-blur-xs">
            {product.availability === 'rented' ? 'Currently Rented' : 'Out of Stock'}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & City Tag */}
          <div className="flex items-center justify-between text-xs text-[#6B6B6B] mb-1">
            <span className="font-medium text-[#F26B21]">{product.brand}</span>
            <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded-md">{product.city}</span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-semibold text-sm text-[#1F1F1F] line-clamp-2 group-hover:text-[#F26B21] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 bg-emerald-50 text-[#1FA463] text-xs font-semibold px-1.5 py-0.5 rounded border border-emerald-100">
              <span>{product.rating}</span>
              <Star className="w-3 h-3 fill-[#1FA463]" />
            </div>
            <span className="text-xs text-[#6B6B6B]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg text-[#1F1F1F]">₹{price}</span>
              <span className="text-xs text-[#6B6B6B] font-medium">{unit}</span>
            </div>
            {product.originalPrice && product.originalPrice > (price || 0) && (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="line-through text-[#6B6B6B]">₹{product.originalPrice}</span>
                <span className="text-[#1FA463] font-semibold">{discountPercent}% OFF</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => addToCart(product)}
              className="p-2.5 rounded-xl border border-[#F26B21] text-[#F26B21] hover:bg-[#FFF3EA] transition shadow-xs"
              title="Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link
              to={`/product/${product.id}`}
              className="px-3.5 py-2 rounded-xl bg-[#F26B21] hover:bg-[#D9530F] text-white text-xs font-semibold transition shadow-xs"
            >
              Rent Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
