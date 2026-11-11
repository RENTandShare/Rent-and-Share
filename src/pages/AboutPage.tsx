import React from 'react';
import { ShieldCheck, Heart, Users, Sparkles, MapPin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pb-24 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center mx-auto text-2xl font-black shadow-md">
          R&S
        </div>
        <span className="text-xs font-bold text-[#F26B21] uppercase tracking-wider">
          Our Story & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#1F1F1F] tracking-tight">
          Rent and Share
        </h1>
        <p className="text-base sm:text-lg font-bold text-[#F26B21]">
          "Share it. Rent it. Use it."
        </p>
        <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
          Founded to liberate urban Indians from the burdens of heavy upfront purchases, depreciating assets, and moving headaches. We connect verified equipment owners with renters through transparent tenures and guaranteed free maintenance.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#F26B21] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1F1F1F]">Smart Financial Freedom</h3>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Furnish an entire apartment or shoot a 4K film for a fraction of the showroom price, with 100% refundable deposits.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#1FA463] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1F1F1F]">Free Lifetime Repairs</h3>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Never pay for AC gas refills, motor maintenance, or technician visits. If it breaks from wear & tear, we fix or replace it free.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-[#1F1F1F]">9 Active Indian Hubs</h3>
          <p className="text-xs text-[#6B6B6B] leading-relaxed">
            Seamlessly active in Hyderabad, Bengaluru, Mumbai, Delhi NCR, Pune, Chennai, Vijayawada, Visakhapatnam, and Amaravati.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to Experience Smart Living?</h2>
        <p className="text-xs text-neutral-400 max-w-md mx-auto">
          Explore over 120+ verified furniture, electronics, fitness, tools, and camera equipment ready for delivery today.
        </p>
        <Link
          to="/explore"
          className="px-6 py-3 rounded-2xl bg-[#F26B21] text-white text-xs font-bold hover:bg-[#D9530F] transition inline-block shadow-lg"
        >
          Explore Catalog →
        </Link>
      </div>
    </div>
  );
};
