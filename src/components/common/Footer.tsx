import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F1F1F] text-white pt-16 pb-24 md:pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Trust Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F26B21]/20 text-[#F26B21] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Free Repairs</p>
              <p className="text-xs text-[#6B6B6B]">Zero maintenance charges</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1FA463]/20 text-[#1FA463] flex items-center justify-center shrink-0">
              <span className="text-xl font-bold">₹</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">100% Refundable</p>
              <p className="text-xs text-[#6B6B6B]">Instant deposit release</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <span className="text-xl">🚚</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Free Doorstep Setup</p>
              <p className="text-xs text-[#6B6B6B]">Trained technicians install</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <span className="text-xl">🔄</span>
            </div>
            <div>
              <p className="font-bold text-sm text-white">Instant Replacement</p>
              <p className="text-xs text-[#6B6B6B]">Guaranteed within 48 hrs</p>
            </div>
          </div>
        </div>

        {/* 4 Column Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F26B21] to-[#D9530F] flex items-center justify-center text-white font-black text-xl">
                R&S
              </div>
              <div className="flex items-center">
                <span className="font-bold text-xl text-white">Rent</span>
                <span className="font-bold text-xl text-[#F26B21] ml-1">&</span>
                <span className="font-bold text-xl text-white ml-1">Share</span>
              </div>
            </Link>
            <p className="text-[#6B6B6B] text-xs leading-relaxed max-w-sm">
              Rent and Share is India's premier equipment and home rental marketplace.
              Share it. Rent it. Use it. Helping thousands of urban residents, creators,
              and professionals upgrade their lives without heavy ownership expenses.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F26B21]" /> +91 1800-RENT-SHARE (Toll-Free, 9am - 8pm)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F26B21]" /> support@rentandshare.com
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F26B21]" /> Hubs in Hyderabad, Bengaluru, Mumbai, Delhi NCR, Pune & Chennai
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/" className="hover:text-[#F26B21] transition">Home</Link></li>
              <li><Link to="/explore" className="hover:text-[#F26B21] transition">All Categories</Link></li>
              <li><Link to="/explore?sort=popular" className="hover:text-[#F26B21] transition">Best Sellers</Link></li>
              <li><Link to="/explore?sort=newest" className="hover:text-[#F26B21] transition">Trending Gear</Link></li>
              <li><Link to="/repairs" className="hover:text-[#F26B21] text-[#1FA463] font-medium transition">Free Repair Support</Link></li>
            </ul>
          </div>

          {/* Equipment Owners & Business */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Equipment Owners</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><Link to="/owner" className="hover:text-[#F26B21] font-semibold text-[#F26B21] transition">List Your Equipment</Link></li>
              <li><Link to="/owner" className="hover:text-[#F26B21] transition">Owner Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-[#F26B21] transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-[#F26B21] transition">Contact Support</Link></li>
              <li><Link to="/admin" className="hover:text-purple-400 text-neutral-400 transition">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Policies & Safety */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">Policies & Security</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li><span className="text-neutral-400">Free Cancellation (Before Dispatch)</span></li>
              <li><span className="text-neutral-400">Zero Maintenance Guarantee</span></li>
              <li><span className="text-neutral-400">KYC Verification Policy</span></li>
              <li><span className="text-neutral-400">Deposit Refund Protocol</span></li>
              <li><span className="text-neutral-400">Privacy & Terms</span></li>
            </ul>
          </div>
        </div>

        {/* Cities Bar */}
        <div className="pt-6 pb-8 border-t border-neutral-800 text-xs text-[#6B6B6B]">
          <p className="font-semibold text-neutral-400 mb-2">Available across major Indian cities:</p>
          <p className="leading-relaxed">
            Hyderabad • Bengaluru • Mumbai • Delhi NCR • Pune • Chennai • Vijayawada • Visakhapatnam • Amaravati
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B6B6B]">
          <p>© {new Date().getFullYear()} Rent and Share Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-[#F26B21] fill-[#F26B21]" /> for modern smart living.
          </p>
        </div>
      </div>
    </footer>
  );
};
