import React from 'react';
import { COMBO_PACKS } from '../../data/combos';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';

export const ComboSection: React.FC = () => {
  const { products, addToCart } = useMarketplace();

  const handleRentCombo = (productIds: string[]) => {
    // Add all products in the combo to cart with 3 months default
    productIds.forEach((id) => {
      const p = products.find((prod) => prod.id === id);
      if (p) {
        addToCart(p, 3);
      }
    });
  };

  return (
    <section className="my-14 bg-gradient-to-b from-[#FFF3EA]/50 via-white to-white rounded-3xl p-6 sm:p-8 border border-orange-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3EA] text-[#F26B21] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Curated Combo Packs
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
            Rent Everything in One Click
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1">
            Pre-assembled furniture & appliance sets designed for modern Indian homes & flats.
          </p>
        </div>
        <Link
          to="/explore"
          className="text-xs sm:text-sm font-semibold text-[#F26B21] hover:text-[#D9530F] flex items-center gap-1 shrink-0"
        >
          Browse All Equipment →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMBO_PACKS.map((pack) => (
          <div
            key={pack.id}
            className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-[#F26B21]/40 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={pack.image}
                  alt={pack.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#F26B21] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                  {pack.badge}
                </span>
              </div>

              <div className="p-5">
                <p className="text-[11px] font-semibold text-[#F26B21] uppercase tracking-wider">
                  {pack.category}
                </p>
                <h3 className="font-bold text-base text-[#1F1F1F] mt-1 leading-snug">
                  {pack.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] mt-1 line-clamp-2">
                  {pack.tagline}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 text-xs text-neutral-600 space-y-1.5">
                  <p className="font-medium text-[#1F1F1F] text-[11px]">{pack.description}</p>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="flex items-baseline justify-between mb-3 bg-[#FFF3EA]/60 p-2.5 rounded-xl">
                <div>
                  <span className="text-[10px] text-[#6B6B6B] block">Bundle Rent</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-lg text-[#F26B21]">₹{pack.discountedRent}</span>
                    <span className="text-xs text-[#6B6B6B]">/mo</span>
                    <span className="line-through text-xs text-[#6B6B6B]">₹{pack.totalMonthlyRent}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#1FA463] font-bold block">Save ₹{pack.savings}/mo</span>
                  <span className="text-[10px] text-[#6B6B6B]">Deposit: ₹{pack.securityDeposit}</span>
                </div>
              </div>

              <button
                onClick={() => handleRentCombo(pack.productIds)}
                className="w-full py-2.5 rounded-xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Rent This Combo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
