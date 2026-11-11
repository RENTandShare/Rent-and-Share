import React from 'react';
import { Wrench, Truck, RefreshCw, Calendar, PackageCheck } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Wrench,
    title: 'Free Repairs',
    desc: 'Zero maintenance charges for wear & tear',
    badge: '100% Free',
  },
  {
    icon: Truck,
    title: 'Free Relocation',
    desc: 'Moving within city? We relocate items free',
    badge: '1x Yearly',
  },
  {
    icon: RefreshCw,
    title: 'Instant Replacement',
    desc: 'Unfixable issue? New unit in 48 hours',
    badge: 'Guaranteed',
  },
  {
    icon: Calendar,
    title: 'Flexible Tenure',
    desc: 'Rent from 1 day up to 36 months, extend anytime',
    badge: 'Customizable',
  },
  {
    icon: PackageCheck,
    title: 'Doorstep Delivery',
    desc: 'Professional unboxing & setup by technicians',
    badge: 'Safely Handled',
  },
];

export const TrustBar: React.FC = () => {
  return (
    <div className="my-10 bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
        {TRUST_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`flex flex-col items-start ${
                index !== 0 ? 'pt-4 md:pt-0 md:pl-5' : ''
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#1FA463] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {item.badge}
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1F1F1F] leading-tight">
                {item.title}
              </h4>
              <p className="text-xs text-[#6B6B6B] mt-1 leading-snug">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
