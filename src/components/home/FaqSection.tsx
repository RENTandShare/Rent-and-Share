import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/faqs';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="my-16 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3EA] text-[#F26B21] text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F1F1F]">
          Got Questions? We Have Answers.
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5">
          Everything about security deposits, free repairs, cancellations, and delivery timelines.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-[#F26B21]/30 bg-white shadow-md'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
              >
                <span className="font-bold text-sm sm:text-base text-[#1F1F1F]">
                  {item.question}
                </span>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#FFF3EA] text-[#F26B21] rotate-180' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed border-t border-neutral-100">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
