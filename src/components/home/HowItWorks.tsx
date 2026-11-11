import React from 'react';
import { HOW_IT_WORKS_STEPS } from '../../data/faqs';
import { Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3EA] text-[#F26B21] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Simple 4-Step Process
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
          How Rent and Share Works
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5">
          From choosing your favorite gear to doorstep pickup when you are done. Zero paperwork friction.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {HOW_IT_WORKS_STEPS.map((step) => (
          <div
            key={step.step}
            className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-xs hover:border-[#F26B21]/30 hover:shadow-lg transition relative"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF3EA] text-[#F26B21] font-black text-xl flex items-center justify-center mb-4 shadow-xs">
              {step.step}
            </div>
            <h3 className="font-bold text-base text-[#1F1F1F] mb-2 leading-snug">
              {step.title}
            </h3>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
