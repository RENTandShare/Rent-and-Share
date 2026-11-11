import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const MobileNav: React.FC = () => {
  const { cart, wishlist } = useMarketplace();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/explore', label: 'Categories', icon: Grid },
    { to: '/account?tab=wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, count: cart.length },
    { to: '/account', label: 'Account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 py-1.5 px-2 flex justify-around items-center shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#F26B21] font-bold scale-105'
                  : 'text-neutral-500 hover:text-neutral-800 font-medium'
              }`
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.count && item.count > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-[#F26B21] text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.count}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
