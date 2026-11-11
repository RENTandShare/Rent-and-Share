import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-0 overflow-hidden animate-pulse">
      <div className="aspect-4/3 w-full bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-neutral-200 rounded" />
          <div className="h-3 w-12 bg-neutral-200 rounded" />
        </div>
        <div className="h-4 w-5/6 bg-neutral-200 rounded" />
        <div className="h-3 w-1/3 bg-neutral-200 rounded" />
        <div className="pt-3 border-t border-neutral-100 flex justify-between items-center">
          <div className="h-6 w-20 bg-neutral-200 rounded" />
          <div className="h-8 w-20 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-neutral-100 rounded-xl w-full" />
      ))}
    </div>
  );
};
