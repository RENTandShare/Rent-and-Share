import React from 'react';
import { Check, X, ShieldAlert, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WhyRentSection: React.FC = () => {
  return (
    <section className="my-16 bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
      {/* Glow decorative effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F26B21]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F26B21]/20 text-[#F26B21] text-xs font-bold uppercase tracking-wider">
            Smart Living Economics
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            Why Rent and Share Beats Buying Outright
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Stop locking lakhs of rupees into depreciating appliances and bulky furniture.
            Upgrade whenever you want, relocate cities with zero transport headaches, and
            let our technicians handle 100% of the repairs for free.
          </p>

          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F26B21] hover:bg-[#D9530F] text-white font-bold text-xs sm:text-sm transition shadow-lg"
            >
              Start Renting Now →
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="lg:col-span-7 bg-neutral-800/80 rounded-2xl border border-neutral-700 p-6 backdrop-blur-xs">
          <div className="grid grid-cols-3 gap-2 pb-3 border-b border-neutral-700 text-xs font-bold uppercase text-neutral-400">
            <div>Factor</div>
            <div className="text-[#F26B21]">Rent and Share</div>
            <div>Buying New</div>
          </div>

          <div className="divide-y divide-neutral-700/60 text-xs">
            <div className="grid grid-cols-3 gap-2 py-3.5 items-center">
              <span className="font-semibold text-neutral-200">Upfront Capital</span>
              <span className="text-[#1FA463] font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#1FA463]" /> ₹449 - ₹1,500
              </span>
              <span className="text-neutral-400 flex items-center gap-1">
                <X className="w-4 h-4 text-rose-400" /> ₹35,000 - ₹90,000
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3.5 items-center">
              <span className="font-semibold text-neutral-200">Maintenance Costs</span>
              <span className="text-[#1FA463] font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#1FA463]" /> 100% Free Repairs
              </span>
              <span className="text-neutral-400 flex items-center gap-1">
                <X className="w-4 h-4 text-rose-400" /> ₹2,000+ per visit
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3.5 items-center">
              <span className="font-semibold text-neutral-200">Moving Cities</span>
              <span className="text-[#1FA463] font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#1FA463]" /> Free Relocation
              </span>
              <span className="text-neutral-400 flex items-center gap-1">
                <X className="w-4 h-4 text-rose-400" /> Packers & Movers fee
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3.5 items-center">
              <span className="font-semibold text-neutral-200">Reselling & Loss</span>
              <span className="text-[#1FA463] font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#1FA463]" /> Zero Depreciation
              </span>
              <span className="text-neutral-400 flex items-center gap-1">
                <X className="w-4 h-4 text-rose-400" /> 60% value lost in 2 yrs
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3.5 items-center">
              <span className="font-semibold text-neutral-200">Deposit Security</span>
              <span className="text-[#1FA463] font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#1FA463]" /> 100% Refundable
              </span>
              <span className="text-neutral-400 flex items-center gap-1">
                <X className="w-4 h-4 text-rose-400" /> Non-recoverable
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
