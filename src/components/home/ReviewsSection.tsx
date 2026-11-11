import React from 'react';
import { TESTIMONIALS } from '../../data/faqs';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="my-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#1FA463] text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-100">
          Verified Customers
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
          Loved by 10,000+ Renters
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5">
          Read genuine experiences from students, working couples, tech professionals, and creators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-[#F26B21]">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F26B21]" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-neutral-200" />
              </div>

              <p className="text-xs sm:text-sm text-[#1F1F1F] leading-relaxed italic">
                "{t.comment}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <p className="font-bold text-xs sm:text-sm text-[#1F1F1F] flex items-center gap-1">
                  {t.name}
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1FA463] fill-[#1FA463]/10" />
                </p>
                <p className="text-[11px] text-[#6B6B6B]">
                  {t.role} • <span className="text-[#F26B21] font-medium">{t.city}</span>
                </p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Rented: {t.itemRented}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
